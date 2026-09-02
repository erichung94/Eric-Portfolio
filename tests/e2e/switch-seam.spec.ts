import { test, expect } from '@playwright/test';

// The seam between "Developer" and "Dancer" has drifted twice: once vertically
// (a stretched flex item dragged the label off its own centre) and once
// horizontally (the labels are different lengths, so the midpoint of the group
// is not the gap between them). Both were invisible to every other test,
// because nothing here changes text, roles, or URLs. These assertions measure
// the rendered geometry so a third regression fails in CI rather than in a
// screenshot Eric sends back.

type Probe = {
  hAsym: number;
  vOffset: number;
  seamHeight: number;
};

async function probeSeam(page: import('@playwright/test').Page): Promise<Probe> {
  return page.evaluate(() => {
    const seam = document.querySelector('.mode-switch__seam')!.getBoundingClientRect();
    const btns = [...document.querySelectorAll('.mode-switch__btn')];

    // Measure the text itself. The button box is padded and, on the dev side,
    // sized by a hidden bold ghost, so box edges say nothing about what a
    // reader actually sees.
    const textRect = (b: Element) => {
      const node = [...b.childNodes].find((n) => n.nodeType === 3)!;
      const r = document.createRange();
      r.selectNodeContents(node);
      return r.getBoundingClientRect();
    };
    const left = textRect(btns[0]);
    const right = textRect(btns[1]);
    const midX = (seam.left + seam.right) / 2;

    // Vertical: compare against the ink centre (cap top to baseline), not the
    // line box. "Developer" carries a descender, so the line box centre sits
    // below what the eye reads as the middle of the words.
    const dancer = btns[1];
    const cs = getComputedStyle(dancer);
    const ctx = document.createElement('canvas').getContext('2d')!;
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx.measureText('Dancer');
    const baseline = right.top + m.fontBoundingBoxAscent;
    const inkCentre =
      (baseline - m.actualBoundingBoxAscent + (baseline + m.actualBoundingBoxDescent)) / 2;

    return {
      hAsym: midX - left.right - (right.left - midX),
      vOffset: (seam.top + seam.bottom) / 2 - inkCentre,
      seamHeight: seam.height,
    };
  });
}

for (const [label, width, height] of [
  ['desktop', 1280, 900],
  ['mobile', 375, 812],
] as const) {
  test(`switch seam is centred between and on the labels (${label})`, async ({ page }) => {
    await page.setViewportSize({ width, height });

    for (const path of ['/', '/dancer']) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const { hAsym, vOffset, seamHeight } = await probeSeam(page);

      // Equal gap to the word on each side.
      expect(Math.abs(hAsym), `${path}: horizontal gap differs by ${hAsym.toFixed(2)}px`)
        .toBeLessThan(1);
      // Centred on the letterforms, not hanging from the baseline.
      expect(Math.abs(vOffset), `${path}: seam sits ${vOffset.toFixed(2)}px off the ink centre`)
        .toBeLessThan(2);
      // Scales with the labels rather than staying a fixed pixel height.
      expect(seamHeight).toBeGreaterThan(20);
    }
  });
}

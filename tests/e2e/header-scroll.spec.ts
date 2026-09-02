import { test, expect } from '@playwright/test';

// The masthead is large on landing and collapses once you scroll past the hero.
// Nothing covered this before, and it is easy to break from CSS elsewhere: an
// `overflow` value on an ancestor can silently move the scroll container and
// stop the window scroll listener firing.
test.describe('masthead collapse on scroll', () => {
  for (const path of ['/', '/dancer']) {
    test(`collapses and restores at ${path}`, async ({ page }) => {
      await page.goto(path);
      const header = page.locator('.site-header');
      const label = page.locator('.mode-switch__btn').first();

      // The label size is animated (0.28s), so every size assertion has to poll
      // rather than sample once, or it reads a mid-transition value.
      const size = () => label.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

      await expect(header).not.toHaveClass(/is-scrolled/);
      const tallSize = await size();

      await page.evaluate(() => window.scrollTo(0, 600));
      await expect(header).toHaveClass(/is-scrolled/);
      await expect.poll(size).toBeLessThan(tallSize);

      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(header).not.toHaveClass(/is-scrolled/);
      await expect.poll(size).toBe(tallSize);
    });
  }

  test('holds its shape inside the hysteresis band', async ({ page }) => {
    // The collapse and expand thresholds are deliberately far apart (200 / 16),
    // because collapsing sheds ~72px of sticky header and scroll anchoring
    // pulls window.scrollY down by the same amount. A band narrower than that
    // drift lets one collapse carry you past the expand threshold, and the
    // header flaps between intermediate sizes. Between the two values the
    // state must not change.
    await page.goto('/');
    const header = page.locator('.site-header');
    const scrollTo = (y: number) => page.evaluate((v) => window.scrollTo(0, v), y);

    await expect(header).not.toHaveClass(/is-scrolled/);

    // Inside the band on the way down: still expanded, not yet collapsed.
    await scrollTo(120);
    await expect(header).not.toHaveClass(/is-scrolled/);

    await scrollTo(260);
    await expect(header).toHaveClass(/is-scrolled/);

    // Back inside the band from above, including past where the anchoring drift
    // lands us: must stay collapsed rather than flap.
    await scrollTo(120);
    await expect(header).toHaveClass(/is-scrolled/);
    await scrollTo(40);
    await expect(header).toHaveClass(/is-scrolled/);

    // Only below the lower threshold does it open up again, and it then stays
    // open even though expanding pushes scrollY back up by ~72px.
    await scrollTo(5);
    await expect(header).not.toHaveClass(/is-scrolled/);
    await page.waitForTimeout(400);
    await expect(header).not.toHaveClass(/is-scrolled/);
  });

  test('the document is what scrolls, not an inner container', async ({ page }) => {
    await page.goto('/');
    // Guards the `overflow-x: clip` on <main> that contains the hero's light
    // bleed: if it ever computes in a way that creates a scroll container, the
    // document stops scrolling and the sticky header stops reacting.
    const scrolls = await page.evaluate(() => {
      window.scrollTo(0, 400);
      return { y: Math.round(window.scrollY), height: document.documentElement.scrollHeight };
    });
    expect(scrolls.height).toBeGreaterThan(1000);
    expect(scrolls.y).toBeGreaterThan(300);
  });
});

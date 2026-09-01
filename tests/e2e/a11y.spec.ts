import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const path of ['/', '/dancer']) {
  test(`axe: no serious/critical violations at ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const bad = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );

    if (bad.length > 0) {
      for (const v of bad) {
        console.log(`\n[${v.impact}] ${v.id} — ${v.help}`);
        for (const node of v.nodes) {
          console.log(`  ${node.target.join(' ')}`);
          console.log(`  ${node.failureSummary?.replace(/\n/g, '\n  ')}`);
        }
      }
    }

    expect(bad, JSON.stringify(bad.map((v) => v.id), null, 2)).toEqual([]);
  });
}

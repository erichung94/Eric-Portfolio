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

      await expect(header).not.toHaveClass(/is-scrolled/);
      const tallSize = await label.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

      await page.evaluate(() => window.scrollTo(0, 600));
      await expect(header).toHaveClass(/is-scrolled/);
      const shortSize = await label.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(shortSize).toBeLessThan(tallSize);

      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(header).not.toHaveClass(/is-scrolled/);
    });
  }

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

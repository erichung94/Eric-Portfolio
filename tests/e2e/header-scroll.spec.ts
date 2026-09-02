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

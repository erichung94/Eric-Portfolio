import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });

test.describe('mobile', () => {
  for (const path of ['/', '/dancer']) {
    test(`no horizontal overflow at ${path}`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      );
      expect(overflow).toBe(false);
    });
  }

  test('switch still works on mobile', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Dancer' }).click();
    await expect(page).toHaveURL(/\/dancer$/);
  });
});

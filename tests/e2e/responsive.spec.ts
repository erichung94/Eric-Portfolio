import { test, expect } from '@playwright/test';
import { switchMode } from './helpers';

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
    await switchMode(page, 'Dancer', 'dance');
    await expect(page).toHaveURL(/\/dancer$/);
  });
});

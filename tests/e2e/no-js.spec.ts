import { test, expect } from '@playwright/test';

test.describe('no JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('/ renders dev mode, themed, dev content visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dev');
    await expect(page.locator('[data-scope="dev"]').first()).toBeVisible();
    await expect(page.locator('[data-scope="dance"]').first()).toBeHidden();
  });

  test('/dancer renders dance mode, themed, dance content visible', async ({ page }) => {
    await page.goto('/dancer');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dance');
    await expect(page.locator('[data-scope="dance"]').first()).toBeVisible();
    await expect(page.locator('[data-scope="dev"]').first()).toBeHidden();
  });
});

import { test, expect } from '@playwright/test';

test('per-route title, canonical, and og:image', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Full-stack developer/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://erichung.dev/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://erichung.dev/images/og-dev.png');

  await page.goto('/dancer');
  await expect(page).toHaveTitle(/West Coast Swing instructor/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://erichung.dev/dancer');
});

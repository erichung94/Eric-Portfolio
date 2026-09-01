import { test, expect } from '@playwright/test';

test.describe('mode switch', () => {
  test('swaps theme, content, and URL without reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dev');
    await expect(page.locator('[data-scope="dev"]').first()).toBeVisible();
    await expect(page.locator('[data-scope="dance"]').first()).toBeHidden();

    await expect(page.getByRole('button', { name: 'Developer' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Dancer' })).toHaveAttribute('aria-pressed', 'false');

    let reloaded = false;
    page.on('load', () => (reloaded = true));

    await page.getByRole('button', { name: 'Dancer' }).click();

    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dance');
    await expect(page).toHaveURL(/\/dancer$/);
    await expect(page.locator('[data-scope="dance"]').first()).toBeVisible();
    await expect(page.locator('[data-scope="dev"]').first()).toBeHidden();
    await expect(page.getByRole('button', { name: 'Dancer' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Developer' })).toHaveAttribute('aria-pressed', 'false');
    expect(reloaded).toBe(false);

    await page.getByRole('button', { name: 'Developer' }).click();

    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dev');
    await expect(page.getByRole('button', { name: 'Developer' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Dancer' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking the active side is a no-op', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Developer' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dev');
  });

  test('browser back/forward moves between modes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Dancer' }).click();
    await expect(page).toHaveURL(/\/dancer$/);
    await page.goBack();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dev');
    await page.goForward();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dance');
  });

  test('reduced motion: no theme-transition class is added', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await page.getByRole('button', { name: 'Dancer' }).click();
    expect((await page.locator('html').getAttribute('class')) ?? '').not.toContain('theme-transition');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dance');
    await context.close();
  });

  test('hero text and CTAs differ per mode', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-scope="dev"] .hero__tagline')).toHaveText('dev by day…');
    await expect(page.locator('[data-scope="dev"] .hero__cta')).toContainText('View work');

    await page.goto('/dancer');
    await expect(page.locator('[data-scope="dance"] .hero__tagline')).toHaveText('…dancer by night');
    await expect(page.locator('[data-scope="dance"] .hero__cta a')).toHaveAttribute('href', /^mailto:erichung\.94@gmail\.com/);
  });

  test('contact links differ per mode', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-scope="dev"] #dev-contact')).toContainText('GitHub');
    await expect(page.locator('[data-scope="dev"] #dev-contact')).toContainText('LinkedIn');
    await page.goto('/dancer');
    await expect(page.locator('[data-scope="dance"] #dance-contact')).not.toContainText('GitHub');
  });
});

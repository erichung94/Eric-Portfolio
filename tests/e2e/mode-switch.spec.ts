import { test, expect, type Page } from '@playwright/test';

// Click a switch label and wait for the mode to actually change. The click is
// retried: a click that lands before the `client:load` React island has hydrated
// would otherwise do nothing (handler not yet attached) and flake the test.
async function switchMode(page: Page, label: 'Developer' | 'Dancer', expected: 'dev' | 'dance') {
  await expect(async () => {
    await page.getByRole('button', { name: label }).click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', expected, { timeout: 500 });
  }).toPass({ timeout: 8000, intervals: [50, 150, 300, 500, 500] });
}

// Navigate, then guarantee the island is interactive by round-tripping the switch
// (dev -> dance -> dev). After this returns, clicks are reliable.
async function gotoHydrated(page: Page, path = '/') {
  await page.goto(path);
  await switchMode(page, 'Dancer', 'dance');
  await switchMode(page, 'Developer', 'dev');
}

test.describe('mode switch', () => {
  test('swaps theme, content, and URL without reload', async ({ page }) => {
    await gotoHydrated(page, '/');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dev');
    await expect(page.locator('[data-scope="dev"]').first()).toBeVisible();
    await expect(page.locator('[data-scope="dance"]').first()).toBeHidden();
    await expect(page.getByRole('button', { name: 'Developer' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Dancer' })).toHaveAttribute('aria-pressed', 'false');

    let reloaded = false;
    page.on('load', () => (reloaded = true));

    await switchMode(page, 'Dancer', 'dance');

    await expect(page).toHaveURL(/\/dancer$/);
    await expect(page.locator('[data-scope="dance"]').first()).toBeVisible();
    await expect(page.locator('[data-scope="dev"]').first()).toBeHidden();
    await expect(page.getByRole('button', { name: 'Dancer' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Developer' })).toHaveAttribute('aria-pressed', 'false');
    expect(reloaded).toBe(false);

    await switchMode(page, 'Developer', 'dev');
    await expect(page.getByRole('button', { name: 'Developer' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('button', { name: 'Dancer' })).toHaveAttribute('aria-pressed', 'false');
  });

  test('clicking the active side is a no-op', async ({ page }) => {
    await gotoHydrated(page, '/'); // ends in dev mode, island proven interactive
    await page.getByRole('button', { name: 'Developer' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dev');
  });

  test('browser back/forward moves between modes', async ({ page }) => {
    await gotoHydrated(page, '/');
    await switchMode(page, 'Dancer', 'dance');
    await expect(page).toHaveURL(/\/dancer$/);
    await page.goBack();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dev');
    await page.goForward();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'dance');
  });

  test('reduced motion: no theme-transition class is added', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await gotoHydrated(page, '/');
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

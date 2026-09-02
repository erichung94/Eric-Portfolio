import { expect, type Page } from '@playwright/test';

/**
 * Click a switch label and wait for the mode to actually change.
 *
 * The click is retried on purpose. `ModeSwitch` is a `client:load` React island,
 * and a click that lands before it hydrates does nothing at all, because the
 * handler is not attached yet. Playwright's actionability checks do not wait for
 * hydration, so without this any test that clicks the switch right after a
 * navigation is a coin flip.
 */
export async function switchMode(
  page: Page,
  label: 'Developer' | 'Dancer',
  expected: 'dev' | 'dance',
) {
  await expect(async () => {
    await page.getByRole('button', { name: label }).click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', expected, { timeout: 500 });
  }).toPass({ timeout: 8000, intervals: [50, 150, 300, 500, 500] });
}

/**
 * Navigate, then prove the island is interactive by round-tripping the switch
 * (dev -> dance -> dev). After this resolves, plain `.click()` calls on the
 * switch are reliable.
 */
export async function gotoHydrated(page: Page, path = '/') {
  await page.goto(path);
  await switchMode(page, 'Dancer', 'dance');
  await switchMode(page, 'Developer', 'dev');
}

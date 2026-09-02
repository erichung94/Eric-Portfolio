import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    // Deliberately not 4321. `astro dev` and `astro preview` both default to
    // that port, and `reuseExistingServer` will happily adopt whatever is
    // already listening. A dev server left running during a test run therefore
    // gets tested instead of the production build, and its HMR re-renders pages
    // mid-test, which shows up as unexplained flakes. Giving preview its own
    // port means the two can never be confused.
    baseURL: 'http://localhost:4323',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4323',
    url: 'http://localhost:4323',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

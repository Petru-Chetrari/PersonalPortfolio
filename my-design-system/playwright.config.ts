import { defineConfig, devices } from '@playwright/test';

/**
 * Antigravity Platform — Playwright E2E Configuration
 * Base URL: http://localhost:4321 (Astro dev server)
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Keep serial to avoid MockRepository race conditions
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Viewport wide enough to show desktop sidebar / nav
    viewport: { width: 1280, height: 800 },
    // Clear storage between tests via storageState reset
    storageState: { cookies: [], origins: [] },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Auto-start the Astro dev server before tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});

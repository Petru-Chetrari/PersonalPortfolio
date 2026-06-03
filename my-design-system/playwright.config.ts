import { defineConfig, devices } from '@playwright/test';

/**
 * Antigravity Platform — Playwright E2E Configuration
 * Base URL: http://localhost:4322 (isolated Astro test server)
 *
 * Two servers are started before tests run:
 *   1. Express backend  — localhost:3001  (reuseExistingServer so manual runs are fine)
 *   2. Astro frontend   — localhost:4322  (always fresh, PUBLIC_API_URL → localhost:3001)
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Keep serial to avoid MockRepository race conditions
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:4322',
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

  webServer: [
    // 1. Express backend — must be running before Astro starts
    {
      command: 'npm run dev',
      url: 'http://localhost:3001/health',
      cwd: '../backend',
      reuseExistingServer: true,
      timeout: 30_000,
    },
    // 2. Astro frontend — isolated on port 4322 with local API URL
    {
      command: 'npm run dev -- --port 4322',
      url: 'http://localhost:4322',
      reuseExistingServer: true,
      timeout: 60_000,
      env: {
        PUBLIC_API_URL: 'http://localhost:3001',
      },
    },
  ],
});

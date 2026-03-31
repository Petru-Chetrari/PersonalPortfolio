import { type Page, expect } from '@playwright/test';

/**
 * Shared helpers for the Antigravity E2E suite.
 *
 * Auth model: The app uses a simple client-side redirect on form submit
 * (window.location.href = '/admin'). We replicate this by filling the form
 * and submitting, then waiting for the destination URL.
 *
 * MockRepository: Lives in module-level memory inside the Astro dev-server
 * process. Because Playwright uses real HTTP requests, data added via the
 * submit-commission form will persist within the same server session BUT will
 * reset on server restart. Each test navigates fresh; we do NOT need to clear
 * localStorage (the repo isn't localStorage-backed), but we DO isolate tests
 * by using separate browser contexts (default Playwright behaviour with
 * storageState: {} in config).
 */

// ─── Auth helpers ────────────────────────────────────────────────────────────

/**
 * Sign in as Admin by filling the /signin form and waiting for /admin.
 * The current implementation redirects any valid credentials to /admin.
 */
export async function loginAsAdmin(page: Page) {
  console.log('[STEP] loginAsAdmin → navigating to /signin');
  await page.goto('/signin');
  await expect(page.locator('#signin-form')).toBeVisible();

  await page.fill('#username', 'admin');
  await page.fill('#password', 'admin123');

  console.log('[STEP] loginAsAdmin → submitting credentials');
  await Promise.all([
    page.waitForURL('**/admin', { timeout: 10_000 }),
    page.click('#signin-btn'),
  ]);
  console.log('[STEP] loginAsAdmin → reached /admin ✓');
}

/**
 * Sign in as a Client. The app redirects to /admin for any valid form;
 * we then manually navigate to the client portal since RBAC is client-side.
 */
export async function loginAsClient(page: Page) {
  console.log('[STEP] loginAsClient → navigating to /signin');
  await page.goto('/signin');
  await expect(page.locator('#signin-form')).toBeVisible();

  await page.fill('#username', 'client_a');
  await page.fill('#password', 'client123');

  console.log('[STEP] loginAsClient → submitting credentials');
  await Promise.all([
    page.waitForURL('**/admin', { timeout: 10_000 }),
    page.click('#signin-btn'),
  ]);
  // Navigate to the client section
  await page.goto('/client/commissions');
  console.log('[STEP] loginAsClient → reached /client/commissions ✓');
}

// ─── Navigation helpers ───────────────────────────────────────────────────────

/**
 * Wait for an Astro ViewTransition to settle.
 * Astro fires `astro:page-load` after the swap; we poll for URL change.
 */
export async function waitForViewTransition(page: Page, expectedUrlPattern: string | RegExp) {
  await page.waitForURL(expectedUrlPattern, { timeout: 10_000 });
  // Give the astro:page-load scripts a tick to re-run
  await page.waitForLoadState('domcontentloaded');
}

// ─── DOM assertion helpers ────────────────────────────────────────────────────

/** Assert an element is absent from the DOM (not just hidden). */
export async function assertAbsentFromDOM(page: Page, selector: string) {
  const count = await page.locator(selector).count();
  expect(count, `Expected "${selector}" to be absent from the DOM, but found ${count} instance(s).`).toBe(0);
}

/** Assert element is visible (web-first, no arbitrary waits). */
export async function assertVisible(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeVisible({ timeout: 8_000 });
}

import { test, expect } from '@playwright/test';
import { loginAsClient } from './helpers';

/**
 * Suite 02 — RBAC: Client Submission
 *
 * Validates that a Client user can:
 *  1. See the "New Commission" CTA on /client/commissions
 *  2. Navigate to /submit-commission
 *  3. Fill and submit the commission form
 *  4. See the success state
 *  5. Navigate back and see the new item in the list
 */
test.describe('Suite 02 — RBAC: Client Submission', () => {

  test('"New Commission" CTA is visible on client commissions page', async ({ page }) => {
    console.log('[02a] Checking "New Commission" CTA visibility');

    await loginAsClient(page);
    await expect(page.locator('#client-commissions')).toBeVisible({ timeout: 10_000 });

    // Scope to the main content area (#client-commissions) to avoid matching
    // the sidebar's nav link which also points to /submit-commission
    const cta = page.locator('#client-commissions a[href="/submit-commission"]').filter({ hasText: /new commission/i });
    await expect(cta).toBeVisible();
    console.log('[02a]   ✓ "New Commission" CTA is visible in main content area');

    // Also verify the sidebar link exists separately
    const sidebarLink = page.locator('#client-sidebar a[href="/submit-commission"]');
    await expect(sidebarLink).toBeVisible();
    console.log('[02a]   ✓ Sidebar "New Commission" link also visible');

    console.log('[02a] ✅ Client CTA visibility — PASSED');
  });

  test('Client can submit a commission and see it in the list', async ({ page }) => {
    console.log('[02b] Starting full client submission flow');

    // Step 1 — Navigate to client portal
    await loginAsClient(page);
    await expect(page.locator('#client-commissions')).toBeVisible({ timeout: 10_000 });
    console.log('[02b] Client commissions page loaded');

    // Count existing cards BEFORE submission
    const cardGrid = page.locator('#card-grid');
    await expect(cardGrid).toBeVisible();
    const initialCardCount = await cardGrid.locator('> div').count();
    console.log(`[02b] Initial card count: ${initialCardCount}`);

    // Step 2 — Click "New Commission" CTA (scoped to main content)
    console.log('[02b] Clicking "New Commission" CTA');
    await page.locator('#client-commissions a[href="/submit-commission"]').filter({ hasText: /new commission/i }).click();
    await page.waitForURL('**/submit-commission', { timeout: 10_000 });
    console.log('[02b] On /submit-commission page ✓');

    // Step 3 — Fill out the commission form
    const uniqueTitle = `E2E Test Commission ${Date.now()}`;
    console.log(`[02b] Filling form with title: "${uniqueTitle}"`);

    await page.fill('#c-title', uniqueTitle);
    await page.selectOption('#c-type', 'Web App');
    await page.fill('#c-short', 'Automated E2E test short description');
    await page.fill('#c-long', 'This commission was created by the Playwright E2E test suite to verify client submission flow.');
    await page.fill('#c-budget', '3000');

    // Step 4 — Submit the form
    console.log('[02b] Submitting form');
    await page.click('#submit-btn');

    // Step 5 — Assert success state is shown
    console.log('[02b] Waiting for success state');
    await expect(page.locator('#success-state')).toBeVisible({ timeout: 8_000 });
    await expect(page.locator('#success-state')).toContainText('Commission Submitted');
    console.log('[02b]   ✓ Success state visible');

    // The form should be hidden
    await expect(page.locator('#commission-form')).not.toBeVisible();
    console.log('[02b]   ✓ Form is hidden after success');

    // Step 6 — Navigate back to /client/commissions and verify new item
    console.log('[02b] Navigating back to client commissions');
    await page.click('a[href="/client/commissions"]');
    await page.waitForURL('**/client/commissions', { timeout: 10_000 });
    await expect(page.locator('#card-grid')).toBeVisible({ timeout: 8_000 });

    // The new commission should appear (created by MockRepository with client="Current User")
    const newCardCount = await page.locator('#card-grid > div').count();
    console.log(`[02b] New card count: ${newCardCount}`);
    expect(newCardCount).toBeGreaterThanOrEqual(initialCardCount);

    // The new commission title should be in the page
    await expect(page.locator('#card-grid')).toContainText(uniqueTitle);
    console.log(`[02b]   ✓ New commission "${uniqueTitle}" found in the list`);

    console.log('[02b] ✅ Client submission flow — PASSED');
  });
});

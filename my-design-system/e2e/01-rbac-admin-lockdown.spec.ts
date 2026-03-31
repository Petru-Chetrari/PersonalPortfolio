import { test, expect } from '@playwright/test';
import { loginAsAdmin, assertAbsentFromDOM } from './helpers';

/**
 * Suite 01 — RBAC: Admin Lockdown
 *
 * Validates that an Admin user viewing /admin/commissions has a READ-ONLY
 * experience: no "Create", "New", "POST", or "Submit" functionality exposed.
 *
 * The admin commissions page should show commission rows with status-change
 * action buttons (Approve / Complete) but NEVER a "New Commission" or
 * "Create Commission" CTA — that belongs to the Client portal only.
 */
test.describe('Suite 01 — RBAC: Admin Lockdown', () => {

  test('Admin commissions page has NO create / new / submit controls', async ({ page }) => {
    console.log('[01] Starting RBAC Admin Lockdown test');

    // Step 1 — Authenticate as Admin
    await loginAsAdmin(page);

    // Step 2 — Navigate to /admin/commissions
    console.log('[01] Navigating to /admin/commissions');
    await page.goto('/admin/commissions');
    await expect(page.locator('#admin-commissions')).toBeVisible({ timeout: 10_000 });
    console.log('[01] Admin commissions page loaded ✓');

    // Step 3 — Assert "Create" / "New" / "Submit" buttons are ABSENT
    console.log('[01] Asserting absence of create/new/submit controls');

    // No button or link with text "Create" or "New Commission" or "Submit Commission"
    const createButtons = page.locator('button, a').filter({ hasText: /create/i });
    expect(await createButtons.count()).toBe(0);
    console.log('[01]   ✓ No "Create" button found');

    const newButtons = page.locator('button, a').filter({ hasText: /new commission/i });
    expect(await newButtons.count()).toBe(0);
    console.log('[01]   ✓ No "New Commission" button found');

    const submitButtons = page.locator('button, a').filter({ hasText: /submit commission/i });
    expect(await submitButtons.count()).toBe(0);
    console.log('[01]   ✓ No "Submit Commission" button found');

    // No link to /submit-commission
    await assertAbsentFromDOM(page, 'a[href="/submit-commission"]');
    console.log('[01]   ✓ No link to /submit-commission');

    // Step 4 — Verify the page DOES have read-only admin elements (filter pills, rows)
    console.log('[01] Verifying admin read-only elements are present');
    await expect(page.locator('#filter-all')).toBeVisible();
    await expect(page.locator('#commission-list')).toBeVisible();
    console.log('[01]   ✓ Filter pills and commission list visible');

    // Step 5 — Verify action buttons are status-transition only (Approve / Complete),
    // NOT general-purpose "POST new data" actions
    const actionBtns = page.locator('.action-btn');
    const count = await actionBtns.count();
    console.log(`[01] Found ${count} action buttons on page`);
    for (let i = 0; i < count; i++) {
      const text = await actionBtns.nth(i).textContent();
      const action = await actionBtns.nth(i).getAttribute('data-action');
      expect(
        action === 'active' || action === 'completed',
        `Action button "${text}" has unexpected data-action="${action}"`
      ).toBeTruthy();
    }
    console.log('[01]   ✓ All action buttons are status-transition controls only');

    console.log('[01] ✅ RBAC Admin Lockdown — PASSED');
  });

  test('Admin commissions page has no form elements for new submissions', async ({ page }) => {
    console.log('[01b] Checking no form/input elements for new commissions exist');

    await loginAsAdmin(page);
    await page.goto('/admin/commissions');
    await expect(page.locator('#admin-commissions')).toBeVisible({ timeout: 10_000 });

    // No <form> on the page (filter buttons are plain <button>s, not wrapped in <form>)
    await assertAbsentFromDOM(page, '#admin-commissions form');
    console.log('[01b]   ✓ No <form> elements on admin commissions');

    // No text inputs for data entry
    await assertAbsentFromDOM(page, '#admin-commissions input[type="text"]');
    await assertAbsentFromDOM(page, '#admin-commissions textarea');
    console.log('[01b]   ✓ No text inputs or textareas');

    console.log('[01b] ✅ Admin form-absence check — PASSED');
  });
});

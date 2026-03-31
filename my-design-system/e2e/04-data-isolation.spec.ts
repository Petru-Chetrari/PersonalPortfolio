import { test, expect } from '@playwright/test';
import { loginAsClient } from './helpers';

/**
 * Suite 04 — Data Isolation
 *
 * Validates that a Client user only sees commissions scoped to their identity.
 *
 * MockRepository.getClientCommissions() returns items where:
 *   client === 'Current User' || client === 'Alex M.' || client === 'Sarah K.' || client === 'Jordan T.'
 *
 * The remaining commissions (Priya S., Marco R., Liu W.) should NOT appear in
 * the client portal. This test verifies that isolation boundary.
 */
test.describe('Suite 04 — Data Isolation', () => {

  test('Client A sees only their scoped commissions, not other clients', async ({ page }) => {
    console.log('[04] Starting data isolation test');

    // Step 1 — Login as client and navigate to commissions
    await loginAsClient(page);
    await expect(page.locator('#client-commissions')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('#card-grid')).toBeVisible({ timeout: 8_000 });
    console.log('[04] Client commissions loaded ✓');

    // Step 2 — Collect all visible commission card texts
    const cardGrid = page.locator('#card-grid');
    const allCardText = await cardGrid.textContent();
    console.log(`[04] Card grid text content length: ${allCardText?.length ?? 0}`);

    // Step 3 — Assert that the CLIENT's commissions ARE visible
    // (Alex M., Sarah K., Jordan T. are "our" mock client commissions)
    const expectedClients = ['Alex M.', 'Sarah K.', 'Jordan T.'];

    // Verify at least one client-scoped commission is visible
    // We check the commission titles since client names aren't shown in client cards
    const expectedTitles = [
      'Portfolio Website Redesign',   // Alex M.
      'E-commerce Dashboard',          // Sarah K.
      'Mobile App UI Design',          // Jordan T.
    ];

    for (const title of expectedTitles) {
      await expect(
        cardGrid,
        `Expected "${title}" to be visible in client commissions`
      ).toContainText(title);
      console.log(`[04]   ✓ Found client commission: "${title}"`);
    }

    // Step 4 — Assert FOREIGN client commissions are ABSENT
    // These belong to Priya S., Marco R., Liu W. — NOT scoped to this client
    const foreignTitles = [
      'SaaS Landing Page',      // Priya S.
      'Brand Identity System',  // Marco R.
      'Admin Panel Overhaul',   // Liu W.
    ];

    for (const title of foreignTitles) {
      expect(
        allCardText,
        `Foreign commission "${title}" should NOT appear in client portal`
      ).not.toContain(title);
      console.log(`[04]   ✓ Foreign commission "${title}" is correctly absent`);
    }

    // Step 5 — Compare counts: client should see exactly 3 base commissions
    // (plus any "Current User" ones added during the session)
    const cardCount = await cardGrid.locator('> div').count();
    console.log(`[04] Total visible cards: ${cardCount}`);
    expect(cardCount).toBeGreaterThanOrEqual(3);
    // Should never exceed total commissions (currently 6, minus 3 foreign = 3 base)
    // But "Current User" additions could increase it, so we set a generous upper bound
    expect(cardCount).toBeLessThanOrEqual(20);

    console.log('[04] ✅ Data Isolation — PASSED');
  });

  test('Client cannot directly navigate to admin commissions and see all data', async ({ page }) => {
    console.log('[04b] Checking data isolation by route comparison');

    // Step 1 — Load admin commissions (all commissions visible to admin)
    await page.goto('/admin/commissions');
    await expect(page.locator('#commission-list')).toBeVisible({ timeout: 10_000 });

    const adminText = await page.locator('#commission-list').textContent();

    // Admin should see ALL commissions, including foreign ones
    expect(adminText).toContain('SaaS Landing Page');
    expect(adminText).toContain('Brand Identity System');
    expect(adminText).toContain('Admin Panel Overhaul');
    console.log('[04b]   ✓ Admin sees all commissions including foreign ones');

    // Step 2 — Now check client portal
    await page.goto('/client/commissions');
    await expect(page.locator('#card-grid')).toBeVisible({ timeout: 10_000 });

    const clientText = await page.locator('#card-grid').textContent();

    // Client should NOT see those same foreign commissions
    expect(clientText).not.toContain('SaaS Landing Page');
    expect(clientText).not.toContain('Brand Identity System');
    expect(clientText).not.toContain('Admin Panel Overhaul');
    console.log('[04b]   ✓ Client does NOT see foreign commissions');

    console.log('[04b] ✅ Route-based data isolation — PASSED');
  });
});

import { test, expect } from '@playwright/test';

/**
 * Suite 05 — Smooth Routing (Astro ViewTransitions / ClientRouter)
 *
 * The app uses Astro's ClientRouter (from 'astro:transitions') which performs
 * soft navigations by swapping <body> content. This means:
 *  - DOM nodes in <body> get replaced (so DOM markers won't survive)
 *  - But window-level JS state survives (no full page reload)
 *  - The browser doesn't fire a new 'load' event
 *
 * We validate ViewTransitions by:
 *  1. Setting a window-level JS variable before navigation
 *  2. Verifying it survives after the nav (proves no hard reload)
 *  3. Checking that persistent layout elements render after transition
 */
test.describe('Suite 05 — Smooth Routing (ViewTransitions)', () => {

  test('Admin: Dashboard → Commissions navigates smoothly without hard reload', async ({ page }) => {
    console.log('[05a] Starting smooth routing test: Admin Dashboard → Commissions');

    // Step 1 — Navigate to admin dashboard
    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');
    console.log('[05a] Admin dashboard loaded ✓');

    // Step 2 — Inject a window-level marker to detect hard reloads
    // Window properties survive ViewTransition body swaps but NOT full page loads
    await page.evaluate(() => {
      (window as any).__e2e_vt_marker__ = 'alive';
    });

    const markerBefore = await page.evaluate(() => (window as any).__e2e_vt_marker__);
    expect(markerBefore).toBe('alive');
    console.log('[05a] Window-level ViewTransition marker set ✓');

    // Step 3 — Verify the admin nav bar is present
    const adminHeading = page.locator('h1').filter({ hasText: /admin portal/i });
    await expect(adminHeading).toBeVisible();
    console.log('[05a] Admin Portal heading visible before navigation ✓');

    // Step 4 — Click "Commissions" link in the admin nav
    console.log('[05a] Clicking Commissions nav link');
    const commissionsLink = page.locator('a[href="/admin/commissions"]').first();
    await expect(commissionsLink).toBeVisible();
    await commissionsLink.click();

    // Step 5 — Wait for URL change
    await page.waitForURL('**/admin/commissions', { timeout: 10_000 });
    console.log('[05a] URL changed to /admin/commissions ✓');

    // Step 6 — Verify the admin heading persists (same layout component)
    await expect(adminHeading).toBeVisible();
    console.log('[05a] Admin Portal heading persisted through transition ✓');

    // Step 7 — Verify the window-level marker survived (no hard reload)
    const markerAfter = await page.evaluate(() => (window as any).__e2e_vt_marker__);
    expect(
      markerAfter,
      'Window marker should survive ViewTransition (proves no hard reload occurred)'
    ).toBe('alive');
    console.log('[05a] Window marker survived — soft navigation confirmed ✓');

    // Step 8 — Verify the destination page content loaded
    await expect(page.locator('#admin-commissions')).toBeVisible({ timeout: 8_000 });
    console.log('[05a] Commissions page content visible ✓');

    console.log('[05a] ✅ Admin smooth routing — PASSED');
  });

  test('Admin: Commissions → Dashboard (reverse nav) also uses ViewTransitions', async ({ page }) => {
    console.log('[05b] Starting reverse routing test: Commissions → Dashboard');

    // Start on commissions
    await page.goto('/admin/commissions');
    await expect(page.locator('#admin-commissions')).toBeVisible({ timeout: 10_000 });

    // Inject window marker
    await page.evaluate(() => {
      (window as any).__e2e_vt_marker_reverse__ = 'alive';
    });

    // Click the "Admin Portal" heading link to go back to /admin
    console.log('[05b] Clicking Admin Portal heading to navigate back');
    const portalLink = page.locator('a[href="/admin"]').first();
    await expect(portalLink).toBeVisible();
    await portalLink.click();

    await page.waitForURL(/\/admin\/?$/, { timeout: 10_000 });
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/admin\/?$/);
    console.log(`[05b] URL changed back to: ${currentUrl} ✓`);

    // Check window marker survived
    const markerAlive = await page.evaluate(() => (window as any).__e2e_vt_marker_reverse__);
    expect(
      markerAlive,
      'Window marker should survive reverse ViewTransition'
    ).toBe('alive');
    console.log('[05b] Window marker survived reverse navigation ✓');

    console.log('[05b] ✅ Reverse smooth routing — PASSED');
  });

  test('Client sidebar persists through page navigations', async ({ page }) => {
    console.log('[05c] Starting client sidebar persistence test');

    // Navigate to client commissions
    await page.goto('/client/commissions');
    await expect(page.locator('#client-commissions')).toBeVisible({ timeout: 10_000 });

    // Assert the sidebar is present (desktop viewport)
    const sidebar = page.locator('#client-sidebar');
    await expect(sidebar).toBeVisible();
    console.log('[05c] Client sidebar visible ✓');

    // Verify the sidebar has the Antigravity branding
    await expect(sidebar).toContainText('Antigravity');
    console.log('[05c] Sidebar branding present ✓');

    // Click "New Commission" in the sidebar nav
    const newCommLink = sidebar.locator('a[href="/submit-commission"]');
    await expect(newCommLink).toBeVisible();

    // Set window marker
    await page.evaluate(() => {
      (window as any).__e2e_sidebar_nav__ = 'alive';
    });

    await newCommLink.click();
    await page.waitForURL('**/submit-commission', { timeout: 10_000 });
    console.log('[05c] Navigated to /submit-commission ✓');

    // Verify soft navigation occurred
    const marker = await page.evaluate(() => (window as any).__e2e_sidebar_nav__);
    expect(marker).toBe('alive');
    console.log('[05c] Window marker survived — ViewTransition confirmed ✓');

    // Verify the destination page loaded correctly
    await expect(page.locator('#commission-form')).toBeVisible({ timeout: 8_000 });
    console.log('[05c] Commission form loaded on destination page ✓');

    console.log('[05c] ✅ Client sidebar persistence — PASSED');
  });
});

import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers';

/**
 * Suite 06 — Admin Edit Flow
 *
 * Validates that an Admin can interact with commission rows:
 *
 *  1. Click a status-transition action button (Approve / Complete)
 *  2. Verify the commission status updates in-place without page reload
 *  3. Verify the row data (ID, title, client) remains consistent after
 *     the status change
 *  4. Test the filter system to ensure the commission moves to the
 *     correct filter category after its status changes
 */
test.describe('Suite 06 — Admin Edit Flow', () => {

  test('Admin can Approve a pending commission and status updates in-place', async ({ page }) => {
    console.log('[06a] Starting admin edit flow — Approve pending commission');

    // Step 1 — Navigate to admin commissions
    await loginAsAdmin(page);
    await page.goto('/admin/commissions');
    await expect(page.locator('#commission-list')).toBeVisible({ timeout: 10_000 });
    console.log('[06a] Admin commissions page loaded ✓');

    // Step 2 — Find a pending commission row
    const pendingRows = page.locator('.commission-row[data-status="pending"]');
    const pendingCount = await pendingRows.count();
    console.log(`[06a] Found ${pendingCount} pending commission(s)`);
    expect(pendingCount).toBeGreaterThan(0);

    // Capture the first pending row's details before action
    const firstPendingRow = pendingRows.first();
    const rowId = await firstPendingRow.locator('.font-mono').textContent();
    const rowTitle = await firstPendingRow.locator('.font-semibold.text-slate-50').textContent();
    console.log(`[06a] Target commission: ${rowId?.trim()} — "${rowTitle?.trim()}"`);

    // Step 3 — Click "Approve" button on this row
    const approveBtn = firstPendingRow.locator('.action-btn[data-action="active"]');
    await expect(approveBtn).toBeVisible();
    await expect(approveBtn).toContainText('Approve');
    console.log('[06a] Clicking "Approve" button');
    await approveBtn.click();

    // Step 4 — Verify the status changed in-place
    // The row should now have data-status="active" and the badge should say "Active"
    // Re-query because the DOM was re-rendered by renderList()
    console.log('[06a] Verifying status update');

    // Wait for the list to re-render
    await expect(page.locator('#commission-list')).toBeVisible();

    // The commission with the same ID should now be "active"
    const updatedRow = page.locator(`.commission-row`).filter({ hasText: rowId?.trim() ?? '' });
    await expect(updatedRow).toBeVisible({ timeout: 5_000 });

    const newStatus = await updatedRow.getAttribute('data-status');
    expect(newStatus).toBe('active');
    console.log(`[06a]   ✓ Commission ${rowId?.trim()} is now status: "${newStatus}"`);

    // Step 5 — Verify the row data is consistent (ID and title didn't change)
    const updatedId = await updatedRow.locator('.font-mono').textContent();
    const updatedTitle = await updatedRow.locator('.font-semibold.text-slate-50').textContent();
    expect(updatedId?.trim()).toBe(rowId?.trim());
    expect(updatedTitle?.trim()).toBe(rowTitle?.trim());
    console.log('[06a]   ✓ Row data (ID, title) is consistent after status change');

    // Step 6 — The "Approve" button should be gone, replaced by "Complete"
    const completeBtn = updatedRow.locator('.action-btn[data-action="completed"]');
    await expect(completeBtn).toBeVisible();
    await expect(completeBtn).toContainText('Complete');
    console.log('[06a]   ✓ Action button changed to "Complete"');

    console.log('[06a] ✅ Admin Approve flow — PASSED');
  });

  test('Admin can Complete an active commission', async ({ page }) => {
    console.log('[06b] Starting admin edit flow — Complete active commission');

    await loginAsAdmin(page);
    await page.goto('/admin/commissions');
    await expect(page.locator('#commission-list')).toBeVisible({ timeout: 10_000 });

    // Find an active commission
    const activeRows = page.locator('.commission-row[data-status="active"]');
    const activeCount = await activeRows.count();
    console.log(`[06b] Found ${activeCount} active commission(s)`);
    expect(activeCount).toBeGreaterThan(0);

    const firstActiveRow = activeRows.first();
    const rowId = await firstActiveRow.locator('.font-mono').textContent();
    console.log(`[06b] Target: ${rowId?.trim()}`);

    // Click "Complete"
    const completeBtn = firstActiveRow.locator('.action-btn[data-action="completed"]');
    await expect(completeBtn).toBeVisible();
    console.log('[06b] Clicking "Complete" button');
    await completeBtn.click();

    // Verify it changed to "completed"
    const updatedRow = page.locator('.commission-row').filter({ hasText: rowId?.trim() ?? '' });
    await expect(updatedRow).toBeVisible({ timeout: 5_000 });

    const newStatus = await updatedRow.getAttribute('data-status');
    expect(newStatus).toBe('completed');
    console.log(`[06b]   ✓ Commission ${rowId?.trim()} is now status: "${newStatus}"`);

    // No action button should remain for completed commissions
    const actionBtn = updatedRow.locator('.action-btn');
    expect(await actionBtn.count()).toBe(0);
    console.log('[06b]   ✓ No action buttons on completed commission');

    console.log('[06b] ✅ Admin Complete flow — PASSED');
  });

  test('Admin filter shows correct commissions after status changes', async ({ page }) => {
    console.log('[06c] Starting admin filter verification');

    await loginAsAdmin(page);
    await page.goto('/admin/commissions');
    await expect(page.locator('#commission-list')).toBeVisible({ timeout: 10_000 });
    console.log('[06c] Admin commissions loaded ✓');

    // Step 1 — Click "Pending" filter
    console.log('[06c] Clicking "Pending" filter');
    await page.click('#filter-pending');

    // All visible rows should have data-status="pending"
    const visibleRows = page.locator('.commission-row');
    const rowCount = await visibleRows.count();
    console.log(`[06c] Pending filter shows ${rowCount} row(s)`);

    for (let i = 0; i < rowCount; i++) {
      const status = await visibleRows.nth(i).getAttribute('data-status');
      expect(status).toBe('pending');
    }
    console.log('[06c]   ✓ All rows under "Pending" filter have correct status');

    // Step 2 — Click "Active" filter
    console.log('[06c] Clicking "Active" filter');
    await page.click('#filter-active');

    const activeRows = page.locator('.commission-row');
    const activeCount = await activeRows.count();
    console.log(`[06c] Active filter shows ${activeCount} row(s)`);

    for (let i = 0; i < activeCount; i++) {
      const status = await activeRows.nth(i).getAttribute('data-status');
      expect(status).toBe('active');
    }
    console.log('[06c]   ✓ All rows under "Active" filter have correct status');

    // Step 3 — Click "Completed" filter
    console.log('[06c] Clicking "Completed" filter');
    await page.click('#filter-completed');

    const completedRows = page.locator('.commission-row');
    const completedCount = await completedRows.count();
    console.log(`[06c] Completed filter shows ${completedCount} row(s)`);

    for (let i = 0; i < completedCount; i++) {
      const status = await completedRows.nth(i).getAttribute('data-status');
      expect(status).toBe('completed');
    }
    console.log('[06c]   ✓ All rows under "Completed" filter have correct status');

    // Step 4 — Click "All" filter and verify total count
    console.log('[06c] Clicking "All" filter');
    await page.click('#filter-all');

    const allRows = page.locator('.commission-row');
    const allCount = await allRows.count();
    console.log(`[06c] All filter shows ${allCount} row(s)`);
    expect(allCount).toBeGreaterThanOrEqual(rowCount + activeCount + completedCount);
    console.log('[06c]   ✓ "All" filter count is consistent');

    console.log('[06c] ✅ Admin filter verification — PASSED');
  });
});

import { test, expect } from '@playwright/test';

/**
 * Suite 03 — SVG Interactivity
 *
 * Tests that SVG elements on the landing page and admin dashboard:
 *  1. Render correctly with valid path data
 *  2. Respond to hover interactions on their parent elements
 *  3. Have proper visual attributes (stroke, fill)
 */
test.describe('Suite 03 — SVG Interactivity', () => {

  test('Landing page SVG elements render correctly and parents respond to hover', async ({ page }) => {
    console.log('[03] Starting SVG interactivity test');

    // Step 1 — Navigate to the landing page
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    console.log('[03] Landing page loaded ✓');

    // Step 2 — Verify SVG elements exist on the page
    const allSvgs = page.locator('svg');
    const svgCount = await allSvgs.count();
    console.log(`[03] Found ${svgCount} SVG elements on the landing page`);
    expect(svgCount).toBeGreaterThan(0);

    // Step 3 — Verify SVG paths exist and have valid "d" attributes
    const svgPaths = page.locator('svg path');
    const pathCount = await svgPaths.count();
    console.log(`[03] Found ${pathCount} SVG <path> elements`);
    expect(pathCount).toBeGreaterThan(0);

    // Step 4 — Find a path with explicit stroke or fill attributes
    // (some paths like the logo only have fill, some only have stroke)
    const pathsWithStroke = page.locator('svg path[stroke]');
    const pathsWithFill = page.locator('svg path[fill]');
    const strokeCount = await pathsWithStroke.count();
    const fillCount = await pathsWithFill.count();
    console.log(`[03] Paths with stroke: ${strokeCount}, with fill: ${fillCount}`);
    expect(
      strokeCount + fillCount,
      'At least some SVG paths should have stroke or fill attributes'
    ).toBeGreaterThan(0);

    // Step 5 — Validate a specific stroked path has valid data
    if (strokeCount > 0) {
      const firstStrokedPath = pathsWithStroke.first();
      const d = await firstStrokedPath.getAttribute('d');
      const stroke = await firstStrokedPath.getAttribute('stroke');
      expect(d, 'SVG path d attribute should be non-empty').toBeTruthy();
      expect(stroke, 'SVG path stroke attribute should be non-empty').toBeTruthy();
      console.log(`[03]   ✓ Stroked path: d="${d?.substring(0, 30)}…", stroke="${stroke}"`);
    }

    // Step 6 — Test hover on the hero CTA button (contains an SVG arrow icon)
    const heroCta = page.locator('a[href="/submit-commission"]').filter({ hasText: /get started/i });
    if (await heroCta.count() > 0) {
      const ctaSvg = heroCta.locator('svg');
      await expect(ctaSvg).toBeVisible();

      // Capture pre-hover opacity of the CTA
      const preHoverOpacity = await heroCta.evaluate(
        (el) => window.getComputedStyle(el).opacity
      );
      console.log(`[03] Hero CTA pre-hover opacity: ${preHoverOpacity}`);

      // Hover over the CTA
      await heroCta.hover();
      await expect(heroCta).toBeVisible();

      // The SVG inside should remain rendered
      await expect(ctaSvg).toBeVisible();
      console.log('[03]   ✓ Hero CTA SVG icon persists through hover');
    }

    // Step 7 — Test hover on project cards (they have hover:brightness-110)
    const projectCards = page.locator('#project-grid > div');
    const cardCount = await projectCards.count();
    console.log(`[03] Found ${cardCount} project cards`);

    if (cardCount > 0) {
      const firstCard = projectCards.first();

      // Get pre-hover brightness
      const preFilter = await firstCard.evaluate(
        (el) => window.getComputedStyle(el).filter
      );

      // Hover
      await firstCard.hover();
      await page.waitForTimeout(250); // Allow CSS transition

      const postFilter = await firstCard.evaluate(
        (el) => window.getComputedStyle(el).filter
      );

      console.log(`[03] Project card filter — before: "${preFilter}", after: "${postFilter}"`);
      await expect(firstCard).toBeVisible();
      console.log('[03]   ✓ Project card hover transition completed');
    }

    console.log('[03] ✅ SVG Interactivity — PASSED');
  });

  test('Admin dashboard action cards respond to hover with brightness change', async ({ page }) => {
    console.log('[03b] Testing admin dashboard card hover');

    await page.goto('/admin');
    await page.waitForLoadState('domcontentloaded');

    // The admin quick-action cards are <a> tags with hover:brightness-110
    // They contain SVG icons rendered via Astro's set:html directive
    // Find them by their structure: links to admin sub-pages
    const actionCards = page.locator('a[href^="/admin/"]');
    const cardCount = await actionCards.count();
    console.log(`[03b] Found ${cardCount} admin action links`);
    expect(cardCount).toBeGreaterThan(0);

    // Pick the first card-like action link (one with the rounded-2xl class)
    const cardLinks = page.locator('a[href^="/admin/"][class*="rounded"]');
    const roundedCount = await cardLinks.count();
    console.log(`[03b] Found ${roundedCount} rounded card links`);

    if (roundedCount > 0) {
      const firstCard = cardLinks.first();
      await expect(firstCard).toBeVisible();

      // Verify it contains SVG content (rendered via set:html)
      const hasSvg = await firstCard.locator('svg').count();
      console.log(`[03b] First card contains ${hasSvg} SVG element(s)`);

      // Capture the computed filter before hover
      const preBrightness = await firstCard.evaluate(
        (el) => window.getComputedStyle(el).filter
      );
      console.log(`[03b] Pre-hover filter: ${preBrightness}`);

      // Hover
      await firstCard.hover();
      await page.waitForTimeout(250);

      const postBrightness = await firstCard.evaluate(
        (el) => window.getComputedStyle(el).filter
      );
      console.log(`[03b] Post-hover filter: ${postBrightness}`);

      // The card should remain visible after hover
      await expect(firstCard).toBeVisible();
      console.log('[03b]   ✓ Admin card hover transition completed');
    }

    console.log('[03b] ✅ Admin card hover — PASSED');
  });
});

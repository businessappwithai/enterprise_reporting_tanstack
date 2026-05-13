# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - Error Handling >> WASM-034: Falls back to server-side when needed
- Location: e2e/wasm-features-complete.spec.ts:685:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.monaco-editor')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.monaco-editor')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e7]
      - heading "Welcome back" [level=3] [ref=e9]
      - paragraph [ref=e10]: Sign in to your Enterprise Reporting account
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - text: Email
          - textbox "Email" [ref=e14]:
            - /placeholder: name@example.com
        - generic [ref=e15]:
          - text: Password
          - textbox "Password" [ref=e16]
      - button "Sign In" [ref=e18] [cursor=pointer]
  - region "Notifications alt+T"
```

# Test source

```ts
  590 |   });
  591 | 
  592 |   test('WASM-029: Active filters bar displays', async ({ page }) => {
  593 |     await page.goto(`${BASE_URL}/dashboards`);
  594 | 
  595 |     const firstDashboard = page.locator('.dashboard-card').first();
  596 | 
  597 |     if (await firstDashboard.isVisible()) {
  598 |       await firstDashboard.click();
  599 |       await page.waitForTimeout(3000);
  600 | 
  601 |       // Look for active filters bar
  602 |       const activeFiltersBar = page.locator('.active-filters-bar, [data-testid="active-filters"]');
  603 | 
  604 |       if (await activeFiltersBar.isVisible()) {
  605 |         await expect(activeFiltersBar).toBeVisible();
  606 | 
  607 |         // Should show "no active filters" or similar
  608 |         const hasEmptyState = await activeFiltersBar.locator('text=/no filters/i').count() > 0;
  609 |         const hasFilters = await activeFiltersBar.locator('.filter-chip, .badge').count() > 0;
  610 | 
  611 |         expect(hasEmptyState || hasFilters).toBeTruthy();
  612 |       }
  613 |     }
  614 |   });
  615 | 
  616 |   test('WASM-030: Can clear active filters', async ({ page }) => {
  617 |     await page.goto(`${BASE_URL}/dashboards`);
  618 | 
  619 |     const firstDashboard = page.locator('.dashboard-card').first();
  620 | 
  621 |     if (await firstDashboard.isVisible()) {
  622 |       await firstDashboard.click();
  623 |       await page.waitForTimeout(3000);
  624 | 
  625 |       // Look for clear filters button
  626 |       const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset")').first();
  627 | 
  628 |       if (await clearButton.isVisible()) {
  629 |         await clearButton.click();
  630 |         await page.waitForTimeout(1000);
  631 | 
  632 |         // Should update the UI
  633 |         await expect(page).toBeVisible();
  634 |       }
  635 |     }
  636 |   });
  637 | });
  638 | 
  639 | test.describe('WASM Features - Error Handling', () => {
  640 |   test.beforeEach(async ({ page }) => {
  641 |     await login(page);
  642 |   });
  643 | 
  644 |   test('WASM-031: Handles WASM initialization failure gracefully', async ({ page }) => {
  645 |     // This test verifies the app still works even if WASM fails
  646 | 
  647 |     await page.goto(`${BASE_URL}/datasets`);
  648 | 
  649 |     // Page should load regardless of WASM status
  650 |     await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  651 |   });
  652 | 
  653 |   test('WASM-032: Shows helpful error for invalid SQL', async ({ page }) => {
  654 |     await page.goto(`${BASE_URL}/sql-editor`);
  655 | 
  656 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  657 | 
  658 |     // Type invalid SQL
  659 |     await page.keyboard.type('INVALID SQL QUERY HERE');
  660 |     await page.click('button:has-text("Run"), button:has-text("Execute")');
  661 | 
  662 |     await page.waitForTimeout(2000);
  663 | 
  664 |     // Should show error message
  665 |     const errorMessage = page.locator('text=error, text=syntax, text=invalid').first();
  666 | 
  667 |     // Error might not show if validation is client-side only
  668 |     // Just verify the page is still responsive
  669 |     await expect(page.locator('.monaco-editor')).toBeVisible();
  670 |   });
  671 | 
  672 |   test('WASM-033: Handles large dataset memory limits', async ({ page }) => {
  673 |     await page.goto(`${BASE_URL}/datasets`);
  674 | 
  675 |     await page.waitForTimeout(3000);
  676 | 
  677 |     // Look for memory limit indicators
  678 |     const memoryWarning = page.locator('text=memory, text=limit, text=large dataset');
  679 | 
  680 |     // Memory warnings might not be visible
  681 |     // The important thing is the page handles datasets appropriately
  682 |     await expect(page.locator('h1')).toBeVisible();
  683 |   });
  684 | 
  685 |   test('WASM-034: Falls back to server-side when needed', async ({ page }) => {
  686 |     // The system should automatically fall back to server-side execution for very large datasets
  687 | 
  688 |     await page.goto(`${BASE_URL}/sql-editor`);
  689 | 
> 690 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  691 | 
  692 |     // Execute a query (will use server-side if no dataset loaded)
  693 |     await page.keyboard.type('SELECT 1');
  694 |     await page.click('button:has-text("Run"), button:has-text("Execute")');
  695 | 
  696 |     await page.waitForTimeout(3000);
  697 | 
  698 |     // Should complete without crashing
  699 |     await expect(page).toBeVisible();
  700 |   });
  701 | });
  702 | 
  703 | test.describe('WASM Features - Feature Flags', () => {
  704 |   test.beforeEach(async ({ page }) => {
  705 |     await login(page);
  706 |   });
  707 | 
  708 |   test('WASM-035: WASM features respect feature flags', async ({ page }) => {
  709 |     // Verify that WASM features are conditionally rendered based on flags
  710 | 
  711 |     await page.goto(`${BASE_URL}/datasets`);
  712 | 
  713 |     // Check for feature flag indicators in console or meta
  714 |     const hasFeatureFlags = await page.evaluate(() => {
  715 |       return typeof (window as any).__FEATURE_FLAGS__ !== 'undefined';
  716 |     });
  717 | 
  718 |     // Feature flags might not be exposed globally
  719 |     // The key is the page functions correctly
  720 |     await expect(page.locator('h1')).toBeVisible();
  721 |   });
  722 | 
  723 |   test('WASM-036: Progressive loading can be toggled', async ({ page }) => {
  724 |     await page.goto(`${BASE_URL}/datasets`);
  725 | 
  726 |     await page.waitForTimeout(3000);
  727 | 
  728 |     // Progressive loading is controlled by feature flag
  729 |     // We can't easily toggle it in E2E, but we can verify the page loads
  730 |     await expect(page.locator('h1')).toBeVisible();
  731 |   });
  732 | 
  733 |   test('WASM-037: Cross-filtering can be toggled', async ({ page }) => {
  734 |     await page.goto(`${BASE_URL}/dashboards`);
  735 | 
  736 |     await page.waitForTimeout(2000);
  737 | 
  738 |     // Cross-filtering is controlled by feature flag
  739 |     // Verify dashboard loads correctly
  740 |     await expect(page.locator('h1')).toBeVisible();
  741 |   });
  742 | 
  743 |   test('WASM-038: Offline mode can be toggled', async ({ page }) => {
  744 |     await page.goto(`${BASE_URL}/datasets`);
  745 | 
  746 |     await page.waitForTimeout(2000);
  747 | 
  748 |     // Offline mode is controlled by feature flag
  749 |     // Verify datasets page loads
  750 |     await expect(page.locator('h1')).toBeVisible();
  751 |   });
  752 | });
  753 | 
  754 | test.describe('WASM Features - Performance', () => {
  755 |   test.beforeEach(async ({ page }) => {
  756 |     await login(page);
  757 |   });
  758 | 
  759 |   test('WASM-039: Dataset page loads quickly', async ({ page }) => {
  760 |     const startTime = Date.now();
  761 | 
  762 |     await page.goto(`${BASE_URL}/datasets`);
  763 |     await page.waitForLoadState('domcontentloaded');
  764 | 
  765 |     const loadTime = Date.now() - startTime;
  766 | 
  767 |     // Should load within 5 seconds
  768 |     expect(loadTime).toBeLessThan(5000);
  769 |   });
  770 | 
  771 |   test('WASM-040: Query execution is responsive', async ({ page }) => {
  772 |     await page.goto(`${BASE_URL}/sql-editor`);
  773 | 
  774 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  775 | 
  776 |     const startTime = Date.now();
  777 | 
  778 |     // Execute a simple query
  779 |     await page.keyboard.type('SELECT 1');
  780 |     await page.click('button:has-text("Run"), button:has-text("Execute")');
  781 | 
  782 |     // Wait for results or error
  783 |     await page.waitForTimeout(3000);
  784 | 
  785 |     const executionTime = Date.now() - startTime;
  786 | 
  787 |     // Should complete within 5 seconds
  788 |     expect(executionTime).toBeLessThan(5000);
  789 |   });
  790 | 
```
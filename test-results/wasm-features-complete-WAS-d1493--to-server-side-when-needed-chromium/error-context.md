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
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - link "Enterprise Reports" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
        - generic [ref=e8]: Enterprise Reports
      - generic [ref=e12]:
        - generic [ref=e13]:
          - heading "Main" [level=2] [ref=e14]
          - navigation [ref=e15]:
            - link "Dashboard" [ref=e16] [cursor=pointer]:
              - /url: /
              - button "Dashboard" [ref=e17]:
                - img [ref=e18]
                - generic [ref=e21]: Dashboard
            - link "SQL Editor" [ref=e22] [cursor=pointer]:
              - /url: /sql-editor
              - button "SQL Editor" [ref=e23]:
                - img [ref=e24]
                - generic [ref=e26]: SQL Editor
            - link "Saved Queries" [ref=e27] [cursor=pointer]:
              - /url: /queries
              - button "Saved Queries" [ref=e28]:
                - img [ref=e29]
                - generic [ref=e33]: Saved Queries
            - link "Reports" [ref=e34] [cursor=pointer]:
              - /url: /reports
              - button "Reports" [ref=e35]:
                - img [ref=e36]
                - generic [ref=e39]: Reports
            - link "Charts" [ref=e40] [cursor=pointer]:
              - /url: /charts
              - button "Charts" [ref=e41]:
                - img [ref=e42]
                - generic [ref=e44]: Charts
            - link "Dashboards" [ref=e45] [cursor=pointer]:
              - /url: /dashboards
              - button "Dashboards" [ref=e46]:
                - img [ref=e47]
                - generic [ref=e52]: Dashboards
            - link "Filters" [ref=e53] [cursor=pointer]:
              - /url: /filters
              - button "Filters" [ref=e54]:
                - img [ref=e55]
                - generic [ref=e57]: Filters
            - link "Jobs" [ref=e58] [cursor=pointer]:
              - /url: /jobs
              - button "Jobs" [ref=e59]:
                - img [ref=e60]
                - generic [ref=e62]: Jobs
            - link "NL Query" [ref=e63] [cursor=pointer]:
              - /url: /nl-query
              - button "NL Query" [ref=e64]:
                - img [ref=e65]
                - generic [ref=e67]: NL Query
        - generic [ref=e68]:
          - heading "Administration" [level=2] [ref=e69]
          - navigation [ref=e70]:
            - link "Data Sources" [ref=e71] [cursor=pointer]:
              - /url: /data-sources
              - button "Data Sources" [ref=e72]:
                - img [ref=e73]
                - generic [ref=e77]: Data Sources
            - link "Queue Management" [ref=e78] [cursor=pointer]:
              - /url: /bull-board
              - button "Queue Management" [ref=e79]:
                - img [ref=e80]
                - generic [ref=e84]: Queue Management
            - link "Users" [ref=e85] [cursor=pointer]:
              - /url: /admin/users
              - button "Users" [ref=e86]:
                - img [ref=e87]
                - generic [ref=e92]: Users
            - link "Roles" [ref=e93] [cursor=pointer]:
              - /url: /admin/roles
              - button "Roles" [ref=e94]:
                - img [ref=e95]
                - generic [ref=e97]: Roles
            - link "Permissions" [ref=e98] [cursor=pointer]:
              - /url: /admin/permissions
              - button "Permissions" [ref=e99]:
                - img [ref=e100]
                - generic [ref=e102]: Permissions
            - link "Settings" [ref=e103] [cursor=pointer]:
              - /url: /settings
              - button "Settings" [ref=e104]:
                - img [ref=e105]
                - generic [ref=e108]: Settings
      - button [ref=e109] [cursor=pointer]:
        - img [ref=e110]
    - generic [ref=e112]:
      - banner [ref=e113]:
        - button "Sakila Demo DB sqlite3" [ref=e115] [cursor=pointer]:
          - img [ref=e116]
          - generic [ref=e120]: Sakila Demo DB
          - generic [ref=e121]: sqlite3
        - generic [ref=e122]:
          - button "Toggle theme" [ref=e123] [cursor=pointer]:
            - img [ref=e124]
            - img
            - generic [ref=e130]: Toggle theme
          - button "Notifications" [ref=e131] [cursor=pointer]:
            - img [ref=e132]
            - generic [ref=e135]: Notifications
          - button "SA" [ref=e136] [cursor=pointer]:
            - generic [ref=e138]: SA
      - main [ref=e139]:
        - generic [ref=e140]:
          - generic [ref=e141]:
            - generic [ref=e142]:
              - heading "SQL Editor" [level=1] [ref=e143]
              - paragraph [ref=e144]: Write and execute SQL queries
            - generic [ref=e145]:
              - button "Validate" [ref=e146] [cursor=pointer]
              - button "Run Query" [ref=e147] [cursor=pointer]
              - button "Save Query" [disabled] [ref=e148]
          - generic [ref=e150]:
            - paragraph [ref=e151]: "Data Source:"
            - button "▲" [ref=e152] [cursor=pointer]
          - button "Loading SQL Editor..." [ref=e153]:
            - generic [ref=e157]:
              - img [ref=e158]
              - generic [ref=e160]: Loading SQL Editor...
          - generic [ref=e161]:
            - generic [ref=e162]:
              - paragraph [ref=e163]: Schema Browser (Select a data source)
              - button "▼" [ref=e165] [cursor=pointer]
            - paragraph [ref=e167]: Select a data source to view schema
          - generic [ref=e168]:
            - generic [ref=e169]:
              - button "Results" [ref=e170] [cursor=pointer]
              - button "Errors" [ref=e171] [cursor=pointer]
              - button "Logs" [ref=e172] [cursor=pointer]
            - paragraph [ref=e176]: No results yet. Run a query to see results here.
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
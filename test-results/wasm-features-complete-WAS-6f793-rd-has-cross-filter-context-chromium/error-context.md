# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - Cross-Widget Filtering >> WASM-027: Dashboard has cross-filter context
- Location: e2e/wasm-features-complete.spec.ts:543:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.dashboard, h1, h2')
Expected: visible
Error: strict mode violation: locator('.dashboard, h1, h2') resolved to 3 elements:
    1) <h2 class="mb-2 px-2 text-xs font-medium text-muted-foreground">Main</h2> aka getByRole('heading', { name: 'Main' })
    2) <h2 class="mb-2 px-2 text-xs font-medium text-muted-foreground">Administration</h2> aka getByRole('heading', { name: 'Administration' })
    3) <h1 class="text-2xl font-bold">Dashboards</h1> aka getByRole('heading', { name: 'Dashboards', exact: true })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.dashboard, h1, h2')

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
              - heading "Dashboards" [level=1] [ref=e143]
              - paragraph [ref=e144]: Create and manage interactive dashboards
            - button "New Dashboard" [ref=e145] [cursor=pointer]:
              - img [ref=e146]
              - text: New Dashboard
          - generic [ref=e147]:
            - heading "All Dashboards" [level=3] [ref=e149]:
              - img [ref=e150]
              - text: All Dashboards
            - table [ref=e157]:
              - rowgroup [ref=e158]:
                - row "Name Description Visibility Created Modified Actions" [ref=e159]:
                  - columnheader "Name" [ref=e160]
                  - columnheader "Description" [ref=e161]
                  - columnheader "Visibility" [ref=e162]
                  - columnheader "Created" [ref=e163]
                  - columnheader "Modified" [ref=e164]
                  - columnheader "Actions" [ref=e165]
              - rowgroup [ref=e166]:
                - row "Executive Dashboard High-level business metrics Private May 13, 2026, 05:51 PM May 13, 2026, 05:51 PM" [ref=e167]:
                  - cell "Executive Dashboard" [ref=e168]
                  - cell "High-level business metrics" [ref=e169]
                  - cell "Private" [ref=e170]:
                    - generic [ref=e171]:
                      - img [ref=e172]
                      - text: Private
                  - cell "May 13, 2026, 05:51 PM" [ref=e175]
                  - cell "May 13, 2026, 05:51 PM" [ref=e176]
                  - cell [ref=e177]:
                    - button [ref=e178] [cursor=pointer]:
                      - img [ref=e179]
                - row "Sales Dashboard Sales metrics and KPIs Private May 13, 2026, 05:51 PM May 13, 2026, 05:51 PM" [ref=e183]:
                  - cell "Sales Dashboard" [ref=e184]
                  - cell "Sales metrics and KPIs" [ref=e185]
                  - cell "Private" [ref=e186]:
                    - generic [ref=e187]:
                      - img [ref=e188]
                      - text: Private
                  - cell "May 13, 2026, 05:51 PM" [ref=e191]
                  - cell "May 13, 2026, 05:51 PM" [ref=e192]
                  - cell [ref=e193]:
                    - button [ref=e194] [cursor=pointer]:
                      - img [ref=e195]
                - row "Product Performance Product-level analytics Private May 13, 2026, 05:51 PM May 13, 2026, 05:51 PM" [ref=e199]:
                  - cell "Product Performance" [ref=e200]
                  - cell "Product-level analytics" [ref=e201]
                  - cell "Private" [ref=e202]:
                    - generic [ref=e203]:
                      - img [ref=e204]
                      - text: Private
                  - cell "May 13, 2026, 05:51 PM" [ref=e207]
                  - cell "May 13, 2026, 05:51 PM" [ref=e208]
                  - cell [ref=e209]:
                    - button [ref=e210] [cursor=pointer]:
                      - img [ref=e211]
  - region "Notifications alt+T"
```

# Test source

```ts
  460 |       // The key is the canvas/container is visible
  461 |     }
  462 |   });
  463 | 
  464 |   test('WASM-024: Chart supports interactivity', async ({ page }) => {
  465 |     await page.goto(`${BASE_URL}/charts`);
  466 | 
  467 |     await page.waitForTimeout(2000);
  468 | 
  469 |     // Find a chart
  470 |     const chart = page.locator('canvas, .echarts').first();
  471 | 
  472 |     if (await chart.isVisible()) {
  473 |       // Try to interact with it
  474 |       await chart.click({ position: { x: 100, y: 100 } });
  475 |       await page.waitForTimeout(500);
  476 | 
  477 |       // Check if tooltip or highlight appeared
  478 |       const hasTooltip = await page.locator('.echarts-tooltip, .tooltip').count() > 0;
  479 | 
  480 |       // Tooltip might not show if clicked on empty space
  481 |       // The important thing is the chart is interactive
  482 |     }
  483 |   });
  484 | 
  485 |   test('WASM-025: Chart respects theme', async ({ page }) => {
  486 |     await page.goto(`${BASE_URL}/charts`);
  487 | 
  488 |     await page.waitForTimeout(2000);
  489 | 
  490 |     // Look for theme toggle
  491 |     const themeToggle = page.locator('button[aria-label*="theme"], button:has-text("Theme")').first();
  492 | 
  493 |     if (await themeToggle.isVisible()) {
  494 |       // Get initial chart state
  495 |       const chart = page.locator('canvas').first();
  496 | 
  497 |       // Toggle theme
  498 |       await themeToggle.click();
  499 |       await page.waitForTimeout(1000);
  500 | 
  501 |       // Chart should still be visible
  502 |       if (await chart.isVisible()) {
  503 |         await expect(chart).toBeVisible();
  504 |       }
  505 |     }
  506 |   });
  507 | 
  508 |   test('WASM-026: Multiple chart types render correctly', async ({ page }) => {
  509 |     const chartTypes = ['bar', 'line', 'pie', 'area'];
  510 | 
  511 |     for (const type of chartTypes) {
  512 |       await page.goto(`${BASE_URL}/charts/editor/new`);
  513 | 
  514 |       await page.waitForTimeout(2000);
  515 | 
  516 |       // Select chart type
  517 |       const typeSelect = page.locator('select[name="type"], [role="combobox"]').first();
  518 | 
  519 |       if (await typeSelect.isVisible()) {
  520 |         await typeSelect.click();
  521 |         await page.waitForTimeout(500);
  522 | 
  523 |         const typeOption = page.locator(`text=${type.charAt(0).toUpperCase() + type.slice(1)}`).first();
  524 | 
  525 |         if (await typeOption.isVisible()) {
  526 |           await typeOption.click();
  527 |           await page.waitForTimeout(1000);
  528 | 
  529 |           // Should show preview or render area
  530 |           const hasPreview = await page.locator('canvas, .preview, .chart-renderer').count() > 0;
  531 |           expect(hasPreview).toBeTruthy();
  532 |         }
  533 |       }
  534 |     }
  535 |   });
  536 | });
  537 | 
  538 | test.describe('WASM Features - Cross-Widget Filtering', () => {
  539 |   test.beforeEach(async ({ page }) => {
  540 |     await login(page);
  541 |   });
  542 | 
  543 |   test('WASM-027: Dashboard has cross-filter context', async ({ page }) => {
  544 |     await page.goto(`${BASE_URL}/dashboards`);
  545 | 
  546 |     await page.waitForTimeout(2000);
  547 | 
  548 |     // Navigate to first dashboard
  549 |     const firstDashboard = page.locator('.dashboard-card, table tbody tr').first();
  550 | 
  551 |     if (await firstDashboard.isVisible()) {
  552 |       await firstDashboard.click();
  553 |       await page.waitForTimeout(3000);
  554 | 
  555 |       // Look for cross-filter indicators
  556 |       const filterBar = page.locator('.active-filters, [data-testid="cross-filter"], .filter-bar').first();
  557 | 
  558 |       // Cross-filter might not be visible until a filter is applied
  559 |       // Check the page loads correctly
> 560 |       await expect(page.locator('.dashboard, h1, h2')).toBeVisible();
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  561 |     }
  562 |   });
  563 | 
  564 |   test('WASM-028: Chart click broadcasts filter', async ({ page }) => {
  565 |     await page.goto(`${BASE_URL}/dashboards`);
  566 | 
  567 |     const firstDashboard = page.locator('.dashboard-card').first();
  568 | 
  569 |     if (await firstDashboard.isVisible()) {
  570 |       await firstDashboard.click();
  571 |       await page.waitForTimeout(3000);
  572 | 
  573 |       // Find a chart
  574 |       const chart = page.locator('canvas, .echarts').first();
  575 | 
  576 |       if (await chart.isVisible()) {
  577 |         // Click on chart element
  578 |         await chart.click({ position: { x: 150, y: 150 } });
  579 |         await page.waitForTimeout(1000);
  580 | 
  581 |         // Look for filter application indicator
  582 |         const filterIndicator = page.locator('.filter-applied, .active-filter, toast');
  583 | 
  584 |         // Filter application is optional
  585 |         if (await filterIndicator.count() > 0) {
  586 |           await expect(filterIndicator.first()).toBeVisible();
  587 |         }
  588 |       }
  589 |     }
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
```
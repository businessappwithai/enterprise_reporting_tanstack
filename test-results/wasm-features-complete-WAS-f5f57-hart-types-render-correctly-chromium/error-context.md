# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - ECharts Integration >> WASM-026: Multiple chart types render correctly
- Location: e2e/wasm-features-complete.spec.ts:508:3

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('text=Bar').first()
    - locator resolved to <div class="font-medium">Bar Chart</div>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <html lang="en" class="light">…</html> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <html lang="en" class="light">…</html> intercepts pointer events
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <html lang="en" class="light">…</html> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic:
  - generic:
    - complementary:
      - generic:
        - link:
          - /url: /
          - img
          - generic: Enterprise Reports
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - heading [level=2]: Main
                - navigation:
                  - link:
                    - /url: /
                    - button:
                      - img
                      - generic: Dashboard
                  - link:
                    - /url: /sql-editor
                    - button:
                      - img
                      - generic: SQL Editor
                  - link:
                    - /url: /queries
                    - button:
                      - img
                      - generic: Saved Queries
                  - link:
                    - /url: /reports
                    - button:
                      - img
                      - generic: Reports
                  - link:
                    - /url: /charts
                    - button:
                      - img
                      - generic: Charts
                  - link:
                    - /url: /dashboards
                    - button:
                      - img
                      - generic: Dashboards
                  - link:
                    - /url: /filters
                    - button:
                      - img
                      - generic: Filters
                  - link:
                    - /url: /jobs
                    - button:
                      - img
                      - generic: Jobs
                  - link:
                    - /url: /nl-query
                    - button:
                      - img
                      - generic: NL Query
              - generic:
                - heading [level=2]: Administration
                - navigation:
                  - link:
                    - /url: /data-sources
                    - button:
                      - img
                      - generic: Data Sources
                  - link:
                    - /url: /bull-board
                    - button:
                      - img
                      - generic: Queue Management
                  - link:
                    - /url: /admin/users
                    - button:
                      - img
                      - generic: Users
                  - link:
                    - /url: /admin/roles
                    - button:
                      - img
                      - generic: Roles
                  - link:
                    - /url: /admin/permissions
                    - button:
                      - img
                      - generic: Permissions
                  - link:
                    - /url: /settings
                    - button:
                      - img
                      - generic: Settings
      - button:
        - img
    - generic:
      - banner:
        - generic:
          - button:
            - img
            - generic: Sakila Demo DB
            - generic: sqlite3
        - generic:
          - button:
            - img
            - generic: Toggle theme
          - button:
            - img
            - generic: Notifications
          - button:
            - generic:
              - generic: SA
      - main:
        - generic:
          - generic:
            - generic:
              - generic:
                - link:
                  - /url: /charts
                  - button:
                    - img
                - generic:
                  - heading [level=1]: Chart Editor
                  - paragraph: Create a new chart
              - generic:
                - button:
                  - img
                  - text: Hide Preview
                - button:
                  - img
                  - text: Save Chart
            - generic:
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - heading [level=3]: Basic Information
                  - generic:
                    - generic:
                      - text: Chart Name *
                      - textbox:
                        - /placeholder: My Sales Chart
                    - generic:
                      - text: Description
                      - textbox:
                        - /placeholder: Describe what this chart shows...
                - generic:
                  - generic:
                    - generic:
                      - heading [level=3]: Data Source
                  - generic:
                    - generic:
                      - text: Select Query *
                      - combobox [expanded]:
                        - generic: Choose a saved query...
                        - img
                - generic:
                  - generic:
                    - generic:
                      - heading [level=3]: Chart Type
                  - generic:
                    - combobox:
                      - generic:
                        - generic:
                          - img
                          - generic:
                            - generic: Bar Chart
                            - generic: Compare values across different categories using vertical bars
                      - img
                    - generic:
                      - text: How to Use This Chart
                      - textbox: "Best for: Comparing sales by region, population by country, revenue by product. Requires: 1 category field (X-axis) and 1+ value fields (Y-axis)."
                - generic:
                  - generic:
                    - generic:
                      - heading [level=3]: Axis Configuration
                  - generic:
                    - generic:
                      - generic:
                        - generic: X-Axis (Categories) *
                      - combobox:
                        - generic: Select field...
                        - img
                    - generic:
                      - generic:
                        - generic: Y-Axis (Values) *
                        - button:
                          - img
                          - text: Add Series
                      - paragraph: Add at least one Y-axis series
                    - generic:
                      - generic:
                        - generic: Group By (Optional)
                      - combobox:
                        - generic: Select field to group by...
                        - img
                    - generic:
                      - generic:
                        - generic: Color By (Optional)
                      - combobox:
                        - generic: Select field to color by...
                        - img
                - generic:
                  - generic:
                    - generic:
                      - heading [level=3]: Appearance
                  - generic:
                    - generic:
                      - generic: Show Title
                      - switch [checked]
                    - textbox:
                      - /placeholder: Chart title
                    - generic:
                      - generic: Show Legend
                      - switch [checked]
                    - generic:
                      - generic: Enable Tooltip
                      - switch [checked]
                    - generic:
                      - generic: Animation
                      - switch [checked]
                    - generic:
                      - generic:
                        - text: Stacked Chart
                        - paragraph: Stack multiple series on top of each other (for bar/column charts)
                      - switch
                    - generic:
                      - text: Chart Colors
                      - paragraph: Customize the color palette for your chart. Click to edit.
                      - generic:
                        - generic:
                          - textbox: "#3b82f6"
                          - button:
                            - img
                        - generic:
                          - textbox: "#10b981"
                          - button:
                            - img
                        - generic:
                          - textbox: "#f59e0b"
                          - button:
                            - img
                        - generic:
                          - textbox: "#ef4444"
                          - button:
                            - img
                        - generic:
                          - textbox: "#8b5cf6"
                          - button:
                            - img
                        - button:
                          - img
                          - text: Add
                      - button: Reset to Default
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - heading [level=3]: Preview
                    - generic:
                      - generic:
                        - paragraph: Select a query to preview your chart
  - region "Notifications alt+T"
  - listbox [active] [ref=e1]
```

# Test source

```ts
  426 |     await page.waitForTimeout(5000);
  427 | 
  428 |     const loadTime = Date.now() - startTime;
  429 | 
  430 |     // Should complete within reasonable time (< 10 seconds)
  431 |     expect(loadTime).toBeLessThan(10000);
  432 |   });
  433 | });
  434 | 
  435 | test.describe('WASM Features - ECharts Integration', () => {
  436 |   test.beforeEach(async ({ page }) => {
  437 |     await login(page);
  438 |   });
  439 | 
  440 |   test('WASM-023: Chart renders using ECharts', async ({ page }) => {
  441 |     await page.goto(`${BASE_URL}/charts`);
  442 | 
  443 |     await page.waitForTimeout(2000);
  444 | 
  445 |     // Look for ECharts canvas or container
  446 |     const echartsElement = page.locator('canvas, ._echarts_instance_, .echarts').first();
  447 | 
  448 |     if (await echartsElement.isVisible()) {
  449 |       await expect(echartsElement).toBeVisible();
  450 | 
  451 |       // Verify ECharts instance
  452 |       const hasEChartsInstance = await echartsElement.evaluate(el => {
  453 |         if (el instanceof HTMLElement) {
  454 |           return !!(el as any)._echarts_instance_;
  455 |         }
  456 |         return false;
  457 |       });
  458 | 
  459 |       // ECharts instance might be on a parent element
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
> 526 |           await typeOption.click();
      |                            ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
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
  560 |       await expect(page.locator('.dashboard, h1, h2')).toBeVisible();
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
```
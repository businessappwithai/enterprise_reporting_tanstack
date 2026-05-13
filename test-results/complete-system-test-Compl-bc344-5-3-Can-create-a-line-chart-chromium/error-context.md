# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Charts >> 5.3 Can create a line chart
- Location: e2e/complete-system-test.spec.ts:367:5

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('text=Line')

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
  276 |         await dataSourceSelect.click();
  277 |         await page.keyboard.press('ArrowDown');
  278 |         await page.keyboard.press('Enter');
  279 |       }
  280 | 
  281 |       // Save
  282 |       const saveButton = page.locator('button:has-text("Save"), button:has-text("Create")').first();
  283 |       if (await saveButton.isVisible()) {
  284 |         await saveButton.click();
  285 |         await page.waitForTimeout(2000);
  286 |       }
  287 |     });
  288 | 
  289 |     test('4.3 Can view report details', async ({ page }) => {
  290 |       await page.goto(`${BASE_URL}/reports`);
  291 | 
  292 |       // Click on first report
  293 |       const firstReport = page.locator('table tbody tr, [role="row"], .card').first();
  294 |       const count = await firstReport.count();
  295 | 
  296 |       if (count > 0) {
  297 |         await firstReport.first().click();
  298 |         await page.waitForTimeout(2000);
  299 | 
  300 |         // Should show report details or data
  301 |         const hasContent = await page.locator('table, .report-data, .chart').count() > 0;
  302 |         expect(hasContent).toBeTruthy();
  303 |       }
  304 |     });
  305 | 
  306 |     test('4.4 Can export report data', async ({ page }) => {
  307 |       await page.goto(`${BASE_URL}/reports`);
  308 | 
  309 |       // Look for export buttons
  310 |       const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")').first();
  311 | 
  312 |       if (await exportButton.isVisible()) {
  313 |         await exportButton.click();
  314 | 
  315 |         // Should show export options
  316 |         await expect(page.locator('text=CSV, text=PDF, text=Excel')).isVisible({ timeout: 3000 });
  317 |       }
  318 |     });
  319 |   });
  320 | 
  321 |   // ========================================================================
  322 |   // PART 5: CHARTS
  323 |   // ========================================================================
  324 | 
  325 |   test.describe('Charts', () => {
  326 |     test.beforeEach(async ({ page }) => {
  327 |       await login(page);
  328 |     });
  329 | 
  330 |     test('5.1 Can view charts list', async ({ page }) => {
  331 |       await page.goto(`${BASE_URL}/charts`);
  332 | 
  333 |       await expect(page.locator('h1').filter({ hasText: /charts/i })).toBeVisible();
  334 |     });
  335 | 
  336 |     test('5.2 Can create a bar chart', async ({ page }) => {
  337 |       await page.goto(`${BASE_URL}/charts`);
  338 | 
  339 |       // Click new chart
  340 |       await page.click('button:has-text("New Chart"), button:has-text("Create Chart")');
  341 | 
  342 |       // Wait for editor
  343 |       await page.waitForTimeout(2000);
  344 | 
  345 |       // Select chart type
  346 |       const chartTypeSelect = page.locator('select[name="type"], [role="combobox"]').first();
  347 |       if (await chartTypeSelect.isVisible()) {
  348 |         await chartTypeSelect.click();
  349 |         await page.click('text=Bar');
  350 |       }
  351 | 
  352 |       // Fill name
  353 |       const chartName = `E2E Bar Chart ${Date.now()}`;
  354 |       const nameInput = page.locator('input[name="name"]');
  355 |       if (await nameInput.isVisible()) {
  356 |         await nameInput.fill(chartName);
  357 |       }
  358 | 
  359 |       // Save
  360 |       const saveButton = page.locator('button:has-text("Save")').first();
  361 |       if (await saveButton.isVisible()) {
  362 |         await saveButton.click();
  363 |         await page.waitForTimeout(2000);
  364 |       }
  365 |     });
  366 | 
  367 |     test('5.3 Can create a line chart', async ({ page }) => {
  368 |       await page.goto(`${BASE_URL}/charts/editor/new`);
  369 | 
  370 |       await page.waitForTimeout(2000);
  371 | 
  372 |       // Select line chart type
  373 |       const chartTypeSelect = page.locator('select[name="type"], [role="combobox"]').first();
  374 |       if (await chartTypeSelect.isVisible()) {
  375 |         await chartTypeSelect.click();
> 376 |         await page.click('text=Line');
      |                    ^ TimeoutError: page.click: Timeout 15000ms exceeded.
  377 |       }
  378 |     });
  379 | 
  380 |     test('5.4 Can create a pie chart', async ({ page }) => {
  381 |       await page.goto(`${BASE_URL}/charts/editor/new`);
  382 | 
  383 |       await page.waitForTimeout(2000);
  384 | 
  385 |       // Select pie chart type
  386 |       const chartTypeSelect = page.locator('select[name="type"], [role="combobox"]').first();
  387 |       if (await chartTypeSelect.isVisible()) {
  388 |         await chartTypeSelect.click();
  389 |         await page.click('text=Pie');
  390 |       }
  391 |     });
  392 | 
  393 |     test('5.5 Chart renders correctly', async ({ page }) => {
  394 |       await page.goto(`${BASE_URL}/charts`);
  395 | 
  396 |       // Click on existing chart if any
  397 |       const firstChart = page.locator('.chart-card, [data-testid="chart"], canvas').first();
  398 | 
  399 |       if (await firstChart.isVisible()) {
  400 |         await page.waitForTimeout(2000);
  401 | 
  402 |         // Check for chart rendering (canvas or svg)
  403 |         const hasChart = await page.locator('canvas, svg, .echarts, .recharts').count() > 0;
  404 |         expect(hasChart).toBeTruthy();
  405 |       }
  406 |     });
  407 |   });
  408 | 
  409 |   // ========================================================================
  410 |   // PART 6: DASHBOARDS
  411 |   // ========================================================================
  412 | 
  413 |   test.describe('Dashboards', () => {
  414 |     test.beforeEach(async ({ page }) => {
  415 |       await login(page);
  416 |     });
  417 | 
  418 |     test('6.1 Can view dashboards list', async ({ page }) => {
  419 |       await page.goto(`${BASE_URL}/dashboards`);
  420 | 
  421 |       await expect(page.locator('h1').filter({ hasText: /dashboards/i })).toBeVisible();
  422 |     });
  423 | 
  424 |     test('6.2 Can create a new dashboard', async ({ page }) => {
  425 |       await page.goto(`${BASE_URL}/dashboards`);
  426 | 
  427 |       // Click new dashboard
  428 |       await page.click('button:has-text("New Dashboard"), button:has-text("Create Dashboard")');
  429 | 
  430 |       // Fill name
  431 |       const dashboardName = `E2E Dashboard ${Date.now()}`;
  432 |       await page.fill('input[name="name"]', dashboardName);
  433 | 
  434 |       // Save
  435 |       await page.click('button:has-text("Save"), button:has-text("Create")');
  436 | 
  437 |       await page.waitForTimeout(2000);
  438 |     });
  439 | 
  440 |     test('6.3 Can add widgets to dashboard', async ({ page }) => {
  441 |       await page.goto(`${BASE_URL}/dashboards`);
  442 | 
  443 |       // Navigate to first dashboard
  444 |       const firstDashboard = page.locator('table tbody tr, [role="row"], .card').first();
  445 |       const count = await firstDashboard.count();
  446 | 
  447 |       if (count > 0) {
  448 |         await firstDashboard.first().click();
  449 |         await page.waitForTimeout(2000);
  450 | 
  451 |         // Look for add widget button
  452 |         const addButton = page.locator('button:has-text("Add Widget"), button:has-text("Add")').first();
  453 | 
  454 |         if (await addButton.isVisible()) {
  455 |           await addButton.click();
  456 | 
  457 |           // Should show widget options
  458 |           await expect(page.locator('text=Chart, text=Metric, text=Table')).isVisible({ timeout: 3000 });
  459 |         }
  460 |       }
  461 |     });
  462 | 
  463 |     test('6.4 Can rearrange dashboard widgets', async ({ page }) => {
  464 |       await page.goto(`${BASE_URL}/dashboards`);
  465 | 
  466 |       const firstDashboard = page.locator('.dashboard-card, [data-testid="dashboard"]').first();
  467 | 
  468 |       if (await firstDashboard.isVisible()) {
  469 |         await firstDashboard.click();
  470 |         await page.waitForTimeout(2000);
  471 | 
  472 |         // Look for draggable widgets
  473 |         const widgets = page.locator('.widget, [draggable="true"]');
  474 |         const widgetCount = await widgets.count();
  475 | 
  476 |         if (widgetCount > 1) {
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Dashboards >> 6.2 Can create a new dashboard
- Location: e2e/complete-system-test.spec.ts:424:5

# Error details

```
TimeoutError: page.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('input[name="name"]')

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
              - heading [level=1]: Dashboards
              - paragraph: Create and manage interactive dashboards
            - button [expanded]:
              - img
              - text: New Dashboard
          - generic:
            - generic:
              - heading [level=3]:
                - img
                - text: All Dashboards
            - generic:
              - generic:
                - table:
                  - rowgroup:
                    - row:
                      - columnheader: Name
                      - columnheader: Description
                      - columnheader: Visibility
                      - columnheader: Created
                      - columnheader: Modified
                      - columnheader: Actions
                  - rowgroup:
                    - row:
                      - cell: Executive Dashboard
                      - cell: High-level business metrics
                      - cell:
                        - generic:
                          - img
                          - text: Private
                      - cell: May 13, 2026, 05:51 PM
                      - cell: May 13, 2026, 05:51 PM
                      - cell:
                        - button:
                          - img
                    - row:
                      - cell: Sales Dashboard
                      - cell: Sales metrics and KPIs
                      - cell:
                        - generic:
                          - img
                          - text: Private
                      - cell: May 13, 2026, 05:51 PM
                      - cell: May 13, 2026, 05:51 PM
                      - cell:
                        - button:
                          - img
                    - row:
                      - cell: Product Performance
                      - cell: Product-level analytics
                      - cell:
                        - generic:
                          - img
                          - text: Private
                      - cell: May 13, 2026, 05:51 PM
                      - cell: May 13, 2026, 05:51 PM
                      - cell:
                        - button:
                          - img
  - region "Notifications alt+T"
  - dialog "Create Dashboard" [ref=e2]:
    - generic [ref=e3]:
      - heading "Create Dashboard" [level=2] [ref=e4]
      - paragraph [ref=e5]: Create a new dashboard to organize your reports and charts.
    - generic [ref=e6]:
      - generic [ref=e7]:
        - text: Name
        - textbox "Name" [active] [ref=e8]:
          - /placeholder: My Dashboard
      - generic [ref=e9]:
        - text: Description
        - textbox "Description" [ref=e10]:
          - /placeholder: Optional description
      - generic [ref=e11]:
        - switch "Make dashboard public" [ref=e12] [cursor=pointer]
        - generic [ref=e13]: Make dashboard public
    - generic [ref=e14]:
      - button "Cancel" [ref=e15] [cursor=pointer]
      - button "Create Dashboard" [disabled]
    - button "Close" [ref=e16] [cursor=pointer]:
      - img [ref=e17]
      - generic [ref=e20]: Close
```

# Test source

```ts
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
  376 |         await page.click('text=Line');
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
> 432 |       await page.fill('input[name="name"]', dashboardName);
      |                  ^ TimeoutError: page.fill: Timeout 15000ms exceeded.
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
  477 |           // Widgets should be present and potentially draggable
  478 |           expect(widgetCount).toBeGreaterThan(0);
  479 |         }
  480 |       }
  481 |     });
  482 |   });
  483 | 
  484 |   // ========================================================================
  485 |   // PART 7: FILTERS
  486 |   // ========================================================================
  487 | 
  488 |   test.describe('Filters', () => {
  489 |     test.beforeEach(async ({ page }) => {
  490 |       await login(page);
  491 |     });
  492 | 
  493 |     test('7.1 Can view saved filters', async ({ page }) => {
  494 |       await page.goto(`${BASE_URL}/filters`);
  495 | 
  496 |       await expect(page.locator('h1').filter({ hasText: /filters/i })).toBeVisible();
  497 |     });
  498 | 
  499 |     test('7.2 Can create a new filter', async ({ page }) => {
  500 |       await page.goto(`${BASE_URL}/filters`);
  501 | 
  502 |       // Click new filter button
  503 |       await page.click('button:has-text("New Filter"), button:has-text("Create Filter")');
  504 | 
  505 |       // Fill filter details
  506 |       const filterName = `E2E Filter ${Date.now()}`;
  507 |       await page.fill('input[name="name"]', filterName);
  508 | 
  509 |       // Select field
  510 |       const fieldSelect = page.locator('select[name="field"], [role="combobox"]').first();
  511 |       if (await fieldSelect.isVisible()) {
  512 |         await fieldSelect.click();
  513 |         await page.keyboard.press('ArrowDown');
  514 |         await page.keyboard.press('Enter');
  515 |       }
  516 | 
  517 |       // Select operator
  518 |       const operatorSelect = page.locator('select[name="operator"]').first();
  519 |       if (await operatorSelect.isVisible()) {
  520 |         await operatorSelect.selectOption('equals');
  521 |       }
  522 | 
  523 |       // Enter value
  524 |       await page.fill('input[name="value"]', 'test_value');
  525 | 
  526 |       // Save
  527 |       await page.click('button:has-text("Save")');
  528 |       await page.waitForTimeout(2000);
  529 |     });
  530 | 
  531 |     test('7.3 Can apply filter to report', async ({ page }) => {
  532 |       await page.goto(`${BASE_URL}/reports`);
```
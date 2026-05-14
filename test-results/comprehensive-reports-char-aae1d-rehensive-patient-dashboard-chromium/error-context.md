# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-reports-charts-dashboard.spec.ts >> Comprehensive HMS Reports, Charts & Dashboard >> Test 3: Create comprehensive patient dashboard
- Location: e2e/comprehensive-reports-charts-dashboard.spec.ts:378:3

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('table tbody tr').first().locator('button').or(locator('[data-testid="more"]')).first()
    - locator resolved to <button type="button" id="radix-_r_3_" data-state="closed" aria-haspopup="menu" aria-expanded="false" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div data-state="open" aria-hidden="true" data-aria-hidden="true" class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"></div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div data-state="open" aria-hidden="true" data-aria-hidden="true" class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"></div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div data-state="open" aria-hidden="true" data-aria-hidden="true" class="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"></div> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active]:
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
        - textbox "Name" [ref=e8]:
          - /placeholder: My Dashboard
          - text: Hospital Executive Dashboard
      - generic [ref=e9]:
        - text: Description
        - textbox "Description" [ref=e10]:
          - /placeholder: Optional description
          - text: Comprehensive hospital patient analytics dashboard
      - generic [ref=e11]:
        - switch "Make dashboard public" [ref=e12] [cursor=pointer]
        - generic [ref=e13]: Make dashboard public
    - generic [ref=e14]:
      - button "Cancel" [ref=e15] [cursor=pointer]
      - button "Create Dashboard" [ref=e16] [cursor=pointer]
    - button "Close" [ref=e17] [cursor=pointer]:
      - img [ref=e18]
      - generic [ref=e21]: Close
```

# Test source

```ts
  318 |           await typeOption.first().click();
  319 |         }
  320 |       }
  321 | 
  322 |       // Select data source (query)
  323 |       const querySelect = page.locator('[role="combobox"]').or(page.locator('select')).nth(1);
  324 |       if (await querySelect.isVisible().catch(() => false)) {
  325 |         await querySelect.click();
  326 |         await page.waitForTimeout(500);
  327 | 
  328 |         const queryOption = page.getByText(/Demographics|Gender/i);
  329 |         if (await queryOption.isVisible().catch(() => false)) {
  330 |           await queryOption.first().click();
  331 |         }
  332 |       }
  333 | 
  334 |       // Save chart
  335 |       const saveBtn = page.getByRole('button', { name: /create.*chart|save/i });
  336 |       if (await saveBtn.isVisible().catch(() => false)) {
  337 |         await saveBtn.click();
  338 |         await page.waitForTimeout(2000);
  339 |         console.log(`✓ ${chartInfo.type} chart created`);
  340 |       } else {
  341 |         console.log(`⚠️  ${chartInfo.type} chart - save button not found`);
  342 |       }
  343 |     }
  344 | 
  345 |     // Step 3: Test chart viewer performance
  346 |     console.log('\nStep 3: Testing chart viewer performance...');
  347 |     await page.goto(`${BASE_URL}/charts`);
  348 |     await page.waitForTimeout(1000);
  349 | 
  350 |     const viewLinks = page.getByRole('link', { name: /view/i });
  351 |     const count = await viewLinks.count();
  352 | 
  353 |     if (count > 0) {
  354 |       for (let i = 0; i < Math.min(count, 3); i++) {
  355 |         const { duration: chartLoadDuration } = await measurePerformance(`Chart ${i + 1} render`, async () => {
  356 |           const links = page.getByRole('link', { name: /view/i });
  357 |           await links.nth(i).click();
  358 |           await page.waitForLoadState('networkidle');
  359 |           await expect(page.locator('svg, canvas, [class*="chart"]')).toBeVisible({ timeout: 10000 });
  360 |         });
  361 | 
  362 |         expect(chartLoadDuration).toBeLessThan(5000);
  363 |         console.log(`✓ Chart ${i + 1} rendered in ${chartLoadDuration}ms (target: <5000ms)`);
  364 | 
  365 |         // Take screenshot of each chart
  366 |         await page.screenshot({ path: `screenshots/hms-chart-${i + 1}.png` });
  367 | 
  368 |         // Go back
  369 |         await page.goBack();
  370 |         await page.waitForTimeout(1000);
  371 |       }
  372 |     }
  373 | 
  374 |     await page.screenshot({ path: 'screenshots/hms-charts-list.png', fullPage: true });
  375 |     console.log('✓ Chart performance test completed\n');
  376 |   });
  377 | 
  378 |   test('Test 3: Create comprehensive patient dashboard', async ({ page }) => {
  379 |     console.log('\n=== Test 3: Comprehensive Patient Dashboard ===\n');
  380 | 
  381 |     // Step 1: Create a new dashboard
  382 |     console.log('Step 1: Creating dashboard...');
  383 |     await page.goto(`${BASE_URL}/dashboards`);
  384 |     await page.waitForTimeout(1000);
  385 | 
  386 |     const newDashboardBtn = page.getByRole('button', { name: /new.*dashboard/i });
  387 |     await newDashboardBtn.click();
  388 |     await page.waitForTimeout(1000);
  389 | 
  390 |     const dashboardNameInput = page.locator('input[id="name"]');
  391 |     await dashboardNameInput.fill('Hospital Executive Dashboard');
  392 | 
  393 |     const descInput = page.locator('input[id="description"]');
  394 |     if (await descInput.isVisible().catch(() => false)) {
  395 |       await descInput.fill('Comprehensive hospital patient analytics dashboard');
  396 |     }
  397 | 
  398 |     // Make it public or keep private - just leave as default
  399 |     const createDashboardBtn = page.getByRole('button', { name: /create.*dashboard/i });
  400 |     await createDashboardBtn.click();
  401 |     await page.waitForTimeout(2000);
  402 | 
  403 |     console.log('✓ Dashboard created');
  404 | 
  405 |     // Step 2: Navigate to the dashboard to add widgets
  406 |     console.log('Step 2: Navigating to dashboard...');
  407 | 
  408 |     // Wait for dashboard table to refresh
  409 |     await page.waitForTimeout(2000);
  410 | 
  411 |     // Find the created dashboard and click view
  412 |     // Similar to reports, the view is in a dropdown
  413 |     const dashboardRows = page.locator('table tbody tr');
  414 |     if (await dashboardRows.count() > 0) {
  415 |       // Click the more button in the first row
  416 |       const moreBtn = dashboardRows.first().locator('button').or(page.locator('[data-testid="more"]'));
  417 |       if (await moreBtn.isVisible().catch(() => false)) {
> 418 |         await moreBtn.first().click();
      |                               ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  419 |         await page.waitForTimeout(500);
  420 |       }
  421 | 
  422 |       // Click View option
  423 |       const viewOption = page.getByRole('menuitem', { name: /view/i }).or(page.getByText(/view/i));
  424 |       if (await viewOption.isVisible().catch(() => false)) {
  425 |         await viewOption.first().click();
  426 |       } else {
  427 |         // Take screenshot and continue
  428 |         await page.screenshot({ path: 'screenshots/hms-dashboards-list.png' });
  429 |         console.log('⚠️  View option not found, taking screenshot');
  430 |       }
  431 |     }
  432 |     await page.waitForTimeout(2000);
  433 | 
  434 |     // Measure dashboard load time
  435 |     const { duration: dashboardLoadDuration } = await measurePerformance('Dashboard initial render', async () => {
  436 |       await page.waitForLoadState('networkidle');
  437 |     });
  438 | 
  439 |     expect(dashboardLoadDuration).toBeLessThan(5000);
  440 |     console.log(`✓ Dashboard loaded in ${dashboardLoadDuration}ms (target: <5000ms)`);
  441 | 
  442 |     // Step 3: Look for edit/add widget options
  443 |     console.log('Step 3: Adding widgets to dashboard...');
  444 | 
  445 |     const editBtn = page.getByRole('button', { name: /edit|configure|add.*widget/i }).or(page.locator('button:has-text("+")'));
  446 |     if (await editBtn.isVisible().catch(() => false)) {
  447 |       await editBtn.first().click();
  448 |       await page.waitForTimeout(1000);
  449 |       console.log('✓ Edit mode activated');
  450 |     }
  451 | 
  452 |     // Try to add widgets (if the functionality exists)
  453 |     const addWidgetBtn = page.getByRole('button', { name: /add.*widget|widget/i }).or(page.locator('button:has-text("Add")'));
  454 |     let widgetsAdded = 0;
  455 | 
  456 |     for (let i = 1; i <= 4; i++) {
  457 |       if (await addWidgetBtn.isVisible().catch(() => false)) {
  458 |         await addWidgetBtn.first().click();
  459 |         await page.waitForTimeout(1000);
  460 | 
  461 |         // Try to select a widget type
  462 |         const widgetOption = page.locator('[role="option"], [data-value]').or(page.getByText(/chart|report|metric/i));
  463 |         if (await widgetOption.first().isVisible().catch(() => false)) {
  464 |           await widgetOption.first().click();
  465 |           await page.waitForTimeout(500);
  466 | 
  467 |           // Confirm
  468 |           const confirmBtn = page.getByRole('button', { name: /add|confirm|save/i });
  469 |           if (await confirmBtn.isVisible().catch(() => false)) {
  470 |             await confirmBtn.first().click();
  471 |             await page.waitForTimeout(1000);
  472 |             widgetsAdded++;
  473 |           }
  474 |         }
  475 |       } else {
  476 |         break;
  477 |       }
  478 |     }
  479 | 
  480 |     console.log(`✓ Added ${widgetsAdded} widgets to dashboard`);
  481 | 
  482 |     await page.screenshot({ path: 'screenshots/hms-comprehensive-dashboard.png', fullPage: true });
  483 |     console.log('✓ Dashboard test completed\n');
  484 |   });
  485 | 
  486 |   test('Test 4: High-volume query performance test', async ({ page }) => {
  487 |     console.log('\n=== Test 4: High-Volume Query Performance ===\n');
  488 | 
  489 |     await page.goto(`${BASE_URL}/sql-editor`);
  490 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  491 | 
  492 |     // Test various query complexities
  493 |     const queries = [
  494 |       {
  495 |         name: 'Simple COUNT',
  496 |         sql: 'SELECT COUNT(*) as total_patients FROM bus_patient',
  497 |       },
  498 |       {
  499 |         name: 'Aggregation with GROUP BY',
  500 |         sql: `SELECT gender, COUNT(*) as count FROM bus_patient GROUP BY gender`,
  501 |       },
  502 |       {
  503 |         name: 'Complex JOIN query',
  504 |         sql: `SELECT p.gender, p.blood_group, COUNT(*) as count
  505 |              FROM bus_patient p
  506 |              LEFT JOIN bus_appointment a ON p.id = a.patient_id
  507 |              GROUP BY p.gender, p.blood_group`,
  508 |       },
  509 |       {
  510 |         name: 'Large result set (1000 rows)',
  511 |         sql: `SELECT * FROM bus_patient ORDER BY id LIMIT 1000`,
  512 |       },
  513 |     ];
  514 | 
  515 |     for (const query of queries) {
  516 |       console.log(`\nTesting: ${query.name}`);
  517 |       await page.locator('.monaco-editor').click();
  518 |       await page.keyboard.press('Control+A');
```
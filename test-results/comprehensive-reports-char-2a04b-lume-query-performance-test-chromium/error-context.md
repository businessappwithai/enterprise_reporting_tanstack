# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-reports-charts-dashboard.spec.ts >> Comprehensive HMS Reports, Charts & Dashboard >> Test 4: High-volume query performance test
- Location: e2e/comprehensive-reports-charts-dashboard.spec.ts:486:3

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
  418 |         await moreBtn.first().click();
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
> 490 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
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
  519 |       await page.keyboard.type(query.sql);
  520 | 
  521 |       const { duration } = await measurePerformance(query.name, async () => {
  522 |         const executeBtn = page.getByRole('button', { name: /execute|run/i });
  523 |         await executeBtn.first().click();
  524 |         await page.waitForTimeout(2000);
  525 |       });
  526 | 
  527 |       console.log(`✓ ${query.name}: ${duration}ms`);
  528 | 
  529 |       // Verify results are shown
  530 |       const results = page.locator('.results, table, [data-testid="results"]');
  531 |       if (await results.isVisible().catch(() => false)) {
  532 |         console.log('  Results displayed correctly');
  533 |       }
  534 | 
  535 |       await page.waitForTimeout(500);
  536 |     }
  537 | 
  538 |     await page.screenshot({ path: 'screenshots/hms-query-performance.png' });
  539 |     console.log('\n✓ Query performance test completed\n');
  540 |   });
  541 | 
  542 |   test('Test 5: End-to-end feature verification', async ({ page }) => {
  543 |     console.log('\n=== Test 5: End-to-End Feature Verification ===\n');
  544 | 
  545 |     const features = [
  546 |       { path: '/sql-editor', name: 'SQL Editor', selector: '.monaco-editor' },
  547 |       { path: '/reports', name: 'Reports Page', selector: 'table, [role="table"]' },
  548 |       { path: '/charts', name: 'Charts Page', selector: 'table, [role="table"]' },
  549 |       { path: '/dashboards', name: 'Dashboards Page', selector: 'table, [role="table"]' },
  550 |       { path: '/saved-queries', name: 'Saved Queries', selector: 'table, [role="table"]' },
  551 |     ];
  552 | 
  553 |     const results: { name: string; accessible: boolean; loadTime: number }[] = [];
  554 | 
  555 |     for (const feature of features) {
  556 |       const { result: accessible, duration } = await measurePerformance(`${feature.name} accessibility`, async () => {
  557 |         await page.goto(`${BASE_URL}${feature.path}`);
  558 |         await page.waitForTimeout(500);
  559 | 
  560 |         const expected = page.locator(feature.selector);
  561 |         return await expected.isVisible().catch(() => false);
  562 |       });
  563 | 
  564 |       results.push({ name: feature.name, accessible: accessible as boolean, loadTime: duration });
  565 | 
  566 |       const status = (accessible as boolean) ? '✓' : '✗';
  567 |       console.log(`${status} ${feature.name}: ${duration}ms`);
  568 |     }
  569 | 
  570 |     // Check average load time
  571 |     const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;
  572 |     console.log(`\n📊 Average page load time: ${avgLoadTime.toFixed(0)}ms`);
  573 |     expect(avgLoadTime).toBeLessThan(3000);
  574 | 
  575 |     const failed = results.filter(r => !r.accessible);
  576 |     if (failed.length > 0) {
  577 |       console.log('\n❌ Failed features:', failed.map(f => f.name));
  578 |     } else {
  579 |       console.log('\n✅ All reporting features are accessible and functional');
  580 |     }
  581 | 
  582 |     await page.screenshot({ path: 'screenshots/hms-all-features.png', fullPage: true });
  583 |     console.log('\n✓ Feature verification test completed\n');
  584 |   });
  585 | 
  586 |   test('Test 6: Export functionality test', async ({ page }) => {
  587 |     console.log('\n=== Test 6: Export Functionality ===\n');
  588 | 
  589 |     // Navigate to reports and select a report
  590 |     await page.goto(`${BASE_URL}/reports`);
```
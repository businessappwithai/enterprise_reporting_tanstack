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
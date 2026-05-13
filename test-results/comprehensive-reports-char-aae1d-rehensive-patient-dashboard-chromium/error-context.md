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
  - waiting for getByRole('button', { name: /new.*dashboard/i })

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
  287 |     for (const chartInfo of chartTypes) {
  288 |       console.log(`Creating ${chartInfo.type} chart: ${chartInfo.name}...`);
  289 | 
  290 |       await page.goto(`${BASE_URL}/charts`);
  291 |       await page.waitForTimeout(1000);
  292 | 
  293 |       // Try "Quick Create" button first
  294 |       const quickCreateBtn = page.getByRole('button', { name: /quick.*create/i });
  295 |       if (await quickCreateBtn.isVisible().catch(() => false)) {
  296 |         await quickCreateBtn.click();
  297 |         await page.waitForTimeout(1000);
  298 |       } else {
  299 |         // Try regular dialog trigger
  300 |         const dialogTrigger = page.locator('button').filter({ hasText: /create|add/i }).first();
  301 |         await dialogTrigger.click();
  302 |         await page.waitForTimeout(1000);
  303 |       }
  304 | 
  305 |       // Fill in chart name
  306 |       const chartNameInput = page.locator('input[id="name"], input[name="name"], input[placeholder*="chart"]').first();
  307 |       await chartNameInput.fill(chartInfo.name);
  308 | 
  309 |       // Select chart type
  310 |       const typeSelector = page.locator('[role="combobox"], select').or(page.locator('[data-value]'));
  311 |       if (await typeSelector.first().isVisible().catch(() => false)) {
  312 |         await typeSelector.first().click();
  313 |         await page.waitForTimeout(500);
  314 | 
  315 |         // Select the specific chart type
  316 |         const typeOption = page.getByText(new RegExp(chartInfo.type, 'i')).or(page.locator(`[data-value="${chartInfo.type}"]`));
  317 |         if (await typeOption.isVisible().catch(() => false)) {
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
> 387 |     await newDashboardBtn.click();
      |                           ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
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
```
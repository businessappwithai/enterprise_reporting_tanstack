# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Filters >> 7.2 Can create a new filter
- Location: e2e/complete-system-test.spec.ts:499:5

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("New Filter"), button:has-text("Create Filter")')

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
> 503 |       await page.click('button:has-text("New Filter"), button:has-text("Create Filter")');
      |                  ^ TimeoutError: page.click: Timeout 15000ms exceeded.
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
  533 | 
  534 |       // Navigate to a report
  535 |       const firstReport = page.locator('table tbody tr').first();
  536 |       const count = await firstReport.count();
  537 | 
  538 |       if (count > 0) {
  539 |         await firstReport.click();
  540 |         await page.waitForTimeout(2000);
  541 | 
  542 |         // Look for filter UI
  543 |         const filterSection = page.locator('.filter-bar, [data-testid="filters"]').first();
  544 | 
  545 |         if (await filterSection.isVisible()) {
  546 |           // Should have filter options
  547 |           expect(filterSection).toBeVisible();
  548 |         }
  549 |       }
  550 |     });
  551 |   });
  552 | 
  553 |   // ========================================================================
  554 |   // PART 8: METADATA ENTITIES
  555 |   // ========================================================================
  556 | 
  557 |   test.describe('Metadata Entities', () => {
  558 |     test.beforeEach(async ({ page }) => {
  559 |       await login(page);
  560 |     });
  561 | 
  562 |     test('8.1 Can view metadata entities', async ({ page }) => {
  563 |       await page.goto(`${BASE_URL}/metadata/entities`);
  564 | 
  565 |       await expect(page.locator('h1').filter({ hasText: /metadata/i })).toBeVisible();
  566 |     });
  567 | 
  568 |     test('8.2 Can create a metadata entity', async ({ page }) => {
  569 |       await page.goto(`${BASE_URL}/metadata/entities`);
  570 | 
  571 |       // Click new entity button
  572 |       await page.click('button:has-text("New Entity"), button:has-text("Create Entity")');
  573 | 
  574 |       // Wait for form
  575 |       await page.waitForTimeout(1000);
  576 | 
  577 |       // Fill entity details
  578 |       const entityName = `e2e_entity_${Date.now()}`;
  579 |       const nameInput = page.locator('input[name="name"], input[name="entity_name"]');
  580 | 
  581 |       if (await nameInput.isVisible()) {
  582 |         await nameInput.fill(entityName);
  583 | 
  584 |         // Select data source
  585 |         const dataSourceSelect = page.locator('select[name="dataSource"]').first();
  586 |         if (await dataSourceSelect.isVisible()) {
  587 |           await dataSourceSelect.click();
  588 |           await page.keyboard.press('ArrowDown');
  589 |           await page.keyboard.press('Enter');
  590 |         }
  591 | 
  592 |         // Save
  593 |         await page.click('button:has-text("Save"), button:has-text("Create")');
  594 |         await page.waitForTimeout(2000);
  595 |       }
  596 |     });
  597 | 
  598 |     test('8.3 Can configure entity fields', async ({ page }) => {
  599 |       await page.goto(`${BASE_URL}/metadata/entities`);
  600 | 
  601 |       // Click on first entity
  602 |       const firstEntity = page.locator('table tbody tr, [role="row"]').first();
  603 |       const count = await firstEntity.count();
```
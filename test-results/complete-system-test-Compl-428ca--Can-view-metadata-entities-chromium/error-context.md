# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Metadata Entities >> 8.1 Can view metadata entities
- Location: e2e/complete-system-test.spec.ts:562:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').filter({ hasText: /metadata/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').filter({ hasText: /metadata/i })

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
        - generic [ref=e141]:
          - img [ref=e142]
          - heading "Access Restricted" [level=2] [ref=e146]
          - paragraph [ref=e147]: Entity metadata management must be accessed from a datasource.
          - link "Go to Data Sources" [ref=e148] [cursor=pointer]:
            - /url: /data-sources
            - button "Go to Data Sources" [ref=e149]:
              - img [ref=e150]
              - text: Go to Data Sources
  - region "Notifications alt+T"
```

# Test source

```ts
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
> 565 |       await expect(page.locator('h1').filter({ hasText: /metadata/i })).toBeVisible();
      |                                                                         ^ Error: expect(locator).toBeVisible() failed
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
  604 | 
  605 |       if (count > 0) {
  606 |         await firstEntity.click();
  607 |         await page.waitForTimeout(2000);
  608 | 
  609 |         // Look for fields configuration
  610 |         const fieldsSection = page.locator('.fields, [data-testid="fields"]').first();
  611 | 
  612 |         if (await fieldsSection.isVisible()) {
  613 |           expect(fieldsSection).toBeVisible();
  614 |         }
  615 |       }
  616 |     });
  617 |   });
  618 | 
  619 |   // ========================================================================
  620 |   // PART 9: JOBS
  621 |   // ========================================================================
  622 | 
  623 |   test.describe('Jobs', () => {
  624 |     test.beforeEach(async ({ page }) => {
  625 |       await login(page);
  626 |     });
  627 | 
  628 |     test('9.1 Can view jobs list', async ({ page }) => {
  629 |       await page.goto(`${BASE_URL}/jobs`);
  630 | 
  631 |       await expect(page.locator('h1').filter({ hasText: /jobs/i })).toBeVisible();
  632 |     });
  633 | 
  634 |     test('9.2 Can view job executions', async ({ page }) => {
  635 |       await page.goto(`${BASE_URL}/jobs`);
  636 | 
  637 |       // Look for executions tab or table
  638 |       const executionsTab = page.locator('button:has-text("Executions"), [role="tab"]:has-text("Executions")');
  639 |       const executionsTable = page.locator('table:has-text("Status"), .executions-table');
  640 | 
  641 |       const isVisible = await (executionsTab.or(executionsTable)).isVisible();
  642 | 
  643 |       if (isVisible) {
  644 |         if (await executionsTab.isVisible()) {
  645 |           await executionsTab.click();
  646 |         }
  647 | 
  648 |         await page.waitForTimeout(1000);
  649 | 
  650 |         // Should show job executions
  651 |         const hasExecutions = await page.locator('table tbody tr, [role="row"]').count() > 0;
  652 |         expect(hasExecutions).toBeTruthy();
  653 |       }
  654 |     });
  655 | 
  656 |     test('9.3 Can retry failed job', async ({ page }) => {
  657 |       await page.goto(`${BASE_URL}/jobs`);
  658 | 
  659 |       // Look for failed job
  660 |       const failedJob = page.locator('text=failed, [data-status="failed"]').first();
  661 | 
  662 |       if (await failedJob.isVisible()) {
  663 |         // Look for retry button
  664 |         const retryButton = page.locator('button:has-text("Retry")').first();
  665 | 
```
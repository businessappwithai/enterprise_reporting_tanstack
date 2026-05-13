# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Jobs >> 9.1 Can view jobs list
- Location: e2e/complete-system-test.spec.ts:628:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').filter({ hasText: /jobs/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').filter({ hasText: /jobs/i })

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
> 631 |       await expect(page.locator('h1').filter({ hasText: /jobs/i })).toBeVisible();
      |                                                                     ^ Error: expect(locator).toBeVisible() failed
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
  666 |         if (await retryButton.isVisible()) {
  667 |           await retryButton.click();
  668 |           await page.waitForTimeout(2000);
  669 | 
  670 |           // Should show success or update status
  671 |           const hasFeedback = await page.locator('text=retry, text=queued, text=success').count() > 0;
  672 |           expect(hasFeedback).toBeTruthy();
  673 |         }
  674 |       }
  675 |     });
  676 | 
  677 |     test('9.4 Can schedule a new job', async ({ page }) => {
  678 |       await page.goto(`${BASE_URL}/jobs`);
  679 | 
  680 |       // Click new job button
  681 |       await page.click('button:has-text("New Job"), button:has-text("Schedule Job")');
  682 | 
  683 |       // Wait for dialog
  684 |       await page.waitForTimeout(1000);
  685 | 
  686 |       // Fill job details
  687 |       const jobName = `E2E Job ${Date.now()}`;
  688 |       const nameInput = page.locator('input[name="name"]');
  689 | 
  690 |       if (await nameInput.isVisible()) {
  691 |         await nameInput.fill(jobName);
  692 | 
  693 |         // Select job type
  694 |         const typeSelect = page.locator('select[name="type"]').first();
  695 |         if (await typeSelect.isVisible()) {
  696 |           await typeSelect.selectOption('export');
  697 |         }
  698 | 
  699 |         // Save
  700 |         await page.click('button:has-text("Save"), button:has-text("Schedule")');
  701 |         await page.waitForTimeout(2000);
  702 |       }
  703 |     });
  704 |   });
  705 | 
  706 |   // ========================================================================
  707 |   // PART 10: SAVED QUERIES
  708 |   // ========================================================================
  709 | 
  710 |   test.describe('Saved Queries', () => {
  711 |     test.beforeEach(async ({ page }) => {
  712 |       await login(page);
  713 |     });
  714 | 
  715 |     test('10.1 Can view saved queries', async ({ page }) => {
  716 |       await page.goto(`${BASE_URL}/queries`);
  717 | 
  718 |       await expect(page.locator('h1').filter({ hasText: /queries/i })).toBeVisible();
  719 |     });
  720 | 
  721 |     test('10.2 Can execute saved query', async ({ page }) => {
  722 |       await page.goto(`${BASE_URL}/queries`);
  723 | 
  724 |       // Click on first saved query
  725 |       const firstQuery = page.locator('table tbody tr, [role="row"], .card').first();
  726 |       const count = await firstQuery.count();
  727 | 
  728 |       if (count > 0) {
  729 |         await firstQuery.click();
  730 |         await page.waitForTimeout(2000);
  731 | 
```
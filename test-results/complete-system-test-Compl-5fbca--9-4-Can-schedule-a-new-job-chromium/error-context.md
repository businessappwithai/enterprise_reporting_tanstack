# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Jobs >> 9.4 Can schedule a new job
- Location: e2e/complete-system-test.spec.ts:677:5

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("New Job"), button:has-text("Schedule Job")')

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
              - heading "Background Jobs" [level=1] [ref=e143]
              - paragraph [ref=e144]: Monitor and manage background job processing
            - button "Refresh" [ref=e145] [cursor=pointer]:
              - img [ref=e146]
              - text: Refresh
          - generic [ref=e151]:
            - generic [ref=e152]:
              - generic [ref=e153]:
                - heading "Waiting" [level=3] [ref=e154]
                - img [ref=e155]
              - generic [ref=e159]: "0"
            - generic [ref=e160]:
              - generic [ref=e161]:
                - heading "Active" [level=3] [ref=e162]
                - img [ref=e163]
              - generic [ref=e169]: "0"
            - generic [ref=e170]:
              - generic [ref=e171]:
                - heading "Completed" [level=3] [ref=e172]
                - img [ref=e173]
              - generic [ref=e177]: "0"
            - generic [ref=e178]:
              - generic [ref=e179]:
                - heading "Failed" [level=3] [ref=e180]
                - img [ref=e181]
              - generic [ref=e186]: "0"
            - generic [ref=e187]:
              - generic [ref=e188]:
                - heading "Delayed" [level=3] [ref=e189]
                - img [ref=e190]
              - generic [ref=e194]: "0"
          - generic [ref=e195]:
            - tablist [ref=e196]:
              - tab "Recent Executions" [selected] [ref=e197] [cursor=pointer]
              - tab "Scheduled Jobs" [ref=e198] [cursor=pointer]
            - tabpanel "Recent Executions" [ref=e199]:
              - generic [ref=e200]:
                - heading "Recent Job Executions" [level=3] [ref=e202]
                - table [ref=e205]:
                  - rowgroup [ref=e206]:
                    - row "ID Status Started Completed Duration Actions" [ref=e207]:
                      - columnheader "ID" [ref=e208]
                      - columnheader "Status" [ref=e209]
                      - columnheader "Started" [ref=e210]
                      - columnheader "Completed" [ref=e211]
                      - columnheader "Duration" [ref=e212]
                      - columnheader "Actions" [ref=e213]
                  - rowgroup
  - region "Notifications alt+T"
```

# Test source

```ts
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
> 681 |       await page.click('button:has-text("New Job"), button:has-text("Schedule Job")');
      |                  ^ TimeoutError: page.click: Timeout 15000ms exceeded.
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
  732 |         // Should show query details or execute button
  733 |         const executeButton = page.locator('button:has-text("Run"), button:has-text("Execute")').first();
  734 | 
  735 |         if (await executeButton.isVisible()) {
  736 |           await executeButton.click();
  737 |           await page.waitForTimeout(3000);
  738 | 
  739 |           // Should show results
  740 |           const hasResults = await page.locator('table, .results').count() > 0;
  741 |           expect(hasResults).toBeTruthy();
  742 |         }
  743 |       }
  744 |     });
  745 | 
  746 |     test('10.3 Can edit saved query', async ({ page }) => {
  747 |       await page.goto(`${BASE_URL}/queries`);
  748 | 
  749 |       const firstQuery = page.locator('table tbody tr').first();
  750 |       const count = await firstQuery.count();
  751 | 
  752 |       if (count > 0) {
  753 |         // Look for edit button
  754 |         const editButton = page.locator('button:has-text("Edit")').first();
  755 | 
  756 |         if (await editButton.isVisible()) {
  757 |           await editButton.click();
  758 |           await page.waitForTimeout(2000);
  759 | 
  760 |           // Should show edit form
  761 |           const hasForm = await page.locator('input[name="name"], textarea').count() > 0;
  762 |           expect(hasForm).toBeTruthy();
  763 |         }
  764 |       }
  765 |     });
  766 |   });
  767 | 
  768 |   // ========================================================================
  769 |   // PART 11: ADMIN PANEL - USERS
  770 |   // ========================================================================
  771 | 
  772 |   test.describe('Admin - Users', () => {
  773 |     test.beforeEach(async ({ page }) => {
  774 |       await login(page);
  775 |     });
  776 | 
  777 |     test('11.1 Can view users list', async ({ page }) => {
  778 |       await page.goto(`${BASE_URL}/admin/users`);
  779 | 
  780 |       await expect(page.locator('h1').filter({ hasText: /users/i })).toBeVisible();
  781 |       await expect(page.locator('table, [role="table"]')).toBeVisible();
```
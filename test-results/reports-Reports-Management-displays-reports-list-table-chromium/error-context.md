# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reports.spec.ts >> Reports Management >> displays reports list table
- Location: e2e/reports.spec.ts:37:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('columnheader', { name: 'Name' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('columnheader', { name: 'Name' })

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
              - heading "Reports" [level=1] [ref=e143]
              - paragraph [ref=e144]: Create and manage tabular reports
            - button "New Report" [ref=e145] [cursor=pointer]:
              - img [ref=e146]
              - text: New Report
          - generic [ref=e147]:
            - heading "All Reports" [level=3] [ref=e149]:
              - img [ref=e150]
              - text: All Reports
            - generic [ref=e154]: No reports created yet. Create your first report to get started.
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { TestHelpers } from './helpers/test-helpers';
  3   | 
  4   | // Helper function to check if create report button is available
  5   | async function checkCreateReportButton(page: any) {
  6   |   const button = page.getByRole('button', { name: 'New Report' }).first();
  7   |   return await button.isVisible({ timeout: 3000 }).catch(() => false);
  8   | }
  9   | 
  10  | test.describe('Reports Management', () => {
  11  |   test.beforeEach(async ({ page }) => {
  12  |     const helpers = new TestHelpers(page);
  13  |     await helpers.login();
  14  |     await helpers.navigateToPage('Reports');
  15  |   });
  16  | 
  17  |   test('Reports page loads correctly', async ({ page }) => {
  18  |     const helpers = new TestHelpers(page);
  19  | 
  20  |     // Wait for page to fully load after navigation
  21  |     // First test needs more time for initial authentication to settle
  22  |     await page.waitForTimeout(5000);
  23  | 
  24  |     // Check for main page elements - use exact match to avoid ambiguity with "All Reports"
  25  |     await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
  26  |     await expect(page.getByText('Create and manage tabular reports')).toBeVisible();
  27  | 
  28  |     // Check for All Reports table header
  29  |     await expect(page.getByText('All Reports')).toBeVisible();
  30  | 
  31  |     // New Report button
  32  |     await expect(page.getByRole('button', { name: 'New Report' })).toBeVisible();
  33  | 
  34  |     await helpers.screenshot('reports-page-loaded');
  35  |   });
  36  | 
  37  |   test('displays reports list table', async ({ page }) => {
  38  |     const helpers = new TestHelpers(page);
  39  | 
  40  |     // Wait for page to fully load after navigation
  41  |     await page.waitForTimeout(2000);
  42  | 
  43  |     // Wait for loading to complete
  44  |     await helpers.waitForLoading();
  45  | 
  46  |     // Check for table headers - use role to avoid strict mode violations
> 47  |     await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
      |                                                                    ^ Error: expect(locator).toBeVisible() failed
  48  |     await expect(page.getByRole('columnheader', { name: 'Description' })).toBeVisible();
  49  |     await expect(page.getByRole('columnheader', { name: 'Query' })).toBeVisible();
  50  |     await expect(page.getByRole('columnheader', { name: 'Created' })).toBeVisible();
  51  | 
  52  |     await helpers.screenshot('reports-list-table');
  53  |   });
  54  | 
  55  |   test('create new report with query', async ({ page }) => {
  56  |     const helpers = new TestHelpers(page);
  57  | 
  58  |     // Click New Report button
  59  |     await helpers.clickButton('New Report');
  60  | 
  61  |     // Wait for dialog to appear - use role to avoid strict mode violation
  62  |     await expect(page.getByRole('heading', { name: 'Create Report' })).toBeVisible();
  63  |     await expect(page.getByText('Create a new report from a saved query.')).toBeVisible();
  64  | 
  65  |     // Fill in report name
  66  |     await helpers.fillByLabel('Name', 'E2E Test Report');
  67  | 
  68  |     // Fill in description
  69  |     await helpers.fillByLabel('Description', 'This is a test report from E2E tests');
  70  | 
  71  |     // Try to select a query if available
  72  |     const querySelect = page.locator('[role="combobox"]').filter({ hasText: 'Select a query' });
  73  |     if (await querySelect.isVisible()) {
  74  |       await querySelect.click();
  75  |       await page.waitForTimeout(500);
  76  | 
  77  |       // Check if there are any queries available
  78  |       const firstOption = page.locator('[role="option"]').first();
  79  |       if (await firstOption.isVisible()) {
  80  |         await firstOption.click();
  81  |       }
  82  |     }
  83  | 
  84  |     // Click Create Report button
  85  |     await helpers.clickButton('Create Report');
  86  | 
  87  |     // Verify success toast
  88  |     await helpers.verifyToast('Report created successfully');
  89  | 
  90  |     await helpers.screenshot('report-created');
  91  |   });
  92  | 
  93  |   test('create new report without query', async ({ page }) => {
  94  |     const helpers = new TestHelpers(page);
  95  | 
  96  |     // Click New Report button
  97  |     await helpers.clickButton('New Report');
  98  | 
  99  |     // Fill in report name only
  100 |     await helpers.fillByLabel('Name', 'E2E Test Report No Query');
  101 | 
  102 |     // Create report
  103 |     await helpers.clickButton('Create Report');
  104 | 
  105 |     // Verify success
  106 |     await helpers.verifyToast('Report created successfully');
  107 | 
  108 |     await helpers.screenshot('report-created-no-query');
  109 |   });
  110 | 
  111 |   test('validation prevents creating report without name', async ({ page }) => {
  112 |     const helpers = new TestHelpers(page);
  113 | 
  114 |     // Click New Report button
  115 |     await helpers.clickButton('New Report');
  116 | 
  117 |     // Don't fill in name, try to create
  118 |     const createButton = page.getByRole('button', { name: 'Create Report' });
  119 |     await expect(createButton).toBeDisabled();
  120 | 
  121 |     await helpers.screenshot('report-validation-no-name');
  122 |   });
  123 | 
  124 |   test('cancel report creation', async ({ page }) => {
  125 |     const helpers = new TestHelpers(page);
  126 | 
  127 |     // Click New Report button
  128 |     await helpers.clickButton('New Report');
  129 | 
  130 |     // Fill in some data
  131 |     await helpers.fillByLabel('Name', 'Test Report');
  132 |     await helpers.fillByLabel('Description', 'Test description');
  133 | 
  134 |     // Click Cancel
  135 |     await helpers.clickButton('Cancel');
  136 | 
  137 |     // Verify dialog is closed - use role to avoid strict mode violation
  138 |     await expect(page.getByRole('heading', { name: 'Create Report' })).not.toBeVisible();
  139 | 
  140 |     await helpers.screenshot('report-creation-cancelled');
  141 |   });
  142 | 
  143 |   test('view report details', async ({ page }) => {
  144 |     const helpers = new TestHelpers(page);
  145 | 
  146 |     // Wait for reports to load
  147 |     await helpers.waitForLoading();
```
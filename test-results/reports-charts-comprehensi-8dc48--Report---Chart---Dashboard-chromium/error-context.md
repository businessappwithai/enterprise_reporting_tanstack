# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reports-charts-comprehensive.spec.ts >> Reporting and Charting Comprehensive Test >> Complete workflow: Query -> Report -> Chart -> Dashboard
- Location: e2e/reports-charts-comprehensive.spec.ts:22:3

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
  1   | /**
  2   |  * Comprehensive Reporting and Charting E2E Test
  3   |  *
  4   |  * This test verifies the complete reporting and charting workflow:
  5   |  * 1. Create and save query
  6   |  * 2. Create report from query
  7   |  * 3. Create chart from query
  8   |  * 4. Create dashboard
  9   |  * 5. Add widgets to dashboard
  10  |  */
  11  | 
  12  | import { test, expect } from '@playwright/test';
  13  | import { login } from './test-auth';
  14  | 
  15  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  16  | 
  17  | test.describe('Reporting and Charting Comprehensive Test', () => {
  18  |   test.beforeEach(async ({ page }) => {
  19  |     await login(page);
  20  |   });
  21  | 
  22  |   test('Complete workflow: Query -> Report -> Chart -> Dashboard', async ({ page }) => {
  23  |     console.log('\n=== Starting Complete Reporting Workflow ===\n');
  24  | 
  25  |     // Step 1: Go to SQL Editor and create a query
  26  |     console.log('Step 1: Creating saved query...');
  27  |     await page.goto(`${BASE_URL}/sql-editor`);
> 28  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  29  | 
  30  |     // Type a test query
  31  |     await page.locator('.monaco-editor').click();
  32  |     await page.keyboard.type('SELECT COUNT(*) as total, gender FROM bus_patient GROUP BY gender');
  33  | 
  34  |     // Look for and click save button
  35  |     const saveBtn = page.getByRole('button', { name: /save/i }).first();
  36  |     await saveBtn.click();
  37  |     await page.waitForTimeout(1000);
  38  | 
  39  |     // Fill in save dialog
  40  |     const nameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="name"]')).first();
  41  |     await nameInput.fill('Patient Gender Distribution');
  42  | 
  43  |     const confirmBtn = page.getByRole('button', { name: /save|create|confirm/i }).or(page.getByRole('button', { name: /ok/i })).first();
  44  |     await confirmBtn.click();
  45  |     await page.waitForTimeout(2000);
  46  | 
  47  |     console.log('✓ Query saved successfully');
  48  | 
  49  |     // Step 2: Create a report from the query
  50  |     console.log('Step 2: Creating report from query...');
  51  |     await page.goto(`${BASE_URL}/reports`);
  52  |     await page.waitForTimeout(2000);
  53  | 
  54  |     // Look for "Create New Report" button
  55  |     const createReportBtn = page.getByRole('button', { name: /create.*report|new.*report|add.*report/i }).or(page.getByRole('button', { name: /create|new|add/i }).first());
  56  |     await createReportBtn.click();
  57  |     await page.waitForTimeout(1500);
  58  | 
  59  |     // Fill in report details
  60  |     const reportNameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="name"]')).first();
  61  |     if (await reportNameInput.isVisible().catch(() => false)) {
  62  |       await reportNameInput.fill('Patient Gender Report');
  63  |     }
  64  | 
  65  |     // Look for query selector
  66  |     const querySelector = page.locator('select, [role="combobox"]').first();
  67  |     if (await querySelector.isVisible().catch(() => false)) {
  68  |       await querySelector.click();
  69  |       await page.waitForTimeout(500);
  70  |       const queryOption = page.getByText('Patient Gender Distribution').or(page.getByText('Patient Gender')).first();
  71  |       if (await queryOption.isVisible().catch(() => false)) {
  72  |         await queryOption.click();
  73  |       }
  74  |     }
  75  | 
  76  |     // Save report
  77  |     const saveReportBtn = page.getByRole('button', { name: /save|create/i }).first();
  78  |     await saveReportBtn.click();
  79  |     await page.waitForTimeout(2000);
  80  | 
  81  |     console.log('✓ Report created successfully');
  82  | 
  83  |     // Step 3: Create a chart
  84  |     console.log('Step 3: Creating chart...');
  85  |     await page.goto(`${BASE_URL}/charts`);
  86  |     await page.waitForTimeout(2000);
  87  | 
  88  |     // Look for "Create New Chart" button
  89  |     const createChartBtn = page.getByRole('button', { name: /create.*chart|new.*chart|add.*chart/i }).or(page.getByRole('button', { name: /create|new|add/i }).first());
  90  |     await createChartBtn.click();
  91  |     await page.waitForTimeout(1500);
  92  | 
  93  |     // Fill in chart details
  94  |     const chartNameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="name"]')).first();
  95  |     if (await chartNameInput.isVisible().catch(() => false)) {
  96  |       await chartNameInput.fill('Gender Distribution Chart');
  97  |     }
  98  | 
  99  |     // Select chart type (bar, pie, etc.)
  100 |     const chartTypeSelector = page.locator('[role="combobox"]').filter({ hasText: /chart.*type|type/i }).or(page.locator('select').first());
  101 |     if (await chartTypeSelector.isVisible().catch(() => false)) {
  102 |       await chartTypeSelector.click();
  103 |       await page.waitForTimeout(500);
  104 |       const barOption = page.getByText(/bar|pie/i).first();
  105 |       if (await barOption.isVisible().catch(() => false)) {
  106 |         await barOption.click();
  107 |       }
  108 |     }
  109 | 
  110 |     // Save chart
  111 |     const saveChartBtn = page.getByRole('button', { name: /save|create/i }).first();
  112 |     await saveChartBtn.click();
  113 |     await page.waitForTimeout(2000);
  114 | 
  115 |     console.log('✓ Chart created successfully');
  116 | 
  117 |     // Step 4: Create a dashboard
  118 |     console.log('Step 4: Creating dashboard...');
  119 |     await page.goto(`${BASE_URL}/dashboards`);
  120 |     await page.waitForTimeout(2000);
  121 | 
  122 |     // Look for "Create New Dashboard" button
  123 |     const createDashboardBtn = page.getByRole('button', { name: /create.*dashboard|new.*dashboard/i }).or(page.getByRole('button', { name: /create|new/i }).first());
  124 |     await createDashboardBtn.click();
  125 |     await page.waitForTimeout(1500);
  126 | 
  127 |     // Fill in dashboard details
  128 |     const dashboardNameInput = page.locator('input[name="name"]').or(page.locator('input[placeholder*="name"]')).first();
```
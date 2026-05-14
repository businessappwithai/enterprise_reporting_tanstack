# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-reports-charts-dashboard.spec.ts >> Comprehensive HMS Reports, Charts & Dashboard >> Test 1: Report viewer with 40,000+ patient records
- Location: e2e/comprehensive-reports-charts-dashboard.spec.ts:47:3

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
  2   |  * Comprehensive E2E Test for Hospital Management System
  3   |  * Reports, Charts, and Dashboard with 40,000+ records
  4   |  *
  5   |  * This test verifies:
  6   |  * 1. Report creation and viewer with 40,000+ hospital patient records
  7   |  * 2. Chart creation and performance testing with large patient data
  8   |  * 3. Comprehensive dashboard creation with multiple widgets
  9   |  * 4. Performance metrics for rendering
  10  |  *
  11  |  * Prerequisites:
  12  |  * - HMS (Hospital Management System) PostgreSQL data source configured
  13  |  * - User authenticated
  14  |  * - 100,000 patient records available in bus_patient table
  15  |  */
  16  | 
  17  | import { test, expect } from '@playwright/test';
  18  | import { login } from './test-auth';
  19  | 
  20  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  21  | 
  22  | // Helper function to measure performance
  23  | async function measurePerformance<T>(name: string, fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
  24  |   const start = Date.now();
  25  |   const result = await fn();
  26  |   const duration = Date.now() - start;
  27  |   console.log(`⏱️  ${name}: ${duration}ms`);
  28  |   return { result, duration };
  29  | }
  30  | 
  31  | // Helper to wait for toast notification
  32  | async function waitForToast(page: any, message?: string) {
  33  |   await page.waitForTimeout(500);
  34  |   const toast = page.locator('[data-sonner-toast]').first();
  35  |   if (message) {
  36  |     await expect(toast).toContainText(message, { timeout: 5000 });
  37  |   } else {
  38  |     await expect(toast).toBeVisible({ timeout: 5000 });
  39  |   }
  40  | }
  41  | 
  42  | test.describe('Comprehensive HMS Reports, Charts & Dashboard', () => {
  43  |   test.beforeEach(async ({ page }) => {
  44  |     await login(page);
  45  |   });
  46  | 
  47  |   test('Test 1: Report viewer with 40,000+ patient records', async ({ page }) => {
  48  |     console.log('\n=== Test 1: Report Viewer with 40K+ Patient Records ===\n');
  49  | 
  50  |     // Step 1: Go to SQL Editor and select HMS data source
  51  |     console.log('Step 1: Setting up data source...');
  52  |     await page.goto(`${BASE_URL}/sql-editor`);
> 53  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  54  | 
  55  |     // Select HMS data source if there's a selector
  56  |     const dataSourceSelector = page.locator('[data-testid="datasource-select"], select, [role="combobox"]').first();
  57  |     if (await dataSourceSelector.isVisible().catch(() => false)) {
  58  |       await dataSourceSelector.click();
  59  |       await page.waitForTimeout(500);
  60  | 
  61  |       // Look for HMS, Hospital, or PostgreSQL option
  62  |       const hospitalOption = page.getByText(/HMS|Hospital|postgres/i).or(page.locator('[data-value*="hospital"], [data-value*="hms"]'));
  63  |       const count = await hospitalOption.count();
  64  | 
  65  |       if (count > 0) {
  66  |         await hospitalOption.first().click();
  67  |         console.log('✓ HMS data source selected');
  68  |       } else {
  69  |         // Try keyboard navigation
  70  |         await page.keyboard.press('ArrowDown');
  71  |         await page.waitForTimeout(300);
  72  |         await page.keyboard.press('Enter');
  73  |         console.log('✓ Data source selected (first available)');
  74  |       }
  75  |       await page.waitForTimeout(1000);
  76  |     }
  77  | 
  78  |     // Step 2: Create a query for 50,000 patient records
  79  |     console.log('Step 2: Creating query for 50,000 patient records...');
  80  |     const query = `SELECT
  81  |   id,
  82  |   first_name,
  83  |   last_name,
  84  |   date_of_birth,
  85  |   gender,
  86  |   blood_group,
  87  |   phone,
  88  |   email,
  89  |   address,
  90  |   city,
  91  |   state,
  92  |   postal_code,
  93  |   country,
  94  |   created_at
  95  | FROM bus_patient
  96  | ORDER BY id
  97  | LIMIT 50000`;
  98  | 
  99  |     await page.locator('.monaco-editor').click();
  100 |     // Clear existing content and type new query
  101 |     await page.keyboard.press('Control+A');
  102 |     await page.keyboard.type(query);
  103 | 
  104 |     // Execute the query to verify it works
  105 |     const executeBtn = page.getByRole('button', { name: /execute|run/i }).or(page.locator('button:has-text("Run")'));
  106 |     await executeBtn.first().click();
  107 |     await page.waitForTimeout(3000);
  108 | 
  109 |     // Verify results
  110 |     const resultsArea = page.locator('.results, table, [data-testid="results"]').first();
  111 |     if (await resultsArea.isVisible().catch(() => false)) {
  112 |       console.log('✓ Query executed successfully');
  113 |       // Take screenshot of results
  114 |       await page.screenshot({ path: 'screenshots/hms-query-results-50k.png', fullPage: true });
  115 |     }
  116 | 
  117 |     // Step 3: Save the query
  118 |     console.log('Step 3: Saving query...');
  119 |     const saveBtn = page.getByRole('button', { name: /save/i }).first();
  120 |     await saveBtn.click();
  121 |     await page.waitForTimeout(1000);
  122 | 
  123 |     const nameInput = page.locator('input[id="name"], input[name="name"]').or(page.locator('input[placeholder*="name"]')).first();
  124 |     await nameInput.fill('50K Patients - Large Dataset Report');
  125 | 
  126 |     const confirmBtn = page.getByRole('button', { name: /save|create|confirm/i }).filter({ hasText: /save|create/i }).first();
  127 |     await confirmBtn.click();
  128 |     await page.waitForTimeout(2000);
  129 | 
  130 |     console.log('✓ Query saved');
  131 | 
  132 |     // Step 4: Create a report from this query
  133 |     console.log('Step 4: Creating report...');
  134 |     await page.goto(`${BASE_URL}/reports`);
  135 |     await page.waitForTimeout(1000);
  136 | 
  137 |     // Click "New Report" button
  138 |     const newReportBtn = page.getByRole('button', { name: /new.*report/i });
  139 |     await newReportBtn.click();
  140 |     await page.waitForTimeout(1000);
  141 | 
  142 |     // Fill in report details
  143 |     const reportNameInput = page.locator('input[id="name"]');
  144 |     await reportNameInput.fill('Patient Registry - 50K Records');
  145 | 
  146 |     const descInput = page.locator('input[id="description"]');
  147 |     if (await descInput.isVisible().catch(() => false)) {
  148 |       await descInput.fill('Comprehensive patient registry with 50,000 records');
  149 |     }
  150 | 
  151 |     // Select the saved query
  152 |     const querySelect = page.locator('[role="combobox"]').or(page.locator('select')).first();
  153 |     await querySelect.click();
```
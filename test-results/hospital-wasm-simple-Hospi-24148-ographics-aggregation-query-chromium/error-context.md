# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm-simple.spec.ts >> Hospital Management - WASM Performance Test >> Patient demographics aggregation query
- Location: e2e/hospital-wasm-simple.spec.ts:42:3

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
  2   |  * Hospital Management System - WASM Architecture E2E Test (Simplified)
  3   |  *
  4   |  * This test focuses on testing WASM features with the hospital database.
  5   |  * Assumes a data source is already configured or tests can create one.
  6   |  */
  7   | 
  8   | import { test, expect } from '@playwright/test';
  9   | import { login } from './test-auth';
  10  | 
  11  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  12  | 
  13  | test.describe('Hospital Management - WASM Performance Test', () => {
  14  |   test.beforeEach(async ({ page }) => {
  15  |     await login(page);
  16  |   });
  17  | 
  18  |   test('Execute queries against 100K patient records', async ({ page }) => {
  19  |     await page.goto(`${BASE_URL}/sql-editor`);
  20  | 
  21  |     // Wait for SQL editor to load
  22  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  23  | 
  24  |     // Query 1: Count all patients
  25  |     await page.locator('.monaco-editor').click();
  26  |     await page.keyboard.type('SELECT COUNT(*) as total_patients FROM bus_patient');
  27  | 
  28  |     // Click execute button
  29  |     const executeBtn = page.getByRole('button', { name: /execute|run/i }).first();
  30  |     await executeBtn.click();
  31  | 
  32  |     // Wait for results - should show 100,000
  33  |     await page.waitForTimeout(3000);
  34  | 
  35  |     // Check if results are displayed
  36  |     const resultsVisible = await page.locator('[role="table"], .results, .data-grid').isVisible().catch(() => false);
  37  |     expect(resultsVisible).toBeTruthy();
  38  | 
  39  |     console.log('Query 1: COUNT(*) - Executed');
  40  |   });
  41  | 
  42  |   test('Patient demographics aggregation query', async ({ page }) => {
  43  |     await page.goto(`${BASE_URL}/sql-editor`);
  44  | 
  45  |     // Wait for editor
> 46  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  47  | 
  48  |     // Execute demographics query
  49  |     const demographicsQuery = `SELECT
  50  |   gender,
  51  |   blood_group,
  52  |   COUNT(*) as patient_count
  53  | FROM bus_patient
  54  | GROUP BY gender, blood_group
  55  | ORDER BY patient_count DESC`;
  56  | 
  57  |     await page.locator('.monaco-editor').click();
  58  |     await page.keyboard.type(demographicsQuery);
  59  | 
  60  |     await page.getByRole('button', { name: /execute|run/i }).first().click();
  61  | 
  62  |     // Wait for results
  63  |     await page.waitForTimeout(3000);
  64  | 
  65  |     const resultsVisible = await page.locator('[role="table"], .results, .data-grid').isVisible().catch(() => false);
  66  |     expect(resultsVisible).toBeTruthy();
  67  | 
  68  |     console.log('Query 2: Demographics aggregation - Executed');
  69  |   });
  70  | 
  71  |   test('Large dataset query with 1000 rows', async ({ page }) => {
  72  |     await page.goto(`${BASE_URL}/sql-editor`);
  73  | 
  74  |     // Wait for editor
  75  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  76  | 
  77  |     // Query for 1000 patients
  78  |     const largeQuery = `SELECT
  79  |   id,
  80  |   uhid,
  81  |   first_name,
  82  |   last_name,
  83  |   gender,
  84  |   blood_group
  85  | FROM bus_patient
  86  | ORDER BY id
  87  | LIMIT 1000`;
  88  | 
  89  |     await page.locator('.monaco-editor').click();
  90  |     await page.keyboard.type(largeQuery);
  91  | 
  92  |     await page.getByRole('button', { name: /execute|run/i }).first().click();
  93  | 
  94  |     // Wait for results - may take longer for large result set
  95  |     await page.waitForTimeout(5000);
  96  | 
  97  |     const resultsVisible = await page.locator('[role="table"], .results, .data-grid').isVisible().catch(() => false);
  98  |     expect(resultsVisible).toBeTruthy();
  99  | 
  100 |     console.log('Query 3: Large dataset (1000 rows) - Executed');
  101 |   });
  102 | 
  103 |   test('Navigate to Reports page', async ({ page }) => {
  104 |     await page.goto(`${BASE_URL}/reports`);
  105 | 
  106 |     // Should show reports page heading
  107 |     const heading = page.getByRole('heading', { name: /reports/i });
  108 |     const isVisible = await heading.isVisible().catch(() => false);
  109 |     expect(isVisible).toBeTruthy();
  110 | 
  111 |     console.log('Reports page accessed');
  112 |   });
  113 | 
  114 |   test('Navigate to Charts page', async ({ page }) => {
  115 |     await page.goto(`${BASE_URL}/charts`);
  116 | 
  117 |     // Should show charts page heading
  118 |     const heading = page.getByRole('heading', { name: /charts/i });
  119 |     const isVisible = await heading.isVisible().catch(() => false);
  120 |     expect(isVisible).toBeTruthy();
  121 | 
  122 |     console.log('Charts page accessed');
  123 |   });
  124 | 
  125 |   test('Navigate to Dashboards page', async ({ page }) => {
  126 |     await page.goto(`${BASE_URL}/dashboards`);
  127 | 
  128 |     // Should show dashboards page heading
  129 |     const heading = page.getByRole('heading', { name: /dashboards/i });
  130 |     const isVisible = await heading.isVisible().catch(() => false);
  131 |     expect(isVisible).toBeTruthy();
  132 | 
  133 |     console.log('Dashboards page accessed');
  134 |   });
  135 | 
  136 |   test('Check WASM/Datasets page', async ({ page }) => {
  137 |     await page.goto(`${BASE_URL}/datasets`);
  138 | 
  139 |     // Should show datasets page
  140 |     const heading = page.getByRole('heading', { name: /datasets/i });
  141 |     const isVisible = await heading.isVisible().catch(() => false);
  142 |     expect(isVisible).toBeTruthy();
  143 | 
  144 |     console.log('Datasets page accessed - WASM features available');
  145 |   });
  146 | 
```
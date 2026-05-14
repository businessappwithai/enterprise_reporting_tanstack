# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm.spec.ts >> Hospital Management System - WASM Architecture >> 1. Create PostgreSQL data source for hospital management
- Location: e2e/hospital-wasm.spec.ts:23:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[name="name"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('input[name="name"]')

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
              - heading "Data Sources" [level=1] [ref=e143]
              - paragraph [ref=e144]: Manage database connections for reports and queries
            - button "New Data Source" [active] [ref=e145] [cursor=pointer]:
              - img [ref=e146]
              - text: New Data Source
          - generic [ref=e147]:
            - heading "All Data Sources" [level=3] [ref=e149]:
              - img [ref=e150]
              - text: All Data Sources
            - generic [ref=e155]: No data sources configured. Add your first data source to get started.
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | /**
  2   |  * Hospital Management System - WASM Architecture E2E Test
  3   |  *
  4   |  * This test:
  5   |  * 1. Creates a PostgreSQL data source for hospital_management_system
  6   |  * 2. Writes queries against bus_patient table (100,000 records)
  7   |  * 3. Creates a report
  8   |  * 4. Creates a chart
  9   |  * 5. Tests WASM/DuckDB performance with large datasets
  10  |  */
  11  | 
  12  | import { test, expect } from '@playwright/test';
  13  | import { login } from './test-auth';
  14  | 
  15  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  16  | 
  17  | test.describe('Hospital Management System - WASM Architecture', () => {
  18  |   test.beforeEach(async ({ page }) => {
  19  |     await login(page);
  20  |     await page.goto(`${BASE_URL}/`);
  21  |   });
  22  | 
  23  |   test('1. Create PostgreSQL data source for hospital management', async ({ page }) => {
  24  |     await page.goto(`${BASE_URL}/data-sources`);
  25  | 
  26  |     // Click "Add New Data Source" button
  27  |     await page.click('button:has-text("Add"), button:has-text("New"), a:has-text("Add")');
  28  | 
  29  |     // Wait for form to load
> 30  |     await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  31  | 
  32  |     // Fill in data source details
  33  |     await page.fill('input[name="name"]', 'Hospital Management System');
  34  |     await page.fill('textarea[name="description"]', 'PostgreSQL database with 100K patient records for WASM testing');
  35  | 
  36  |     // Select PostgreSQL as client type
  37  |     await page.selectOption('select[name="clientType"]', 'pg');
  38  | 
  39  |     // Fill connection details
  40  |     await page.fill('input[name="host"]', 'localhost');
  41  |     await page.fill('input[name="port"]', '5432');
  42  |     await page.fill('input[name="database"]', 'hospital_management_system');
  43  |     await page.fill('input[name="user"]', 'postgres');
  44  |     await page.fill('input[name="password"]', '');
  45  | 
  46  |     // Test connection
  47  |     await page.click('button:has-text("Test Connection")');
  48  | 
  49  |     // Wait for test result (should show success)
  50  |     await expect(page.locator('text=Connection successful, text=Connected')).toBeVisible({ timeout: 10000 });
  51  | 
  52  |     // Save the data source
  53  |     await page.click('button:has-text("Save"), button:has-text("Create")');
  54  | 
  55  |     // Verify data source was created
  56  |     await expect(page.locator('text=Hospital Management System')).toBeVisible();
  57  |   });
  58  | 
  59  |   test('2. Execute queries against 100K patient records', async ({ page }) => {
  60  |     await page.goto(`${BASE_URL}/sql-editor`);
  61  | 
  62  |     // Wait for SQL editor to load
  63  |     await expect(page.locator('.monaco-editor, [contenteditable="true"], textarea, .CodeMirror')).toBeVisible();
  64  | 
  65  |     // Query 1: Simple patient count
  66  |     const countQuery = 'SELECT COUNT(*) as total_patients FROM bus_patient';
  67  |     await page.locator('.monaco-editor textarea, .CodeMirror-code textarea, [contenteditable="true"]').first().fill(countQuery);
  68  |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  69  | 
  70  |     // Wait for results - should show 100,000
  71  |     await expect(page.locator('table, .results, text=100000')).toBeVisible({ timeout: 15000 });
  72  | 
  73  |     // Query 2: Patient demographics aggregation
  74  |     const demographicsQuery = `SELECT
  75  |       gender,
  76  |       blood_group,
  77  |       COUNT(*) as patient_count,
  78  |       ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth))), 2) as avg_age
  79  |     FROM bus_patient
  80  |     GROUP BY gender, blood_group
  81  |     ORDER BY patient_count DESC`;
  82  | 
  83  |     await page.locator('.monaco-editor textarea, .CodeMirror-code textarea, [contenteditable="true"]').first().fill(demographicsQuery);
  84  |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  85  | 
  86  |     // Wait for results - should show demographic breakdown
  87  |     await expect(page.locator('table, .results')).toBeVisible({ timeout: 15000 });
  88  |     await expect(page.locator('text=gender, text=blood_group, text=patient_count')).toBeVisible();
  89  | 
  90  |     // Query 3: Age distribution with CASE statement
  91  |     const ageDistributionQuery = `SELECT
  92  |       CASE
  93  |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 18 THEN 'Under 18'
  94  |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 40 THEN '18-39'
  95  |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 60 THEN '40-59'
  96  |         ELSE '60+'
  97  |       END as age_group,
  98  |       COUNT(*) as patient_count
  99  |     FROM bus_patient
  100 |     GROUP BY age_group
  101 |     ORDER BY age_group`;
  102 | 
  103 |     await page.locator('.monaco-editor textarea, .CodeMirror-code textarea, [contenteditable="true"]').first().fill(ageDistributionQuery);
  104 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  105 | 
  106 |     // Wait for results
  107 |     await expect(page.locator('table, .results')).toBeVisible({ timeout: 15000 });
  108 | 
  109 |     // Query 4: Large dataset query with pagination (1000 rows)
  110 |     const largeDatasetQuery = `SELECT
  111 |       id,
  112 |       uhid,
  113 |       mrn,
  114 |       first_name,
  115 |       last_name,
  116 |       date_of_birth,
  117 |       gender,
  118 |       blood_group,
  119 |       phone,
  120 |       email
  121 |     FROM bus_patient
  122 |     ORDER BY id
  123 |     LIMIT 1000`;
  124 | 
  125 |     await page.locator('.monaco-editor textarea, .CodeMirror-code textarea, [contenteditable="true"]').first().fill(largeDatasetQuery);
  126 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  127 | 
  128 |     // Wait for results - should show 1000 rows
  129 |     await expect(page.locator('table tbody tr, .data-grid-row').nth(0)).toBeVisible({ timeout: 20000 });
  130 | 
```
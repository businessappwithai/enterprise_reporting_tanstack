# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm.spec.ts >> Hospital Management System - WASM Architecture >> 1. Create PostgreSQL data source for hospital management
- Location: e2e/hospital-wasm.spec.ts:23:3

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Add"), button:has-text("New"), a:has-text("Add")')

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
> 27  |     await page.click('button:has-text("Add"), button:has-text("New"), a:has-text("Add")');
      |                ^ TimeoutError: page.click: Timeout 15000ms exceeded.
  28  | 
  29  |     // Wait for form to load
  30  |     await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
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
```
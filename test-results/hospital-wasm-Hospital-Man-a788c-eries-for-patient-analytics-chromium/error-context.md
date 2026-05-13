# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm.spec.ts >> Hospital Management System - WASM Architecture >> 3. Save queries for patient analytics
- Location: e2e/hospital-wasm.spec.ts:135:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.monaco-editor, [contenteditable="true"], textarea, .CodeMirror')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.monaco-editor, [contenteditable="true"], textarea, .CodeMirror')

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
  131 |     // Check pagination controls
  132 |     await expect(page.locator('button:has-text("Next"), text=Next, .pagination')).toBeVisible();
  133 |   });
  134 | 
  135 |   test('3. Save queries for patient analytics', async ({ page }) => {
  136 |     await page.goto(`${BASE_URL}/sql-editor`);
  137 | 
  138 |     // Wait for SQL editor to load
> 139 |     await expect(page.locator('.monaco-editor, [contenteditable="true"], textarea, .CodeMirror')).toBeVisible();
      |                                                                                                   ^ Error: expect(locator).toBeVisible() failed
  140 | 
  141 |     // Enter patient demographics query
  142 |     const query = `SELECT
  143 |       gender,
  144 |       blood_group,
  145 |       COUNT(*) as patient_count,
  146 |       ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth))), 2) as avg_age
  147 |     FROM bus_patient
  148 |     GROUP BY gender, blood_group
  149 |     ORDER BY patient_count DESC`;
  150 | 
  151 |     await page.locator('.monaco-editor textarea, .CodeMirror-code textarea, [contenteditable="true"]').first().fill(query);
  152 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  153 | 
  154 |     // Wait for results
  155 |     await expect(page.locator('table, .results')).toBeVisible({ timeout: 15000 });
  156 | 
  157 |     // Save the query
  158 |     await page.click('button:has-text("Save Query"), button:has-text("Save")');
  159 | 
  160 |     // Fill in save query form
  161 |     await expect(page.locator('input[name="name"], input[placeholder*="name"]')).toBeVisible();
  162 |     await page.fill('input[name="name"], input[placeholder*="name"]', 'Patient Demographics Summary');
  163 |     await page.fill('textarea[name="description"], textarea[placeholder*="description"]', 'Gender and blood group distribution of 100K patients');
  164 | 
  165 |     // Submit the form
  166 |     await page.click('button:has-text("Save"), button:has-text("Create")');
  167 | 
  168 |     // Verify query was saved
  169 |     await expect(page.locator('text=Query saved, text=successfully')).toBeVisible({ timeout: 5000 });
  170 |   });
  171 | 
  172 |   test('4. Create patient demographics report', async ({ page }) => {
  173 |     await page.goto(`${BASE_URL}/reports`);
  174 | 
  175 |     // Click "Add New Report" or "Create Report" button
  176 |     await page.click('button:has-text("Add"), button:has-text("New"), button:has-text("Create")');
  177 | 
  178 |     // Wait for form to load
  179 |     await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
  180 | 
  181 |     // Fill in report details
  182 |     await page.fill('input[name="name"]', 'Patient Demographics Report');
  183 |     await page.fill('textarea[name="description"]', 'Comprehensive patient demographics analysis with 100K records');
  184 | 
  185 |     // Select or enter the query
  186 |     await page.click('select[name="queryId"], [role="combobox"]');
  187 |     await page.click('text=Patient Demographics, text=patient demographics');
  188 | 
  189 |     // Configure report settings
  190 |     await expect(page.locator('input[name="columns"], .column-selector')).toBeVisible();
  191 | 
  192 |     // Save the report
  193 |     await page.click('button:has-text("Save"), button:has-text("Create")');
  194 | 
  195 |     // Verify report was created
  196 |     await expect(page.locator('text=Patient Demographics Report')).toBeVisible();
  197 |   });
  198 | 
  199 |   test('5. Create age distribution chart', async ({ page }) => {
  200 |     await page.goto(`${BASE_URL}/charts`);
  201 | 
  202 |     // Click "Add New Chart" or "Create Chart" button
  203 |     await page.click('button:has-text("Add"), button:has-text("New"), button:has-text("Create")');
  204 | 
  205 |     // Wait for form to load
  206 |     await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
  207 | 
  208 |     // Fill in chart details
  209 |     await page.fill('input[name="name"]', 'Patient Age Distribution');
  210 |     await page.fill('textarea[name="description"]', 'Bar chart showing patient count by age group');
  211 | 
  212 |     // Select chart type - Bar chart
  213 |     await page.selectOption('select[name="chartType"]', 'bar');
  214 | 
  215 |     // Enter the age distribution query
  216 |     const query = `SELECT
  217 |       CASE
  218 |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 18 THEN 'Under 18'
  219 |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 40 THEN '18-39'
  220 |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 60 THEN '40-59'
  221 |         ELSE '60+'
  222 |       END as age_group,
  223 |       COUNT(*) as patient_count
  224 |     FROM bus_patient
  225 |     GROUP BY age_group
  226 |     ORDER BY age_group`;
  227 | 
  228 |     await page.locator('textarea[name="query"], .monaco-editor textarea').fill(query);
  229 | 
  230 |     // Configure chart axes
  231 |     await page.fill('input[name="xAxisField"]', 'age_group');
  232 |     await page.fill('input[name="yAxisField"]', 'patient_count');
  233 | 
  234 |     // Set chart title
  235 |     await page.fill('input[name="title"]', 'Patient Age Distribution');
  236 | 
  237 |     // Save the chart
  238 |     await page.click('button:has-text("Save"), button:has-text("Create")');
  239 | 
```
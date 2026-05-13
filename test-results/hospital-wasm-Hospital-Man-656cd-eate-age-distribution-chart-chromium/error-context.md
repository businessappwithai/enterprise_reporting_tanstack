# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm.spec.ts >> Hospital Management System - WASM Architecture >> 5. Create age distribution chart
- Location: e2e/hospital-wasm.spec.ts:199:3

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
- generic:
  - generic:
    - complementary:
      - generic:
        - link:
          - /url: /
          - img
          - generic: Enterprise Reports
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - heading [level=2]: Main
                - navigation:
                  - link:
                    - /url: /
                    - button:
                      - img
                      - generic: Dashboard
                  - link:
                    - /url: /sql-editor
                    - button:
                      - img
                      - generic: SQL Editor
                  - link:
                    - /url: /queries
                    - button:
                      - img
                      - generic: Saved Queries
                  - link:
                    - /url: /reports
                    - button:
                      - img
                      - generic: Reports
                  - link:
                    - /url: /charts
                    - button:
                      - img
                      - generic: Charts
                  - link:
                    - /url: /dashboards
                    - button:
                      - img
                      - generic: Dashboards
                  - link:
                    - /url: /filters
                    - button:
                      - img
                      - generic: Filters
                  - link:
                    - /url: /jobs
                    - button:
                      - img
                      - generic: Jobs
                  - link:
                    - /url: /nl-query
                    - button:
                      - img
                      - generic: NL Query
              - generic:
                - heading [level=2]: Administration
                - navigation:
                  - link:
                    - /url: /data-sources
                    - button:
                      - img
                      - generic: Data Sources
                  - link:
                    - /url: /bull-board
                    - button:
                      - img
                      - generic: Queue Management
                  - link:
                    - /url: /admin/users
                    - button:
                      - img
                      - generic: Users
                  - link:
                    - /url: /admin/roles
                    - button:
                      - img
                      - generic: Roles
                  - link:
                    - /url: /admin/permissions
                    - button:
                      - img
                      - generic: Permissions
                  - link:
                    - /url: /settings
                    - button:
                      - img
                      - generic: Settings
      - button:
        - img
    - generic:
      - banner:
        - generic:
          - button:
            - img
            - generic: Sakila Demo DB
            - generic: sqlite3
        - generic:
          - button:
            - img
            - generic: Toggle theme
          - button:
            - img
            - generic: Notifications
          - button:
            - generic:
              - generic: SA
      - main:
        - generic:
          - generic:
            - generic:
              - heading [level=1]: Charts
              - paragraph: Create and manage data visualizations
            - generic:
              - link:
                - /url: /charts/editor/new
                - button:
                  - img
                  - text: Open Chart Editor
              - button [expanded]:
                - img
                - text: Quick Create
          - generic:
            - generic:
              - heading [level=3]:
                - img
                - text: All Charts
            - generic:
              - generic:
                - table:
                  - rowgroup:
                    - row:
                      - columnheader: Name
                      - columnheader: Type
                      - columnheader: Query
                      - columnheader: Created
                      - columnheader: Actions
                  - rowgroup:
                    - row:
                      - cell: Top Products Bar Chart
                      - cell:
                        - generic:
                          - img
                          - text: bar
                      - cell:
                        - generic: No Query
                      - cell: May 13, 2026, 05:51 PM
                      - cell:
                        - button:
                          - img
                    - row:
                      - cell: Regional Comparison
                      - cell:
                        - generic:
                          - img
                          - text: bar
                      - cell:
                        - generic: No Query
                      - cell: May 13, 2026, 05:51 PM
                      - cell:
                        - button:
                          - img
                    - row:
                      - cell: Regional Sales Distribution
                      - cell:
                        - generic:
                          - img
                          - text: pie
                      - cell:
                        - generic: No Query
                      - cell: May 13, 2026, 05:51 PM
                      - cell:
                        - button:
                          - img
                    - row:
                      - cell: Sales Trend
                      - cell:
                        - generic:
                          - img
                          - text: line
                      - cell:
                        - generic: No Query
                      - cell: May 13, 2026, 05:51 PM
                      - cell:
                        - button:
                          - img
  - region "Notifications alt+T"
  - dialog "Create Chart" [ref=e2]:
    - generic [ref=e3]:
      - heading "Create Chart" [level=2] [ref=e4]
      - paragraph [ref=e5]: Create a new chart visualization from a saved query.
    - generic [ref=e6]:
      - generic [ref=e7]:
        - text: Name
        - textbox "Name" [active] [ref=e8]:
          - /placeholder: My Chart
      - generic [ref=e9]:
        - text: Chart Type
        - combobox [ref=e10] [cursor=pointer]:
          - generic: Bar Chart
          - img [ref=e11]
      - generic [ref=e13]:
        - text: Data Source Query
        - combobox [ref=e14] [cursor=pointer]:
          - generic: Select a query
          - img [ref=e15]
    - generic [ref=e17]:
      - button "Cancel" [ref=e18] [cursor=pointer]
      - button "Create Chart" [disabled]
    - button "Close" [ref=e19] [cursor=pointer]:
      - img [ref=e20]
      - generic [ref=e23]: Close
```

# Test source

```ts
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
  139 |     await expect(page.locator('.monaco-editor, [contenteditable="true"], textarea, .CodeMirror')).toBeVisible();
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
> 206 |     await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
      |                                                      ^ Error: expect(locator).toBeVisible() failed
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
  240 |     // Verify chart was created
  241 |     await expect(page.locator('text=Patient Age Distribution')).toBeVisible();
  242 |   });
  243 | 
  244 |   test('6. Create patient analytics dashboard', async ({ page }) => {
  245 |     await page.goto(`${BASE_URL}/dashboards`);
  246 | 
  247 |     // Click "Add New Dashboard" or "Create Dashboard" button
  248 |     await page.click('button:has-text("Add"), button:has-text("New"), button:has-text("Create")');
  249 | 
  250 |     // Wait for form to load
  251 |     await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
  252 | 
  253 |     // Fill in dashboard details
  254 |     await page.fill('input[name="name"]', 'Patient Analytics Dashboard');
  255 |     await page.fill('textarea[name="description"]', 'Real-time patient analytics with WASM-powered visualizations');
  256 | 
  257 |     // Save the dashboard
  258 |     await page.click('button:has-text("Save"), button:has-text("Create")');
  259 | 
  260 |     // Verify dashboard was created and navigate to it
  261 |     await expect(page.locator('text=Patient Analytics Dashboard')).toBeVisible();
  262 |   });
  263 | 
  264 |   test('7. Performance test - Large dataset query execution time', async ({ page }) => {
  265 |     await page.goto(`${BASE_URL}/sql-editor`);
  266 | 
  267 |     // Wait for SQL editor to load
  268 |     await expect(page.locator('.monaco-editor, [contenteditable="true"], textarea, .CodeMirror')).toBeVisible();
  269 | 
  270 |     // Execute multiple queries and measure performance
  271 |     const queries = [
  272 |       {
  273 |         name: 'Count Query',
  274 |         sql: 'SELECT COUNT(*) as count FROM bus_patient',
  275 |       },
  276 |       {
  277 |         name: 'Aggregation Query',
  278 |         sql: `SELECT gender, blood_group, COUNT(*) as count
  279 |               FROM bus_patient
  280 |               GROUP BY gender, blood_group`,
  281 |       },
  282 |       {
  283 |         name: 'Large Result Set (1000 rows)',
  284 |         sql: `SELECT * FROM bus_patient ORDER BY id LIMIT 1000`,
  285 |       },
  286 |     ];
  287 | 
  288 |     for (const queryTest of queries) {
  289 |       const startTime = Date.now();
  290 | 
  291 |       await page.locator('.monaco-editor textarea, .CodeMirror-code textarea, [contenteditable="true"]').first().fill(queryTest.sql);
  292 |       await page.click('button:has-text("Execute"), button:has-text("Run")');
  293 | 
  294 |       // Wait for results
  295 |       await expect(page.locator('table, .results, .data-grid')).toBeVisible({ timeout: 20000 });
  296 | 
  297 |       const executionTime = Date.now() - startTime;
  298 |       console.log(`${queryTest.name}: ${executionTime}ms`);
  299 | 
  300 |       // Verify query completed successfully
  301 |       await expect(page.locator('table, .results')).toBeVisible();
  302 |     }
  303 |   });
  304 | 
  305 |   test('8. WASM feature flags verification', async ({ page }) => {
  306 |     // Navigate to datasets page to verify WASM is enabled
```
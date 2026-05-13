# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm.spec.ts >> Hospital Management System - WASM Architecture >> 7. Performance test - Large dataset query execution time
- Location: e2e/hospital-wasm.spec.ts:264:3

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
> 268 |     await expect(page.locator('.monaco-editor, [contenteditable="true"], textarea, .CodeMirror')).toBeVisible();
      |                                                                                                   ^ Error: expect(locator).toBeVisible() failed
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
  307 |     await page.goto(`${BASE_URL}/datasets`);
  308 | 
  309 |     // Check if WASM features are indicated on the page
  310 |     const wasmLocator = page.locator('text=WASM, text=DuckDB, text=Datasets');
  311 |     const datasetLocator = page.locator('h1:has-text("Dataset")');
  312 |     const isVisible = await wasmLocator.isVisible().catch(() => false) || await datasetLocator.isVisible().catch(() => false);
  313 |     expect(isVisible).toBeTruthy();
  314 | 
  315 |     // Check for DuckDB status indicator
  316 |     const duckdbStatus = page.locator('text=DuckDB, text=ready, text=initialized');
  317 |     if (await duckdbStatus.count() > 0) {
  318 |       console.log('DuckDB-Wasm is initialized and ready');
  319 |     }
  320 |   });
  321 | 
  322 |   test('9. End-to-end workflow - Complete patient analytics', async ({ page }) => {
  323 |     // This test covers the complete workflow:
  324 |     // 1. Navigate to SQL Editor
  325 |     await page.goto(`${BASE_URL}/sql-editor`);
  326 |     await expect(page.locator('.monaco-editor, [contenteditable="true"], textarea')).toBeVisible();
  327 | 
  328 |     // 2. Execute patient count query
  329 |     await page.locator('.monaco-editor textarea, [contenteditable="true"]').first().fill('SELECT COUNT(*) FROM bus_patient');
  330 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  331 |     await expect(page.locator('text=100000, table, .results')).toBeVisible({ timeout: 15000 });
  332 | 
  333 |     // 3. Navigate to reports
  334 |     await page.goto(`${BASE_URL}/reports`);
  335 |     await expect(page.locator('h1:has-text("Report"), text=Reports, h1')).first().toBeVisible();
  336 | 
  337 |     // 4. Navigate to charts
  338 |     await page.goto(`${BASE_URL}/charts`);
  339 |     await expect(page.locator('text=Chart, text=Charts, h1').first()).toBeVisible();
  340 | 
  341 |     // 5. Navigate to dashboards
  342 |     await page.goto(`${BASE_URL}/dashboards`);
  343 |     await expect(page.locator('text=Dashboard, text=Dashboards, h1').first()).toBeVisible();
  344 | 
  345 |     // 6. Verify no console errors related to WASM
  346 |     const logs = await page.evaluate(() => {
  347 |       return (window as any).consoleLogs || [];
  348 |     });
  349 |     console.log('Console logs:', logs);
  350 |   });
  351 | });
  352 | 
  353 | test.describe('Hospital Management - Data Source Connection', () => {
  354 |   test('Connect to local PostgreSQL hospital database', async ({ page }) => {
  355 |     await login(page);
  356 |     await page.goto(`${BASE_URL}/data-sources`);
  357 | 
  358 |     // Verify we can add a new data source
  359 |     await expect(page.locator('button:has-text("Add"), button:has-text("New")')).toBeVisible();
  360 | 
  361 |     // Click add data source
  362 |     await page.click('button:has-text("Add"), button:has-text("New")');
  363 | 
  364 |     // Fill connection details for local PostgreSQL
  365 |     await page.fill('input[name="name"]', 'Local Hospital DB');
  366 |     await page.selectOption('select[name="clientType"]', 'pg');
  367 |     await page.fill('input[name="host"]', 'localhost');
  368 |     await page.fill('input[name="port"]', '5432');
```
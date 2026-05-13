# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm.spec.ts >> Hospital Management System - WASM Architecture >> 9. End-to-end workflow - Complete patient analytics
- Location: e2e/hospital-wasm.spec.ts:322:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.monaco-editor, [contenteditable="true"], textarea')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.monaco-editor, [contenteditable="true"], textarea')

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
> 326 |     await expect(page.locator('.monaco-editor, [contenteditable="true"], textarea')).toBeVisible();
      |                                                                                      ^ Error: expect(locator).toBeVisible() failed
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
  369 |     await page.fill('input[name="database"]', 'hospital_management_system');
  370 |     await page.fill('input[name="user"]', 'postgres');
  371 | 
  372 |     // Test connection
  373 |     await page.click('button:has-text("Test Connection")');
  374 | 
  375 |     // Should show success or connection result
  376 |     await expect(page.locator('text=Connection, text=success, text=failed, .toast, .notification')).first().toBeVisible({ timeout: 10000 });
  377 |   });
  378 | });
  379 | 
```
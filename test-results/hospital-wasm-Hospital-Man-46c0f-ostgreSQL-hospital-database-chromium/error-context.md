# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm.spec.ts >> Hospital Management - Data Source Connection >> Connect to local PostgreSQL hospital database
- Location: e2e/hospital-wasm.spec.ts:354:3

# Error details

```
TimeoutError: page.fill: Timeout 15000ms exceeded.
Call log:
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
              - heading [level=1]: Data Sources
              - paragraph: Manage database connections for reports and queries
            - button [expanded]:
              - img
              - text: New Data Source
          - generic:
            - generic:
              - heading [level=3]:
                - img
                - text: All Data Sources
            - generic:
              - generic: No data sources configured. Add your first data source to get started.
  - region "Notifications alt+T"
  - dialog "Add Data Source" [ref=e2]:
    - generic [ref=e3]:
      - heading "Add Data Source" [level=2] [ref=e4]
      - paragraph [ref=e5]: Configure a new database connection for your reports.
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]:
          - text: Name
          - textbox "Name" [active] [ref=e9]:
            - /placeholder: Production Database
        - generic [ref=e10]:
          - text: Database Type
          - combobox "Database Type" [ref=e11] [cursor=pointer]:
            - generic: PostgreSQL
            - img [ref=e12]
      - generic [ref=e14]:
        - text: Description
        - textbox "Description" [ref=e15]:
          - /placeholder: Optional description
      - generic [ref=e16]:
        - generic [ref=e17]:
          - text: Host
          - textbox "Host" [ref=e18]:
            - /placeholder: localhost
        - generic [ref=e19]:
          - text: Port
          - textbox "Port" [ref=e20]:
            - /placeholder: "5432"
      - generic [ref=e21]:
        - text: Database
        - textbox "Database" [ref=e22]:
          - /placeholder: mydb
      - generic [ref=e23]:
        - generic [ref=e24]:
          - text: Username
          - textbox "Username" [ref=e25]:
            - /placeholder: dbuser
        - generic [ref=e26]:
          - text: Password
          - textbox "Password" [ref=e27]:
            - /placeholder: "********"
    - generic [ref=e29]:
      - button "Test Connection" [disabled]
      - button "Create" [disabled]
    - button "Close" [ref=e30] [cursor=pointer]:
      - img [ref=e31]
      - generic [ref=e34]: Close
```

# Test source

```ts
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
> 365 |     await page.fill('input[name="name"]', 'Local Hospital DB');
      |                ^ TimeoutError: page.fill: Timeout 15000ms exceeded.
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
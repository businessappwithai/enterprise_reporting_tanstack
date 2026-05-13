# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm.spec.ts >> Hospital Management System - WASM Architecture >> 6. Create patient analytics dashboard
- Location: e2e/hospital-wasm.spec.ts:244:3

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")')

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
  240 |     // Verify chart was created
  241 |     await expect(page.locator('text=Patient Age Distribution')).toBeVisible();
  242 |   });
  243 | 
  244 |   test('6. Create patient analytics dashboard', async ({ page }) => {
  245 |     await page.goto(`${BASE_URL}/dashboards`);
  246 | 
  247 |     // Click "Add New Dashboard" or "Create Dashboard" button
> 248 |     await page.click('button:has-text("Add"), button:has-text("New"), button:has-text("Create")');
      |                ^ TimeoutError: page.click: Timeout 15000ms exceeded.
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
```
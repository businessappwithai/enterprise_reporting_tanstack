# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Enterprise Reporting System - Comprehensive Suite >> 6. SQL Editor - Massive JOIN query (20K records)
- Location: e2e/comprehensive-suite.spec.ts:302:3

# Error details

```
TimeoutError: locator.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.monaco-editor, [contenteditable="true"], textarea').first()

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
  207 |     ORDER BY o.order_date DESC, o.order_id
  208 |     LIMIT 20000
  209 |   `
  210 | };
  211 | 
  212 | test.describe('Enterprise Reporting System - Comprehensive Suite', () => {
  213 |   test.beforeEach(async ({ page }) => {
  214 |     await login(page);
  215 |   });
  216 | 
  217 |   test('1. Dashboard loads and displays key metrics', async ({ page }) => {
  218 |     await page.goto(`${BASE_URL}/`);
  219 | 
  220 |     // Wait for dashboard to load
  221 |     await expect(page.locator('h1')).toContainText('Dashboard');
  222 | 
  223 |     // Check for stats cards
  224 |     await expect(page.locator('text=Total Reports')).toBeVisible();
  225 |     await expect(page.locator('text=Active Charts')).toBeVisible();
  226 |     await expect(page.locator('text=Dashboards')).toBeVisible();
  227 |     await expect(page.locator('text=Scheduled Jobs')).toBeVisible();
  228 | 
  229 |     // Check for quick actions
  230 |     await expect(page.locator('text=Quick Actions')).toBeVisible();
  231 |     await expect(page.locator('text=SQL Editor')).toBeVisible();
  232 |     await expect(page.locator('text=Reports')).toBeVisible();
  233 |     await expect(page.locator('text=Charts')).toBeVisible();
  234 |     await expect(page.locator('text=Dashboards')).toBeVisible();
  235 |   });
  236 | 
  237 |   test('2. SQL Editor - Execute simple query', async ({ page }) => {
  238 |     await page.goto(`${BASE_URL}/sql-editor`);
  239 | 
  240 |     // Wait for SQL editor to load
  241 |     await expect(page.locator('text=SQL Editor')).toBeVisible();
  242 | 
  243 |     // Type a simple query
  244 |     await page.fill('[contenteditable="true"]', 'SELECT * FROM customers LIMIT 10');
  245 | 
  246 |     // Click execute button
  247 |     await page.click('button:has-text("Execute")');
  248 | 
  249 |     // Wait for results
  250 |     await expect(page.locator('text=customer_id')).toBeVisible({ timeout: 10000 });
  251 |   });
  252 | 
  253 |   test('3. SQL Editor - Complex JOIN query with aggregations', async ({ page }) => {
  254 |     await page.goto(`${BASE_URL}/sql-editor`);
  255 | 
  256 |     // Execute complex customer order summary query
  257 |     const query = COMPLEX_QUERIES.customerOrderSummary;
  258 | 
  259 |     // Find and fill the editor
  260 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  261 |     await editor.fill(query);
  262 | 
  263 |     // Execute query
  264 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  265 | 
  266 |     // Verify results loaded
  267 |     await expect(page.locator('text=customer_id').or(page.locator('text=name')).or(page.locator('table'))).toBeVisible({ timeout: 15000 });
  268 | 
  269 |     // Check for data in results
  270 |     const table = page.locator('table, [role="table"]').first();
  271 |     if (await table.isVisible()) {
  272 |       const rows = await table.locator('tr').count();
  273 |       expect(rows).toBeGreaterThan(1); // At least header + data rows
  274 |     }
  275 |   });
  276 | 
  277 |   test('4. SQL Editor - Product performance with subquery', async ({ page }) => {
  278 |     await page.goto(`${BASE_URL}/sql-editor`);
  279 | 
  280 |     const query = COMPLEX_QUERIES.topProductsByRevenue;
  281 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  282 |     await editor.fill(query);
  283 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  284 | 
  285 |     // Verify results
  286 |     await expect(page.locator('text=product_id').or(page.locator('table')).or(page.locator('text=total_revenue'))).toBeVisible({ timeout: 15000 });
  287 |   });
  288 | 
  289 |   test('5. SQL Editor - Large dataset query (load test)', async ({ page }) => {
  290 |     await page.goto(`${BASE_URL}/sql-editor`);
  291 | 
  292 |     // Execute query that returns 10,000+ records
  293 |     const query = COMPLEX_QUERIES.allOrdersWithCustomerInfo;
  294 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  295 |     await editor.fill(query);
  296 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  297 | 
  298 |     // Verify results load within reasonable time
  299 |     await expect(page.locator('table, [role="table"], text=order_id')).toBeVisible({ timeout: 30000 });
  300 |   });
  301 | 
  302 |   test('6. SQL Editor - Massive JOIN query (20K records)', async ({ page }) => {
  303 |     await page.goto(`${BASE_URL}/sql-editor`);
  304 | 
  305 |     const query = COMPLEX_QUERIES.massiveDataJoin;
  306 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
> 307 |     await editor.fill(query);
      |                  ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
  308 | 
  309 |     // Record start time
  310 |     const startTime = Date.now();
  311 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  312 | 
  313 |     // Verify results load
  314 |     await expect(page.locator('table, [role="table"], text=order_date')).toBeVisible({ timeout: 45000 });
  315 | 
  316 |     const executionTime = Date.now() - startTime;
  317 |     console.log(`Massive JOIN query executed in ${executionTime}ms`);
  318 | 
  319 |     // Query should complete within 45 seconds
  320 |     expect(executionTime).toBeLessThan(45000);
  321 |   });
  322 | 
  323 |   test('7. Create and save a new query', async ({ page }) => {
  324 |     await page.goto(`${BASE_URL}/sql-editor`);
  325 | 
  326 |     // Enter query
  327 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  328 |     await editor.fill('SELECT COUNT(*) as total_customers FROM customers');
  329 | 
  330 |     // Execute
  331 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  332 |     await expect(page.locator('table, text=total_customers')).toBeVisible({ timeout: 10000 });
  333 | 
  334 |     // Save query
  335 |     await page.click('button:has-text("Save"), button[aria-label*="save"]');
  336 | 
  337 |     // Fill in save dialog
  338 |     await page.fill('input[name="name"], input[placeholder*="name"]', 'Customer Count Query');
  339 |     await page.fill('textarea[name="description"], textarea[placeholder*="description"]', 'Returns total customer count');
  340 | 
  341 |     // Submit
  342 |     await page.click('button:has-text("Save"), button[type="submit"]');
  343 | 
  344 |     // Verify success message
  345 |     await expect(page.locator('text=successfully saved, text=saved').or(page.locator('.toast'))).toBeVisible({ timeout: 5000 });
  346 |   });
  347 | 
  348 |   test('8. View saved queries', async ({ page }) => {
  349 |     await page.goto(`${BASE_URL}/queries`);
  350 | 
  351 |     // Check for saved queries section
  352 |     await expect(page.locator('text=Saved Queries').or(page.locator('h1:has-text("Query")'))).toBeVisible();
  353 |   });
  354 | 
  355 |   test('9. Create a new report from query results', async ({ page }) => {
  356 |     await page.goto(`${BASE_URL}/sql-editor`);
  357 | 
  358 |     // Enter and execute query
  359 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  360 |     await editor.fill('SELECT country, COUNT(*) as customer_count FROM customers GROUP BY country ORDER BY customer_count DESC');
  361 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  362 | 
  363 |     // Wait for results
  364 |     await expect(page.locator('table, text=country')).toBeVisible({ timeout: 10000 });
  365 | 
  366 |     // Click create report button
  367 |     const createReportBtn = page.locator('button:has-text("Create Report"), button:has-text("Save as Report")').first();
  368 |     if (await createReportBtn.isVisible()) {
  369 |       await createReportBtn.click();
  370 | 
  371 |       // Fill report details
  372 |       await page.fill('input[name="name"]', 'Customers by Country Report');
  373 |       await page.fill('textarea[name="description"]', 'Distribution of customers by country');
  374 | 
  375 |       // Save
  376 |       await page.click('button[type="submit"], button:has-text("Save")');
  377 | 
  378 |       // Verify success
  379 |       await expect(page.locator('text=successfully created, text=Report created')).toBeVisible({ timeout: 5000 });
  380 |     }
  381 |   });
  382 | 
  383 |   test('10. Navigate to reports page', async ({ page }) => {
  384 |     await page.goto(`${BASE_URL}/reports`);
  385 | 
  386 |     // Check reports page loads
  387 |     await expect(page.locator('text=Reports').or(page.locator('h1'))).toBeVisible();
  388 |   });
  389 | 
  390 |   test('11. Create a new chart', async ({ page }) => {
  391 |     await page.goto(`${BASE_URL}/charts`);
  392 | 
  393 |     // Click new chart button
  394 |     await page.click('button:has-text("New Chart"), button:has-text("Create")');
  395 | 
  396 |     // Fill chart details
  397 |     await page.fill('input[name="name"]', 'Sales by Country Chart');
  398 |     await page.selectOption('select[name="chartType"]', 'bar');
  399 | 
  400 |     // Save
  401 |     await page.click('button:has-text("Save"), button[type="submit"]');
  402 | 
  403 |     // Verify chart created
  404 |     await expect(page.locator('text=Chart created').or(page.locator('text=successfully saved'))).toBeVisible({ timeout: 5000 });
  405 |   });
  406 | 
  407 |   test('12. Navigate to dashboards', async ({ page }) => {
```
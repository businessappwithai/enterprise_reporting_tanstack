# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Enterprise Reporting System - Comprehensive Suite >> 7. Create and save a new query
- Location: e2e/comprehensive-suite.spec.ts:323:3

# Error details

```
TimeoutError: locator.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.monaco-editor, [contenteditable="true"], textarea').first()

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
  307 |     await editor.fill(query);
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
> 328 |     await editor.fill('SELECT COUNT(*) as total_customers FROM customers');
      |                  ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
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
  408 |     await page.goto(`${BASE_URL}/dashboards`);
  409 | 
  410 |     // Check dashboards page
  411 |     await expect(page.locator('text=Dashboards').or(page.locator('h1:has-text("Dashboard")'))).toBeVisible();
  412 |   });
  413 | 
  414 |   test('13. Create a new dashboard', async ({ page }) => {
  415 |     await page.goto(`${BASE_URL}/dashboards`);
  416 | 
  417 |     // Click new dashboard
  418 |     await page.click('button:has-text("New Dashboard"), button:has-text("Create")');
  419 | 
  420 |     // Fill details
  421 |     await page.fill('input[name="name"]', 'Executive Dashboard');
  422 | 
  423 |     // Save
  424 |     await page.click('button:has-text("Save"), button[type="submit"]');
  425 | 
  426 |     // Verify
  427 |     await expect(page.locator('text=Dashboard created').or(page.locator('text=successfully created'))).toBeVisible({ timeout: 5000 });
  428 |   });
```
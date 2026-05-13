# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Enterprise Reporting System - Comprehensive Suite >> 11. Create a new chart
- Location: e2e/comprehensive-suite.spec.ts:390:3

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("New Chart"), button:has-text("Create")')

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
> 394 |     await page.click('button:has-text("New Chart"), button:has-text("Create")');
      |                ^ TimeoutError: page.click: Timeout 15000ms exceeded.
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
  429 | 
  430 |   test('14. Data sources management', async ({ page }) => {
  431 |     await page.goto(`${BASE_URL}/data-sources`);
  432 | 
  433 |     // Check data sources page
  434 |     await expect(page.locator('text=Data Sources').or(page.locator('h1'))).toBeVisible();
  435 |   });
  436 | 
  437 |   test('15. Add a new data source (test connection)', async ({ page }) => {
  438 |     await page.goto(`${BASE_URL}/data-sources`);
  439 | 
  440 |     // Click add new
  441 |     await page.click('button:has-text("Add Data Source"), button:has-text("New")');
  442 | 
  443 |     // Fill form
  444 |     await page.fill('input[name="name"]', 'Test SQLite Database');
  445 |     await page.selectOption('select[name="client_type"]', 'sqlite');
  446 | 
  447 |     // Enter database path
  448 |     await page.fill('input[name="path"], input[placeholder*="path"]', './database/test_large_dataset.db');
  449 | 
  450 |     // Test connection
  451 |     await page.click('button:has-text("Test Connection")');
  452 | 
  453 |     // Wait for connection result (may fail if DB doesn't exist, that's OK)
  454 |     await page.waitForTimeout(2000);
  455 |   });
  456 | 
  457 |   test('16. Jobs management page', async ({ page }) => {
  458 |     await page.goto(`${BASE_URL}/jobs`);
  459 | 
  460 |     // Check jobs page
  461 |     await expect(page.locator('text=Jobs').or(page.locator('h1'))).toBeVisible();
  462 |   });
  463 | 
  464 |   test('17. Create a scheduled job', async ({ page }) => {
  465 |     await page.goto(`${BASE_URL}/jobs`);
  466 | 
  467 |     // Click new job
  468 |     await page.click('button:has-text("New Job"), button:has-text("Create")');
  469 | 
  470 |     // Fill job details
  471 |     await page.fill('input[name="name"]', 'Daily Sales Report');
  472 |     await page.fill('textarea[name="description"]', 'Generates daily sales summary');
  473 | 
  474 |     // Save
  475 |     await page.click('button:has-text("Save"), button[type="submit"]');
  476 | 
  477 |     // Verify
  478 |     await expect(page.locator('text=Job created').or(page.locator('text=successfully'))).toBeVisible({ timeout: 5000 });
  479 |   });
  480 | 
  481 |   test('18. Filters management', async ({ page }) => {
  482 |     await page.goto(`${BASE_URL}/filters`);
  483 | 
  484 |     // Check filters page
  485 |     await expect(page.locator('text=Filters').or(page.locator('h1'))).toBeVisible();
  486 |   });
  487 | 
  488 |   test('19. User management (admin)', async ({ page }) => {
  489 |     await page.goto(`${BASE_URL}/admin/users`);
  490 | 
  491 |     // Check users page
  492 |     await expect(page.locator('text=Users').or(page.locator('h1'))).toBeVisible();
  493 |   });
  494 | 
```
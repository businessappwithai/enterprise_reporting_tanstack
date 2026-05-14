# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Enterprise Reporting System - Comprehensive Suite >> 12. Navigate to dashboards
- Location: e2e/comprehensive-suite.spec.ts:407:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Dashboards').or(locator('h1:has-text("Dashboard")'))
Expected: visible
Error: strict mode violation: locator('text=Dashboards').or(locator('h1:has-text("Dashboard")')) resolved to 5 elements:
    1) <span>Dashboards</span> aka getByRole('button', { name: 'Dashboards' })
    2) <h1 class="text-2xl font-bold">Dashboards</h1> aka getByRole('heading', { name: 'Dashboards', exact: true })
    3) <p class="text-muted-foreground">Create and manage interactive dashboards</p> aka getByText('Create and manage interactive')
    4) <h3 class="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">…</h3> aka getByRole('heading', { name: 'All Dashboards' })
    5) <div class="text-center py-8 text-muted-foreground">Loading dashboards...</div> aka getByText('Loading dashboards...')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Dashboards').or(locator('h1:has-text("Dashboard")'))

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
              - heading "Dashboards" [level=1] [ref=e143]
              - paragraph [ref=e144]: Create and manage interactive dashboards
            - button "New Dashboard" [ref=e145] [cursor=pointer]:
              - img [ref=e146]
              - text: New Dashboard
          - generic [ref=e147]:
            - heading "All Dashboards" [level=3] [ref=e149]:
              - img [ref=e150]
              - text: All Dashboards
            - table [ref=e157]:
              - rowgroup [ref=e158]:
                - row "Name Description Visibility Created Modified Actions" [ref=e159]:
                  - columnheader "Name" [ref=e160]
                  - columnheader "Description" [ref=e161]
                  - columnheader "Visibility" [ref=e162]
                  - columnheader "Created" [ref=e163]
                  - columnheader "Modified" [ref=e164]
                  - columnheader "Actions" [ref=e165]
              - rowgroup [ref=e166]:
                - row "Executive Dashboard High-level business metrics Private May 13, 2026, 05:51 PM May 13, 2026, 05:51 PM" [ref=e167]:
                  - cell "Executive Dashboard" [ref=e168]
                  - cell "High-level business metrics" [ref=e169]
                  - cell "Private" [ref=e170]:
                    - generic [ref=e171]:
                      - img [ref=e172]
                      - text: Private
                  - cell "May 13, 2026, 05:51 PM" [ref=e175]
                  - cell "May 13, 2026, 05:51 PM" [ref=e176]
                  - cell [ref=e177]:
                    - button [ref=e178] [cursor=pointer]:
                      - img [ref=e179]
                - row "Sales Dashboard Sales metrics and KPIs Private May 13, 2026, 05:51 PM May 13, 2026, 05:51 PM" [ref=e183]:
                  - cell "Sales Dashboard" [ref=e184]
                  - cell "Sales metrics and KPIs" [ref=e185]
                  - cell "Private" [ref=e186]:
                    - generic [ref=e187]:
                      - img [ref=e188]
                      - text: Private
                  - cell "May 13, 2026, 05:51 PM" [ref=e191]
                  - cell "May 13, 2026, 05:51 PM" [ref=e192]
                  - cell [ref=e193]:
                    - button [ref=e194] [cursor=pointer]:
                      - img [ref=e195]
                - row "Product Performance Product-level analytics Private May 13, 2026, 05:51 PM May 13, 2026, 05:51 PM" [ref=e199]:
                  - cell "Product Performance" [ref=e200]
                  - cell "Product-level analytics" [ref=e201]
                  - cell "Private" [ref=e202]:
                    - generic [ref=e203]:
                      - img [ref=e204]
                      - text: Private
                  - cell "May 13, 2026, 05:51 PM" [ref=e207]
                  - cell "May 13, 2026, 05:51 PM" [ref=e208]
                  - cell [ref=e209]:
                    - button [ref=e210] [cursor=pointer]:
                      - img [ref=e211]
  - region "Notifications alt+T"
```

# Test source

```ts
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
  408 |     await page.goto(`${BASE_URL}/dashboards`);
  409 | 
  410 |     // Check dashboards page
> 411 |     await expect(page.locator('text=Dashboards').or(page.locator('h1:has-text("Dashboard")'))).toBeVisible();
      |                                                                                                ^ Error: expect(locator).toBeVisible() failed
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
  495 |   test('20. Roles management', async ({ page }) => {
  496 |     await page.goto(`${BASE_URL}/admin/roles`);
  497 | 
  498 |     // Check roles page
  499 |     await expect(page.locator('text=Roles').or(page.locator('h1'))).toBeVisible();
  500 |   });
  501 | 
  502 |   test('21. Settings page', async ({ page }) => {
  503 |     await page.goto(`${BASE_URL}/settings`);
  504 | 
  505 |     // Check settings page
  506 |     await expect(page.locator('text=Settings').or(page.locator('h1'))).toBeVisible();
  507 |   });
  508 | 
  509 |   test('22. Theme toggle', async ({ page }) => {
  510 |     await page.goto(`${BASE_URL}/`);
  511 | 
```
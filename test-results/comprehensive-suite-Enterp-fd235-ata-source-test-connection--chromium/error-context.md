# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Enterprise Reporting System - Comprehensive Suite >> 15. Add a new data source (test connection)
- Location: e2e/comprehensive-suite.spec.ts:437:3

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
> 444 |     await page.fill('input[name="name"]', 'Test SQLite Database');
      |                ^ TimeoutError: page.fill: Timeout 15000ms exceeded.
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
  512 |     // Get initial theme
  513 |     const html = page.locator('html');
  514 |     const initialClass = await html.getAttribute('class');
  515 | 
  516 |     // Click theme toggle
  517 |     await page.click('button:has-text("Toggle theme"), button[aria-label*="theme"]');
  518 | 
  519 |     // Wait for theme change
  520 |     await page.waitForTimeout(500);
  521 |     const newClass = await html.getAttribute('class');
  522 | 
  523 |     // Theme should have changed
  524 |     expect(initialClass).not.toBe(newClass);
  525 |   });
  526 | 
  527 |   test('23. Notifications panel', async ({ page }) => {
  528 |     await page.goto(`${BASE_URL}/`);
  529 | 
  530 |     // Click notifications button
  531 |     await page.click('button:has-text("Notifications"), [aria-label*="notification"]');
  532 | 
  533 |     // Check notifications panel appears
  534 |     await expect(page.locator('[role="dialog"], .popover, text=Notifications').or(page.locator('text=No notifications'))).toBeVisible();
  535 |   });
  536 | 
  537 |   test('24. Sidebar navigation', async ({ page }) => {
  538 |     await page.goto(`${BASE_URL}/`);
  539 | 
  540 |     // Navigate through sidebar links
  541 |     const links = [
  542 |       { text: 'Dashboard', url: '/' },
  543 |       { text: 'SQL Editor', url: '/sql-editor' },
  544 |       { text: 'Reports', url: '/reports' },
```
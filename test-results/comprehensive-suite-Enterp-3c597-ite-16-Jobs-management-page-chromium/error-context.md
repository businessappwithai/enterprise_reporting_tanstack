# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Enterprise Reporting System - Comprehensive Suite >> 16. Jobs management page
- Location: e2e/comprehensive-suite.spec.ts:457:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Jobs').or(locator('h1'))
Expected: visible
Error: strict mode violation: locator('text=Jobs').or(locator('h1')) resolved to 3 elements:
    1) <span>Jobs</span> aka getByRole('button', { name: 'Jobs' })
    2) <h1 class="text-2xl font-bold">Background Jobs</h1> aka getByRole('heading', { name: 'Background Jobs' })
    3) <button role="tab" type="button" tabindex="-1" aria-selected="false" data-state="inactive" data-orientation="horizontal" data-radix-collection-item="" id="radix-_R_3d5j6_-trigger-scheduled" aria-controls="radix-_R_3d5j6_-content-scheduled" class="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-eve…>Scheduled Jobs</button> aka getByRole('tab', { name: 'Scheduled Jobs' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Jobs').or(locator('h1'))

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
        - generic [ref=e115]:
          - img [ref=e116]
          - generic [ref=e118]: Loading connection...
        - generic [ref=e119]:
          - button "Toggle theme" [ref=e120] [cursor=pointer]:
            - img [ref=e121]
            - img
            - generic [ref=e127]: Toggle theme
          - button "Notifications" [ref=e128] [cursor=pointer]:
            - img [ref=e129]
            - generic [ref=e132]: Notifications
          - button "SA" [ref=e133] [cursor=pointer]:
            - generic [ref=e135]: SA
      - main [ref=e136]:
        - generic [ref=e137]:
          - generic [ref=e138]:
            - generic [ref=e139]:
              - heading "Background Jobs" [level=1] [ref=e140]
              - paragraph [ref=e141]: Monitor and manage background job processing
            - button "Refresh" [ref=e142] [cursor=pointer]:
              - img [ref=e143]
              - text: Refresh
          - generic [ref=e148]:
            - generic [ref=e149]:
              - generic [ref=e150]:
                - heading "Waiting" [level=3] [ref=e151]
                - img [ref=e152]
              - generic [ref=e156]: "0"
            - generic [ref=e157]:
              - generic [ref=e158]:
                - heading "Active" [level=3] [ref=e159]
                - img [ref=e160]
              - generic [ref=e166]: "0"
            - generic [ref=e167]:
              - generic [ref=e168]:
                - heading "Completed" [level=3] [ref=e169]
                - img [ref=e170]
              - generic [ref=e174]: "0"
            - generic [ref=e175]:
              - generic [ref=e176]:
                - heading "Failed" [level=3] [ref=e177]
                - img [ref=e178]
              - generic [ref=e183]: "0"
            - generic [ref=e184]:
              - generic [ref=e185]:
                - heading "Delayed" [level=3] [ref=e186]
                - img [ref=e187]
              - generic [ref=e191]: "0"
          - generic [ref=e192]:
            - tablist [ref=e193]:
              - tab "Recent Executions" [selected] [ref=e194] [cursor=pointer]
              - tab "Scheduled Jobs" [ref=e195] [cursor=pointer]
            - tabpanel "Recent Executions" [ref=e196]:
              - generic [ref=e197]:
                - heading "Recent Job Executions" [level=3] [ref=e199]
                - generic [ref=e201]: Loading...
  - region "Notifications alt+T"
```

# Test source

```ts
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
> 461 |     await expect(page.locator('text=Jobs').or(page.locator('h1'))).toBeVisible();
      |                                                                    ^ Error: expect(locator).toBeVisible() failed
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
  545 |       { text: 'Charts', url: '/charts' },
  546 |       { text: 'Dashboards', url: '/dashboards' }
  547 |     ];
  548 | 
  549 |     for (const link of links) {
  550 |       await page.click(`a:has-text("${link.text}")`);
  551 |       await expect(page).toHaveURL(new RegExp(link.url));
  552 |       await page.waitForTimeout(500);
  553 |     }
  554 |   });
  555 | 
  556 |   test('25. Pagination test - large dataset', async ({ page }) => {
  557 |     await page.goto(`${BASE_URL}/sql-editor`);
  558 | 
  559 |     // Query that returns many records
  560 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  561 |     await editor.fill('SELECT * FROM orders LIMIT 1000');
```
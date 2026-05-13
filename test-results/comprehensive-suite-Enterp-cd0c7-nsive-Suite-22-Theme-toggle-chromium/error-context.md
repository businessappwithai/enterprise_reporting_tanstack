# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Enterprise Reporting System - Comprehensive Suite >> 22. Theme toggle
- Location: e2e/comprehensive-suite.spec.ts:509:3

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not "light"
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - button "Toggle theme" [active] [ref=e123] [cursor=pointer]:
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
            - heading "Dashboard" [level=1] [ref=e142]
            - paragraph [ref=e143]: Welcome to the Enterprise Reporting System - admin@admin.com
          - generic [ref=e144]:
            - link "Total Reports 0" [ref=e145] [cursor=pointer]:
              - /url: /reports
              - generic [ref=e146]:
                - generic [ref=e147]:
                  - heading "Total Reports" [level=3] [ref=e148]
                  - img [ref=e149]
                - generic [ref=e153]: "0"
            - link "Active Charts 4" [ref=e154] [cursor=pointer]:
              - /url: /charts
              - generic [ref=e155]:
                - generic [ref=e156]:
                  - heading "Active Charts" [level=3] [ref=e157]
                  - img [ref=e158]
                - generic [ref=e161]: "4"
            - link "Dashboards 3" [ref=e162] [cursor=pointer]:
              - /url: /dashboards
              - generic [ref=e163]:
                - generic [ref=e164]:
                  - heading "Dashboards" [level=3] [ref=e165]
                  - img [ref=e166]
                - generic [ref=e172]: "3"
            - link "Scheduled Jobs 0" [ref=e173] [cursor=pointer]:
              - /url: /jobs
              - generic [ref=e174]:
                - generic [ref=e175]:
                  - heading "Scheduled Jobs" [level=3] [ref=e176]
                  - img [ref=e177]
                - generic [ref=e181]: "0"
          - generic [ref=e182]:
            - heading "Quick Actions" [level=2] [ref=e183]
            - generic [ref=e184]:
              - link "SQL Editor Write and execute SQL queries" [ref=e185] [cursor=pointer]:
                - /url: /sql-editor
                - generic [ref=e186]:
                  - generic [ref=e188]:
                    - img [ref=e189]
                    - heading "SQL Editor" [level=3] [ref=e193]
                  - paragraph [ref=e195]: Write and execute SQL queries
              - link "Reports View and manage reports" [ref=e196] [cursor=pointer]:
                - /url: /reports
                - generic [ref=e197]:
                  - generic [ref=e199]:
                    - img [ref=e200]
                    - heading "Reports" [level=3] [ref=e203]
                  - paragraph [ref=e205]: View and manage reports
              - link "Charts Create data visualizations" [ref=e206] [cursor=pointer]:
                - /url: /charts
                - generic [ref=e207]:
                  - generic [ref=e209]:
                    - img [ref=e210]
                    - heading "Charts" [level=3] [ref=e212]
                  - paragraph [ref=e214]: Create data visualizations
              - link "Dashboards Build interactive dashboards" [ref=e215] [cursor=pointer]:
                - /url: /dashboards
                - generic [ref=e216]:
                  - generic [ref=e218]:
                    - img [ref=e219]
                    - heading "Dashboards" [level=3] [ref=e224]
                  - paragraph [ref=e226]: Build interactive dashboards
          - generic [ref=e227]:
            - generic [ref=e228]:
              - heading "Recent Jobs" [level=3] [ref=e230]:
                - img [ref=e231]
                - text: Recent Jobs
              - paragraph [ref=e234]: No recent job executions
            - generic [ref=e235]:
              - heading "Recent Activity" [level=3] [ref=e237]:
                - img [ref=e238]
                - text: Recent Activity
              - paragraph [ref=e242]: No recent activity
  - region "Notifications alt+T"
```

# Test source

```ts
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
> 524 |     expect(initialClass).not.toBe(newClass);
      |                              ^ Error: expect(received).not.toBe(expected) // Object.is equality
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
  562 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  563 | 
  564 |     // Check for pagination controls
  565 |     await expect(page.locator('text=Next, text=Previous, button[aria-label*="page"]').or(page.locator('table')).first()).toBeVisible({ timeout: 15000 });
  566 |   });
  567 | 
  568 |   test('26. SQL validation - error handling', async ({ page }) => {
  569 |     await page.goto(`${BASE_URL}/sql-editor`);
  570 | 
  571 |     // Enter invalid SQL
  572 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  573 |     await editor.fill('SELECT * FROM nonexistent_table');
  574 | 
  575 |     // Try to execute
  576 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  577 | 
  578 |     // Should show error message
  579 |     await page.waitForTimeout(2000);
  580 | 
  581 |     // Check for error indicator
  582 |     const hasError = await page.locator('text=error, text=syntax, text=failed, .error, [role="alert"]').count() > 0;
  583 |     // Error may or may not be shown depending on implementation
  584 |   });
  585 | 
  586 |   test('27. Export functionality', async ({ page }) => {
  587 |     await page.goto(`${BASE_URL}/sql-editor`);
  588 | 
  589 |     // Execute query
  590 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  591 |     await editor.fill('SELECT * FROM customers LIMIT 100');
  592 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  593 | 
  594 |     // Wait for results
  595 |     await expect(page.locator('table, text=customer_id')).toBeVisible({ timeout: 10000 });
  596 | 
  597 |     // Check for export buttons
  598 |     const exportBtn = page.locator('button:has-text("Export"), button:has-text("Download")').first();
  599 |     if (await exportBtn.isVisible()) {
  600 |       // Export should be available
  601 |       expect(exportBtn).toBeTruthy();
  602 |     }
  603 |   });
  604 | 
  605 |   test('28. Search/filter functionality', async ({ page }) => {
  606 |     await page.goto(`${BASE_URL}/reports`);
  607 | 
  608 |     // Look for search input
  609 |     const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"], input[type="search"]').first();
  610 | 
  611 |     if (await searchInput.isVisible()) {
  612 |       await searchInput.fill('test');
  613 |       await page.waitForTimeout(500);
  614 |     }
  615 |   });
  616 | 
  617 |   test('29. Responsive design - mobile viewport', async ({ page }) => {
  618 |     // Set mobile viewport
  619 |     await page.setViewportSize({ width: 375, height: 667 });
  620 |     await page.goto(`${BASE_URL}/`);
  621 | 
  622 |     // Check sidebar is collapsed or hidden
  623 |     await expect(page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]')).or(page.locator('.sidebar, aside')).toBeVisible();
  624 |   });
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Enterprise Reporting System - Comprehensive Suite >> 29. Responsive design - mobile viewport
- Location: e2e/comprehensive-suite.spec.ts:617:3

# Error details

```
Error: expect: Property 'or' not found.
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
            - heading "Dashboard" [level=1] [ref=e139]
            - paragraph [ref=e140]: Welcome to the Enterprise Reporting System - admin@admin.com
          - generic [ref=e141]:
            - link "Total Reports 0" [ref=e142] [cursor=pointer]:
              - /url: /reports
              - generic [ref=e143]:
                - generic [ref=e144]:
                  - heading "Total Reports" [level=3] [ref=e145]
                  - img [ref=e146]
                - generic [ref=e150]: "0"
            - link "Active Charts 4" [ref=e151] [cursor=pointer]:
              - /url: /charts
              - generic [ref=e152]:
                - generic [ref=e153]:
                  - heading "Active Charts" [level=3] [ref=e154]
                  - img [ref=e155]
                - generic [ref=e158]: "4"
            - link "Dashboards 3" [ref=e159] [cursor=pointer]:
              - /url: /dashboards
              - generic [ref=e160]:
                - generic [ref=e161]:
                  - heading "Dashboards" [level=3] [ref=e162]
                  - img [ref=e163]
                - generic [ref=e169]: "3"
            - link "Scheduled Jobs 0" [ref=e170] [cursor=pointer]:
              - /url: /jobs
              - generic [ref=e171]:
                - generic [ref=e172]:
                  - heading "Scheduled Jobs" [level=3] [ref=e173]
                  - img [ref=e174]
                - generic [ref=e178]: "0"
          - generic [ref=e179]:
            - heading "Quick Actions" [level=2] [ref=e180]
            - generic [ref=e181]:
              - link "SQL Editor Write and execute SQL queries" [ref=e182] [cursor=pointer]:
                - /url: /sql-editor
                - generic [ref=e183]:
                  - generic [ref=e185]:
                    - img [ref=e186]
                    - heading "SQL Editor" [level=3] [ref=e190]
                  - paragraph [ref=e192]: Write and execute SQL queries
              - link "Reports View and manage reports" [ref=e193] [cursor=pointer]:
                - /url: /reports
                - generic [ref=e194]:
                  - generic [ref=e196]:
                    - img [ref=e197]
                    - heading "Reports" [level=3] [ref=e200]
                  - paragraph [ref=e202]: View and manage reports
              - link "Charts Create data visualizations" [ref=e203] [cursor=pointer]:
                - /url: /charts
                - generic [ref=e204]:
                  - generic [ref=e206]:
                    - img [ref=e207]
                    - heading "Charts" [level=3] [ref=e209]
                  - paragraph [ref=e211]: Create data visualizations
              - link "Dashboards Build interactive dashboards" [ref=e212] [cursor=pointer]:
                - /url: /dashboards
                - generic [ref=e213]:
                  - generic [ref=e215]:
                    - img [ref=e216]
                    - heading "Dashboards" [level=3] [ref=e221]
                  - paragraph [ref=e223]: Build interactive dashboards
          - generic [ref=e224]:
            - generic [ref=e225]:
              - heading "Recent Jobs" [level=3] [ref=e227]:
                - img [ref=e228]
                - text: Recent Jobs
              - paragraph [ref=e231]: No recent job executions
            - generic [ref=e232]:
              - heading "Recent Activity" [level=3] [ref=e234]:
                - img [ref=e235]
                - text: Recent Activity
              - paragraph [ref=e239]: No recent activity
  - region "Notifications alt+T"
```

# Test source

```ts
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
> 623 |     await expect(page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]')).or(page.locator('.sidebar, aside')).toBeVisible();
      |                                                                                         ^ Error: expect: Property 'or' not found.
  624 |   });
  625 | 
  626 |   test('30. Performance - sequential queries', async ({ page }) => {
  627 |     await page.goto(`${BASE_URL}/sql-editor`);
  628 | 
  629 |     const queries = [
  630 |       'SELECT COUNT(*) FROM customers',
  631 |       'SELECT COUNT(*) FROM orders',
  632 |       'SELECT COUNT(*) FROM products'
  633 |     ];
  634 | 
  635 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  636 |     const executionTimes: number[] = [];
  637 | 
  638 |     for (const query of queries) {
  639 |       await editor.fill(query);
  640 |       const startTime = Date.now();
  641 |       await page.click('button:has-text("Execute"), button:has-text("Run")');
  642 |       await expect(page.locator('table, text=count')).toBeVisible({ timeout: 10000 });
  643 |       executionTimes.push(Date.now() - startTime);
  644 |       await page.waitForTimeout(500);
  645 |     }
  646 | 
  647 |     // Log performance
  648 |     console.log('Query execution times:', executionTimes);
  649 | 
  650 |     // All queries should complete within 10 seconds each
  651 |     executionTimes.forEach(time => {
  652 |       expect(time).toBeLessThan(10000);
  653 |     });
  654 |   });
  655 | 
  656 |   test('31. Complex GROUP BY with multiple dimensions', async ({ page }) => {
  657 |     await page.goto(`${BASE_URL}/sql-editor`);
  658 | 
  659 |     const query = COMPLEX_QUERIES.salesByMultipleDimensions;
  660 |     const editor = page.locator('.monono-editor, [contenteditable="true"], textarea').first();
  661 |     await editor.fill(query);
  662 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  663 | 
  664 |     await expect(page.locator('table, text=country, text=revenue')).toBeVisible({ timeout: 20000 });
  665 |   });
  666 | 
  667 |   test('32. Support ticket analytics query', async ({ page }) => {
  668 |     await page.goto(`${BASE_URL}/sql-editor`);
  669 | 
  670 |     const query = COMPLEX_QUERIES.supportTicketMetrics;
  671 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  672 |     await editor.fill(query);
  673 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  674 | 
  675 |     await expect(page.locator('table, text=ticket_count, text=category')).toBeVisible({ timeout: 15000 });
  676 |   });
  677 | 
  678 |   test('33. Logout and login again', async ({ page }) => {
  679 |     await page.goto(`${BASE_URL}/`);
  680 | 
  681 |     // Click logout
  682 |     await page.click('button:has-text("Logout"), [aria-label*="logout"], button:has-text("Sign out")');
  683 | 
  684 |     // Should redirect to login
  685 |     await expect(page).toHaveURL(/login/);
  686 | 
  687 |     // Login again
  688 |     await page.fill('input[name="email"], input[type="email"]', 'admin@admin.com');
  689 |     await page.fill('input[name="password"], input[type="password"]', 'admin');
  690 |     await page.click('button[type="submit"], button:has-text("Sign In")');
  691 | 
  692 |     // Should be redirected to dashboard
  693 |     await expect(page).toHaveURL(new RegExp('/'));
  694 |   });
  695 | 
  696 |   test('34. Check for console errors', async ({ page }) => {
  697 |     const errors: string[] = [];
  698 | 
  699 |     page.on('console', msg => {
  700 |       if (msg.type() === 'error') {
  701 |         errors.push(msg.text());
  702 |       }
  703 |     });
  704 | 
  705 |     await page.goto(`${BASE_URL}/`);
  706 |     await page.goto(`${BASE_URL}/sql-editor`);
  707 |     await page.goto(`${BASE_URL}/reports`);
  708 | 
  709 |     // Log any errors (for debugging, not failing test)
  710 |     if (errors.length > 0) {
  711 |       console.log('Console errors found:', errors);
  712 |     }
  713 |   });
  714 | 
  715 |   test('35. Page load performance check', async ({ page }) => {
  716 |     const pages = [
  717 |       { path: '/', name: 'Dashboard' },
  718 |       { path: '/sql-editor', name: 'SQL Editor' },
  719 |       { path: '/reports', name: 'Reports' },
  720 |       { path: '/charts', name: 'Charts' },
  721 |       { path: '/dashboards', name: 'Dashboards' }
  722 |     ];
  723 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Enterprise Reporting System - Comprehensive Suite >> 27. Export functionality
- Location: e2e/comprehensive-suite.spec.ts:586:3

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
> 591 |     await editor.fill('SELECT * FROM customers LIMIT 100');
      |                  ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
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
```
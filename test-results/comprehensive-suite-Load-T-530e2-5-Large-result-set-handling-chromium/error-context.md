# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Load Testing - High Volume Data >> L5. Large result set handling
- Location: e2e/comprehensive-suite.spec.ts:847:3

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
  752 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  753 |     await expect(page.locator('table, text=customer_id')).toBeVisible({ timeout: 30000 });
  754 |     const queryTime = Date.now() - startTime;
  755 | 
  756 |     console.log(`100K customers query executed in ${queryTime}ms`);
  757 |     expect(queryTime).toBeLessThan(30000);
  758 |   });
  759 | 
  760 |   test('L2. Query 300K orders with date filter', async ({ page }) => {
  761 |     await page.goto(`${BASE_URL}/sql-editor`);
  762 | 
  763 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  764 |     await editor.fill(`
  765 |       SELECT
  766 |         order_date,
  767 |         status,
  768 |         COUNT(*) as order_count,
  769 |         SUM(total_amount) as daily_revenue
  770 |       FROM orders
  771 |       WHERE order_date >= '2024-01-01'
  772 |       GROUP BY order_date, status
  773 |       ORDER BY order_date DESC
  774 |     `);
  775 | 
  776 |     const startTime = Date.now();
  777 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  778 |     await expect(page.locator('table, text=order_date')).toBeVisible({ timeout: 45000 });
  779 |     const queryTime = Date.now() - startTime;
  780 | 
  781 |     console.log(`300K orders aggregation executed in ${queryTime}ms`);
  782 |     expect(queryTime).toBeLessThan(45000);
  783 |   });
  784 | 
  785 |   test('L3. Complex 3-table JOIN with large datasets', async ({ page }) => {
  786 |     await page.goto(`${BASE_URL}/sql-editor`);
  787 | 
  788 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  789 |     await editor.fill(`
  790 |       SELECT
  791 |         c.country,
  792 |         c.segment,
  793 |         p.category,
  794 |         COUNT(DISTINCT o.order_id) as order_count,
  795 |         SUM(oi.line_total) as total_revenue,
  796 |         AVG(oi.line_total) as avg_line_total
  797 |       FROM customers c
  798 |       INNER JOIN orders o ON c.customer_id = o.customer_id
  799 |       INNER JOIN order_items oi ON o.order_id = oi.order_id
  800 |       INNER JOIN products p ON oi.product_id = p.product_id
  801 |       WHERE o.order_date >= '2024-01-01'
  802 |       GROUP BY c.country, c.segment, p.category
  803 |       ORDER BY total_revenue DESC
  804 |       LIMIT 500
  805 |     `);
  806 | 
  807 |     const startTime = Date.now();
  808 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  809 |     await expect(page.locator('table')).toBeVisible({ timeout: 60000 });
  810 |     const queryTime = Date.now() - startTime;
  811 | 
  812 |     console.log(`Complex 3-table JOIN executed in ${queryTime}ms`);
  813 |     expect(queryTime).toBeLessThan(60000);
  814 |   });
  815 | 
  816 |   test('L4. Multiple sequential queries (stress test)', async ({ page }) => {
  817 |     await page.goto(`${BASE_URL}/sql-editor`);
  818 | 
  819 |     const queries = [
  820 |       'SELECT COUNT(*) FROM customers',
  821 |       'SELECT COUNT(*) FROM orders',
  822 |       'SELECT COUNT(*) FROM order_items',
  823 |       'SELECT COUNT(*) FROM products',
  824 |       'SELECT COUNT(DISTINCT customer_id) FROM orders',
  825 |       'SELECT country, COUNT(*) FROM customers GROUP BY country',
  826 |       'SELECT status, COUNT(*) FROM orders GROUP BY status',
  827 |       'SELECT category, COUNT(*) FROM products GROUP BY category'
  828 |     ];
  829 | 
  830 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  831 |     const totalTime = Date.now();
  832 | 
  833 |     for (let i = 0; i < queries.length; i++) {
  834 |       await editor.fill(queries[i]);
  835 |       await page.click('button:has-text("Execute"), button:has-text("Run")');
  836 |       await expect(page.locator('table, text=count')).toBeVisible({ timeout: 10000 });
  837 |       console.log(`Query ${i + 1}/${queries.length} completed`);
  838 |     }
  839 | 
  840 |     const totalTimeMs = Date.now() - totalTime;
  841 |     console.log(`All queries completed in ${totalTimeMs}ms`);
  842 | 
  843 |     // All 8 queries should complete within 60 seconds
  844 |     expect(totalTimeMs).toBeLessThan(60000);
  845 |   });
  846 | 
  847 |   test('L5. Large result set handling', async ({ page }) => {
  848 |     await page.goto(`${BASE_URL}/sql-editor`);
  849 | 
  850 |     // Query that returns 5000+ rows
  851 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
> 852 |     await editor.fill(`
      |                  ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
  853 |       SELECT
  854 |         o.order_id,
  855 |         o.order_date,
  856 |         c.name as customer_name,
  857 |         o.total_amount,
  858 |         o.status
  859 |       FROM orders o
  860 |       INNER JOIN customers c ON o.customer_id = c.customer_id
  861 |       WHERE o.order_date >= '2024-01-01'
  862 |       ORDER BY o.order_date DESC
  863 |       LIMIT 5000
  864 |     `);
  865 | 
  866 |     const startTime = Date.now();
  867 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  868 | 
  869 |     // Wait for results and verify rendering
  870 |     await expect(page.locator('table, tbody tr').first()).toBeVisible({ timeout: 30000 });
  871 |     const queryTime = Date.now() - startTime;
  872 | 
  873 |     console.log(`5000 row result set loaded in ${queryTime}ms`);
  874 |     expect(queryTime).toBeLessThan(30000);
  875 |   });
  876 | });
  877 | 
  878 | test.describe('Authentication & Security', () => {
  879 |   test('A1. Invalid login shows error', async ({ page }) => {
  880 |     await page.goto(`${BASE_URL}/login`);
  881 | 
  882 |     await page.fill('input[name="email"], input[type="email"]', 'invalid@test.com');
  883 |     await page.fill('input[name="password"], input[type="password"]', 'wrongpassword');
  884 |     await page.click('button[type="submit"], button:has-text("Sign In")');
  885 | 
  886 |     await expect(page.locator('text=Invalid email or password, text=Invalid').or(page.locator('.error'))).toBeVisible({ timeout: 5000 });
  887 |   });
  888 | 
  889 |   test('A2. Protected routes redirect to login', async ({ page }) => {
  890 |     // Go to dashboard without logging in
  891 |     await page.goto(`${BASE_URL}/`);
  892 | 
  893 |     // Should redirect to login
  894 |     await expect(page).toHaveURL(/login/);
  895 |   });
  896 | 
  897 |   test('A3. Session persistence after refresh', async ({ page }) => {
  898 |     await login(page);
  899 |     await page.goto(`${BASE_URL}/`);
  900 | 
  901 |     // Refresh page
  902 |     await page.reload();
  903 | 
  904 |     // Should still be logged in
  905 |     await expect(page.locator('text=Dashboard').or(page.locator('h1'))).toBeVisible();
  906 |   });
  907 | });
  908 | 
```
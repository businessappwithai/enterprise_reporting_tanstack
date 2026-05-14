# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Authentication & Security >> A3. Session persistence after refresh
- Location: e2e/comprehensive-suite.spec.ts:897:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Dashboard').or(locator('h1'))
Expected: visible
Error: strict mode violation: locator('text=Dashboard').or(locator('h1')) resolved to 6 elements:
    1) <span>Dashboard</span> aka getByRole('button', { name: 'Dashboard', exact: true })
    2) <span>Dashboards</span> aka getByRole('button', { name: 'Dashboards' })
    3) <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1> aka getByRole('heading', { name: 'Dashboard', exact: true })
    4) <h3 class="tracking-tight text-sm font-medium">Dashboards</h3> aka getByRole('link', { name: 'Dashboards 3' })
    5) <h3 class="font-semibold tracking-tight text-sm">Dashboards</h3> aka getByRole('link', { name: 'Dashboards Build interactive' })
    6) <p class="text-xs text-muted-foreground">Build interactive dashboards</p> aka getByRole('link', { name: 'Dashboards Build interactive' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Dashboard').or(locator('h1'))

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
  852 |     await editor.fill(`
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
> 905 |     await expect(page.locator('text=Dashboard').or(page.locator('h1'))).toBeVisible();
      |                                                                         ^ Error: expect(locator).toBeVisible() failed
  906 |   });
  907 | });
  908 | 
```
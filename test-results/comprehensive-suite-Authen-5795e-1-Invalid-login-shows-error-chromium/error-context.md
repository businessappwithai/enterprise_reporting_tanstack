# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Authentication & Security >> A1. Invalid login shows error
- Location: e2e/comprehensive-suite.spec.ts:879:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/login
Call log:
  - navigating to "http://localhost:4050/login", waiting until "load"

```

# Test source

```ts
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
> 880 |     await page.goto(`${BASE_URL}/login`);
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/login
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
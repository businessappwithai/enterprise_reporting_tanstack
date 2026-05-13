# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-comprehensive.spec.ts >> Load Testing - Large Dataset >> L6. Multiple sequential queries (stress test)
- Location: e2e/load-comprehensive.spec.ts:137:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=SQL Editor').or(locator('h1'))
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=SQL Editor').or(locator('h1'))

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
  40  |     await page.locator('.monaco-editor').click();
  41  | 
  42  |     // Type simple query
  43  |     await page.keyboard.type('SELECT COUNT(*) as total FROM customers');
  44  | 
  45  |     // Look for and click execute button
  46  |     const executeBtn = page.locator('button:has-text("Execute"), button:has-text("Run"), button[title*="Execute"], button[title*="Run"]').first();
  47  |     if (await executeBtn.isVisible()) {
  48  |       await executeBtn.click();
  49  |     }
  50  | 
  51  |     // Wait for results
  52  |     await page.waitForTimeout(5000);
  53  |   });
  54  | 
  55  |   test('L3. Complex JOIN query performance', async ({ page }) => {
  56  |     await page.goto('/sql-editor');
  57  | 
  58  |     await expect(page.locator('text=SQL Editor').or(page.locator('h1'))).toBeVisible();
  59  | 
  60  |     const editor = page.locator('.monaco-editor, .view-line').first();
  61  |     await editor.click();
  62  | 
  63  |     // Complex JOIN query
  64  |     const complexQuery = `SELECT
  65  |   c.name,
  66  |   COUNT(o.order_id) as order_count,
  67  |   SUM(o.total_amount) as total_spent
  68  | FROM customers c
  69  | LEFT JOIN orders o ON c.customer_id = o.customer_id
  70  | GROUP BY c.customer_id
  71  | ORDER BY total_spent DESC
  72  | LIMIT 100`;
  73  | 
  74  |     await page.keyboard.type(complexQuery);
  75  | 
  76  |     // Execute and measure time
  77  |     const startTime = Date.now();
  78  |     await page.click('button:has-text("Execute"), button:has-text("Run"), button:has-text("▶")');
  79  | 
  80  |     // Wait for results
  81  |     await page.waitForTimeout(10000);
  82  |     const queryTime = Date.now() - startTime;
  83  | 
  84  |     console.log(`Complex JOIN query completed in ${queryTime}ms`);
  85  | 
  86  |     // Query should complete within 30 seconds
  87  |     expect(queryTime).toBeLessThan(30000);
  88  |   });
  89  | 
  90  |   test('L4. Large result set handling (1000 rows)', async ({ page }) => {
  91  |     await page.goto('/sql-editor');
  92  | 
  93  |     await expect(page.locator('text=SQL Editor').or(page.locator('h1'))).toBeVisible();
  94  | 
  95  |     const editor = page.locator('.monaco-editor, .view-line').first();
  96  |     await editor.click();
  97  | 
  98  |     await page.keyboard.type('SELECT * FROM orders ORDER BY id DESC LIMIT 1000');
  99  | 
  100 |     const startTime = Date.now();
  101 |     await page.click('button:has-text("Execute"), button:has-text("Run"), button:has-text("▶")');
  102 | 
  103 |     await page.waitForTimeout(15000);
  104 |     const queryTime = Date.now() - startTime;
  105 | 
  106 |     console.log(`1000 row query completed in ${queryTime}ms`);
  107 |   });
  108 | 
  109 |   test('L5. Aggregation query performance', async ({ page }) => {
  110 |     await page.goto('/sql-editor');
  111 | 
  112 |     await expect(page.locator('text=SQL Editor').or(page.locator('h1'))).toBeVisible();
  113 | 
  114 |     const editor = page.locator('.monaco-editor, .view-line').first();
  115 |     await editor.click();
  116 | 
  117 |     const aggQuery = `SELECT
  118 |   status,
  119 |   COUNT(*) as count,
  120 |   SUM(total_amount) as total,
  121 |   AVG(total_amount) as average
  122 | FROM orders
  123 | GROUP BY status`;
  124 | 
  125 |     await page.keyboard.type(aggQuery);
  126 | 
  127 |     const startTime = Date.now();
  128 |     await page.click('button:has-text("Execute"), button:has-text("Run"), button:has-text("▶")');
  129 | 
  130 |     await page.waitForTimeout(10000);
  131 |     const queryTime = Date.now() - startTime;
  132 | 
  133 |     console.log(`Aggregation query completed in ${queryTime}ms`);
  134 |     expect(queryTime).toBeLessThan(20000);
  135 |   });
  136 | 
  137 |   test('L6. Multiple sequential queries (stress test)', async ({ page }) => {
  138 |     await page.goto('/sql-editor');
  139 | 
> 140 |     await expect(page.locator('text=SQL Editor').or(page.locator('h1'))).toBeVisible();
      |                                                                          ^ Error: expect(locator).toBeVisible() failed
  141 | 
  142 |     const queries = [
  143 |       'SELECT COUNT(*) FROM customers',
  144 |       'SELECT COUNT(*) FROM orders',
  145 |       'SELECT COUNT(*) FROM order_items',
  146 |       'SELECT status, COUNT(*) FROM orders GROUP BY status'
  147 |     ];
  148 | 
  149 |     const editor = page.locator('.monaco-editor, .view-line').first();
  150 |     const totalTime = Date.now();
  151 | 
  152 |     for (const query of queries) {
  153 |       await editor.click();
  154 |       // Clear editor
  155 |       await page.keyboard.press('Control+A');
  156 |       await page.keyboard.press('Delete');
  157 |       await page.keyboard.type(query);
  158 | 
  159 |       await page.click('button:has-text("Execute"), button:has-text("Run"), button:has-text("▶")');
  160 |       await page.waitForTimeout(5000);
  161 |     }
  162 | 
  163 |     const totalTimeMs = Date.now() - totalTime;
  164 |     console.log(`All queries completed in ${totalTimeMs}ms`);
  165 |     expect(totalTimeMs).toBeLessThan(60000);
  166 |   });
  167 | });
  168 | 
  169 | test.describe('Comprehensive Application Testing', () => {
  170 |   test.beforeEach(async ({ page }) => {
  171 |     // Login before each test
  172 |     await page.goto('/login');
  173 |     await page.fill('input[name="email"], input[type="email"]', 'admin@admin.com');
  174 |     await page.fill('input[name="password"], input[type="password"]', 'admin');
  175 |     await page.click('button[type="submit"]');
  176 |     await page.waitForURL(/\//);
  177 |   });
  178 | 
  179 |   test('C1. Navigate all main pages', async ({ page }) => {
  180 |     const pages = [
  181 |       { path: '/', name: 'Dashboard' },
  182 |       { path: '/sql-editor', name: 'SQL Editor' },
  183 |       { path: '/queries', name: 'Saved Queries' },
  184 |       { path: '/reports', name: 'Reports' },
  185 |       { path: '/charts', name: 'Charts' },
  186 |       { path: '/dashboards', name: 'Dashboards' },
  187 |       { path: '/filters', name: 'Filters' },
  188 |       { path: '/jobs', name: 'Jobs' },
  189 |       { path: '/data-sources', name: 'Data Sources' },
  190 |       { path: '/admin/users', name: 'Users' },
  191 |       { path: '/admin/roles', name: 'Roles' },
  192 |       { path: '/settings', name: 'Settings' }
  193 |     ];
  194 | 
  195 |     for (const pageData of pages) {
  196 |       await page.goto(pageData.path);
  197 |       const visible = await page.locator('h1').or(page.locator(`text=${pageData.name}`)).or(page.locator('text=Dashboard')).or(page.locator('text=SQL')).or(page.locator('text=Reports')).first().isVisible({ timeout: 10000 });
  198 |       expect(visible).toBeTruthy();
  199 |       console.log(`✓ ${pageData.name} page loaded`);
  200 |     }
  201 |   });
  202 | 
  203 |   test('C2. Theme toggle works', async ({ page }) => {
  204 |     await page.goto('/');
  205 | 
  206 |     // Get initial theme
  207 |     const html = page.locator('html');
  208 |     const initialTheme = await html.getAttribute('class');
  209 | 
  210 |     // Toggle theme
  211 |     await page.click('button:has-text("Toggle theme"), button[aria-label*="theme"], button:has([data-lucide="moon"], [data-lucide="sun"])');
  212 | 
  213 |     await page.waitForTimeout(1000);
  214 |     const newTheme = await html.getAttribute('class');
  215 | 
  216 |     // Theme should change
  217 |     expect(initialTheme).not.toBe(newTheme);
  218 |   });
  219 | 
  220 |   test('C3. Sidebar navigation', async ({ page }) => {
  221 |     await page.goto('/');
  222 | 
  223 |     // Find sidebar links and navigate
  224 |     const dashboardLink = page.locator('a').filter({ hasText: 'Dashboard' }).first();
  225 |     if (await dashboardLink.isVisible()) {
  226 |       await dashboardLink.click();
  227 |       await expect(page).toHaveURL(/\//);
  228 |     }
  229 |   });
  230 | 
  231 |   test('C4. Quick Actions cards', async ({ page }) => {
  232 |     await page.goto('/');
  233 | 
  234 |     // Check for Quick Actions
  235 |     await expect(page.locator('text=Quick Actions').or(page.locator('text=SQL')).or(page.locator('text=Report')).first()).toBeVisible();
  236 |   });
  237 | 
  238 |   test('C5. Page load performance', async ({ page }) => {
  239 |     const pages = [
  240 |       { path: '/', name: 'Dashboard' },
```
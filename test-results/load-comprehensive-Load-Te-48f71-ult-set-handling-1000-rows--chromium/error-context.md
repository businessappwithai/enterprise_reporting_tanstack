# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-comprehensive.spec.ts >> Load Testing - Large Dataset >> L4. Large result set handling (1000 rows)
- Location: e2e/load-comprehensive.spec.ts:90:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=SQL Editor').or(locator('h1'))
Expected: visible
Error: strict mode violation: locator('text=SQL Editor').or(locator('h1')) resolved to 3 elements:
    1) <span>SQL Editor</span> aka getByRole('button', { name: 'SQL Editor', exact: true })
    2) <h1 class="text-2xl font-bold">SQL Editor</h1> aka getByRole('heading', { name: 'SQL Editor' })
    3) <span class="text-sm text-muted-foreground">Loading SQL Editor...</span> aka getByRole('button', { name: 'Loading SQL Editor...' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=SQL Editor').or(locator('h1'))

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
              - heading "SQL Editor" [level=1] [ref=e140]
              - paragraph [ref=e141]: Write and execute SQL queries
            - generic [ref=e142]:
              - button "Validate" [ref=e143] [cursor=pointer]
              - button "Run Query" [ref=e144] [cursor=pointer]
              - button "Save Query" [disabled] [ref=e145]
          - generic [ref=e146]:
            - generic [ref=e147]:
              - paragraph [ref=e148]: "Data Source:"
              - button "▲" [ref=e149] [cursor=pointer]
            - paragraph [ref=e151]: Loading...
          - button "Loading SQL Editor..." [ref=e152]:
            - generic [ref=e156]:
              - img [ref=e157]
              - generic [ref=e159]: Loading SQL Editor...
          - generic [ref=e160]:
            - generic [ref=e161]:
              - paragraph [ref=e162]: Schema Browser (Select a data source)
              - button "▼" [ref=e164] [cursor=pointer]
            - paragraph [ref=e166]: Select a data source to view schema
          - generic [ref=e167]:
            - generic [ref=e168]:
              - button "Results" [ref=e169] [cursor=pointer]
              - button "Errors" [ref=e170] [cursor=pointer]
              - button "Logs" [ref=e171] [cursor=pointer]
            - paragraph [ref=e175]: No results yet. Run a query to see results here.
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | /**
  2   |  * Load and Comprehensive Testing Suite
  3   |  * Tests application with 300K+ records
  4   |  */
  5   | 
  6   | import { test, expect } from '@playwright/test';
  7   | 
  8   | test.describe('Load Testing - Large Dataset', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     // Login before each test
  11  |     await page.goto('/login');
  12  |     await page.fill('input[name="email"], input[type="email"]', 'admin@admin.com');
  13  |     await page.fill('input[name="password"], input[type="password"]', 'admin');
  14  |     await page.click('button[type="submit"]');
  15  |     await page.waitForURL(/\//);
  16  |   });
  17  | 
  18  |   test('L1. Dashboard loads with large dataset', async ({ page }) => {
  19  |     await page.goto('/');
  20  | 
  21  |     // Dashboard should load
  22  |     await expect(page.locator('h1').first()).toContainText('Dashboard', { timeout: 10000 });
  23  | 
  24  |     // Stats should be visible
  25  |     await expect(page.locator('text=Total Reports').first()).toBeVisible();
  26  |     await expect(page.locator('text=Active Charts').first()).toBeVisible();
  27  |     await expect(page.locator('text=Dashboards').first()).toBeVisible();
  28  |   });
  29  | 
  30  |   test('L2. SQL Editor - Simple query on large dataset', async ({ page }) => {
  31  |     await page.goto('/sql-editor');
  32  | 
  33  |     // Wait for page to load
  34  |     await expect(page.locator('h1').or(page.locator('text=SQL')).first()).toBeVisible({ timeout: 10000 });
  35  | 
  36  |     // Wait for Monaco editor to load
  37  |     await page.waitForSelector('.monaco-editor', { timeout: 10000 });
  38  | 
  39  |     // Click in the editor
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
> 93  |     await expect(page.locator('text=SQL Editor').or(page.locator('h1'))).toBeVisible();
      |                                                                          ^ Error: expect(locator).toBeVisible() failed
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
  140 |     await expect(page.locator('text=SQL Editor').or(page.locator('h1'))).toBeVisible();
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
```
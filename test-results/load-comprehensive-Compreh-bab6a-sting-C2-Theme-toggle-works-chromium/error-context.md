# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-comprehensive.spec.ts >> Comprehensive Application Testing >> C2. Theme toggle works
- Location: e2e/load-comprehensive.spec.ts:203:3

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
> 217 |     expect(initialTheme).not.toBe(newTheme);
      |                              ^ Error: expect(received).not.toBe(expected) // Object.is equality
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
  241 |       { path: '/sql-editor', name: 'SQL Editor' },
  242 |       { path: '/reports', name: 'Reports' }
  243 |     ];
  244 | 
  245 |     for (const pageData of pages) {
  246 |       const startTime = Date.now();
  247 |       await page.goto(pageData.path);
  248 |       await page.waitForLoadState('domcontentloaded');
  249 |       const loadTime = Date.now() - startTime;
  250 | 
  251 |       console.log(`${pageData.name} loaded in ${loadTime}ms`);
  252 |       expect(loadTime).toBeLessThan(10000);
  253 |     }
  254 |   });
  255 | });
  256 | 
  257 | test.describe('Authentication Tests', () => {
  258 |   test('A1. Login with valid credentials', async ({ page }) => {
  259 |     await page.goto('/login');
  260 | 
  261 |     // Fill login form
  262 |     await page.fill('input[name="email"], input[type="email"]', 'admin@admin.com');
  263 |     await page.fill('input[name="password"], input[type="password"]', 'admin');
  264 |     await page.click('button[type="submit"]');
  265 | 
  266 |     // Should redirect to dashboard
  267 |     await expect(page).toHaveURL(/\//);
  268 |   });
  269 | 
  270 |   test('A2. Invalid login shows error', async ({ page }) => {
  271 |     await page.goto('/login');
  272 | 
  273 |     await page.fill('input[name="email"], input[type="email"]', 'invalid@test.com');
  274 |     await page.fill('input[name="password"], input[type="password"]', 'wrongpass');
  275 |     await page.click('button[type="submit"]');
  276 | 
  277 |     // Should show error
  278 |     await expect(page.locator('text=Invalid').or(page.locator('.error')).or(page.locator('text=Email or password'))).toBeVisible({ timeout: 5000 });
  279 |   });
  280 | 
  281 |   test('A3. Protected routes redirect to login', async ({ page, context }) => {
  282 |     // Clear all cookies
  283 |     await context.clearCookies();
  284 | 
  285 |     await page.goto('/reports');
  286 | 
  287 |     // Should redirect to login
  288 |     await expect(page).toHaveURL(/login/);
  289 |   });
  290 | });
  291 | 
  292 | test.describe('Data Source Testing', () => {
  293 |   test.beforeEach(async ({ page }) => {
  294 |     // Login before each test
  295 |     await page.goto('/login');
  296 |     await page.fill('input[name="email"], input[type="email"]', 'admin@admin.com');
  297 |     await page.fill('input[name="password"], input[type="password"]', 'admin');
  298 |     await page.click('button[type="submit"]');
  299 |     await page.waitForURL(/\//);
  300 |   });
  301 | 
  302 |   test('D1. Data sources page loads', async ({ page }) => {
  303 |     await page.goto('/data-sources');
  304 | 
  305 |     await expect(page.locator('h1').or(page.locator('text=Data Source')).first()).toBeVisible();
  306 |   });
  307 | 
  308 |   test('D2. Add data source form', async ({ page }) => {
  309 |     await page.goto('/data-sources');
  310 | 
  311 |     // Look for add button
  312 |     const addBtn = page.locator('button:has-text("Add"), button:has-text("New")').first();
  313 |     if (await addBtn.isVisible()) {
  314 |       await addBtn.click();
  315 |       await page.waitForTimeout(1000);
  316 |     }
  317 |   });
```
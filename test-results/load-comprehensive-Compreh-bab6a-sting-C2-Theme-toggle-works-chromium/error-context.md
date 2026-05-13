# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-comprehensive.spec.ts >> Comprehensive Application Testing >> C2. Theme toggle works
- Location: e2e/load-comprehensive.spec.ts:203:3

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Toggle theme"), button[aria-label*="theme"], button:has([data-lucide="moon"], [data-lucide="sun"])')

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
> 211 |     await page.click('button:has-text("Toggle theme"), button[aria-label*="theme"], button:has([data-lucide="moon"], [data-lucide="sun"])');
      |                ^ TimeoutError: page.click: Timeout 15000ms exceeded.
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
```
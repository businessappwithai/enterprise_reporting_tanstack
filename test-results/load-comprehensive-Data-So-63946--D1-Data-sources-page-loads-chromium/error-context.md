# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-comprehensive.spec.ts >> Data Source Testing >> D1. Data sources page loads
- Location: e2e/load-comprehensive.spec.ts:302:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').or(locator('text=Data Source')).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').or(locator('text=Data Source')).first()

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
> 305 |     await expect(page.locator('h1').or(page.locator('text=Data Source')).first()).toBeVisible();
      |                                                                                   ^ Error: expect(locator).toBeVisible() failed
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
  318 | });
  319 | 
  320 | test.describe('Reports and Charts', () => {
  321 |   test.beforeEach(async ({ page }) => {
  322 |     // Login before each test
  323 |     await page.goto('/login');
  324 |     await page.fill('input[name="email"], input[type="email"]', 'admin@admin.com');
  325 |     await page.fill('input[name="password"], input[type="password"]', 'admin');
  326 |     await page.click('button[type="submit"]');
  327 |     await page.waitForURL(/\//);
  328 |   });
  329 | 
  330 |   test('R1. Reports page loads', async ({ page }) => {
  331 |     await page.goto('/reports');
  332 | 
  333 |     await expect(page.locator('h1').or(page.locator('text=Report')).first()).toBeVisible();
  334 |   });
  335 | 
  336 |   test('R2. Charts page loads', async ({ page }) => {
  337 |     await page.goto('/charts');
  338 | 
  339 |     await expect(page.locator('h1').or(page.locator('text=Chart')).first()).toBeVisible();
  340 |   });
  341 | 
  342 |   test('R3. Dashboards page loads', async ({ page }) => {
  343 |     await page.goto('/dashboards');
  344 | 
  345 |     await expect(page.locator('h1').or(page.locator('text=Dashboard')).first()).toBeVisible();
  346 |   });
  347 | });
  348 | 
  349 | test.describe('Admin Functions', () => {
  350 |   test.beforeEach(async ({ page }) => {
  351 |     // Login before each test
  352 |     await page.goto('/login');
  353 |     await page.fill('input[name="email"], input[type="email"]', 'admin@admin.com');
  354 |     await page.fill('input[name="password"], input[type="password"]', 'admin');
  355 |     await page.click('button[type="submit"]');
  356 |     await page.waitForURL(/\//);
  357 |   });
  358 | 
  359 |   test('ADM1. Users page loads', async ({ page }) => {
  360 |     await page.goto('/admin/users');
  361 | 
  362 |     await expect(page.locator('h1').or(page.locator('text=User')).first()).toBeVisible();
  363 |   });
  364 | 
  365 |   test('ADM2. Roles page loads', async ({ page }) => {
  366 |     await page.goto('/admin/roles');
  367 | 
  368 |     await expect(page.locator('h1').or(page.locator('text=Role')).first()).toBeVisible();
  369 |   });
  370 | 
  371 |   test('ADM3. Settings page loads', async ({ page }) => {
  372 |     await page.goto('/settings');
  373 | 
  374 |     await expect(page.locator('h1').first()).toBeVisible();
  375 |   });
  376 | });
  377 | 
```
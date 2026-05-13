# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-comprehensive.spec.ts >> Admin Functions >> ADM3. Settings page loads
- Location: e2e/load-comprehensive.spec.ts:371:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/login
Call log:
  - navigating to "http://localhost:4050/login", waiting until "load"

```

# Test source

```ts
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
> 352 |     await page.goto('/login');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/login
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
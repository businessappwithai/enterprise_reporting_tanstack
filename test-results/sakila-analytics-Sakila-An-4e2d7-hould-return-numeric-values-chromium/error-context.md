# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sakila-analytics.spec.ts >> Sakila Analytics - Data Quality >> revenue queries should return numeric values
- Location: e2e/sakila-analytics.spec.ts:374:3

# Error details

```
TypeError: Cannot read properties of undefined (reading 'items')
```

# Test source

```ts
  279 |     expect(dashboard).toBeDefined();
  280 |   });
  281 | 
  282 |   test('dashboard should be public', async ({ request }) => {
  283 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  284 |     const response = await apiHelpers.getDashboards();
  285 |     const data = await ApiTestHelpers.extractJson(response);
  286 |     const dashboard = data.data.items.find((d: any) => d.name === 'Sakila Analytics Dashboard');
  287 | 
  288 |     expect(dashboard.is_public).toBe(true);
  289 |   });
  290 | });
  291 | 
  292 | test.describe('Sakila Analytics - UI Integration', () => {
  293 |   let testHelpers: TestHelpers;
  294 | 
  295 |   test.beforeEach(async ({ page }) => {
  296 |     testHelpers = new TestHelpers(page);
  297 |     await testHelpers.login();
  298 |   });
  299 | 
  300 |   test('should display saved queries page', async ({ page }) => {
  301 |     await testHelpers.navigateToPage('SQL Editor');
  302 |     await page.waitForTimeout(2000);
  303 | 
  304 |     const hasQueriesSection = await page.locator('text=/saved|queries|recent/i').isVisible().catch(() => false);
  305 |     expect(hasQueriesSection).toBeTruthy();
  306 |   });
  307 | 
  308 |   test('should display reports page', async ({ page }) => {
  309 |     await page.goto('/reports');
  310 |     await page.waitForLoadState('domcontentloaded');
  311 |     await page.waitForTimeout(2000);
  312 | 
  313 |     const hasReportList = await page.locator('text=/report|Monthly Revenue|Store Performance/i').isVisible().catch(() => false);
  314 |     expect(hasReportList).toBeTruthy();
  315 |   });
  316 | 
  317 |   test('should display charts page', async ({ page }) => {
  318 |     await page.goto('/charts');
  319 |     await page.waitForLoadState('domcontentloaded');
  320 |     await page.waitForTimeout(2000);
  321 | 
  322 |     const hasChartList = await page.locator('text=/chart|Revenue|Category/i').isVisible().catch(() => false);
  323 |     expect(hasChartList).toBeTruthy();
  324 |   });
  325 | 
  326 |   test('should display dashboards page', async ({ page }) => {
  327 |     await page.goto('/dashboards');
  328 |     await page.waitForLoadState('domcontentloaded');
  329 |     await page.waitForTimeout(2000);
  330 | 
  331 |     const hasDashboardList = await page.locator('text=/dashboard|Sakila Analytics/i').isVisible().catch(() => false);
  332 |     expect(hasDashboardList).toBeTruthy();
  333 |   });
  334 | });
  335 | 
  336 | test.describe('Sakila Analytics - Data Quality', () => {
  337 |   let authCookie: string;
  338 |   let authContext: any;
  339 |   let authPage: any;
  340 | 
  341 |   test.beforeAll(async ({ browser }) => {
  342 |     authContext = await browser.newContext();
  343 |     authPage = await authContext.newPage();
  344 | 
  345 |     const testHelpers = new TestHelpers(authPage);
  346 |     await testHelpers.login();
  347 | 
  348 |     const cookies = await authContext.cookies();
  349 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  350 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  351 |   });
  352 | 
  353 |   test.afterAll(async () => {
  354 |     if (authPage) await authPage.close();
  355 |     if (authContext) await authContext.close();
  356 |   });
  357 | 
  358 |   test('queries should return data with proper structure', async ({ request }) => {
  359 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  360 |     const queriesResponse = await apiHelpers.getQueries();
  361 |     const queriesData = await ApiTestHelpers.extractJson(queriesResponse);
  362 |     const query = queriesData.data.items.find((q: any) => q.name === 'Monthly Revenue Trend');
  363 | 
  364 |     const executeResponse = await apiHelpers.executeQuery(query.id);
  365 |     const result = await ApiTestHelpers.extractJson(executeResponse);
  366 | 
  367 |     expect(result.success).toBe(true);
  368 |     expect(result.data).toHaveProperty('rows');
  369 |     expect(result.data).toHaveProperty('columns');
  370 |     expect(Array.isArray(result.data.rows)).toBe(true);
  371 |     expect(Array.isArray(result.data.columns)).toBe(true);
  372 |   });
  373 | 
  374 |   test('revenue queries should return numeric values', async ({ request }) => {
  375 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  376 |     const queriesResponse = await apiHelpers.getQueries();
  377 |     const queriesData = await ApiTestHelpers.extractJson(queriesResponse);
  378 | 
> 379 |     const revenueQuery = queriesData.data.items.find((q: any) => q.name === 'Monthly Revenue Trend');
      |                                           ^ TypeError: Cannot read properties of undefined (reading 'items')
  380 |     const executeResponse = await apiHelpers.executeQuery(revenueQuery.id);
  381 |     const result = await ApiTestHelpers.extractJson(executeResponse);
  382 | 
  383 |     expect(result.data.rows.length).toBeGreaterThan(0);
  384 |     expect(result.data.rows[0]).toHaveProperty('total_revenue');
  385 |   });
  386 | 
  387 |   test('top performing films query should return 10 or fewer results', async ({ request }) => {
  388 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  389 |     const queriesResponse = await apiHelpers.getQueries();
  390 |     const queriesData = await ApiTestHelpers.extractJson(queriesResponse);
  391 | 
  392 |     const filmsQuery = queriesData.data.items.find((q: any) => q.name === 'Top 10 Performing Films');
  393 |     const executeResponse = await apiHelpers.executeQuery(filmsQuery.id);
  394 |     const result = await ApiTestHelpers.extractJson(executeResponse);
  395 | 
  396 |     expect(result.data.rows.length).toBeLessThanOrEqual(10);
  397 |   });
  398 | });
  399 | 
  400 | test.describe('Sakila Analytics - Performance', () => {
  401 |   let authCookie: string;
  402 |   let authContext: any;
  403 |   let authPage: any;
  404 | 
  405 |   test.beforeAll(async ({ browser }) => {
  406 |     authContext = await browser.newContext();
  407 |     authPage = await authContext.newPage();
  408 | 
  409 |     const testHelpers = new TestHelpers(authPage);
  410 |     await testHelpers.login();
  411 | 
  412 |     const cookies = await authContext.cookies();
  413 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  414 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  415 |   });
  416 | 
  417 |   test.afterAll(async () => {
  418 |     if (authPage) await authPage.close();
  419 |     if (authContext) await authContext.close();
  420 |   });
  421 | 
  422 |   test('queries should execute within reasonable time', async ({ request }) => {
  423 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  424 |     const queriesResponse = await apiHelpers.getQueries();
  425 |     const queriesData = await ApiTestHelpers.extractJson(queriesResponse);
  426 | 
  427 |     const startTime = Date.now();
  428 |     const query = queriesData.data.items[0];
  429 |     const executeResponse = await apiHelpers.executeQuery(query.id);
  430 |     const duration = Date.now() - startTime;
  431 | 
  432 |     expect(executeResponse.status()).toBe(200);
  433 |     expect(duration).toBeLessThan(5000); // 5 seconds max
  434 |   });
  435 | 
  436 |   test('dashboard should load within reasonable time', async ({ request }) => {
  437 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  438 |     const startTime = Date.now();
  439 |     const response = await apiHelpers.getDashboards();
  440 |     const duration = Date.now() - startTime;
  441 | 
  442 |     expect(response.status()).toBe(200);
  443 |     expect(duration).toBeLessThan(3000); // 3 seconds max
  444 |   });
  445 | });
  446 | 
```
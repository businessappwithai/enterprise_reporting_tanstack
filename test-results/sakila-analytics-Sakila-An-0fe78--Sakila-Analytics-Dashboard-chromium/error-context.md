# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sakila-analytics.spec.ts >> Sakila Analytics - Dashboard >> should have Sakila Analytics Dashboard
- Location: e2e/sakila-analytics.spec.ts:272:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
```

# Test source

```ts
  175 | 
  176 |   test('should fetch report data', async ({ request }) => {
  177 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  178 |     const reportsResponse = await apiHelpers.getReports();
  179 |     const reportsData = await ApiTestHelpers.extractJson(reportsResponse);
  180 |     const report = reportsData.data.items.find((r: any) => r.name === 'Monthly Revenue Report');
  181 | 
  182 |     const dataResponse = await apiHelpers.getReportData(report.id);
  183 |     expect(dataResponse.status()).toBe(200);
  184 | 
  185 |     const result = await ApiTestHelpers.extractJson(dataResponse);
  186 |     expect(result.success).toBe(true);
  187 |     expect(result.data.rows).toBeInstanceOf(Array);
  188 |   });
  189 | });
  190 | 
  191 | test.describe('Sakila Analytics - Charts', () => {
  192 |   let authCookie: string;
  193 |   let authContext: any;
  194 |   let authPage: any;
  195 | 
  196 |   test.beforeAll(async ({ browser }) => {
  197 |     authContext = await browser.newContext();
  198 |     authPage = await authContext.newPage();
  199 | 
  200 |     const testHelpers = new TestHelpers(authPage);
  201 |     await testHelpers.login();
  202 | 
  203 |     const cookies = await authContext.cookies();
  204 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  205 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  206 |   });
  207 | 
  208 |   test.afterAll(async () => {
  209 |     if (authPage) await authPage.close();
  210 |     if (authContext) await authContext.close();
  211 |   });
  212 | 
  213 |   test('should have Revenue Over Time chart', async ({ request }) => {
  214 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  215 |     const response = await apiHelpers.getCharts();
  216 |     expect(response.status()).toBe(200);
  217 | 
  218 |     const data = await ApiTestHelpers.extractJson(response);
  219 |     const chart = data.data.items.find((c: any) => c.name === 'Revenue Over Time');
  220 |     expect(chart).toBeDefined();
  221 |     expect(chart.chart_type).toBe('line');
  222 |   });
  223 | 
  224 |   test('should have Revenue by Category chart', async ({ request }) => {
  225 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  226 |     const response = await apiHelpers.getCharts();
  227 |     expect(response.status()).toBe(200);
  228 | 
  229 |     const data = await ApiTestHelpers.extractJson(response);
  230 |     const chart = data.data.items.find((c: any) => c.name === 'Revenue by Category');
  231 |     expect(chart).toBeDefined();
  232 |     expect(chart.chart_type).toBe('bar');
  233 |   });
  234 | 
  235 |   test('should fetch chart data', async ({ request }) => {
  236 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  237 |     const chartsResponse = await apiHelpers.getCharts();
  238 |     const chartsData = await ApiTestHelpers.extractJson(chartsResponse);
  239 |     const chart = chartsData.data.items.find((c: any) => c.name === 'Revenue Over Time');
  240 | 
  241 |     const dataResponse = await apiHelpers.getChartData(chart.id);
  242 |     expect(dataResponse.status()).toBe(200);
  243 | 
  244 |     const result = await ApiTestHelpers.extractJson(dataResponse);
  245 |     expect(result.success).toBe(true);
  246 |     expect(result.data.rows).toBeInstanceOf(Array);
  247 |   });
  248 | });
  249 | 
  250 | test.describe('Sakila Analytics - Dashboard', () => {
  251 |   let authCookie: string;
  252 |   let authContext: any;
  253 |   let authPage: any;
  254 | 
  255 |   test.beforeAll(async ({ browser }) => {
  256 |     authContext = await browser.newContext();
  257 |     authPage = await authContext.newPage();
  258 | 
  259 |     const testHelpers = new TestHelpers(authPage);
  260 |     await testHelpers.login();
  261 | 
  262 |     const cookies = await authContext.cookies();
  263 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  264 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  265 |   });
  266 | 
  267 |   test.afterAll(async () => {
  268 |     if (authPage) await authPage.close();
  269 |     if (authContext) await authContext.close();
  270 |   });
  271 | 
  272 |   test('should have Sakila Analytics Dashboard', async ({ request }) => {
  273 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  274 |     const response = await apiHelpers.getDashboards();
> 275 |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  276 | 
  277 |     const data = await ApiTestHelpers.extractJson(response);
  278 |     const dashboard = data.data.items.find((d: any) => d.name === 'Sakila Analytics Dashboard');
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
```
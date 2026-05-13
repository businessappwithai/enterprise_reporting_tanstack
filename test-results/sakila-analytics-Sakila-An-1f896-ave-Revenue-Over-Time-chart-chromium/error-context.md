# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sakila-analytics.spec.ts >> Sakila Analytics - Charts >> should have Revenue Over Time chart
- Location: e2e/sakila-analytics.spec.ts:213:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
```

# Test source

```ts
  116 |     const queriesData = await ApiTestHelpers.extractJson(queriesResponse);
  117 |     const query = queriesData.data.items.find((q: any) => q.name === 'Revenue by Film Category');
  118 | 
  119 |     const executeResponse = await apiHelpers.executeQuery(query.id);
  120 |     expect(executeResponse.status()).toBe(200);
  121 | 
  122 |     const result = await ApiTestHelpers.extractJson(executeResponse);
  123 |     expect(result.success).toBe(true);
  124 |     expect(result.data.rows).toBeInstanceOf(Array);
  125 |   });
  126 | 
  127 |   test('should execute Top Customers query', async ({ request }) => {
  128 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  129 |     const queriesResponse = await apiHelpers.getQueries();
  130 |     const queriesData = await ApiTestHelpers.extractJson(queriesResponse);
  131 |     const query = queriesData.data.items.find((q: any) => q.name === 'Top Customers by Spending');
  132 | 
  133 |     const executeResponse = await apiHelpers.executeQuery(query.id);
  134 |     expect(executeResponse.status()).toBe(200);
  135 | 
  136 |     const result = await ApiTestHelpers.extractJson(executeResponse);
  137 |     expect(result.success).toBe(true);
  138 |     expect(result.data.rows).toBeInstanceOf(Array);
  139 |     expect(result.data.rows.length).toBeGreaterThan(0);
  140 |   });
  141 | });
  142 | 
  143 | test.describe('Sakila Analytics - Reports', () => {
  144 |   let authCookie: string;
  145 |   let authContext: any;
  146 |   let authPage: any;
  147 | 
  148 |   test.beforeAll(async ({ browser }) => {
  149 |     authContext = await browser.newContext();
  150 |     authPage = await authContext.newPage();
  151 | 
  152 |     const testHelpers = new TestHelpers(authPage);
  153 |     await testHelpers.login();
  154 | 
  155 |     const cookies = await authContext.cookies();
  156 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  157 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  158 |   });
  159 | 
  160 |   test.afterAll(async () => {
  161 |     if (authPage) await authPage.close();
  162 |     if (authContext) await authContext.close();
  163 |   });
  164 | 
  165 |   test('should have Monthly Revenue Report', async ({ request }) => {
  166 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  167 |     const response = await apiHelpers.getReports();
  168 |     expect(response.status()).toBe(200);
  169 | 
  170 |     const data = await ApiTestHelpers.extractJson(response);
  171 |     const report = data.data.items.find((r: any) => r.name === 'Monthly Revenue Report');
  172 |     expect(report).toBeDefined();
  173 |     expect(report.description).toContain('revenue');
  174 |   });
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
> 216 |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
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
  275 |     expect(response.status()).toBe(200);
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
```
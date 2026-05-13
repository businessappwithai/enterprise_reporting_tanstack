# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Charts >> 5.1 Can view charts list
- Location: e2e/complete-system-test.spec.ts:330:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').filter({ hasText: /charts/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').filter({ hasText: /charts/i })

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
  233 | 
  234 |       if (await schemaBrowser.isVisible()) {
  235 |         // Should expand to show tables
  236 |         await expect(schemaBrowser).toBeVisible();
  237 |       }
  238 |     });
  239 |   });
  240 | 
  241 |   // ========================================================================
  242 |   // PART 4: REPORTS
  243 |   // ========================================================================
  244 | 
  245 |   test.describe('Reports', () => {
  246 |     test.beforeEach(async ({ page }) => {
  247 |       await login(page);
  248 |     });
  249 | 
  250 |     test('4.1 Can view reports list', async ({ page }) => {
  251 |       await page.goto(`${BASE_URL}/reports`);
  252 | 
  253 |       await expect(page.locator('h1').filter({ hasText: /reports/i })).toBeVisible();
  254 |       await expect(page.locator('table, [role="table"], .grid')).toBeVisible();
  255 |     });
  256 | 
  257 |     test('4.2 Can create a new report', async ({ page }) => {
  258 |       await page.goto(`${BASE_URL}/reports`);
  259 | 
  260 |       // Click new report button
  261 |       await page.click('button:has-text("New Report"), button:has-text("Create Report")');
  262 | 
  263 |       // Should navigate to editor or show dialog
  264 |       await page.waitForTimeout(2000);
  265 | 
  266 |       // Fill report name
  267 |       const reportName = `E2E Report ${Date.now()}`;
  268 |       const nameInput = page.locator('input[name="name"], input[placeholder*="name"]');
  269 |       if (await nameInput.isVisible()) {
  270 |         await nameInput.fill(reportName);
  271 |       }
  272 | 
  273 |       // Select data source
  274 |       const dataSourceSelect = page.locator('select[name="dataSource"], [role="combobox"]').first();
  275 |       if (await dataSourceSelect.isVisible()) {
  276 |         await dataSourceSelect.click();
  277 |         await page.keyboard.press('ArrowDown');
  278 |         await page.keyboard.press('Enter');
  279 |       }
  280 | 
  281 |       // Save
  282 |       const saveButton = page.locator('button:has-text("Save"), button:has-text("Create")').first();
  283 |       if (await saveButton.isVisible()) {
  284 |         await saveButton.click();
  285 |         await page.waitForTimeout(2000);
  286 |       }
  287 |     });
  288 | 
  289 |     test('4.3 Can view report details', async ({ page }) => {
  290 |       await page.goto(`${BASE_URL}/reports`);
  291 | 
  292 |       // Click on first report
  293 |       const firstReport = page.locator('table tbody tr, [role="row"], .card').first();
  294 |       const count = await firstReport.count();
  295 | 
  296 |       if (count > 0) {
  297 |         await firstReport.first().click();
  298 |         await page.waitForTimeout(2000);
  299 | 
  300 |         // Should show report details or data
  301 |         const hasContent = await page.locator('table, .report-data, .chart').count() > 0;
  302 |         expect(hasContent).toBeTruthy();
  303 |       }
  304 |     });
  305 | 
  306 |     test('4.4 Can export report data', async ({ page }) => {
  307 |       await page.goto(`${BASE_URL}/reports`);
  308 | 
  309 |       // Look for export buttons
  310 |       const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")').first();
  311 | 
  312 |       if (await exportButton.isVisible()) {
  313 |         await exportButton.click();
  314 | 
  315 |         // Should show export options
  316 |         await expect(page.locator('text=CSV, text=PDF, text=Excel')).isVisible({ timeout: 3000 });
  317 |       }
  318 |     });
  319 |   });
  320 | 
  321 |   // ========================================================================
  322 |   // PART 5: CHARTS
  323 |   // ========================================================================
  324 | 
  325 |   test.describe('Charts', () => {
  326 |     test.beforeEach(async ({ page }) => {
  327 |       await login(page);
  328 |     });
  329 | 
  330 |     test('5.1 Can view charts list', async ({ page }) => {
  331 |       await page.goto(`${BASE_URL}/charts`);
  332 | 
> 333 |       await expect(page.locator('h1').filter({ hasText: /charts/i })).toBeVisible();
      |                                                                       ^ Error: expect(locator).toBeVisible() failed
  334 |     });
  335 | 
  336 |     test('5.2 Can create a bar chart', async ({ page }) => {
  337 |       await page.goto(`${BASE_URL}/charts`);
  338 | 
  339 |       // Click new chart
  340 |       await page.click('button:has-text("New Chart"), button:has-text("Create Chart")');
  341 | 
  342 |       // Wait for editor
  343 |       await page.waitForTimeout(2000);
  344 | 
  345 |       // Select chart type
  346 |       const chartTypeSelect = page.locator('select[name="type"], [role="combobox"]').first();
  347 |       if (await chartTypeSelect.isVisible()) {
  348 |         await chartTypeSelect.click();
  349 |         await page.click('text=Bar');
  350 |       }
  351 | 
  352 |       // Fill name
  353 |       const chartName = `E2E Bar Chart ${Date.now()}`;
  354 |       const nameInput = page.locator('input[name="name"]');
  355 |       if (await nameInput.isVisible()) {
  356 |         await nameInput.fill(chartName);
  357 |       }
  358 | 
  359 |       // Save
  360 |       const saveButton = page.locator('button:has-text("Save")').first();
  361 |       if (await saveButton.isVisible()) {
  362 |         await saveButton.click();
  363 |         await page.waitForTimeout(2000);
  364 |       }
  365 |     });
  366 | 
  367 |     test('5.3 Can create a line chart', async ({ page }) => {
  368 |       await page.goto(`${BASE_URL}/charts/editor/new`);
  369 | 
  370 |       await page.waitForTimeout(2000);
  371 | 
  372 |       // Select line chart type
  373 |       const chartTypeSelect = page.locator('select[name="type"], [role="combobox"]').first();
  374 |       if (await chartTypeSelect.isVisible()) {
  375 |         await chartTypeSelect.click();
  376 |         await page.click('text=Line');
  377 |       }
  378 |     });
  379 | 
  380 |     test('5.4 Can create a pie chart', async ({ page }) => {
  381 |       await page.goto(`${BASE_URL}/charts/editor/new`);
  382 | 
  383 |       await page.waitForTimeout(2000);
  384 | 
  385 |       // Select pie chart type
  386 |       const chartTypeSelect = page.locator('select[name="type"], [role="combobox"]').first();
  387 |       if (await chartTypeSelect.isVisible()) {
  388 |         await chartTypeSelect.click();
  389 |         await page.click('text=Pie');
  390 |       }
  391 |     });
  392 | 
  393 |     test('5.5 Chart renders correctly', async ({ page }) => {
  394 |       await page.goto(`${BASE_URL}/charts`);
  395 | 
  396 |       // Click on existing chart if any
  397 |       const firstChart = page.locator('.chart-card, [data-testid="chart"], canvas').first();
  398 | 
  399 |       if (await firstChart.isVisible()) {
  400 |         await page.waitForTimeout(2000);
  401 | 
  402 |         // Check for chart rendering (canvas or svg)
  403 |         const hasChart = await page.locator('canvas, svg, .echarts, .recharts').count() > 0;
  404 |         expect(hasChart).toBeTruthy();
  405 |       }
  406 |     });
  407 |   });
  408 | 
  409 |   // ========================================================================
  410 |   // PART 6: DASHBOARDS
  411 |   // ========================================================================
  412 | 
  413 |   test.describe('Dashboards', () => {
  414 |     test.beforeEach(async ({ page }) => {
  415 |       await login(page);
  416 |     });
  417 | 
  418 |     test('6.1 Can view dashboards list', async ({ page }) => {
  419 |       await page.goto(`${BASE_URL}/dashboards`);
  420 | 
  421 |       await expect(page.locator('h1').filter({ hasText: /dashboards/i })).toBeVisible();
  422 |     });
  423 | 
  424 |     test('6.2 Can create a new dashboard', async ({ page }) => {
  425 |       await page.goto(`${BASE_URL}/dashboards`);
  426 | 
  427 |       // Click new dashboard
  428 |       await page.click('button:has-text("New Dashboard"), button:has-text("Create Dashboard")');
  429 | 
  430 |       // Fill name
  431 |       const dashboardName = `E2E Dashboard ${Date.now()}`;
  432 |       await page.fill('input[name="name"]', dashboardName);
  433 | 
```
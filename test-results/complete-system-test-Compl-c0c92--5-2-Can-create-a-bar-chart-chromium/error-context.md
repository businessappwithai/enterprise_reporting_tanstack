# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Charts >> 5.2 Can create a bar chart
- Location: e2e/complete-system-test.spec.ts:336:5

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("New Chart"), button:has-text("Create Chart")')

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
        - button "Sakila Demo DB sqlite3" [ref=e115] [cursor=pointer]:
          - img [ref=e116]
          - generic [ref=e120]: Sakila Demo DB
          - generic [ref=e121]: sqlite3
        - generic [ref=e122]:
          - button "Toggle theme" [ref=e123] [cursor=pointer]:
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
            - generic [ref=e142]:
              - heading "Charts" [level=1] [ref=e143]
              - paragraph [ref=e144]: Create and manage data visualizations
            - generic [ref=e145]:
              - link "Open Chart Editor" [ref=e146] [cursor=pointer]:
                - /url: /charts/editor/new
                - button "Open Chart Editor" [ref=e147]:
                  - img [ref=e148]
                  - text: Open Chart Editor
              - button "Quick Create" [ref=e149] [cursor=pointer]:
                - img [ref=e150]
                - text: Quick Create
          - generic [ref=e151]:
            - heading "All Charts" [level=3] [ref=e153]:
              - img [ref=e154]
              - text: All Charts
            - table [ref=e158]:
              - rowgroup [ref=e159]:
                - row "Name Type Query Created Actions" [ref=e160]:
                  - columnheader "Name" [ref=e161]
                  - columnheader "Type" [ref=e162]
                  - columnheader "Query" [ref=e163]
                  - columnheader "Created" [ref=e164]
                  - columnheader "Actions" [ref=e165]
              - rowgroup [ref=e166]:
                - row "Top Products Bar Chart bar No Query May 13, 2026, 05:51 PM" [ref=e167]:
                  - cell "Top Products Bar Chart" [ref=e168]
                  - cell "bar" [ref=e169]:
                    - generic [ref=e170]:
                      - img [ref=e171]
                      - text: bar
                  - cell "No Query" [ref=e173]:
                    - generic [ref=e174]: No Query
                  - cell "May 13, 2026, 05:51 PM" [ref=e175]
                  - cell [ref=e176]:
                    - button [ref=e177] [cursor=pointer]:
                      - img [ref=e178]
                - row "Regional Comparison bar No Query May 13, 2026, 05:51 PM" [ref=e182]:
                  - cell "Regional Comparison" [ref=e183]
                  - cell "bar" [ref=e184]:
                    - generic [ref=e185]:
                      - img [ref=e186]
                      - text: bar
                  - cell "No Query" [ref=e188]:
                    - generic [ref=e189]: No Query
                  - cell "May 13, 2026, 05:51 PM" [ref=e190]
                  - cell [ref=e191]:
                    - button [ref=e192] [cursor=pointer]:
                      - img [ref=e193]
                - row "Regional Sales Distribution pie No Query May 13, 2026, 05:51 PM" [ref=e197]:
                  - cell "Regional Sales Distribution" [ref=e198]
                  - cell "pie" [ref=e199]:
                    - generic [ref=e200]:
                      - img [ref=e201]
                      - text: pie
                  - cell "No Query" [ref=e204]:
                    - generic [ref=e205]: No Query
                  - cell "May 13, 2026, 05:51 PM" [ref=e206]
                  - cell [ref=e207]:
                    - button [ref=e208] [cursor=pointer]:
                      - img [ref=e209]
                - row "Sales Trend line No Query May 13, 2026, 05:51 PM" [ref=e213]:
                  - cell "Sales Trend" [ref=e214]
                  - cell "line" [ref=e215]:
                    - generic [ref=e216]:
                      - img [ref=e217]
                      - text: line
                  - cell "No Query" [ref=e220]:
                    - generic [ref=e221]: No Query
                  - cell "May 13, 2026, 05:51 PM" [ref=e222]
                  - cell [ref=e223]:
                    - button [ref=e224] [cursor=pointer]:
                      - img [ref=e225]
  - region "Notifications alt+T"
```

# Test source

```ts
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
  333 |       await expect(page.locator('h1').filter({ hasText: /charts/i })).toBeVisible();
  334 |     });
  335 | 
  336 |     test('5.2 Can create a bar chart', async ({ page }) => {
  337 |       await page.goto(`${BASE_URL}/charts`);
  338 | 
  339 |       // Click new chart
> 340 |       await page.click('button:has-text("New Chart"), button:has-text("Create Chart")');
      |                  ^ TimeoutError: page.click: Timeout 15000ms exceeded.
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
  434 |       // Save
  435 |       await page.click('button:has-text("Save"), button:has-text("Create")');
  436 | 
  437 |       await page.waitForTimeout(2000);
  438 |     });
  439 | 
  440 |     test('6.3 Can add widgets to dashboard', async ({ page }) => {
```
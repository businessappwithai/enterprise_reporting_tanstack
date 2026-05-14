# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - TanStack Table >> WASM-019: Table uses virtual scrolling
- Location: e2e/wasm-features-complete.spec.ts:347:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.monaco-editor')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.monaco-editor')

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
              - heading "SQL Editor" [level=1] [ref=e143]
              - paragraph [ref=e144]: Write and execute SQL queries
            - generic [ref=e145]:
              - button "Validate" [ref=e146] [cursor=pointer]
              - button "Run Query" [ref=e147] [cursor=pointer]
              - button "Save Query" [disabled] [ref=e148]
          - generic [ref=e150]:
            - paragraph [ref=e151]: "Data Source:"
            - button "▲" [ref=e152] [cursor=pointer]
          - button "Loading SQL Editor..." [ref=e153]:
            - generic [ref=e157]:
              - img [ref=e158]
              - generic [ref=e160]: Loading SQL Editor...
          - generic [ref=e161]:
            - generic [ref=e162]:
              - paragraph [ref=e163]: Schema Browser (Select a data source)
              - button "▼" [ref=e165] [cursor=pointer]
            - paragraph [ref=e167]: Select a data source to view schema
          - generic [ref=e168]:
            - generic [ref=e169]:
              - button "Results" [ref=e170] [cursor=pointer]
              - button "Errors" [ref=e171] [cursor=pointer]
              - button "Logs" [ref=e172] [cursor=pointer]
            - paragraph [ref=e176]: No results yet. Run a query to see results here.
  - region "Notifications alt+T"
```

# Test source

```ts
  250 |     await page.click('button:has-text("Run"), button:has-text("Execute")');
  251 | 
  252 |     // Wait for results
  253 |     await page.waitForTimeout(3000);
  254 | 
  255 |     // Should show results in a table or grid
  256 |     const hasResults = await page.locator('table, [role="table"], .data-grid, .tanstack-table').count() > 0;
  257 | 
  258 |     // Note: Query might fail if no data source is configured, that's okay
  259 |     // We're just testing the UI flow
  260 |   });
  261 | 
  262 |   test('WASM-014: Memory monitor is present', async ({ page }) => {
  263 |     await page.goto(`${BASE_URL}/datasets`);
  264 | 
  265 |     await page.waitForTimeout(2000);
  266 | 
  267 |     // Look for memory monitor (might be subtle)
  268 |     const memoryMonitor = page.locator('.memory-monitor, [data-testid="memory-usage"], text=/memory/i');
  269 | 
  270 |     if (await memoryMonitor.isVisible()) {
  271 |       await expect(memoryMonitor.first()).toBeVisible();
  272 |     }
  273 |     // If not visible, that's okay - it might be in a collapsed state
  274 |   });
  275 | 
  276 |   test('WASM-015: Large dataset uses progressive loading', async ({ page }) => {
  277 |     await page.goto(`${BASE_URL}/datasets`);
  278 | 
  279 |     await page.waitForTimeout(3000);
  280 | 
  281 |     // Look for progressive loading indicator
  282 |     const progressIndicator = page.locator('.progress, [data-testid="progress"], text=/loading/i');
  283 | 
  284 |     // Progressive loading might not be active if no large datasets
  285 |     if (await progressIndicator.isVisible()) {
  286 |       await expect(progressIndicator.first()).toBeVisible();
  287 |     }
  288 |   });
  289 | });
  290 | 
  291 | test.describe('WASM Features - Offline Mode', () => {
  292 |   test.beforeEach(async ({ page }) => {
  293 |     await login(page);
  294 |   });
  295 | 
  296 |   test('WASM-016: Offline indicator shows connection status', async ({ page }) => {
  297 |     await page.goto(`${BASE_URL}/datasets`);
  298 | 
  299 |     await page.waitForTimeout(2000);
  300 | 
  301 |     // Look for offline indicator
  302 |     const offlineIndicator = page.locator('[data-testid="offline-indicator"], .offline-status, text=/online|offline/i');
  303 | 
  304 |     if (await offlineIndicator.isVisible()) {
  305 |       await expect(offlineIndicator.first()).toBeVisible();
  306 |     }
  307 |     // If not visible, offline mode might not be enabled or user is online
  308 |   });
  309 | 
  310 |   test('WASM-017: Cached datasets are indicated', async ({ page }) => {
  311 |     await page.goto(`${BASE_URL}/datasets`);
  312 | 
  313 |     await page.waitForTimeout(3000);
  314 | 
  315 |     // Look for cached indicator on dataset cards
  316 |     const cachedIndicator = page.locator('.cached, [data-cached="true"], text=/cached/i');
  317 | 
  318 |     // Might not have cached datasets
  319 |     if (await cachedIndicator.isVisible()) {
  320 |       await expect(cachedIndicator.first()).toBeVisible();
  321 |     }
  322 |   });
  323 | 
  324 |   test('WASM-018: Can access datasets offline simulation', async ({ page }) => {
  325 |     // Note: This is a simulation test - real offline testing requires service worker mocking
  326 | 
  327 |     await page.goto(`${BASE_URL}/datasets`);
  328 | 
  329 |     await page.waitForTimeout(3000);
  330 | 
  331 |     // Check if offline features are mentioned in UI
  332 |     const offlineFeatures = page.locator('text=IndexedDB, text=Offline, text=Cache');
  333 | 
  334 |     // Offline features might be in documentation or subtle UI
  335 |     const featureCount = await offlineFeatures.count();
  336 | 
  337 |     // At minimum, the page should load
  338 |     await expect(page.locator('h1')).toBeVisible();
  339 |   });
  340 | });
  341 | 
  342 | test.describe('WASM Features - TanStack Table', () => {
  343 |   test.beforeEach(async ({ page }) => {
  344 |     await login(page);
  345 |   });
  346 | 
  347 |   test('WASM-019: Table uses virtual scrolling', async ({ page }) => {
  348 |     await page.goto(`${BASE_URL}/sql-editor`);
  349 | 
> 350 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  351 | 
  352 |     // Execute a query
  353 |     await page.keyboard.type('SELECT * FROM users LIMIT 1000');
  354 |     await page.click('button:has-text("Run"), button:has-text("Execute")');
  355 | 
  356 |     await page.waitForTimeout(3000);
  357 | 
  358 |     // Look for TanStack Table or virtual scrolling indicator
  359 |     const table = page.locator('table, [role="table"], .tanstack-table').first();
  360 | 
  361 |     if (await table.isVisible()) {
  362 |       await expect(table).toBeVisible();
  363 | 
  364 |       // Check if virtual scrolling is enabled (TanStack Virtual uses specific DOM structure)
  365 |       const hasVirtualScroll = await page.locator('.virtual, [data-virtualized]').count() > 0;
  366 | 
  367 |       // Virtual scrolling might not be visible if result set is small
  368 |       // The important thing is the table renders
  369 |     }
  370 |   });
  371 | 
  372 |   test('WASM-020: Table supports sorting', async ({ page }) => {
  373 |     await page.goto(`${BASE_URL}/sql-editor`);
  374 | 
  375 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  376 | 
  377 |     // Execute query
  378 |     await page.keyboard.type('SELECT id, name FROM users LIMIT 100');
  379 |     await page.click('button:has-text("Run"), button:has-text("Execute")');
  380 | 
  381 |     await page.waitForTimeout(3000);
  382 | 
  383 |     // Look for sortable column headers
  384 |     const sortableHeader = page.locator('th[aria-sort], th.sortable, .sortable').first();
  385 | 
  386 |     if (await sortableHeader.isVisible()) {
  387 |       // Click to sort
  388 |       await sortableHeader.click();
  389 |       await page.waitForTimeout(1000);
  390 | 
  391 |       // Check if sort indicator changed
  392 |       const hasSortIndicator = await page.locator('th[aria-sort*="asc"], th[aria-sort*="desc"]').count() > 0;
  393 |       expect(hasSortIndicator).toBeTruthy();
  394 |     }
  395 |   });
  396 | 
  397 |   test('WASM-021: Table supports column filtering', async ({ page }) => {
  398 |     await page.goto(`${BASE_URL}/reports`);
  399 | 
  400 |     await page.waitForTimeout(2000);
  401 | 
  402 |     // Look for filter inputs in table
  403 |     const filterInput = page.locator('input[placeholder*="filter"], input[placeholder*="search"], th input').first();
  404 | 
  405 |     if (await filterInput.isVisible()) {
  406 |       await filterInput.fill('test');
  407 |       await page.waitForTimeout(1000);
  408 | 
  409 |       // Should filter results (we can't easily verify this without knowing the data)
  410 |       // Just check the interaction works
  411 |       await expect(filterInput).toHaveValue('test');
  412 |     }
  413 |   });
  414 | 
  415 |   test('WASM-022: Table handles large datasets efficiently', async ({ page }) => {
  416 |     await page.goto(`${BASE_URL}/sql-editor`);
  417 | 
  418 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  419 | 
  420 |     // Execute query for larger dataset
  421 |     const startTime = Date.now();
  422 |     await page.keyboard.type('SELECT * FROM users LIMIT 5000');
  423 |     await page.click('button:has-text("Run"), button:has-text("Execute")');
  424 | 
  425 |     // Wait for results (with timeout)
  426 |     await page.waitForTimeout(5000);
  427 | 
  428 |     const loadTime = Date.now() - startTime;
  429 | 
  430 |     // Should complete within reasonable time (< 10 seconds)
  431 |     expect(loadTime).toBeLessThan(10000);
  432 |   });
  433 | });
  434 | 
  435 | test.describe('WASM Features - ECharts Integration', () => {
  436 |   test.beforeEach(async ({ page }) => {
  437 |     await login(page);
  438 |   });
  439 | 
  440 |   test('WASM-023: Chart renders using ECharts', async ({ page }) => {
  441 |     await page.goto(`${BASE_URL}/charts`);
  442 | 
  443 |     await page.waitForTimeout(2000);
  444 | 
  445 |     // Look for ECharts canvas or container
  446 |     const echartsElement = page.locator('canvas, ._echarts_instance_, .echarts').first();
  447 | 
  448 |     if (await echartsElement.isVisible()) {
  449 |       await expect(echartsElement).toBeVisible();
  450 | 
```
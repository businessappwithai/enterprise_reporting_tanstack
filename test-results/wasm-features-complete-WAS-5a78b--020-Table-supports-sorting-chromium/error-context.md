# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - TanStack Table >> WASM-020: Table supports sorting
- Location: e2e/wasm-features-complete.spec.ts:372:3

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
  350 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
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
> 375 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
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
  451 |       // Verify ECharts instance
  452 |       const hasEChartsInstance = await echartsElement.evaluate(el => {
  453 |         if (el instanceof HTMLElement) {
  454 |           return !!(el as any)._echarts_instance_;
  455 |         }
  456 |         return false;
  457 |       });
  458 | 
  459 |       // ECharts instance might be on a parent element
  460 |       // The key is the canvas/container is visible
  461 |     }
  462 |   });
  463 | 
  464 |   test('WASM-024: Chart supports interactivity', async ({ page }) => {
  465 |     await page.goto(`${BASE_URL}/charts`);
  466 | 
  467 |     await page.waitForTimeout(2000);
  468 | 
  469 |     // Find a chart
  470 |     const chart = page.locator('canvas, .echarts').first();
  471 | 
  472 |     if (await chart.isVisible()) {
  473 |       // Try to interact with it
  474 |       await chart.click({ position: { x: 100, y: 100 } });
  475 |       await page.waitForTimeout(500);
```
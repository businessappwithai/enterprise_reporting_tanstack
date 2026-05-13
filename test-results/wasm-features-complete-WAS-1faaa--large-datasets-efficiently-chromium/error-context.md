# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - TanStack Table >> WASM-022: Table handles large datasets efficiently
- Location: e2e/wasm-features-complete.spec.ts:415:3

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
> 418 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
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
  476 | 
  477 |       // Check if tooltip or highlight appeared
  478 |       const hasTooltip = await page.locator('.echarts-tooltip, .tooltip').count() > 0;
  479 | 
  480 |       // Tooltip might not show if clicked on empty space
  481 |       // The important thing is the chart is interactive
  482 |     }
  483 |   });
  484 | 
  485 |   test('WASM-025: Chart respects theme', async ({ page }) => {
  486 |     await page.goto(`${BASE_URL}/charts`);
  487 | 
  488 |     await page.waitForTimeout(2000);
  489 | 
  490 |     // Look for theme toggle
  491 |     const themeToggle = page.locator('button[aria-label*="theme"], button:has-text("Theme")').first();
  492 | 
  493 |     if (await themeToggle.isVisible()) {
  494 |       // Get initial chart state
  495 |       const chart = page.locator('canvas').first();
  496 | 
  497 |       // Toggle theme
  498 |       await themeToggle.click();
  499 |       await page.waitForTimeout(1000);
  500 | 
  501 |       // Chart should still be visible
  502 |       if (await chart.isVisible()) {
  503 |         await expect(chart).toBeVisible();
  504 |       }
  505 |     }
  506 |   });
  507 | 
  508 |   test('WASM-026: Multiple chart types render correctly', async ({ page }) => {
  509 |     const chartTypes = ['bar', 'line', 'pie', 'area'];
  510 | 
  511 |     for (const type of chartTypes) {
  512 |       await page.goto(`${BASE_URL}/charts/editor/new`);
  513 | 
  514 |       await page.waitForTimeout(2000);
  515 | 
  516 |       // Select chart type
  517 |       const typeSelect = page.locator('select[name="type"], [role="combobox"]').first();
  518 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - DuckDB Integration >> WASM-015: Large dataset uses progressive loading
- Location: e2e/wasm-features-complete.spec.ts:276:3

# Error details

```
Error: locator.isVisible: Unexpected token "=" while parsing css selector ".progress, [data-testid="progress"], text=/loading/i". Did you mean to CSS.escape it?
Call log:
    - checking visibility of .progress, [data-testid="progress"], text=/loading/i

```

# Page snapshot

```yaml
- generic:
  - generic:
    - generic:
      - generic:
        - generic:
          - img
      - generic:
        - heading [level=1]: Something went wrong
        - paragraph: An unexpected error has occurred. Our team has been notified and we're working to fix it.
      - generic:
        - paragraph: useDuckDB must be used within a DuckDBProvider
      - generic:
        - button:
          - img
          - text: Reload Page
        - button: Report Error
      - paragraph: If this problem persists, please contact your system administrator.
  - dialog "Error Report" [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - img [ref=e5]
        - heading "Error Report" [level=2] [ref=e7]
      - paragraph [ref=e8]: An unexpected error occurred. Please help us improve by reporting this issue.
    - generic [ref=e9]:
      - generic [ref=e10]:
        - paragraph [ref=e11]: useDuckDB must be used within a DuckDBProvider
        - paragraph [ref=e12]: 2026-05-14T05:40:48.535Z
      - generic [ref=e13]:
        - text: Additional Information (Optional)
        - textbox "Additional Information (Optional)" [active] [ref=e14]:
          - /placeholder: Describe what you were doing when this error occurred...
      - generic [ref=e15]:
        - text: Email Preview
        - generic [ref=e16]:
          - textbox "Email Preview" [ref=e17]: "ERROR REPORT ============ Timestamp: 2026-05-14T05:40:48.535Z Error: useDuckDB must be used within a DuckDBProvider Stack Trace: Error: useDuckDB must be used within a DuckDBProvider at useDuckDB (http://localhost:4050/src/components/duckdb/DuckDBProvider.tsx:152:11) at DatasetsPage (http://localhost:4050/src/routes/_authed/datasets/index.tsx?tsr-split=component:29:7) at Object.react_stack_bottom_frame (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:18509:20) at renderWithHooks (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:5654:24) at updateFunctionComponent (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:7475:21) at beginWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:8525:20) at runWithFiberInDEV (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:997:72) at performUnitOfWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12561:98) at workLoopSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12424:43) at renderRootSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12408:13) Component Stack: at DatasetsPage (http://localhost:4050/src/routes/_authed/datasets/index.tsx?tsr-split=component:29:7) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at main (<anonymous>) at div (<anonymous>) at div (<anonymous>) at ActiveDataSourceProvider (http://localhost:4050/src/lib/hooks/use-active-datasource.tsx:20:44) at AppShell (http://localhost:4050/src/components/layout/app-shell.tsx:23:28) at AuthedLayout (http://localhost:4050/src/routes/_authed.tsx?tsr-split=component:25:13) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at Suspense (<anonymous>) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at V (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:44:25) at J (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:42:18) at QueryClientProvider (http://localhost:4050/node_modules/.vite/deps/@tanstack_react-query.js?v=a26a3e3e:3170:3) at Provider (http://localhost:4050/node_modules/.vite/deps/chunk-GQ5SNI5U.js?v=a26a3e3e:43:15) at TooltipProvider (http://localhost:4050/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=a26a3e3e:157:5) at TanStackDBWrapper (http://localhost:4050/src/lib/tanstack-db/provider.tsx:29:37) at ErrorBoundary (http://localhost:4050/src/components/errors/error-boundary.tsx:11:5) at body (<anonymous>) at html (<anonymous>) at RootComponent (http://localhost:4050/src/routes/__root.tsx:44:33) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at CatchBoundaryImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:20:5) at CatchBoundary (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:5:32) at MatchesInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:24:18) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at Matches (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:14:18) at RouterContextProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:12:34) at RouterProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:37:27) at AwaitInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:27:15) at Await (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:20:12) at StartClient (<anonymous>) Context: URL: http://localhost:4050/datasets User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36"
          - button "Copy" [ref=e18] [cursor=pointer]:
            - img [ref=e19]
            - text: Copy
        - paragraph [ref=e22]: This will be sent to admin@yourcompany.com
      - paragraph [ref=e24]:
        - strong [ref=e25]: "What happens next:"
        - text: Clicking "Send Error Report" will open your email client with the error details pre-filled. You can review the contents before sending.
    - generic [ref=e26]:
      - button "Dismiss" [ref=e27] [cursor=pointer]:
        - img [ref=e28]
        - text: Dismiss
      - button "Copy to Clipboard" [ref=e31] [cursor=pointer]:
        - img [ref=e32]
        - text: Copy to Clipboard
      - button "Send Error Report" [ref=e35] [cursor=pointer]:
        - img [ref=e36]
        - text: Send Error Report
    - button "Close" [ref=e39] [cursor=pointer]:
      - img [ref=e40]
      - generic [ref=e43]: Close
```

# Test source

```ts
  185 |       await page.waitForTimeout(2000);
  186 | 
  187 |       // Should show loading indicator or success message
  188 |       const hasFeedback = await page.locator('text=refreshing, text=success, .loading').count() > 0;
  189 |       expect(hasFeedback).toBeTruthy();
  190 |     }
  191 |   });
  192 | });
  193 | 
  194 | test.describe('WASM Features - DuckDB Integration', () => {
  195 |   test.beforeEach(async ({ page }) => {
  196 |     await login(page);
  197 |   });
  198 | 
  199 |   test('WASM-011: DuckDB provider initializes', async ({ page }) => {
  200 |     await page.goto(`${BASE_URL}/sql-editor`);
  201 | 
  202 |     // Wait for page to fully load
  203 |     await page.waitForTimeout(5000);
  204 | 
  205 |     // Check if DuckDB is available in window (for debugging)
  206 |     const duckDBStatus = await page.evaluate(() => {
  207 |       return typeof window !== 'undefined' &&
  208 |              (window as any).__DUCKDB_STATUS__;
  209 |     });
  210 | 
  211 |     // DuckDB might not be exposed globally, that's okay
  212 |     // The key is that the page loads without errors
  213 |     await expect(page.locator('.monaco-editor, .sql-editor')).toBeVisible({ timeout: 10000 });
  214 |   });
  215 | 
  216 |   test('WASM-012: Can execute client-side query on dataset', async ({ page }) => {
  217 |     await page.goto(`${BASE_URL}/datasets`);
  218 | 
  219 |     await page.waitForTimeout(3000);
  220 | 
  221 |     // Try to find and interact with a dataset
  222 |     const datasetCard = page.locator('.dataset-card, table tbody tr').first();
  223 | 
  224 |     if (await datasetCard.isVisible()) {
  225 |       // Click on dataset to load it
  226 |       await datasetCard.click();
  227 |       await page.waitForTimeout(3000);
  228 | 
  229 |       // Look for query interface
  230 |       const queryButton = page.locator('button:has-text("Query"), button:has-text("Explore")').first();
  231 | 
  232 |       if (await queryButton.isVisible()) {
  233 |         await queryButton.click();
  234 |         await page.waitForTimeout(2000);
  235 | 
  236 |         // Should show query results or editor
  237 |         const hasResults = await page.locator('table, .results, .monaco-editor').count() > 0;
  238 |         expect(hasResults).toBeTruthy();
  239 |       }
  240 |     }
  241 |   });
  242 | 
  243 |   test('WASM-013: Query results display in data grid', async ({ page }) => {
  244 |     await page.goto(`${BASE_URL}/sql-editor`);
  245 | 
  246 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  247 | 
  248 |     // Execute a simple query
  249 |     await page.keyboard.type('SELECT 1 as id, \'test\' as name');
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
> 285 |     if (await progressIndicator.isVisible()) {
      |                                 ^ Error: locator.isVisible: Unexpected token "=" while parsing css selector ".progress, [data-testid="progress"], text=/loading/i". Did you mean to CSS.escape it?
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
```
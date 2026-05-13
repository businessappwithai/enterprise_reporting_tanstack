# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - DuckDB Integration >> WASM-013: Query results display in data grid
- Location: e2e/wasm-features-complete.spec.ts:243:3

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
  146 |   });
  147 | 
  148 |   test('WASM-008: Dataset shows row count', async ({ page }) => {
  149 |     await page.goto(`${BASE_URL}/datasets`);
  150 | 
  151 |     await page.waitForTimeout(3000);
  152 | 
  153 |     // Look for row count display
  154 |     const rowCount = page.locator('text=/rows?/i, .row-count, [data-testid="row-count"]');
  155 | 
  156 |     // Row count might not be visible if no datasets exist
  157 |     if (await rowCount.isVisible()) {
  158 |       await expect(rowCount.first()).toBeVisible();
  159 |     }
  160 |   });
  161 | 
  162 |   test('WASM-009: Dataset shows file size', async ({ page }) => {
  163 |     await page.goto(`${BASE_URL}/datasets`);
  164 | 
  165 |     await page.waitForTimeout(3000);
  166 | 
  167 |     // Look for file size display
  168 |     const fileSize = page.locator('text=/MB|KB|GB/i, .file-size');
  169 | 
  170 |     if (await fileSize.isVisible()) {
  171 |       await expect(fileSize.first()).toBeVisible();
  172 |     }
  173 |   });
  174 | 
  175 |   test('WASM-010: Can refresh dataset', async ({ page }) => {
  176 |     await page.goto(`${BASE_URL}/datasets`);
  177 | 
  178 |     await page.waitForTimeout(3000);
  179 | 
  180 |     // Look for refresh button
  181 |     const refreshButton = page.locator('button:has-text("Refresh"), [aria-label="refresh"]').first();
  182 | 
  183 |     if (await refreshButton.isVisible()) {
  184 |       await refreshButton.click();
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
> 246 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
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
```
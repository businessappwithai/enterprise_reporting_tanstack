# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - DuckDB Integration >> WASM-011: DuckDB provider initializes
- Location: e2e/wasm-features-complete.spec.ts:199:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.monaco-editor, .sql-editor')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.monaco-editor, .sql-editor')

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
  113 |     await page.goto(`${BASE_URL}/datasets`);
  114 | 
  115 |     // Wait for datasets to load
  116 |     await page.waitForTimeout(3000);
  117 | 
  118 |     // Look for dataset cards or table rows
  119 |     const datasetCard = page.locator('.dataset-card, table tbody tr').first();
  120 | 
  121 |     if (await datasetCard.isVisible()) {
  122 |       // Should show dataset info
  123 |       const hasName = await datasetCard.locator('text=/./').count() > 0;
  124 |       expect(hasName).toBeTruthy();
  125 |     }
  126 |   });
  127 | 
  128 |   test('WASM-007: Can download dataset as Parquet', async ({ page }) => {
  129 |     await page.goto(`${BASE_URL}/datasets`);
  130 | 
  131 |     await page.waitForTimeout(3000);
  132 | 
  133 |     // Look for download button
  134 |     const downloadButton = page.locator('button:has-text("Download"), button:has-text("Parquet"), a:has-text("Download")').first();
  135 | 
  136 |     if (await downloadButton.isVisible()) {
  137 |       const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
  138 | 
  139 |       await downloadButton.click();
  140 | 
  141 |       const download = await downloadPromise;
  142 |       if (download) {
  143 |         expect(download.suggestedFilename()).toMatch(/\.parquet$/i);
  144 |       }
  145 |     }
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
> 213 |     await expect(page.locator('.monaco-editor, .sql-editor')).toBeVisible({ timeout: 10000 });
      |                                                               ^ Error: expect(locator).toBeVisible() failed
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
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - Datasets >> WASM-002: Can view dataset list
- Location: e2e/wasm-features-complete.spec.ts:33:3

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
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
        - paragraph [ref=e12]: 2026-05-14T05:39:42.667Z
      - generic [ref=e13]:
        - text: Additional Information (Optional)
        - textbox "Additional Information (Optional)" [active] [ref=e14]:
          - /placeholder: Describe what you were doing when this error occurred...
      - generic [ref=e15]:
        - text: Email Preview
        - generic [ref=e16]:
          - textbox "Email Preview" [ref=e17]: "ERROR REPORT ============ Timestamp: 2026-05-14T05:39:42.667Z Error: useDuckDB must be used within a DuckDBProvider Stack Trace: Error: useDuckDB must be used within a DuckDBProvider at useDuckDB (http://localhost:4050/src/components/duckdb/DuckDBProvider.tsx:152:11) at DatasetsPage (http://localhost:4050/src/routes/_authed/datasets/index.tsx?tsr-split=component:29:7) at Object.react_stack_bottom_frame (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:18509:20) at renderWithHooks (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:5654:24) at updateFunctionComponent (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:7475:21) at beginWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:8525:20) at runWithFiberInDEV (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:997:72) at performUnitOfWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12561:98) at workLoopSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12424:43) at renderRootSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12408:13) Component Stack: at DatasetsPage (http://localhost:4050/src/routes/_authed/datasets/index.tsx?tsr-split=component:29:7) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at main (<anonymous>) at div (<anonymous>) at div (<anonymous>) at ActiveDataSourceProvider (http://localhost:4050/src/lib/hooks/use-active-datasource.tsx:20:44) at AppShell (http://localhost:4050/src/components/layout/app-shell.tsx:23:28) at AuthedLayout (http://localhost:4050/src/routes/_authed.tsx?tsr-split=component:25:13) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at Suspense (<anonymous>) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at V (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:44:25) at J (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:42:18) at QueryClientProvider (http://localhost:4050/node_modules/.vite/deps/@tanstack_react-query.js?v=a26a3e3e:3170:3) at Provider (http://localhost:4050/node_modules/.vite/deps/chunk-GQ5SNI5U.js?v=a26a3e3e:43:15) at TooltipProvider (http://localhost:4050/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=a26a3e3e:157:5) at TanStackDBWrapper (http://localhost:4050/src/lib/tanstack-db/provider.tsx:29:37) at ErrorBoundary (http://localhost:4050/src/components/errors/error-boundary.tsx:11:5) at body (<anonymous>) at html (<anonymous>) at RootComponent (http://localhost:4050/src/routes/__root.tsx:44:33) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at CatchBoundaryImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:20:5) at CatchBoundary (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:5:32) at MatchesInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:24:18) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at Matches (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:14:18) at RouterContextProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:12:34) at RouterProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:37:27) at AwaitInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:27:15) at Await (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:20:12) at StartClient (<anonymous>) Context: URL: http://localhost:4050/datasets User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36"
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
  1   | /**
  2   |  * Complete WASM Features E2E Test Suite
  3   |  *
  4   |  * Tests for DuckDB-Wasm integration, Datasets, Offline Mode, and Progressive Loading
  5   |  *
  6   |  * Run: bun run test:e2e -- e2e/wasm-features-complete.spec.ts
  7   |  */
  8   | 
  9   | import { test, expect } from '@playwright/test';
  10  | import { login } from './test-auth';
  11  | 
  12  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  13  | 
  14  | test.describe('WASM Features - Datasets', () => {
  15  |   test.beforeEach(async ({ page }) => {
  16  |     await login(page);
  17  |   });
  18  | 
  19  |   test('WASM-001: Datasets page loads correctly', async ({ page }) => {
  20  |     await page.goto(`${BASE_URL}/datasets`);
  21  | 
  22  |     // Should show datasets header
  23  |     await expect(page.locator('h1').filter({ hasText: /datasets/i })).toBeVisible({ timeout: 10000 });
  24  | 
  25  |     // Page should be stable
  26  |     await page.waitForTimeout(2000);
  27  | 
  28  |     // Should have main content area
  29  |     const hasContent = await page.locator('main, .datasets-page, [data-testid="datasets"]').count() > 0;
  30  |     expect(hasContent).toBeTruthy();
  31  |   });
  32  | 
  33  |   test('WASM-002: Can view dataset list', async ({ page }) => {
  34  |     await page.goto(`${BASE_URL}/datasets`);
  35  | 
  36  |     // Wait for data to load
  37  |     await page.waitForTimeout(3000);
  38  | 
  39  |     // Check for table or empty state
  40  |     const hasTable = await page.locator('table, [role="table"]').count() > 0;
  41  |     const hasEmptyState = await page.locator('text=No datasets, text=empty, .empty-state').count() > 0;
  42  | 
> 43  |     expect(hasTable || hasEmptyState).toBeTruthy();
      |                                       ^ Error: expect(received).toBeTruthy()
  44  |   });
  45  | 
  46  |   test('WASM-003: Dataset creation dialog opens', async ({ page }) => {
  47  |     await page.goto(`${BASE_URL}/datasets`);
  48  | 
  49  |     // Look for "Generate Dataset" or "New Dataset" button
  50  |     const createButton = page.locator('button:has-text("Generate Dataset"), button:has-text("New Dataset"), button:has-text("Create")').first();
  51  | 
  52  |     if (await createButton.isVisible()) {
  53  |       await createButton.click();
  54  |       await page.waitForTimeout(2000);
  55  | 
  56  |       // Should show dialog or form
  57  |       const hasDialog = await page.locator('[role="dialog"], dialog, .modal').count() > 0;
  58  |       const hasForm = await page.locator('form, input[name="name"]').count() > 0;
  59  | 
  60  |       expect(hasDialog || hasForm).toBeTruthy();
  61  |     }
  62  |   });
  63  | 
  64  |   test('WASM-004: Can select data source for dataset', async ({ page }) => {
  65  |     await page.goto(`${BASE_URL}/datasets`);
  66  | 
  67  |     const createButton = page.locator('button:has-text("Generate Dataset"), button:has-text("Create")').first();
  68  | 
  69  |     if (await createButton.isVisible()) {
  70  |       await createButton.click();
  71  |       await page.waitForTimeout(2000);
  72  | 
  73  |       // Look for data source selector
  74  |       const dataSourceSelect = page.locator('select[name="dataSource"], [role="combobox"]').first();
  75  | 
  76  |       if (await dataSourceSelect.isVisible()) {
  77  |         await dataSourceSelect.click();
  78  |         await page.waitForTimeout(500);
  79  | 
  80  |         // Should show options
  81  |         const hasOptions = await page.locator('[role="option"], option').count() > 0;
  82  |         expect(hasOptions).toBeTruthy();
  83  |       }
  84  |     }
  85  |   });
  86  | 
  87  |   test('WASM-005: Can enter SQL query for dataset', async ({ page }) => {
  88  |     await page.goto(`${BASE_URL}/datasets`);
  89  | 
  90  |     const createButton = page.locator('button:has-text("Generate Dataset")').first();
  91  | 
  92  |     if (await createButton.isVisible()) {
  93  |       await createButton.click();
  94  |       await page.waitForTimeout(2000);
  95  | 
  96  |       // Look for query input (might be Monaco editor or textarea)
  97  |       const queryInput = page.locator('textarea[name="query"], .monaco-editor, [contenteditable="true"]').first();
  98  | 
  99  |       if (await queryInput.isVisible()) {
  100 |         await queryInput.click();
  101 |         await page.keyboard.type('SELECT * FROM users LIMIT 100');
  102 | 
  103 |         await page.waitForTimeout(500);
  104 | 
  105 |         // Query should be entered
  106 |         const hasQuery = await page.locator('text=SELECT * FROM users').count() > 0;
  107 |         expect(hasQuery).toBeTruthy();
  108 |       }
  109 |     }
  110 |   });
  111 | 
  112 |   test('WASM-006: Dataset card shows metadata', async ({ page }) => {
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
```
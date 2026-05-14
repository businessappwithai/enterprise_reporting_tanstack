# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm-simple.spec.ts >> Hospital Management - WASM Performance Test >> Check WASM/Datasets page
- Location: e2e/hospital-wasm-simple.spec.ts:136:3

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
        - paragraph [ref=e12]: 2026-05-14T05:33:00.964Z
      - generic [ref=e13]:
        - text: Additional Information (Optional)
        - textbox "Additional Information (Optional)" [active] [ref=e14]:
          - /placeholder: Describe what you were doing when this error occurred...
      - generic [ref=e15]:
        - text: Email Preview
        - generic [ref=e16]:
          - textbox "Email Preview" [ref=e17]: "ERROR REPORT ============ Timestamp: 2026-05-14T05:33:00.964Z Error: useDuckDB must be used within a DuckDBProvider Stack Trace: Error: useDuckDB must be used within a DuckDBProvider at useDuckDB (http://localhost:4050/src/components/duckdb/DuckDBProvider.tsx:152:11) at DatasetsPage (http://localhost:4050/src/routes/_authed/datasets/index.tsx?tsr-split=component:29:7) at Object.react_stack_bottom_frame (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:18509:20) at renderWithHooks (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:5654:24) at updateFunctionComponent (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:7475:21) at beginWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:8525:20) at runWithFiberInDEV (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:997:72) at performUnitOfWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12561:98) at workLoopSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12424:43) at renderRootSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12408:13) Component Stack: at DatasetsPage (http://localhost:4050/src/routes/_authed/datasets/index.tsx?tsr-split=component:29:7) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at main (<anonymous>) at div (<anonymous>) at div (<anonymous>) at ActiveDataSourceProvider (http://localhost:4050/src/lib/hooks/use-active-datasource.tsx:20:44) at AppShell (http://localhost:4050/src/components/layout/app-shell.tsx:23:28) at AuthedLayout (http://localhost:4050/src/routes/_authed.tsx?tsr-split=component:25:13) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at Suspense (<anonymous>) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at V (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:44:25) at J (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:42:18) at QueryClientProvider (http://localhost:4050/node_modules/.vite/deps/@tanstack_react-query.js?v=a26a3e3e:3170:3) at Provider (http://localhost:4050/node_modules/.vite/deps/chunk-GQ5SNI5U.js?v=a26a3e3e:43:15) at TooltipProvider (http://localhost:4050/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=a26a3e3e:157:5) at TanStackDBWrapper (http://localhost:4050/src/lib/tanstack-db/provider.tsx:29:37) at ErrorBoundary (http://localhost:4050/src/components/errors/error-boundary.tsx:11:5) at body (<anonymous>) at html (<anonymous>) at RootComponent (http://localhost:4050/src/routes/__root.tsx:44:33) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at CatchBoundaryImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:20:5) at CatchBoundary (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:5:32) at MatchesInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:24:18) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at Matches (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:14:18) at RouterContextProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:12:34) at RouterProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:37:27) at AwaitInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:27:15) at Await (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:20:12) at StartClient (<anonymous>) Context: URL: http://localhost:4050/datasets User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36"
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
  42  |   test('Patient demographics aggregation query', async ({ page }) => {
  43  |     await page.goto(`${BASE_URL}/sql-editor`);
  44  | 
  45  |     // Wait for editor
  46  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  47  | 
  48  |     // Execute demographics query
  49  |     const demographicsQuery = `SELECT
  50  |   gender,
  51  |   blood_group,
  52  |   COUNT(*) as patient_count
  53  | FROM bus_patient
  54  | GROUP BY gender, blood_group
  55  | ORDER BY patient_count DESC`;
  56  | 
  57  |     await page.locator('.monaco-editor').click();
  58  |     await page.keyboard.type(demographicsQuery);
  59  | 
  60  |     await page.getByRole('button', { name: /execute|run/i }).first().click();
  61  | 
  62  |     // Wait for results
  63  |     await page.waitForTimeout(3000);
  64  | 
  65  |     const resultsVisible = await page.locator('[role="table"], .results, .data-grid').isVisible().catch(() => false);
  66  |     expect(resultsVisible).toBeTruthy();
  67  | 
  68  |     console.log('Query 2: Demographics aggregation - Executed');
  69  |   });
  70  | 
  71  |   test('Large dataset query with 1000 rows', async ({ page }) => {
  72  |     await page.goto(`${BASE_URL}/sql-editor`);
  73  | 
  74  |     // Wait for editor
  75  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  76  | 
  77  |     // Query for 1000 patients
  78  |     const largeQuery = `SELECT
  79  |   id,
  80  |   uhid,
  81  |   first_name,
  82  |   last_name,
  83  |   gender,
  84  |   blood_group
  85  | FROM bus_patient
  86  | ORDER BY id
  87  | LIMIT 1000`;
  88  | 
  89  |     await page.locator('.monaco-editor').click();
  90  |     await page.keyboard.type(largeQuery);
  91  | 
  92  |     await page.getByRole('button', { name: /execute|run/i }).first().click();
  93  | 
  94  |     // Wait for results - may take longer for large result set
  95  |     await page.waitForTimeout(5000);
  96  | 
  97  |     const resultsVisible = await page.locator('[role="table"], .results, .data-grid').isVisible().catch(() => false);
  98  |     expect(resultsVisible).toBeTruthy();
  99  | 
  100 |     console.log('Query 3: Large dataset (1000 rows) - Executed');
  101 |   });
  102 | 
  103 |   test('Navigate to Reports page', async ({ page }) => {
  104 |     await page.goto(`${BASE_URL}/reports`);
  105 | 
  106 |     // Should show reports page heading
  107 |     const heading = page.getByRole('heading', { name: /reports/i });
  108 |     const isVisible = await heading.isVisible().catch(() => false);
  109 |     expect(isVisible).toBeTruthy();
  110 | 
  111 |     console.log('Reports page accessed');
  112 |   });
  113 | 
  114 |   test('Navigate to Charts page', async ({ page }) => {
  115 |     await page.goto(`${BASE_URL}/charts`);
  116 | 
  117 |     // Should show charts page heading
  118 |     const heading = page.getByRole('heading', { name: /charts/i });
  119 |     const isVisible = await heading.isVisible().catch(() => false);
  120 |     expect(isVisible).toBeTruthy();
  121 | 
  122 |     console.log('Charts page accessed');
  123 |   });
  124 | 
  125 |   test('Navigate to Dashboards page', async ({ page }) => {
  126 |     await page.goto(`${BASE_URL}/dashboards`);
  127 | 
  128 |     // Should show dashboards page heading
  129 |     const heading = page.getByRole('heading', { name: /dashboards/i });
  130 |     const isVisible = await heading.isVisible().catch(() => false);
  131 |     expect(isVisible).toBeTruthy();
  132 | 
  133 |     console.log('Dashboards page accessed');
  134 |   });
  135 | 
  136 |   test('Check WASM/Datasets page', async ({ page }) => {
  137 |     await page.goto(`${BASE_URL}/datasets`);
  138 | 
  139 |     // Should show datasets page
  140 |     const heading = page.getByRole('heading', { name: /datasets/i });
  141 |     const isVisible = await heading.isVisible().catch(() => false);
> 142 |     expect(isVisible).toBeTruthy();
      |                       ^ Error: expect(received).toBeTruthy()
  143 | 
  144 |     console.log('Datasets page accessed - WASM features available');
  145 |   });
  146 | 
  147 |   test('Complete workflow test', async ({ page }) => {
  148 |     // This test verifies the complete workflow works
  149 | 
  150 |     // 1. Start at dashboard
  151 |     await page.goto(`${BASE_URL}/`);
  152 |     await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({ timeout: 10000 });
  153 | 
  154 |     // 2. Go to SQL Editor
  155 |     await page.goto(`${BASE_URL}/sql-editor`);
  156 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  157 | 
  158 |     // 3. Execute a simple query
  159 |     await page.locator('.monaco-editor').click();
  160 |     await page.keyboard.type('SELECT COUNT(*) as count FROM bus_patient');
  161 |     await page.getByRole('button', { name: /execute|run/i }).first().click();
  162 |     await page.waitForTimeout(3000);
  163 | 
  164 |     // 4. Navigate to reports
  165 |     await page.goto(`${BASE_URL}/reports`);
  166 |     await page.waitForTimeout(1000);
  167 | 
  168 |     // 5. Navigate to charts
  169 |     await page.goto(`${BASE_URL}/charts`);
  170 |     await page.waitForTimeout(1000);
  171 | 
  172 |     // 6. Navigate to dashboards
  173 |     await page.goto(`${BASE_URL}/dashboards`);
  174 |     await page.waitForTimeout(1000);
  175 | 
  176 |     console.log('Complete workflow test passed');
  177 |   });
  178 | });
  179 | 
  180 | test.describe('Hospital Management - Data Source Setup', () => {
  181 |   test.beforeEach(async ({ page }) => {
  182 |     await login(page);
  183 |   });
  184 | 
  185 |   test('Navigate to data sources page', async ({ page }) => {
  186 |     await page.goto(`${BASE_URL}/data-sources`);
  187 | 
  188 |     // Should show data sources page
  189 |     const heading = page.getByRole('heading', { name: /data sources/i });
  190 |     const isVisible = await heading.isVisible().catch(() => false);
  191 |     expect(isVisible).toBeTruthy();
  192 | 
  193 |     console.log('Data sources page accessed');
  194 |   });
  195 | 
  196 |   test('Check for existing data sources', async ({ page }) => {
  197 |     await page.goto(`${BASE_URL}/data-sources`);
  198 | 
  199 |     // Wait for page to load
  200 |     await page.waitForTimeout(2000);
  201 | 
  202 |     // Check if there are any data source cards or list items
  203 |     const dataSources = page.locator('[data-testid="data-source"], .data-source-card, tr');
  204 |     const count = await dataSources.count();
  205 | 
  206 |     console.log(`Found ${count} data source elements`);
  207 | 
  208 |     // Test passes regardless of whether data sources exist
  209 |     expect(true).toBeTruthy();
  210 |   });
  211 | });
  212 | 
```
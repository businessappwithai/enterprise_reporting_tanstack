# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> WASM Features >> 15.1 Datasets page is accessible
- Location: e2e/complete-system-test.spec.ts:1004:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').filter({ hasText: /datasets/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h1').filter({ hasText: /datasets/i })

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
        - paragraph [ref=e12]: 2026-05-14T05:21:41.224Z
      - generic [ref=e13]:
        - text: Additional Information (Optional)
        - textbox "Additional Information (Optional)" [active] [ref=e14]:
          - /placeholder: Describe what you were doing when this error occurred...
      - generic [ref=e15]:
        - text: Email Preview
        - generic [ref=e16]:
          - textbox "Email Preview" [ref=e17]: "ERROR REPORT ============ Timestamp: 2026-05-14T05:21:41.224Z Error: useDuckDB must be used within a DuckDBProvider Stack Trace: Error: useDuckDB must be used within a DuckDBProvider at useDuckDB (http://localhost:4050/src/components/duckdb/DuckDBProvider.tsx:152:11) at DatasetsPage (http://localhost:4050/src/routes/_authed/datasets/index.tsx?tsr-split=component:29:7) at Object.react_stack_bottom_frame (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:18509:20) at renderWithHooks (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:5654:24) at updateFunctionComponent (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:7475:21) at beginWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:8525:20) at runWithFiberInDEV (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:997:72) at performUnitOfWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12561:98) at workLoopSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12424:43) at renderRootSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12408:13) Component Stack: at DatasetsPage (http://localhost:4050/src/routes/_authed/datasets/index.tsx?tsr-split=component:29:7) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at main (<anonymous>) at div (<anonymous>) at div (<anonymous>) at ActiveDataSourceProvider (http://localhost:4050/src/lib/hooks/use-active-datasource.tsx:20:44) at AppShell (http://localhost:4050/src/components/layout/app-shell.tsx:23:28) at AuthedLayout (http://localhost:4050/src/routes/_authed.tsx?tsr-split=component:25:13) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at Suspense (<anonymous>) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at V (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:44:25) at J (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:42:18) at QueryClientProvider (http://localhost:4050/node_modules/.vite/deps/@tanstack_react-query.js?v=a26a3e3e:3170:3) at Provider (http://localhost:4050/node_modules/.vite/deps/chunk-GQ5SNI5U.js?v=a26a3e3e:43:15) at TooltipProvider (http://localhost:4050/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=a26a3e3e:157:5) at TanStackDBWrapper (http://localhost:4050/src/lib/tanstack-db/provider.tsx:29:37) at ErrorBoundary (http://localhost:4050/src/components/errors/error-boundary.tsx:11:5) at body (<anonymous>) at html (<anonymous>) at RootComponent (http://localhost:4050/src/routes/__root.tsx:44:33) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at CatchBoundaryImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:20:5) at CatchBoundary (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:5:32) at MatchesInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:24:18) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at Matches (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:14:18) at RouterContextProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:12:34) at RouterProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:37:27) at AwaitInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:27:15) at Await (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:20:12) at StartClient (<anonymous>) Context: URL: http://localhost:4050/datasets User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36"
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
  907  | 
  908  |       // Should show a table or matrix of permissions
  909  |       await expect(page.locator('table, .permissions-matrix')).toBeVisible();
  910  |     });
  911  | 
  912  |     test('13.2 Can update resource permissions', async ({ page }) => {
  913  |       await page.goto(`${BASE_URL}/admin/permissions`);
  914  | 
  915  |       // Look for editable permission cells
  916  |       const editableCells = page.locator('[contenteditable="true"], .permission-cell:has(button)');
  917  | 
  918  |       const count = await editableCells.count();
  919  | 
  920  |       if (count > 0) {
  921  |         // Click on first editable cell
  922  |         await editableCells.first().click();
  923  |         await page.waitForTimeout(1000);
  924  | 
  925  |         // Should show permission options
  926  |         const hasOptions = await page.locator('text=View, text=Edit, text=Admin').count() > 0;
  927  |         expect(hasOptions).toBeTruthy();
  928  |       }
  929  |     });
  930  |   });
  931  | 
  932  |   // ========================================================================
  933  |   // PART 14: SETTINGS
  934  |   // ========================================================================
  935  | 
  936  |   test.describe('Settings', () => {
  937  |     test.beforeEach(async ({ page }) => {
  938  |       await login(page);
  939  |     });
  940  | 
  941  |     test('14.1 Can access email settings', async ({ page }) => {
  942  |       await page.goto(`${BASE_URL}/settings/email`);
  943  | 
  944  |       await expect(page.locator('h1').filter({ hasText: /email/i }).or(page.locator('h1').filter({ hasText: /settings/i }))).toBeVisible();
  945  | 
  946  |       // Should show email configuration form
  947  |       const hasForm = await page.locator('input[name="smtp"], input[name="email"], input[name="host"]').count() > 0;
  948  | 
  949  |       // Form might not be visible if already configured, that's okay
  950  |       if (hasForm) {
  951  |         expect(hasForm).toBeTruthy();
  952  |       }
  953  |     });
  954  | 
  955  |     test('14.2 Can save email settings', async ({ page }) => {
  956  |       await page.goto(`${BASE_URL}/settings/email`);
  957  | 
  958  |       // Look for save button
  959  |       const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")').first();
  960  | 
  961  |       if (await saveButton.isVisible()) {
  962  |         // Fill some test data (might not actually save depending on validation)
  963  |         const hostInput = page.locator('input[name="host"], input[name="smtpHost"]');
  964  | 
  965  |         if (await hostInput.isVisible()) {
  966  |           await hostInput.fill('smtp.example.com');
  967  | 
  968  |           await saveButton.click();
  969  |           await page.waitForTimeout(2000);
  970  | 
  971  |           // Should show feedback
  972  |           const hasFeedback = await page.locator('text=saved, text=updated, text=success').count() > 0;
  973  |           expect(hasFeedback).toBeTruthy();
  974  |         }
  975  |       }
  976  |     });
  977  | 
  978  |     test('14.3 Can send test email', async ({ page }) => {
  979  |       await page.goto(`${BASE_URL}/settings/email`);
  980  | 
  981  |       // Look for test email button
  982  |       const testButton = page.locator('button:has-text("Test"), button:has-text("Send Test")').first();
  983  | 
  984  |       if (await testButton.isVisible()) {
  985  |         await testButton.click();
  986  |         await page.waitForTimeout(2000);
  987  | 
  988  |         // Should show feedback
  989  |         const hasFeedback = await page.locator('text=sent, text=failed, text=success, text=error').count() > 0;
  990  |         expect(hasFeedback).toBeTruthy();
  991  |       }
  992  |     });
  993  |   });
  994  | 
  995  |   // ========================================================================
  996  |   // PART 15: WASM FEATURES
  997  |   // ========================================================================
  998  | 
  999  |   test.describe('WASM Features', () => {
  1000 |     test.beforeEach(async ({ page }) => {
  1001 |       await login(page);
  1002 |     });
  1003 | 
  1004 |     test('15.1 Datasets page is accessible', async ({ page }) => {
  1005 |       await page.goto(`${BASE_URL}/datasets`);
  1006 | 
> 1007 |       await expect(page.locator('h1').filter({ hasText: /datasets/i })).toBeVisible({ timeout: 10000 });
       |                                                                         ^ Error: expect(locator).toBeVisible() failed
  1008 |     });
  1009 | 
  1010 |     test('15.2 Can view dataset list', async ({ page }) => {
  1011 |       await page.goto(`${BASE_URL}/datasets`);
  1012 | 
  1013 |       // Should load without errors
  1014 |       const hasContent = await page.locator('table, .dataset-list, .empty-state').count() > 0;
  1015 |       expect(hasContent).toBeTruthy();
  1016 |     });
  1017 | 
  1018 |     test('15.3 Dataset features are available', async ({ page }) => {
  1019 |       await page.goto(`${BASE_URL}/datasets`);
  1020 | 
  1021 |       // Look for dataset-specific features
  1022 |       const datasetFeatures = page.locator('text=Parquet, text=DuckDB, text=WASM');
  1023 | 
  1024 |       // These might be in tooltips or info sections
  1025 |       const featureCount = await datasetFeatures.count();
  1026 | 
  1027 |       // At least the page should load
  1028 |       await expect(page.locator('h1')).toBeVisible();
  1029 |     });
  1030 | 
  1031 |     test('15.4 Offline indicator exists', async ({ page }) => {
  1032 |       await page.goto(`${BASE_URL}/datasets`);
  1033 | 
  1034 |       // Look for offline indicator (might be subtle)
  1035 |       const offlineIndicator = page.locator('[data-testid="offline-indicator"], .offline-status');
  1036 | 
  1037 |       // Might not be visible if online, that's okay
  1038 |       if (await offlineIndicator.isVisible()) {
  1039 |         expect(offlineIndicator).toBeVisible();
  1040 |       }
  1041 |     });
  1042 |   });
  1043 | 
  1044 |   // ========================================================================
  1045 |   // PART 16: CROSS-WIDGET FILTERING
  1046 |   // ========================================================================
  1047 | 
  1048 |   test.describe('Cross-Widget Filtering', () => {
  1049 |     test.beforeEach(async ({ page }) => {
  1050 |       await login(page);
  1051 |     });
  1052 | 
  1053 |     test('16.1 Dashboard supports cross-filtering', async ({ page }) => {
  1054 |       await page.goto(`${BASE_URL}/dashboards`);
  1055 | 
  1056 |       // Navigate to first dashboard
  1057 |       const firstDashboard = page.locator('.dashboard-card, [data-testid="dashboard"]').first();
  1058 | 
  1059 |       if (await firstDashboard.isVisible()) {
  1060 |         await firstDashboard.click();
  1061 |         await page.waitForTimeout(2000);
  1062 | 
  1063 |         // Look for active filters bar
  1064 |         const filtersBar = page.locator('.active-filters, [data-testid="active-filters"]');
  1065 | 
  1066 |         // Cross-filtering might not be visible until a filter is applied
  1067 |         // Just check the page loads correctly
  1068 |         await expect(page.locator('h1, h2, .dashboard')).toBeVisible();
  1069 |       }
  1070 |     });
  1071 | 
  1072 |     test('16.2 Can apply filter from chart click', async ({ page }) => {
  1073 |       await page.goto(`${BASE_URL}/dashboards`);
  1074 | 
  1075 |       const firstDashboard = page.locator('.dashboard-card').first();
  1076 | 
  1077 |       if (await firstDashboard.isVisible()) {
  1078 |         await firstDashboard.click();
  1079 |         await page.waitForTimeout(2000);
  1080 | 
  1081 |         // Look for clickable chart elements
  1082 |         const chart = page.locator('canvas, svg, .chart').first();
  1083 | 
  1084 |         if (await chart.isVisible()) {
  1085 |           // Click on chart
  1086 |           await chart.click({ position: { x: 100, y: 100 } });
  1087 |           await page.waitForTimeout(1000);
  1088 | 
  1089 |           // Check if filter was applied (might show a toast or filter bar)
  1090 |           const hasFeedback = await page.locator('.filter, .toast, .notification').count() > 0;
  1091 |           // This is optional - cross-filtering might not be set up
  1092 |         }
  1093 |       }
  1094 |     });
  1095 |   });
  1096 | 
  1097 |   // ========================================================================
  1098 |   // PART 17: NAVIGATION
  1099 |   // ========================================================================
  1100 | 
  1101 |   test.describe('Navigation', () => {
  1102 |     test.beforeEach(async ({ page }) => {
  1103 |       await login(page);
  1104 |     });
  1105 | 
  1106 |     test('17.1 All main navigation links work', async ({ page }) => {
  1107 |       const navLinks = [
```
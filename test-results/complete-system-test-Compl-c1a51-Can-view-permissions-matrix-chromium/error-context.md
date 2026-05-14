# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Admin - Permissions >> 13.1 Can view permissions matrix
- Location: e2e/complete-system-test.spec.ts:903:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').filter({ hasText: /permissions/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').filter({ hasText: /permissions/i })

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
        - paragraph: Cannot read properties of undefined (reading 'replace')
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
        - paragraph [ref=e11]: Cannot read properties of undefined (reading 'replace')
        - paragraph [ref=e12]: 2026-05-14T05:21:24.910Z
      - generic [ref=e13]:
        - text: Additional Information (Optional)
        - textbox "Additional Information (Optional)" [active] [ref=e14]:
          - /placeholder: Describe what you were doing when this error occurred...
      - generic [ref=e15]:
        - text: Email Preview
        - generic [ref=e16]:
          - textbox "Email Preview" [ref=e17]: "ERROR REPORT ============ Timestamp: 2026-05-14T05:21:24.910Z Error: Cannot read properties of undefined (reading 'replace') Stack Trace: TypeError: Cannot read properties of undefined (reading 'replace') at http://localhost:4050/src/routes/_authed/admin/permissions/index.tsx?tsr-split=component:307:118 at Array.map (<anonymous>) at PermissionsManagementPage (http://localhost:4050/src/routes/_authed/admin/permissions/index.tsx?tsr-split=component:297:67) at Object.react_stack_bottom_frame (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:18509:20) at renderWithHooks (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:5654:24) at updateFunctionComponent (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:7475:21) at beginWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:8525:20) at runWithFiberInDEV (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:997:72) at performUnitOfWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12561:98) at workLoopSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12424:43) Component Stack: at PermissionsManagementPage (http://localhost:4050/src/routes/_authed/admin/permissions/index.tsx?tsr-split=component:70:23) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at div (<anonymous>) at AdminLayout (<anonymous>) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at main (<anonymous>) at div (<anonymous>) at div (<anonymous>) at ActiveDataSourceProvider (http://localhost:4050/src/lib/hooks/use-active-datasource.tsx:20:44) at AppShell (http://localhost:4050/src/components/layout/app-shell.tsx:23:28) at AuthedLayout (http://localhost:4050/src/routes/_authed.tsx?tsr-split=component:25:13) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at Suspense (<anonymous>) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at V (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:44:25) at J (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:42:18) at QueryClientProvider (http://localhost:4050/node_modules/.vite/deps/@tanstack_react-query.js?v=a26a3e3e:3170:3) at Provider (http://localhost:4050/node_modules/.vite/deps/chunk-GQ5SNI5U.js?v=a26a3e3e:43:15) at TooltipProvider (http://localhost:4050/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=a26a3e3e:157:5) at TanStackDBWrapper (http://localhost:4050/src/lib/tanstack-db/provider.tsx:29:37) at ErrorBoundary (http://localhost:4050/src/components/errors/error-boundary.tsx:11:5) at body (<anonymous>) at html (<anonymous>) at RootComponent (http://localhost:4050/src/routes/__root.tsx:44:33) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at CatchBoundaryImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:20:5) at CatchBoundary (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:5:32) at MatchesInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:24:18) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at Matches (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:14:18) at RouterContextProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:12:34) at RouterProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:37:27) at AwaitInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:27:15) at Await (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:20:12) at StartClient (<anonymous>) Context: URL: http://localhost:4050/admin/permissions User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36"
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
  806  |       await page.click('button:has-text("Save"), button:has-text("Create")');
  807  |       await page.waitForTimeout(2000);
  808  | 
  809  |       // Should show success
  810  |       await expect(page.locator('text=success, text=created').first()).toBeVisible({ timeout: 5000 });
  811  |     });
  812  | 
  813  |     test('11.3 Can assign roles to user', async ({ page }) => {
  814  |       await page.goto(`${BASE_URL}/admin/users`);
  815  | 
  816  |       // Click on first user
  817  |       const firstUser = page.locator('table tbody tr').first();
  818  |       const count = await firstUser.count();
  819  | 
  820  |       if (count > 0) {
  821  |         await firstUser.click();
  822  |         await page.waitForTimeout(2000);
  823  | 
  824  |         // Look for role assignment
  825  |         const roleSection = page.locator('.roles, [data-testid="roles"]').first();
  826  | 
  827  |         if (await roleSection.isVisible()) {
  828  |           expect(roleSection).toBeVisible();
  829  |         }
  830  |       }
  831  |     });
  832  |   });
  833  | 
  834  |   // ========================================================================
  835  |   // PART 12: ADMIN PANEL - ROLES
  836  |   // ========================================================================
  837  | 
  838  |   test.describe('Admin - Roles', () => {
  839  |     test.beforeEach(async ({ page }) => {
  840  |       await login(page);
  841  |     });
  842  | 
  843  |     test('12.1 Can view roles list', async ({ page }) => {
  844  |       await page.goto(`${BASE_URL}/admin/roles`);
  845  | 
  846  |       await expect(page.locator('h1').filter({ hasText: /roles/i })).toBeVisible();
  847  |     });
  848  | 
  849  |     test('12.2 Can create a new role', async ({ page }) => {
  850  |       await page.goto(`${BASE_URL}/admin/roles`);
  851  | 
  852  |       // Click new role button
  853  |       await page.click('button:has-text("New Role"), button:has-text("Add Role")');
  854  | 
  855  |       // Wait for dialog
  856  |       await page.waitForTimeout(1000);
  857  | 
  858  |       // Fill role details
  859  |       const roleName = `e2e_role_${Date.now()}`;
  860  |       await page.fill('input[name="name"]', roleName);
  861  |       await page.fill('textarea[name="description"]', 'E2E test role');
  862  | 
  863  |       // Select permissions
  864  |       const permissionsCheckboxes = page.locator('input[type="checkbox"]');
  865  |       const count = await permissionsCheckboxes.count();
  866  | 
  867  |       if (count > 0) {
  868  |         await permissionsCheckboxes.nth(0).check();
  869  |       }
  870  | 
  871  |       // Save
  872  |       await page.click('button:has-text("Save"), button:has-text("Create")');
  873  |       await page.waitForTimeout(2000);
  874  |     });
  875  | 
  876  |     test('12.3 Can configure role permissions', async ({ page }) => {
  877  |       await page.goto(`${BASE_URL}/admin/roles`);
  878  | 
  879  |       // Click on first role
  880  |       const firstRole = page.locator('table tbody tr').first();
  881  |       const count = await firstRole.count();
  882  | 
  883  |       if (count > 0) {
  884  |         await firstRole.click();
  885  |         await page.waitForTimeout(2000);
  886  | 
  887  |         // Should show permissions
  888  |         const hasPermissions = await page.locator('input[type="checkbox"], .permissions').count() > 0;
  889  |         expect(hasPermissions).toBeTruthy();
  890  |       }
  891  |     });
  892  |   });
  893  | 
  894  |   // ========================================================================
  895  |   // PART 13: ADMIN PANEL - PERMISSIONS
  896  |   // ========================================================================
  897  | 
  898  |   test.describe('Admin - Permissions', () => {
  899  |     test.beforeEach(async ({ page }) => {
  900  |       await login(page);
  901  |     });
  902  | 
  903  |     test('13.1 Can view permissions matrix', async ({ page }) => {
  904  |       await page.goto(`${BASE_URL}/admin/permissions`);
  905  | 
> 906  |       await expect(page.locator('h1').filter({ hasText: /permissions/i })).toBeVisible();
       |                                                                            ^ Error: expect(locator).toBeVisible() failed
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
```
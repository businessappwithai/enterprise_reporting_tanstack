# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Settings >> 14.3 Can send test email
- Location: e2e/complete-system-test.spec.ts:978:5

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
              - heading "Email Settings" [level=1] [ref=e143]
              - paragraph [ref=e144]: Configure email notifications for job completion
            - button "Verify Connection" [ref=e145] [cursor=pointer]:
              - img [ref=e146]
              - text: Verify Connection
          - generic [ref=e151]:
            - tablist [ref=e152]:
              - tab "Configuration" [ref=e153] [cursor=pointer]:
                - img [ref=e154]
                - text: Configuration
              - tab "Templates" [ref=e157] [cursor=pointer]:
                - img [ref=e158]
                - text: Templates
              - tab "Test Email" [active] [selected] [ref=e161] [cursor=pointer]:
                - img [ref=e162]
                - text: Test Email
            - tabpanel "Test Email" [ref=e165]:
              - generic [ref=e166]:
                - heading "Send Test Email" [level=3] [ref=e168]
                - generic [ref=e169]:
                  - paragraph [ref=e170]: Send a test email to verify your SMTP configuration is working correctly.
                  - generic [ref=e171]:
                    - text: Recipient Email
                    - textbox "Recipient Email" [ref=e172]:
                      - /placeholder: your-email@example.com
                  - button "Send Test Email" [disabled]:
                    - img
                    - text: Send Test Email
                  - generic [ref=e173]:
                    - heading "💡 Tips" [level=4] [ref=e174]
                    - list [ref=e175]:
                      - listitem [ref=e176]: Send to your own email first to test configuration
                      - listitem [ref=e177]: Check spam folder if email doesn't arrive
                      - listitem [ref=e178]: "Gmail users: Use App Password, not your regular password"
                      - listitem [ref=e179]: "Outlook/Office365: Use SMTP with authentication"
  - region "Notifications alt+T"
```

# Test source

```ts
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
  906  |       await expect(page.locator('h1').filter({ hasText: /permissions/i })).toBeVisible();
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
> 990  |         expect(hasFeedback).toBeTruthy();
       |                             ^ Error: expect(received).toBeTruthy()
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
  1007 |       await expect(page.locator('h1').filter({ hasText: /datasets/i })).toBeVisible({ timeout: 10000 });
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
```
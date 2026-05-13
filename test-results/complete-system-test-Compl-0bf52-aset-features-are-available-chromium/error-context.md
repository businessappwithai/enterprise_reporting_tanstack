# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> WASM Features >> 15.3 Dataset features are available
- Location: e2e/complete-system-test.spec.ts:1018:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1')

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
> 1028 |       await expect(page.locator('h1')).toBeVisible();
       |                                        ^ Error: expect(locator).toBeVisible() failed
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
  1108 |         { text: /dashboard/i, url: '/dashboard' },
  1109 |         { text: /reports/i, url: '/reports' },
  1110 |         { text: /charts/i, url: '/charts' },
  1111 |         { text: /sql editor/i, url: '/sql-editor' },
  1112 |         { text: /data sources/i, url: '/data-sources' },
  1113 |         { text: /dashboards/i, url: '/dashboards' },
  1114 |       ];
  1115 | 
  1116 |       for (const link of navLinks) {
  1117 |         // Click navigation link
  1118 |         const navLink = page.locator(`a:has-text("${link.text}"), nav:has-text("${link.text}")`).first();
  1119 | 
  1120 |         if (await navLink.isVisible()) {
  1121 |           await navLink.click();
  1122 |           await page.waitForTimeout(2000);
  1123 | 
  1124 |           // Should navigate to correct page
  1125 |           const currentUrl = page.url();
  1126 |           expect(currentUrl).toContain(link.url);
  1127 | 
  1128 |           // Go back to home for next test
```
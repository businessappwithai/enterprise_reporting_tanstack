# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: save-query-test.spec.ts >> Save Query Functionality >> Navigate to SQL Editor and check save button
- Location: e2e/save-query-test.spec.ts:18:3

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
  1   | /**
  2   |  * Save Query Functionality Test
  3   |  *
  4   |  * This test verifies that the save query feature works correctly
  5   |  * after fixing the saved_queries table schema.
  6   |  */
  7   | 
  8   | import { test, expect } from '@playwright/test';
  9   | import { login } from './test-auth';
  10  | 
  11  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  12  | 
  13  | test.describe('Save Query Functionality', () => {
  14  |   test.beforeEach(async ({ page }) => {
  15  |     await login(page);
  16  |   });
  17  | 
  18  |   test('Navigate to SQL Editor and check save button', async ({ page }) => {
  19  |     await page.goto(`${BASE_URL}/sql-editor`);
  20  | 
  21  |     // Wait for Monaco editor to load
> 22  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  23  | 
  24  |     // Click in editor and type a query
  25  |     await page.locator('.monaco-editor').click();
  26  |     await page.keyboard.type('SELECT COUNT(*) as count FROM users');
  27  | 
  28  |     console.log('✓ Query typed in editor');
  29  | 
  30  |     // Look for save button
  31  |     const saveBtn = page.getByRole('button', { name: /save/i }).or(page.getByRole('button', { name: /save query/i }));
  32  |     const count = await saveBtn.count();
  33  | 
  34  |     console.log(`✓ Found ${count} save button(s)`);
  35  | 
  36  |     // Try clicking save if button exists
  37  |     if (count > 0) {
  38  |       await saveBtn.first().click();
  39  |       await page.waitForTimeout(2000);
  40  | 
  41  |       // Check for any dialog or modal for saving
  42  |       const dialog = page.locator('[role="dialog"], .modal, .dialog').first();
  43  |       const hasDialog = await dialog.isVisible().catch(() => false);
  44  | 
  45  |       if (hasDialog) {
  46  |         console.log('✓ Save dialog appeared');
  47  | 
  48  |         // Look for name input
  49  |         const nameInput = page.locator('input[name="name"], input[placeholder*="name"]').first();
  50  |         const hasInput = await nameInput.isVisible().catch(() => false);
  51  | 
  52  |         if (hasInput) {
  53  |           await nameInput.fill('Test Query');
  54  |           console.log('✓ Query name entered');
  55  | 
  56  |           // Look for confirm button
  57  |           const confirmBtn = page.getByRole('button', { name: /save|create|confirm/i }).or(page.getByRole('button', { name: /ok/i }));
  58  |           await confirmBtn.first().click();
  59  |           await page.waitForTimeout(2000);
  60  | 
  61  |           console.log('✓ Save query completed');
  62  |         }
  63  |       } else {
  64  |         console.log('⚠ No save dialog appeared - might be inline save');
  65  |       }
  66  |     }
  67  | 
  68  |     // Take screenshot
  69  |     await page.screenshot({ path: 'test-results/save-query-test.png' });
  70  |   });
  71  | 
  72  |   test('Check console for query save API calls', async ({ page }) => {
  73  |     const apiCalls: string[] = [];
  74  | 
  75  |     // Listen for API calls
  76  |     page.on('request', request => {
  77  |       if (request.url().includes('/api/queries')) {
  78  |         apiCalls.push(`${request.method()} ${request.url()}`);
  79  |       }
  80  |     });
  81  | 
  82  |     await page.goto(`${BASE_URL}/sql-editor`);
  83  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  84  | 
  85  |     // Try to trigger a save query action
  86  |     await page.locator('.monaco-editor').click();
  87  |     await page.keyboard.type('SELECT 1');
  88  | 
  89  |     // Look for and click save button
  90  |     const saveBtn = page.getByRole('button', { name: /save/i }).first();
  91  |     const hasSave = await saveBtn.isVisible().catch(() => false);
  92  | 
  93  |     if (hasSave) {
  94  |       await saveBtn.click();
  95  |       await page.waitForTimeout(2000);
  96  |     }
  97  | 
  98  |     console.log('API calls to /api/queries:', apiCalls.length > 0 ? apiCalls : 'None detected');
  99  | 
  100 |     // Check for 500 errors in console
  101 |     const errors: string[] = [];
  102 |     page.on('response', response => {
  103 |       if (response.status() === 500 && response.url().includes('/api/queries')) {
  104 |         errors.push(response.url());
  105 |       }
  106 |     });
  107 | 
  108 |     await page.waitForTimeout(1000);
  109 | 
  110 |     if (errors.length > 0) {
  111 |       console.log('⚠ 500 errors detected:', errors);
  112 |     } else {
  113 |       console.log('✓ No 500 errors on /api/queries');
  114 |     }
  115 | 
  116 |     expect(errors.length).toBe(0);
  117 |   });
  118 | });
  119 | 
```
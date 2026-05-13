# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Authentication & Authorization >> 1.3 User can logout
- Location: e2e/complete-system-test.spec.ts:71:5

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('[data-testid="user-menu-button"]')

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
            - heading "Dashboard" [level=1] [ref=e142]
            - paragraph [ref=e143]: Welcome to the Enterprise Reporting System - admin@admin.com
          - generic [ref=e144]:
            - link "Total Reports 0" [ref=e145] [cursor=pointer]:
              - /url: /reports
              - generic [ref=e146]:
                - generic [ref=e147]:
                  - heading "Total Reports" [level=3] [ref=e148]
                  - img [ref=e149]
                - generic [ref=e153]: "0"
            - link "Active Charts 4" [ref=e154] [cursor=pointer]:
              - /url: /charts
              - generic [ref=e155]:
                - generic [ref=e156]:
                  - heading "Active Charts" [level=3] [ref=e157]
                  - img [ref=e158]
                - generic [ref=e161]: "4"
            - link "Dashboards 3" [ref=e162] [cursor=pointer]:
              - /url: /dashboards
              - generic [ref=e163]:
                - generic [ref=e164]:
                  - heading "Dashboards" [level=3] [ref=e165]
                  - img [ref=e166]
                - generic [ref=e172]: "3"
            - link "Scheduled Jobs 0" [ref=e173] [cursor=pointer]:
              - /url: /jobs
              - generic [ref=e174]:
                - generic [ref=e175]:
                  - heading "Scheduled Jobs" [level=3] [ref=e176]
                  - img [ref=e177]
                - generic [ref=e181]: "0"
          - generic [ref=e182]:
            - heading "Quick Actions" [level=2] [ref=e183]
            - generic [ref=e184]:
              - link "SQL Editor Write and execute SQL queries" [ref=e185] [cursor=pointer]:
                - /url: /sql-editor
                - generic [ref=e186]:
                  - generic [ref=e188]:
                    - img [ref=e189]
                    - heading "SQL Editor" [level=3] [ref=e193]
                  - paragraph [ref=e195]: Write and execute SQL queries
              - link "Reports View and manage reports" [ref=e196] [cursor=pointer]:
                - /url: /reports
                - generic [ref=e197]:
                  - generic [ref=e199]:
                    - img [ref=e200]
                    - heading "Reports" [level=3] [ref=e203]
                  - paragraph [ref=e205]: View and manage reports
              - link "Charts Create data visualizations" [ref=e206] [cursor=pointer]:
                - /url: /charts
                - generic [ref=e207]:
                  - generic [ref=e209]:
                    - img [ref=e210]
                    - heading "Charts" [level=3] [ref=e212]
                  - paragraph [ref=e214]: Create data visualizations
              - link "Dashboards Build interactive dashboards" [ref=e215] [cursor=pointer]:
                - /url: /dashboards
                - generic [ref=e216]:
                  - generic [ref=e218]:
                    - img [ref=e219]
                    - heading "Dashboards" [level=3] [ref=e224]
                  - paragraph [ref=e226]: Build interactive dashboards
          - generic [ref=e227]:
            - generic [ref=e228]:
              - heading "Recent Jobs" [level=3] [ref=e230]:
                - img [ref=e231]
                - text: Recent Jobs
              - paragraph [ref=e234]: No recent job executions
            - generic [ref=e235]:
              - heading "Recent Activity" [level=3] [ref=e237]:
                - img [ref=e238]
                - text: Recent Activity
              - paragraph [ref=e242]: No recent activity
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | /**
  2   |  * Complete System E2E Test Suite
  3   |  *
  4   |  * This test suite covers ALL functionality of the Enterprise Reporting System:
  5   |  * - Authentication & Authorization
  6   |  * - Data Source Management
  7   |  * - SQL Editor & Query Execution
  8   |  * - Reports (Create, Edit, View, Export)
  9   |  * - Charts (All chart types)
  10  |  * - Dashboards (Create, Edit, Widgets, Cross-Filtering)
  11  |  * - Filters (Saved, Dynamic)
  12  |  * - Metadata Entities (CRUD, Permissions)
  13  |  * - Jobs (Schedule, Monitor, Retry)
  14  |  * - Admin Panel (Users, Roles, Permissions)
  15  |  * - Settings (Email configuration)
  16  |  * - WASM Features (DuckDB, Datasets, Offline Mode, Progressive Loading)
  17  |  *
  18  |  * Run: bun run test:e2e -- e2e/complete-system-test.spec.ts
  19  |  */
  20  | 
  21  | import { test, expect } from '@playwright/test';
  22  | import { login } from './test-auth';
  23  | 
  24  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  25  | 
  26  | // Test credentials
  27  | const ADMIN_CREDS = { email: 'admin@admin.com', password: 'admin' };
  28  | const ANALYST_CREDS = { email: 'analyst@example.com', password: 'analyst123' };
  29  | 
  30  | // Test data
  31  | const TEST_DATA_SOURCE = {
  32  |   name: 'E2E Test DataSource',
  33  |   type: 'postgres',
  34  |   host: 'localhost',
  35  |   port: '5432',
  36  |   database: 'test_db',
  37  |   username: 'test_user',
  38  |   password: 'test_pass',
  39  | };
  40  | 
  41  | test.describe('Complete System Test Suite', () => {
  42  |   // ========================================================================
  43  |   // PART 1: AUTHENTICATION & AUTHORIZATION
  44  |   // ========================================================================
  45  | 
  46  |   test.describe('Authentication & Authorization', () => {
  47  |     test('1.1 User can login with valid credentials', async ({ page }) => {
  48  |       await page.goto(`${BASE_URL}/login`);
  49  | 
  50  |       // Fill login form
  51  |       await page.fill('input[name="email"]', ADMIN_CREDS.email);
  52  |       await page.fill('input[name="password"]', ADMIN_CREDS.password);
  53  |       await page.click('button[type="submit"]');
  54  | 
  55  |       // Should redirect to dashboard
  56  |       await page.waitForURL(/\/(dashboard|)$/, { timeout: 10000 });
  57  |       expect(page.url()).toMatch(/\/(dashboard|)$/);
  58  |     });
  59  | 
  60  |     test('1.2 User cannot login with invalid credentials', async ({ page }) => {
  61  |       await page.goto(`${BASE_URL}/login`);
  62  | 
  63  |       await page.fill('input[name="email"]', 'invalid@test.com');
  64  |       await page.fill('input[name="password"]', 'wrongpassword');
  65  |       await page.click('button[type="submit"]');
  66  | 
  67  |       // Should show error message
  68  |       await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 });
  69  |     });
  70  | 
  71  |     test('1.3 User can logout', async ({ page }) => {
  72  |       await login(page);
  73  | 
  74  |       // Click user menu and logout
> 75  |       await page.click('[data-testid="user-menu-button"]');
      |                  ^ TimeoutError: page.click: Timeout 15000ms exceeded.
  76  |       await page.click('text=Logout');
  77  | 
  78  |       // Should redirect to login
  79  |       await page.waitForURL('/login', { timeout: 10000 });
  80  |       expect(page.url()).toContain('/login');
  81  |     });
  82  | 
  83  |     test('1.4 Unauthenticated user is redirected to login', async ({ page }) => {
  84  |       await page.goto(`${BASE_URL}/reports`);
  85  | 
  86  |       // Should redirect to login
  87  |       await page.waitForURL('/login', { timeout: 5000 });
  88  |       expect(page.url()).toContain('/login');
  89  |     });
  90  |   });
  91  | 
  92  |   // ========================================================================
  93  |   // PART 2: DATA SOURCE MANAGEMENT
  94  |   // ========================================================================
  95  | 
  96  |   test.describe('Data Source Management', () => {
  97  |     test.beforeEach(async ({ page }) => {
  98  |       await login(page);
  99  |     });
  100 | 
  101 |     test('2.1 Can view data sources list', async ({ page }) => {
  102 |       await page.goto(`${BASE_URL}/data-sources`);
  103 | 
  104 |       // Page should load
  105 |       await expect(page.locator('h1').filter({ hasText: /data sources/i })).toBeVisible();
  106 | 
  107 |       // Should have a table of data sources
  108 |       await expect(page.locator('table, [role="table"]')).toBeVisible();
  109 |     });
  110 | 
  111 |     test('2.2 Can create a new data source', async ({ page }) => {
  112 |       await page.goto(`${BASE_URL}/data-sources`);
  113 | 
  114 |       // Click "New Data Source" button
  115 |       await page.click('button:has-text("New Data Source"), button:has-text("Add Data Source")');
  116 | 
  117 |       // Wait for dialog/modal
  118 |       await expect(page.locator('[role="dialog"], .dialog, dialog')).toBeVisible();
  119 | 
  120 |       // Fill form
  121 |       await page.fill('input[name="name"]', `E2E Test ${Date.now()}`);
  122 |       await page.selectOption('select[name="type"]', 'postgres');
  123 |       await page.fill('input[name="host"]', 'localhost');
  124 |       await page.fill('input[name="port"]', '5432');
  125 |       await page.fill('input[name="database"]', 'test_db');
  126 |       await page.fill('input[name="username"]', 'test_user');
  127 |       await page.fill('input[name="password"]', 'test_pass');
  128 | 
  129 |       // Submit
  130 |       await page.click('button:has-text("Save"), button:has-text("Create"), button[type="submit"]');
  131 | 
  132 |       // Should show success message
  133 |       await expect(page.locator('text=success, text=created, text=saved').first()).toBeVisible({ timeout: 5000 });
  134 |     });
  135 | 
  136 |     test('2.3 Can test data source connection', async ({ page }) => {
  137 |       await page.goto(`${BASE_URL}/data-sources`);
  138 | 
  139 |       // Find first data source with test button
  140 |       const testButton = page.locator('button:has-text("Test Connection")').first();
  141 |       if (await testButton.isVisible()) {
  142 |         await testButton.click();
  143 | 
  144 |         // Should show connection result
  145 |         await expect(page.locator('text=success, text=connected, text=failed').first()).toBeVisible({ timeout: 5000 });
  146 |       }
  147 |     });
  148 | 
  149 |     test('2.4 Can view data source schema', async ({ page }) => {
  150 |       await page.goto(`${BASE_URL}/data-sources`);
  151 | 
  152 |       // Click on a data source
  153 |       const firstRow = page.locator('table tbody tr, [role="row"]').first();
  154 |       await firstRow.click();
  155 | 
  156 |       // Should show schema or navigate to detail page
  157 |       await page.waitForTimeout(2000);
  158 | 
  159 |       // Look for tables or schema info
  160 |       const hasTables = await page.locator('text=table, text=Tables').count() > 0;
  161 |       const hasSchema = await page.locator('.schema, [data-testid="schema"]').count() > 0;
  162 | 
  163 |       expect(hasTables || hasSchema).toBeTruthy();
  164 |     });
  165 |   });
  166 | 
  167 |   // ========================================================================
  168 |   // PART 3: SQL EDITOR
  169 |   // ========================================================================
  170 | 
  171 |   test.describe('SQL Editor', () => {
  172 |     test.beforeEach(async ({ page }) => {
  173 |       await login(page);
  174 |     });
  175 | 
```
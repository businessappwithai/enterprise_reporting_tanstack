# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-roles.spec.ts >> Admin - Role Management >> should display roles management page
- Location: e2e/admin-roles.spec.ts:26:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Manage roles and their permissions')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Manage roles and their permissions')

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
            - heading "Admin Panel" [level=1] [ref=e142]
            - paragraph [ref=e143]: Manage system users, roles, and permissions
          - generic [ref=e144]:
            - link "Users" [ref=e145] [cursor=pointer]:
              - /url: /admin/users
            - link "Roles" [ref=e146] [cursor=pointer]:
              - /url: /admin/roles
            - link "Permissions" [ref=e147] [cursor=pointer]:
              - /url: /admin/permissions
          - generic [ref=e148]:
            - generic [ref=e149]:
              - generic [ref=e150]:
                - heading "Role Management" [level=1] [ref=e151]
                - paragraph [ref=e152]: Manage roles and their granular permissions
              - button "Create Role" [ref=e153] [cursor=pointer]:
                - img [ref=e154]
                - text: Create Role
            - generic [ref=e156]:
              - heading "All Roles" [level=3] [ref=e158]:
                - img [ref=e159]
                - text: All Roles
              - table [ref=e163]:
                - rowgroup [ref=e164]:
                  - row "Role Name Description Permissions Actions" [ref=e165]:
                    - columnheader "Role Name" [ref=e166]
                    - columnheader "Description" [ref=e167]
                    - columnheader "Permissions" [ref=e168]
                    - columnheader "Actions" [ref=e169]
                - rowgroup [ref=e170]:
                  - row "Admin Full system access admin:* data_source:* Edit Delete" [ref=e171]:
                    - cell "Admin" [ref=e172]:
                      - generic [ref=e173]: Admin
                    - cell "Full system access" [ref=e174]
                    - cell "admin:* data_source:*" [ref=e175]:
                      - generic [ref=e176]:
                        - generic [ref=e177]: admin:*
                        - generic [ref=e178]: data_source:*
                    - cell "Edit Delete" [ref=e179]:
                      - button "Edit" [ref=e180] [cursor=pointer]:
                        - img [ref=e181]
                        - text: Edit
                      - button "Delete" [disabled]:
                        - img
                        - text: Delete
                  - row "Analyst Can create and execute reports, charts, and queries data_source:view query:* Edit Delete" [ref=e184]:
                    - cell "Analyst" [ref=e185]:
                      - generic [ref=e186]: Analyst
                    - cell "Can create and execute reports, charts, and queries" [ref=e187]
                    - cell "data_source:view query:*" [ref=e188]:
                      - generic [ref=e189]:
                        - generic [ref=e190]: data_source:view
                        - generic [ref=e191]: query:*
                    - cell "Edit Delete" [ref=e192]:
                      - button "Edit" [ref=e193] [cursor=pointer]:
                        - img [ref=e194]
                        - text: Edit
                      - button "Delete" [ref=e197] [cursor=pointer]:
                        - img [ref=e198]
                        - text: Delete
                  - row "Viewer View-only access to reports and dashboards data_source:view query:view Edit Delete" [ref=e201]:
                    - cell "Viewer" [ref=e202]:
                      - generic [ref=e203]: Viewer
                    - cell "View-only access to reports and dashboards" [ref=e204]
                    - cell "data_source:view query:view" [ref=e205]:
                      - generic [ref=e206]:
                        - generic [ref=e207]: data_source:view
                        - generic [ref=e208]: query:view
                    - cell "Edit Delete" [ref=e209]:
                      - button "Edit" [ref=e210] [cursor=pointer]:
                        - img [ref=e211]
                        - text: Edit
                      - button "Delete" [ref=e214] [cursor=pointer]:
                        - img [ref=e215]
                        - text: Delete
  - region "Notifications alt+T"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Comprehensive E2E Tests for Role Management
  5   |  * Tests CRUD operations for roles in the admin panel
  6   |  */
  7   | 
  8   | test.describe.configure({ mode: 'serial' });
  9   | 
  10  | // Clear storage for all tests in this file
  11  | test.use({ storageState: { cookies: [], origins: [] } });
  12  | 
  13  | test.describe('Admin - Role Management', () => {
  14  |   test.beforeEach(async ({ page }) => {
  15  |     // Login as admin before each test
  16  |     await page.goto('/');
  17  |     await page.getByPlaceholder('name@example.com').fill('admin@admin.com');
  18  |     await page.getByLabel('Password').fill('admin');
  19  |     await page.getByRole('button', { name: 'Sign In' }).click();
  20  | 
  21  |     // Wait for page load after login
  22  |     await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  23  |     await page.waitForTimeout(1000);
  24  |   });
  25  | 
  26  |   test('should display roles management page', async ({ page }) => {
  27  |     await page.goto('/admin/roles');
  28  | 
  29  |     // Wait for page to load
  30  |     await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  31  |     await page.waitForTimeout(3000);
  32  | 
  33  |     // Verify page title
  34  |     await expect(page.getByRole('heading', { name: 'Role Management' })).toBeVisible({ timeout: 5000 });
> 35  |     await expect(page.getByText('Manage roles and their permissions')).toBeVisible();
      |                                                                        ^ Error: expect(locator).toBeVisible() failed
  36  | 
  37  |     // Wait for table to be visible or "No roles" message
  38  |     await page.waitForTimeout(2000);
  39  | 
  40  |     // Check for table OR "No roles found" message
  41  |     const tableVisible = await page.getByRole('columnheader', { name: 'Role Name' }).isVisible().catch(() => false);
  42  |     const noRolesVisible = await page.getByText('No roles found').isVisible().catch(() => false);
  43  |     const loadingVisible = await page.getByText('Loading roles').isVisible().catch(() => false);
  44  | 
  45  |     // At least one should be visible
  46  |     expect(tableVisible || noRolesVisible || loadingVisible).toBeTruthy();
  47  | 
  48  |     // Verify Create Role button
  49  |     await expect(page.getByRole('button', { name: /create role/i }).or(page.getByRole('button', { name: /create role/i }))).toBeVisible();
  50  | 
  51  |     // Take screenshot
  52  |     await page.screenshot({ path: 'screenshots/admin-roles-page.png' });
  53  |   });
  54  | 
  55  |   test('should display default roles', async ({ page }) => {
  56  |     await page.goto('/admin/roles');
  57  | 
  58  |     // Wait for page to load
  59  |     await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  60  |     await page.waitForTimeout(3000);
  61  | 
  62  |     // Verify default roles exist - wait for table to load
  63  |     const tableVisible = await page.getByRole('table').isVisible({ timeout: 5000 }).catch(() => false);
  64  | 
  65  |     if (tableVisible) {
  66  |       // Check for at least one default role
  67  |       await expect(page.getByText('Admin').first()).toBeVisible({ timeout: 5000 });
  68  |     } else {
  69  |       // If no table, check for "No roles" message
  70  |       const noRolesVisible = await page.getByText('No roles found').isVisible().catch(() => false);
  71  |       expect(noRolesVisible).toBeTruthy();
  72  |     }
  73  | 
  74  |     // Take screenshot
  75  |     await page.screenshot({ path: 'screenshots/admin-roles-default.png' });
  76  |   });
  77  | 
  78  |   test('should create a new role', async ({ page }) => {
  79  |     await page.goto('/admin/roles');
  80  | 
  81  |     // Wait for page load
  82  |     await page.waitForTimeout(2000);
  83  | 
  84  |     // Click Create Role button
  85  |     await page.getByRole('button', { name: /create role/i }).click();
  86  | 
  87  |     // Wait for dialog to open
  88  |     await expect(page.getByRole('heading', { name: 'Create Role' })).toBeVisible({ timeout: 5000 });
  89  | 
  90  |     // Fill in role details
  91  |     const timestamp = Date.now();
  92  |     const roleName = `Test Role ${timestamp}`;
  93  |     const roleDescription = `Test role description ${timestamp}`;
  94  | 
  95  |     await page.getByLabel('Role Name').fill(roleName);
  96  |     await page.getByLabel('Description').fill(roleDescription);
  97  | 
  98  |     // Select permissions using checkboxes
  99  |     // The permissions are displayed as checkboxes with labels like "dashboard → view"
  100 |     // Click on a few permission checkboxes
  101 |     const permissions = [
  102 |       'dashboard → view',
  103 |       'report → view',
  104 |     ];
  105 | 
  106 |     for (const permission of permissions) {
  107 |       // Find the label for this permission and click it
  108 |       const permissionLabel = page.getByText(permission).first();
  109 |       if (await permissionLabel.isVisible({ timeout: 2000 }).catch(() => false)) {
  110 |         await permissionLabel.click();
  111 |         await page.waitForTimeout(200);
  112 |       }
  113 |     }
  114 | 
  115 |     // Submit form
  116 |     await page.getByRole('button', { name: 'Create Role' }).click();
  117 | 
  118 |     // Wait for dialog to close (either success or error)
  119 |     await page.waitForTimeout(3000);
  120 | 
  121 |     // Check for success toast OR if role was created
  122 |     const dialogVisible = await page.getByRole('heading', { name: 'Create Role' }).isVisible().catch(() => false);
  123 |     const hasSuccess = await page.getByText(/created successfully/i, { exact: false }).isVisible().catch(() => false);
  124 |     const roleVisible = await page.getByText(roleName).isVisible({ timeout: 5000 }).catch(() => false);
  125 | 
  126 |     // Either dialog should be closed with success, or role should be visible in table
  127 |     expect(!dialogVisible || hasSuccess || roleVisible).toBeTruthy();
  128 | 
  129 |     await page.screenshot({ path: 'screenshots/admin-role-created.png' });
  130 |   });
  131 | 
  132 |   test('should validate role creation - duplicate name', async ({ page }) => {
  133 |     await page.goto('/admin/roles');
  134 | 
  135 |     // Wait for page load
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Admin - Roles >> 12.2 Can create a new role
- Location: e2e/complete-system-test.spec.ts:849:5

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("New Role"), button:has-text("Add Role")')

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
  753 |         // Look for edit button
  754 |         const editButton = page.locator('button:has-text("Edit")').first();
  755 | 
  756 |         if (await editButton.isVisible()) {
  757 |           await editButton.click();
  758 |           await page.waitForTimeout(2000);
  759 | 
  760 |           // Should show edit form
  761 |           const hasForm = await page.locator('input[name="name"], textarea').count() > 0;
  762 |           expect(hasForm).toBeTruthy();
  763 |         }
  764 |       }
  765 |     });
  766 |   });
  767 | 
  768 |   // ========================================================================
  769 |   // PART 11: ADMIN PANEL - USERS
  770 |   // ========================================================================
  771 | 
  772 |   test.describe('Admin - Users', () => {
  773 |     test.beforeEach(async ({ page }) => {
  774 |       await login(page);
  775 |     });
  776 | 
  777 |     test('11.1 Can view users list', async ({ page }) => {
  778 |       await page.goto(`${BASE_URL}/admin/users`);
  779 | 
  780 |       await expect(page.locator('h1').filter({ hasText: /users/i })).toBeVisible();
  781 |       await expect(page.locator('table, [role="table"]')).toBeVisible();
  782 |     });
  783 | 
  784 |     test('11.2 Can create a new user', async ({ page }) => {
  785 |       await page.goto(`${BASE_URL}/admin/users`);
  786 | 
  787 |       // Click new user button
  788 |       await page.click('button:has-text("New User"), button:has-text("Add User")');
  789 | 
  790 |       // Wait for dialog
  791 |       await page.waitForTimeout(1000);
  792 | 
  793 |       // Fill user details
  794 |       const email = `e2e_test_${Date.now()}@example.com`;
  795 |       await page.fill('input[name="email"]', email);
  796 |       await page.fill('input[name="name"]', `E2E User ${Date.now()}`);
  797 |       await page.fill('input[name="password"]', 'test_password_123');
  798 | 
  799 |       // Select role
  800 |       const roleSelect = page.locator('select[name="role"]').first();
  801 |       if (await roleSelect.isVisible()) {
  802 |         await roleSelect.selectOption('analyst');
  803 |       }
  804 | 
  805 |       // Save
  806 |       await page.click('button:has-text("Save"), button:has-text("Create")');
  807 |       await page.waitForTimeout(2000);
  808 | 
  809 |       // Should show success
  810 |       await expect(page.locator('text=success, text=created').first()).toBeVisible({ timeout: 5000 });
  811 |     });
  812 | 
  813 |     test('11.3 Can assign roles to user', async ({ page }) => {
  814 |       await page.goto(`${BASE_URL}/admin/users`);
  815 | 
  816 |       // Click on first user
  817 |       const firstUser = page.locator('table tbody tr').first();
  818 |       const count = await firstUser.count();
  819 | 
  820 |       if (count > 0) {
  821 |         await firstUser.click();
  822 |         await page.waitForTimeout(2000);
  823 | 
  824 |         // Look for role assignment
  825 |         const roleSection = page.locator('.roles, [data-testid="roles"]').first();
  826 | 
  827 |         if (await roleSection.isVisible()) {
  828 |           expect(roleSection).toBeVisible();
  829 |         }
  830 |       }
  831 |     });
  832 |   });
  833 | 
  834 |   // ========================================================================
  835 |   // PART 12: ADMIN PANEL - ROLES
  836 |   // ========================================================================
  837 | 
  838 |   test.describe('Admin - Roles', () => {
  839 |     test.beforeEach(async ({ page }) => {
  840 |       await login(page);
  841 |     });
  842 | 
  843 |     test('12.1 Can view roles list', async ({ page }) => {
  844 |       await page.goto(`${BASE_URL}/admin/roles`);
  845 | 
  846 |       await expect(page.locator('h1').filter({ hasText: /roles/i })).toBeVisible();
  847 |     });
  848 | 
  849 |     test('12.2 Can create a new role', async ({ page }) => {
  850 |       await page.goto(`${BASE_URL}/admin/roles`);
  851 | 
  852 |       // Click new role button
> 853 |       await page.click('button:has-text("New Role"), button:has-text("Add Role")');
      |                  ^ TimeoutError: page.click: Timeout 15000ms exceeded.
  854 | 
  855 |       // Wait for dialog
  856 |       await page.waitForTimeout(1000);
  857 | 
  858 |       // Fill role details
  859 |       const roleName = `e2e_role_${Date.now()}`;
  860 |       await page.fill('input[name="name"]', roleName);
  861 |       await page.fill('textarea[name="description"]', 'E2E test role');
  862 | 
  863 |       // Select permissions
  864 |       const permissionsCheckboxes = page.locator('input[type="checkbox"]');
  865 |       const count = await permissionsCheckboxes.count();
  866 | 
  867 |       if (count > 0) {
  868 |         await permissionsCheckboxes.nth(0).check();
  869 |       }
  870 | 
  871 |       // Save
  872 |       await page.click('button:has-text("Save"), button:has-text("Create")');
  873 |       await page.waitForTimeout(2000);
  874 |     });
  875 | 
  876 |     test('12.3 Can configure role permissions', async ({ page }) => {
  877 |       await page.goto(`${BASE_URL}/admin/roles`);
  878 | 
  879 |       // Click on first role
  880 |       const firstRole = page.locator('table tbody tr').first();
  881 |       const count = await firstRole.count();
  882 | 
  883 |       if (count > 0) {
  884 |         await firstRole.click();
  885 |         await page.waitForTimeout(2000);
  886 | 
  887 |         // Should show permissions
  888 |         const hasPermissions = await page.locator('input[type="checkbox"], .permissions').count() > 0;
  889 |         expect(hasPermissions).toBeTruthy();
  890 |       }
  891 |     });
  892 |   });
  893 | 
  894 |   // ========================================================================
  895 |   // PART 13: ADMIN PANEL - PERMISSIONS
  896 |   // ========================================================================
  897 | 
  898 |   test.describe('Admin - Permissions', () => {
  899 |     test.beforeEach(async ({ page }) => {
  900 |       await login(page);
  901 |     });
  902 | 
  903 |     test('13.1 Can view permissions matrix', async ({ page }) => {
  904 |       await page.goto(`${BASE_URL}/admin/permissions`);
  905 | 
  906 |       await expect(page.locator('h1').filter({ hasText: /permissions/i })).toBeVisible();
  907 | 
  908 |       // Should show a table or matrix of permissions
  909 |       await expect(page.locator('table, .permissions-matrix')).toBeVisible();
  910 |     });
  911 | 
  912 |     test('13.2 Can update resource permissions', async ({ page }) => {
  913 |       await page.goto(`${BASE_URL}/admin/permissions`);
  914 | 
  915 |       // Look for editable permission cells
  916 |       const editableCells = page.locator('[contenteditable="true"], .permission-cell:has(button)');
  917 | 
  918 |       const count = await editableCells.count();
  919 | 
  920 |       if (count > 0) {
  921 |         // Click on first editable cell
  922 |         await editableCells.first().click();
  923 |         await page.waitForTimeout(1000);
  924 | 
  925 |         // Should show permission options
  926 |         const hasOptions = await page.locator('text=View, text=Edit, text=Admin').count() > 0;
  927 |         expect(hasOptions).toBeTruthy();
  928 |       }
  929 |     });
  930 |   });
  931 | 
  932 |   // ========================================================================
  933 |   // PART 14: SETTINGS
  934 |   // ========================================================================
  935 | 
  936 |   test.describe('Settings', () => {
  937 |     test.beforeEach(async ({ page }) => {
  938 |       await login(page);
  939 |     });
  940 | 
  941 |     test('14.1 Can access email settings', async ({ page }) => {
  942 |       await page.goto(`${BASE_URL}/settings/email`);
  943 | 
  944 |       await expect(page.locator('h1').filter({ hasText: /email/i }).or(page.locator('h1').filter({ hasText: /settings/i }))).toBeVisible();
  945 | 
  946 |       // Should show email configuration form
  947 |       const hasForm = await page.locator('input[name="smtp"], input[name="email"], input[name="host"]').count() > 0;
  948 | 
  949 |       // Form might not be visible if already configured, that's okay
  950 |       if (hasForm) {
  951 |         expect(hasForm).toBeTruthy();
  952 |       }
  953 |     });
```
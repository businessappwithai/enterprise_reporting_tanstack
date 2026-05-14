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

Locator: getByRole('heading', { name: 'Role Management' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Role Management' })

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
> 34  |     await expect(page.getByRole('heading', { name: 'Role Management' })).toBeVisible({ timeout: 5000 });
      |                                                                          ^ Error: expect(locator).toBeVisible() failed
  35  |     await expect(page.getByText('Manage roles and their permissions')).toBeVisible();
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
```
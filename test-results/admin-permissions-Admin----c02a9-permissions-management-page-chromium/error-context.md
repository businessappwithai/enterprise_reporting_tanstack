# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-permissions.spec.ts >> Admin - Permission Management >> should display permissions management page
- Location: e2e/admin-permissions.spec.ts:26:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Permission Management' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Permission Management' })

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
  4   |  * Comprehensive E2E Tests for Permission Management
  5   |  * Tests CRUD operations for resource-level permissions
  6   |  */
  7   | 
  8   | test.describe.configure({ mode: 'serial' });
  9   | 
  10  | // Clear storage for all tests in this file
  11  | test.use({ storageState: { cookies: [], origins: [] } });
  12  | 
  13  | test.describe('Admin - Permission Management', () => {
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
  26  |   test('should display permissions management page', async ({ page }) => {
  27  |     await page.goto('/admin/permissions');
  28  | 
  29  |     // Wait for page to load
  30  |     await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  31  |     await page.waitForTimeout(3000);
  32  | 
  33  |     // Verify page title
> 34  |     await expect(page.getByRole('heading', { name: 'Permission Management' })).toBeVisible({ timeout: 5000 });
      |                                                                                ^ Error: expect(locator).toBeVisible() failed
  35  |     await expect(page.getByText('Manage resource-level permissions for roles')).toBeVisible();
  36  | 
  37  |     // Wait for table to be visible or "No permissions" message
  38  |     await page.waitForTimeout(2000);
  39  | 
  40  |     // Check for table OR "No permissions found" message
  41  |     const tableVisible = await page.getByRole('columnheader', { name: 'Role' }).isVisible().catch(() => false);
  42  |     const noPermsVisible = await page.getByText(/no permissions|no resource permissions/i).isVisible().catch(() => false);
  43  |     const loadingVisible = await page.getByText(/loading|loading permissions/i).isVisible().catch(() => false);
  44  | 
  45  |     // At least one should be visible
  46  |     expect(tableVisible || noPermsVisible || loadingVisible).toBeTruthy();
  47  | 
  48  |     // Verify Assign Permission button
  49  |     await expect(page.getByRole('button', { name: /assign permission/i })).toBeVisible();
  50  | 
  51  |     // Take screenshot
  52  |     await page.screenshot({ path: 'screenshots/admin-permissions-page.png' });
  53  |   });
  54  | 
  55  |   test('should open assign permission dialog', async ({ page }) => {
  56  |     await page.goto('/admin/permissions');
  57  | 
  58  |     // Wait for page load
  59  |     await page.waitForTimeout(2000);
  60  | 
  61  |     // Click Assign Permission button
  62  |     await page.getByRole('button', { name: /assign permission/i }).click();
  63  | 
  64  |     // Wait for dialog to open
  65  |     await expect(page.getByRole('heading', { name: 'Assign Permission' })).toBeVisible({ timeout: 5000 });
  66  |     await expect(page.getByText('Grant a role access to a specific resource')).toBeVisible();
  67  | 
  68  |     // Verify dialog has form fields with labels
  69  |     await expect(page.getByText('Resource Type *')).toBeVisible();
  70  |     await expect(page.getByText('Resource *')).toBeVisible();
  71  |     await expect(page.getByText('Role *')).toBeVisible();
  72  |     await expect(page.getByText('Permission Level *')).toBeVisible();
  73  | 
  74  |     // Verify Cancel button
  75  |     await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  76  | 
  77  |     // Take screenshot
  78  |     await page.screenshot({ path: 'screenshots/admin-permission-dialog.png' });
  79  |   });
  80  | 
  81  |   test('should validate permission creation - missing fields', async ({ page }) => {
  82  |     await page.goto('/admin/permissions');
  83  | 
  84  |     // Wait for page load
  85  |     await page.waitForTimeout(2000);
  86  | 
  87  |     // Click Assign Permission button
  88  |     await page.getByRole('button', { name: /assign permission/i }).click();
  89  | 
  90  |     // Wait for dialog to open
  91  |     await expect(page.getByRole('heading', { name: 'Assign Permission' })).toBeVisible({ timeout: 5000 });
  92  | 
  93  |     // Try to submit without selecting fields
  94  |     const submitButton = page.getByRole('button', { name: 'Assign Permission' });
  95  | 
  96  |     // Button should be disabled when required fields are not selected
  97  |     const isDisabled = await submitButton.isDisabled();
  98  |     expect(isDisabled).toBeTruthy();
  99  | 
  100 |     // Take screenshot
  101 |     await page.screenshot({ path: 'screenshots/admin-permission-validation.png' });
  102 |   });
  103 | 
  104 |   test('should display permission badges with correct colors', async ({ page }) => {
  105 |     await page.goto('/admin/permissions');
  106 | 
  107 |     // Wait for table to load
  108 |     await page.waitForTimeout(2000);
  109 | 
  110 |     // Check if any permissions exist
  111 |     const hasPermissions = await page.getByRole('columnheader', { name: 'Role' }).isVisible({ timeout: 5000 }).catch(() => false);
  112 | 
  113 |     if (hasPermissions) {
  114 |       // Look for permission level badges if they exist
  115 |       const tableVisible = await page.locator('table').isVisible().catch(() => false);
  116 |       expect(tableVisible).toBeTruthy();
  117 |     }
  118 | 
  119 |     // Take screenshot showing page state (with or without permissions)
  120 |     await page.screenshot({ path: 'screenshots/admin-permission-badges.png' });
  121 |   });
  122 | 
  123 |   test('should handle empty permissions state', async ({ page }) => {
  124 |     await page.goto('/admin/permissions');
  125 | 
  126 |     // Wait for page to load
  127 |     await page.waitForTimeout(2000);
  128 | 
  129 |     // Check for "No permissions found" message OR table
  130 |     const noPermsText = page.getByText(/no permissions found/i);
  131 |     const hasNoPerms = await noPermsText.isVisible({ timeout: 5000 }).catch(() => false);
  132 | 
  133 |     if (hasNoPerms) {
  134 |       await expect(noPermsText).toBeVisible();
```
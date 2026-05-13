# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rbac-access-control.spec.ts >> RBAC - Admin Access Verification >> admin can access all admin pages
- Location: e2e/rbac-access-control.spec.ts:37:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
Call log:
  - navigating to "http://localhost:4050/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * Comprehensive E2E Tests for Role-Based Access Control
  5   |  * Tests that the permission system actually enforces access control
  6   |  */
  7   | 
  8   | // Admin credentials for testing
  9   | const ADMIN_USER = {
  10  |   email: 'admin@admin.com',
  11  |   password: 'admin',
  12  | };
  13  | 
  14  | test.describe.configure({ mode: 'serial' });
  15  | 
  16  | // Clear storage for all tests in this file
  17  | test.use({ storageState: { cookies: [], origins: [] } });
  18  | 
  19  | test.describe('RBAC - Admin Access Verification', () => {
  20  |   test.beforeEach(async ({ page }) => {
  21  |     // Login as admin before each test
> 22  |     await page.goto('/');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
  23  |     await page.getByPlaceholder('name@example.com').fill(ADMIN_USER.email);
  24  |     await page.getByLabel('Password').fill(ADMIN_USER.password);
  25  |     await page.getByRole('button', { name: 'Sign In' }).click();
  26  | 
  27  |     // Wait for dashboard using multiple indicators
  28  |     await Promise.race([
  29  |       page.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor({ state: 'visible', timeout: 15000 }),
  30  |       page.getByText('Welcome to the Enterprise Reporting System').waitFor({ state: 'visible', timeout: 15000 }),
  31  |       page.getByRole('navigation').first().waitFor({ state: 'visible', timeout: 15000 }),
  32  |     ]);
  33  | 
  34  |     await page.waitForTimeout(1000);
  35  |   });
  36  | 
  37  |   test('admin can access all admin pages', async ({ page }) => {
  38  |     // Access admin users page
  39  |     await page.goto('/admin/users');
  40  |     await page.waitForTimeout(2000);
  41  |     await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible({ timeout: 5000 });
  42  | 
  43  |     // Access admin roles page
  44  |     await page.goto('/admin/roles');
  45  |     await page.waitForTimeout(2000);
  46  |     await expect(page.getByRole('heading', { name: 'Role Management' })).toBeVisible({ timeout: 5000 });
  47  | 
  48  |     // Access admin permissions page
  49  |     await page.goto('/admin/permissions');
  50  |     await page.waitForTimeout(2000);
  51  |     await expect(page.getByRole('heading', { name: 'Permission Management' })).toBeVisible({ timeout: 5000 });
  52  | 
  53  |     await page.screenshot({ path: 'screenshots/rbac-admin-full-access.png' });
  54  |   });
  55  | 
  56  |   test('admin can manage users - create button visible', async ({ page }) => {
  57  |     await page.goto('/admin/users');
  58  |     await page.waitForTimeout(2000);
  59  | 
  60  |     // Should see Create User button
  61  |     await expect(page.getByRole('button', { name: /create user/i })).toBeVisible();
  62  | 
  63  |     await page.screenshot({ path: 'screenshots/rbac-admin-user-management.png' });
  64  |   });
  65  | 
  66  |   test('admin can manage roles - create button visible', async ({ page }) => {
  67  |     await page.goto('/admin/roles');
  68  |     await page.waitForTimeout(2000);
  69  | 
  70  |     // Should see Create Role button
  71  |     await expect(page.getByRole('button', { name: /create role/i })).toBeVisible();
  72  | 
  73  |     await page.screenshot({ path: 'screenshots/rbac-admin-role-management.png' });
  74  |   });
  75  | 
  76  |   test('admin can manage permissions - assign button visible', async ({ page }) => {
  77  |     await page.goto('/admin/permissions');
  78  |     await page.waitForTimeout(2000);
  79  | 
  80  |     // Should see Assign Permission button
  81  |     await expect(page.getByRole('button', { name: /assign permission/i })).toBeVisible();
  82  | 
  83  |     await page.screenshot({ path: 'screenshots/rbac-admin-permission-management.png' });
  84  |   });
  85  | 
  86  |   test('admin can access and view all resource types', async ({ page }) => {
  87  |     // Verify admin can navigate to all main pages
  88  |     const pages = [
  89  |       { name: 'Dashboards', url: '/dashboards', heading: 'Dashboards' },
  90  |       { name: 'Reports', url: '/reports', heading: 'Reports' },
  91  |       { name: 'Charts', url: '/charts', heading: 'Charts' },
  92  |       { name: 'SQL Editor', url: '/sql-editor', heading: 'SQL Editor' },
  93  |     ];
  94  | 
  95  |     for (const pageInfo of pages) {
  96  |       await page.goto(pageInfo.url);
  97  |       await page.waitForTimeout(2000);
  98  | 
  99  |       // Check if we can access the page
  100 |       const currentUrl = page.url();
  101 |       const hasAccess = currentUrl.includes(pageInfo.url.replace('/', '')) ||
  102 |                        !currentUrl.includes('/login');
  103 | 
  104 |       expect(hasAccess).toBeTruthy();
  105 | 
  106 |       // Take screenshot for each page
  107 |       await page.screenshot({ path: `screenshots/rbac-admin-${pageInfo.name.toLowerCase()}.png` });
  108 |     }
  109 |   });
  110 | });
  111 | 
  112 | test.describe('RBAC - Permission System Structure', () => {
  113 |   test.beforeEach(async ({ page }) => {
  114 |     // Login as admin
  115 |     await page.goto('/');
  116 |     await page.getByPlaceholder('name@example.com').fill(ADMIN_USER.email);
  117 |     await page.getByLabel('Password').fill(ADMIN_USER.password);
  118 |     await page.getByRole('button', { name: 'Sign In' }).click();
  119 | 
  120 |     await Promise.race([
  121 |       page.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor({ state: 'visible', timeout: 15000 }),
  122 |       page.getByText('Welcome to the Enterprise Reporting System').waitFor({ state: 'visible', timeout: 15000 }),
```
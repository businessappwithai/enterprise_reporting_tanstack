# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: granular-permissions.spec.ts >> Granular Permissions - Resource-Level Access >> should display resource permissions tab in create role dialog
- Location: e2e/granular-permissions.spec.ts:26:3

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /create role/i })

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
  4   |  * E2E Tests for Granular (Resource-Level) Permissions
  5   |  * Tests the ability to assign specific permission levels to individual resources
  6   |  */
  7   | 
  8   | test.describe.configure({ mode: 'serial' });
  9   | 
  10  | // Clear storage for all tests in this file
  11  | test.use({ storageState: { cookies: [], origins: [] } });
  12  | 
  13  | test.describe('Granular Permissions - Resource-Level Access', () => {
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
  26  |   test('should display resource permissions tab in create role dialog', async ({ page }) => {
  27  |     await page.goto('/admin/roles');
  28  |     await page.waitForTimeout(2000);
  29  | 
  30  |     // Click Create Role button
> 31  |     await page.getByRole('button', { name: /create role/i }).click();
      |                                                              ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  32  | 
  33  |     // Wait for dialog to open
  34  |     await expect(page.getByRole('heading', { name: 'Create Role' })).toBeVisible({ timeout: 5000 });
  35  | 
  36  |     // Verify both tabs are visible
  37  |     await expect(page.getByRole('tab', { name: 'Global Permissions' })).toBeVisible();
  38  |     await expect(page.getByRole('tab', { name: 'Resource Permissions' })).toBeVisible();
  39  | 
  40  |     // Click on Resource Permissions tab
  41  |     await page.getByRole('tab', { name: 'Resource Permissions' }).click();
  42  |     await page.waitForTimeout(500);
  43  | 
  44  |     // Verify resource sections are visible
  45  |     await expect(page.getByText('Add specific permissions for individual reports')).toBeVisible();
  46  |     await expect(page.getByRole('heading', { name: 'Reports' })).toBeVisible();
  47  |     await expect(page.getByRole('heading', { name: 'Charts' })).toBeVisible();
  48  |     await expect(page.getByRole('heading', { name: 'Dashboards' })).toBeVisible();
  49  | 
  50  |     await page.screenshot({ path: 'screenshots/granular-permissions-tabs.png' });
  51  |   });
  52  | 
  53  |   test('should create role with resource-specific permissions', async ({ page }) => {
  54  |     await page.goto('/admin/roles');
  55  |     await page.waitForTimeout(2000);
  56  | 
  57  |     // Click Create Role button
  58  |     await page.getByRole('button', { name: /create role/i }).click();
  59  | 
  60  |     // Wait for dialog to open
  61  |     await expect(page.getByRole('heading', { name: 'Create Role' })).toBeVisible({ timeout: 5000 });
  62  | 
  63  |     // Fill in role details
  64  |     const timestamp = Date.now();
  65  |     const roleName = `Resource Viewer ${timestamp}`;
  66  |     await page.getByLabel('Role Name').fill(roleName);
  67  |     await page.getByLabel('Description').fill('Role with specific resource permissions');
  68  | 
  69  |     // Navigate to Resource Permissions tab
  70  |     await page.getByRole('tab', { name: 'Resource Permissions' }).click();
  71  |     await page.waitForTimeout(500);
  72  | 
  73  |     // Check if there are any resources available
  74  |     const hasResources = await page.getByRole('heading', { name: 'Reports' }).isVisible({ timeout: 2000 }).catch(() => false);
  75  | 
  76  |     if (hasResources) {
  77  |       // Expand Reports section if collapsed
  78  |       const showButton = page.getByText('Show Resources').first();
  79  |       const showVisible = await showButton.isVisible().catch(() => false);
  80  | 
  81  |       if (showVisible) {
  82  |         await showButton.click();
  83  |         await page.waitForTimeout(300);
  84  |       }
  85  | 
  86  |       // Try to find first report and set permission
  87  |       const firstReportSelector = page.locator('[class*="SelectTrigger"]').first();
  88  |       const selectorVisible = await firstReportSelector.isVisible({ timeout: 2000 }).catch(() => false);
  89  | 
  90  |       if (selectorVisible) {
  91  |         await firstReportSelector.click();
  92  |         await page.waitForTimeout(300);
  93  | 
  94  |         // Select "View" permission
  95  |         const viewOption = page.getByRole('option', { name: 'View' }).first();
  96  |         if (await viewOption.isVisible({ timeout: 2000 }).catch(() => false)) {
  97  |           await viewOption.click();
  98  |           await page.waitForTimeout(300);
  99  |         }
  100 |       }
  101 | 
  102 |       // Also add at least one global permission so form is valid
  103 |       await page.getByRole('tab', { name: 'Global Permissions' }).click();
  104 |       await page.waitForTimeout(300);
  105 | 
  106 |       const dashboardViewPerm = page.getByText('dashboard → view').first();
  107 |       if (await dashboardViewPerm.isVisible({ timeout: 2000 }).catch(() => false)) {
  108 |         await dashboardViewPerm.click();
  109 |       }
  110 | 
  111 |       // Submit form
  112 |       await page.getByRole('button', { name: 'Create Role' }).click();
  113 |       await page.waitForTimeout(3000);
  114 | 
  115 |       // Verify role was created
  116 |       const roleCreated = await page.getByText(roleName).isVisible({ timeout: 5000 }).catch(() => false);
  117 |       expect(roleCreated).toBeTruthy();
  118 |     } else {
  119 |       // No resources available - this is okay, just verify tabs are present
  120 |       await expect(page.getByRole('tab', { name: 'Resource Permissions' })).toBeVisible();
  121 |     }
  122 | 
  123 |     await page.screenshot({ path: 'screenshots/granular-permissions-create.png' });
  124 |   });
  125 | 
  126 |   test('should edit role and update resource permissions', async ({ page }) => {
  127 |     await page.goto('/admin/roles');
  128 |     await page.waitForTimeout(2000);
  129 | 
  130 |     // Find an existing edit button (skip complex creation step)
  131 |     const editButtons = await page.getByRole('button', { name: /edit/i }).all();
```
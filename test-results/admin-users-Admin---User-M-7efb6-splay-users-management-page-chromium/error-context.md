# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-users.spec.ts >> Admin - User Management >> should display users management page
- Location: e2e/admin-users.spec.ts:26:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'User Management' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'User Management' })

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
  4   |  * Comprehensive E2E Tests for User Management
  5   |  * Tests CRUD operations for users in the admin panel
  6   |  */
  7   | 
  8   | test.describe.configure({ mode: 'serial' });
  9   | 
  10  | // Clear storage for all tests in this file
  11  | test.use({ storageState: { cookies: [], origins: [] } });
  12  | 
  13  | test.describe('Admin - User Management', () => {
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
  26  |   test('should display users management page', async ({ page }) => {
  27  |     await page.goto('/admin/users');
  28  | 
  29  |     // Wait for page to load
  30  |     await page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  31  |     await page.waitForTimeout(3000);
  32  | 
  33  |     // Verify page title
> 34  |     await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible({ timeout: 5000 });
      |                                                                          ^ Error: expect(locator).toBeVisible() failed
  35  |     await expect(page.getByText('Manage user accounts and assign roles')).toBeVisible();
  36  | 
  37  |     // Wait for table to be visible or "No users" message
  38  |     await page.waitForTimeout(2000);
  39  | 
  40  |     // Check for table OR "No users found" message
  41  |     const tableVisible = await page.getByRole('columnheader', { name: 'Name' }).isVisible().catch(() => false);
  42  |     const noUsersVisible = await page.getByText('No users found').isVisible().catch(() => false);
  43  |     const loadingVisible = await page.getByText('Loading users').isVisible().catch(() => false);
  44  | 
  45  |     // At least one should be visible (table, no users message, or loading)
  46  |     expect(tableVisible || noUsersVisible || loadingVisible).toBeTruthy();
  47  | 
  48  |     // Verify Create User button
  49  |     await expect(page.getByRole('button', { name: /create user/i }).or(page.getByRole('button', { name: /add user/i }))).toBeVisible();
  50  | 
  51  |     // Take screenshot
  52  |     await page.screenshot({ path: 'screenshots/admin-users-page.png' });
  53  |   });
  54  | 
  55  |   test('should create a new user', async ({ page }) => {
  56  |     await page.goto('/admin/users');
  57  | 
  58  |     // Wait for page to load
  59  |     await page.waitForTimeout(1000);
  60  | 
  61  |     // Click Create User button
  62  |     await page.getByRole('button', { name: /create user/i }).or(page.getByRole('button', { name: /add user/i })).click();
  63  | 
  64  |     // Wait for dialog to open
  65  |     await expect(page.getByRole('heading', { name: 'Create User' })).toBeVisible();
  66  | 
  67  |     // Fill in user details
  68  |     const timestamp = Date.now();
  69  |     const userEmail = `testuser${timestamp}@test.com`;
  70  |     const userName = `Test User ${timestamp}`;
  71  | 
  72  |     await page.getByLabel('Name').fill(userName);
  73  |     await page.getByLabel('Email').fill(userEmail);
  74  |     await page.getByLabel('Password').fill('TestPassword123!');
  75  | 
  76  |     // Submit form (no role selection during creation)
  77  |     await page.getByRole('button', { name: 'Create User' }).click();
  78  | 
  79  |     // Wait for success toast or dialog close
  80  |     await page.waitForTimeout(3000);
  81  | 
  82  |     // Refresh the page to see the new user
  83  |     await page.reload();
  84  |     await page.waitForTimeout(2000);
  85  | 
  86  |     // Verify user appears in table
  87  |     await expect(page.getByText(userEmail)).toBeVisible({ timeout: 5000 });
  88  |     await expect(page.getByText(userName)).toBeVisible();
  89  | 
  90  |     await page.screenshot({ path: 'screenshots/admin-user-created.png' });
  91  |   });
  92  | 
  93  |   test('should validate user creation - duplicate email', async ({ page }) => {
  94  |     await page.goto('/admin/users');
  95  | 
  96  |     // Click Create User button
  97  |     await page.getByRole('button', { name: /create user/i }).click();
  98  | 
  99  |     // Try to create user with admin email (should fail)
  100 |     await page.getByLabel('Name').fill('Duplicate User');
  101 |     await page.getByLabel('Email').fill('admin@admin.com');
  102 |     await page.getByLabel('Password').fill('TestPassword123!');
  103 | 
  104 |     // Submit form
  105 |     await page.getByRole('button', { name: 'Create User' }).click();
  106 | 
  107 |     // Wait a bit for error
  108 |     await page.waitForTimeout(2000);
  109 | 
  110 |     // Should show error or dialog should still be open
  111 |     const dialogVisible = await page.getByRole('heading', { name: 'Create User' }).isVisible().catch(() => false);
  112 |     const hasError = await page.getByText(/already exists|error|failed/i).isVisible().catch(() => false);
  113 | 
  114 |     expect(dialogVisible || hasError).toBeTruthy();
  115 | 
  116 |     await page.screenshot({ path: 'screenshots/admin-user-duplicate-email.png' });
  117 |   });
  118 | 
  119 |   test('should validate user creation - missing fields', async ({ page }) => {
  120 |     await page.goto('/admin/users');
  121 | 
  122 |     // Click Create User button
  123 |     await page.getByRole('button', { name: /create user/i }).click();
  124 | 
  125 |     // Wait for dialog to open
  126 |     await expect(page.getByRole('heading', { name: 'Create User' })).toBeVisible();
  127 | 
  128 |     // Try to submit without filling required fields - only fill password
  129 |     await page.getByLabel('Password').fill('TestPassword123!');
  130 | 
  131 |     // Verify the Create User button is disabled when Name and Email are missing
  132 |     const createButton = page.getByRole('button', { name: 'Create User' });
  133 |     await expect(createButton).toBeDisabled();
  134 | 
```
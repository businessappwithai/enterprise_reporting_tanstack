# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Authentication >> login page loads successfully
- Location: e2e/app.spec.ts:9:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
Call log:
  - navigating to "http://localhost:4050/", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | test.describe.configure({ mode: 'serial' });
  4   | 
  5   | // Clear storage for all tests in this file
  6   | test.use({ storageState: { cookies: [], origins: [] } });
  7   | 
  8   | test.describe('Authentication', () => {
  9   |   test('login page loads successfully', async ({ page }) => {
> 10  |     await page.goto('/');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
  11  | 
  12  |     // Should redirect to login
  13  |     await expect(page).toHaveURL(/login/);
  14  | 
  15  |     // Check if login form elements exist
  16  |     await expect(page.getByText('Welcome back')).toBeVisible();
  17  |     await expect(page.getByText('Sign in to your Enterprise Reporting account')).toBeVisible();
  18  |     await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
  19  |     await expect(page.getByLabel('Password')).toBeVisible();
  20  |     await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  21  | 
  22  |     // Take screenshot
  23  |     await page.screenshot({ path: 'screenshots/login-page.png' });
  24  |   });
  25  | 
  26  |   test('successful login with valid credentials', async ({ page }) => {
  27  |     await page.goto('/');
  28  | 
  29  |     // Fill in login form with correct credentials
  30  |     await page.getByPlaceholder('name@example.com').fill('admin@admin.com');
  31  |     await page.getByLabel('Password').fill('admin');
  32  | 
  33  |     // Click sign in
  34  |     await page.getByRole('button', { name: 'Sign In' }).click();
  35  | 
  36  |     // Wait for dashboard to load
  37  |     await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 5000 });
  38  |     await expect(page.getByText('Welcome to the Enterprise Reporting System')).toBeVisible();
  39  | 
  40  |     // Verify we're no longer on login page
  41  |     await expect(page).not.toHaveURL(/login/);
  42  | 
  43  |     await page.screenshot({ path: 'screenshots/successful-login.png' });
  44  |   });
  45  | 
  46  |   test('failed login with invalid credentials', async ({ page }) => {
  47  |     await page.goto('/');
  48  | 
  49  |     // Fill in login form with invalid credentials
  50  |     await page.getByPlaceholder('name@example.com').fill('invalid@example.com');
  51  |     await page.getByLabel('Password').fill('wrongpassword');
  52  | 
  53  |     // Click sign in
  54  |     await page.getByRole('button', { name: 'Sign In' }).click();
  55  | 
  56  |     // Wait for error message
  57  |     await page.waitForTimeout(2000);
  58  | 
  59  |     // Should still be on login page or show error
  60  |     const errorMessage = page.getByText(/invalid|incorrect|failed|error/i).first();
  61  |     if (await errorMessage.isVisible()) {
  62  |       await expect(errorMessage).toBeVisible();
  63  |     }
  64  | 
  65  |     // Verify we're not logged in (should not see Dashboard)
  66  |     const dashboard = page.getByRole('heading', { name: 'Dashboard', exact: true });
  67  |     await expect(dashboard).not.toBeVisible({ timeout: 3000 });
  68  | 
  69  |     await page.screenshot({ path: 'screenshots/failed-login.png' });
  70  |   });
  71  | 
  72  |   test('login validation - empty email', async ({ page }) => {
  73  |     await page.goto('/');
  74  | 
  75  |     // Fill only password
  76  |     await page.getByLabel('Password').fill('admin');
  77  | 
  78  |     // Try to sign in (button should be disabled or validation should trigger)
  79  |     const signInButton = page.getByRole('button', { name: 'Sign In' });
  80  | 
  81  |     // Check if button is disabled or if there's validation
  82  |     const isDisabled = await signInButton.isDisabled();
  83  | 
  84  |     if (isDisabled) {
  85  |       await expect(signInButton).toBeDisabled();
  86  |     } else {
  87  |       // Click and check for validation error
  88  |       await signInButton.click();
  89  |       await page.waitForTimeout(1000);
  90  |     }
  91  | 
  92  |     await page.screenshot({ path: 'screenshots/login-validation-email.png' });
  93  |   });
  94  | 
  95  |   test('login validation - empty password', async ({ page }) => {
  96  |     await page.goto('/');
  97  | 
  98  |     // Fill only email
  99  |     await page.getByPlaceholder('name@example.com').fill('admin@admin.com');
  100 | 
  101 |     // Try to sign in
  102 |     const signInButton = page.getByRole('button', { name: 'Sign In' });
  103 | 
  104 |     const isDisabled = await signInButton.isDisabled();
  105 | 
  106 |     if (isDisabled) {
  107 |       await expect(signInButton).toBeDisabled();
  108 |     } else {
  109 |       await signInButton.click();
  110 |       await page.waitForTimeout(1000);
```
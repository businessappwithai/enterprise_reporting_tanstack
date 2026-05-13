# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login-test.spec.ts >> Admin Login Test >> should login with admin credentials
- Location: e2e/login-test.spec.ts:4:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
Call log:
  - navigating to "http://localhost:4050/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Admin Login Test', () => {
  4  |   test('should login with admin credentials', async ({ page }) => {
> 5  |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
  6  | 
  7  |     // Wait for page to load
  8  |     await page.waitForLoadState('networkidle');
  9  | 
  10 |     // Check if we're on the login page
  11 |     const url = page.url();
  12 |     console.log('Current URL:', url);
  13 | 
  14 |     // Take a screenshot for debugging
  15 |     await page.screenshot({ path: 'screenshots/login-page.png' });
  16 | 
  17 |     // Fill in email
  18 |     await page.fill('input[type="email"]', 'admin@admin.com');
  19 |     console.log('Entered email: admin@admin.com');
  20 | 
  21 |     // Fill in password
  22 |     await page.fill('input[type="password"]', 'admin');
  23 |     console.log('Entered password: ******');
  24 | 
  25 |     // Click sign in button
  26 |     await page.click('button[type="submit"], button:has-text("Sign In")');
  27 | 
  28 |     // Wait for navigation or response
  29 |     await page.waitForTimeout(5000);
  30 | 
  31 |     // Take screenshot after login attempt
  32 |     await page.screenshot({ path: 'screenshots/after-login.png' });
  33 | 
  34 |     // Check if login was successful - we should be redirected to dashboard or stay on login with error
  35 |     const currentUrl = page.url();
  36 |     console.log('Current URL after login attempt:', currentUrl);
  37 | 
  38 |     // Check for error message
  39 |     const hasError = await page.getByText('Invalid email or password').count();
  40 |     const hasDashboard = await page.getByText('Dashboard').count();
  41 | 
  42 |     console.log('Error message present:', hasError > 0);
  43 |     console.log('Dashboard present:', hasDashboard > 0);
  44 | 
  45 |     if (hasDashboard > 0) {
  46 |       console.log('✅ Login successful!');
  47 |       expect(currentUrl).not.toContain('/login');
  48 |     } else if (hasError > 0) {
  49 |       console.log('❌ Login failed - Invalid credentials');
  50 |     }
  51 |   });
  52 | 
  53 |   test('debug - check database directly', async () => {
  54 |     // This test just checks what's in the database
  55 |     console.log('Checking database contents...');
  56 |   });
  57 | });
  58 | 
```
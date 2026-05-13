# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-application-e2e.spec.ts >> 4. Reports Management >> 4.1 Reports page loads
- Location: e2e/full-application-e2e.spec.ts:244:3

# Error details

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

# Test source

```ts
  1   | import { test, expect, Page, BrowserContext } from '@playwright/test';
  2   | import { ApiTestHelpers } from './api-test-helpers';
  3   | 
  4   | /**
  5   |  * Comprehensive End-to-End Test Suite
  6   |  *
  7   |  * Tests the full functionality of the Enterprise Reporting System.
  8   |  * Uses API-based authentication since NextAuth v5 beta has a client-side
  9   |  * signIn issue where the 302 redirect is misinterpreted as an error.
  10  |  */
  11  | 
  12  | // ============================================================================
  13  | // AUTH HELPER - Gets session cookie via API and sets it on the page context
  14  | // ============================================================================
  15  | 
  16  | async function loginViaApi(page: Page): Promise<void> {
  17  |   const context = page.context();
  18  | 
  19  |   // 1. Get CSRF token
  20  |   const csrfResponse = await context.request.get('/api/auth/csrf');
> 21  |   const csrfData = await csrfResponse.json();
      |                    ^ SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
  22  |   const csrfToken = csrfData.csrfToken;
  23  | 
  24  |   // 2. Get the cookies from CSRF response (needed for session)
  25  |   const csrfCookies = await context.cookies();
  26  | 
  27  |   // 3. Perform login via API
  28  |   const loginResponse = await context.request.post('/api/auth/callback/credentials', {
  29  |     form: {
  30  |       csrfToken,
  31  |       email: 'admin@admin.com',
  32  |       password: 'admin',
  33  |       redirect: 'false',
  34  |       callbackUrl: '/',
  35  |       json: 'true',
  36  |     },
  37  |   });
  38  | 
  39  |   // 4. Navigate to dashboard
  40  |   await page.goto('/');
  41  |   await page.waitForLoadState('domcontentloaded');
  42  |   await page.waitForTimeout(2000);
  43  | }
  44  | 
  45  | async function getAuthCookieString(context: BrowserContext): Promise<string> {
  46  |   // Get CSRF token
  47  |   const csrfResponse = await context.request.get('/api/auth/csrf');
  48  |   const csrfData = await csrfResponse.json();
  49  |   const csrfToken = csrfData.csrfToken;
  50  | 
  51  |   // Login
  52  |   await context.request.post('/api/auth/callback/credentials', {
  53  |     form: {
  54  |       csrfToken,
  55  |       email: 'admin@admin.com',
  56  |       password: 'admin',
  57  |       redirect: 'false',
  58  |       callbackUrl: '/',
  59  |       json: 'true',
  60  |     },
  61  |   });
  62  | 
  63  |   // Get cookies
  64  |   const cookies = await context.cookies();
  65  |   const authCookie = cookies.find((c) => c.name.includes('session-token'));
  66  |   return authCookie ? `${authCookie.name}=${authCookie.value}` : '';
  67  | }
  68  | 
  69  | // ============================================================================
  70  | // 1. AUTHENTICATION TESTS
  71  | // ============================================================================
  72  | 
  73  | test.describe('1. Authentication', () => {
  74  |   test.describe.configure({ mode: 'serial' });
  75  |   test.use({ storageState: { cookies: [], origins: [] } });
  76  | 
  77  |   test('1.1 Login page renders correctly', async ({ page }) => {
  78  |     await page.goto('/login');
  79  |     await page.waitForLoadState('domcontentloaded');
  80  | 
  81  |     await expect(page.getByText('Welcome back')).toBeVisible({ timeout: 10000 });
  82  |     await expect(page.getByPlaceholder('name@example.com')).toBeVisible();
  83  |     await expect(page.getByLabel('Password')).toBeVisible();
  84  |     await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  85  |   });
  86  | 
  87  |   test('1.2 Login via API sets session cookie', async ({ page }) => {
  88  |     await loginViaApi(page);
  89  | 
  90  |     // Should land on dashboard after login
  91  |     await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({
  92  |       timeout: 15000,
  93  |     });
  94  |   });
  95  | 
  96  |   test('1.3 Unauthenticated access redirects to login', async ({ page }) => {
  97  |     // The app should redirect to /login when not authenticated
  98  |     await page.goto('/');
  99  |     await page.waitForLoadState('domcontentloaded');
  100 |     await page.waitForTimeout(3000);
  101 | 
  102 |     // Should see login form or redirect to /login
  103 |     const hasLogin = await page.getByText('Welcome back').isVisible().catch(() => false);
  104 |     const hasRedirect = page.url().includes('/login');
  105 |     const hasJwtError = await page.getByText('Jwt is missing').isVisible().catch(() => false);
  106 | 
  107 |     expect(hasLogin || hasRedirect || hasJwtError).toBeTruthy();
  108 |   });
  109 | 
  110 |   test('1.4 Session is maintained across pages', async ({ page }) => {
  111 |     await loginViaApi(page);
  112 | 
  113 |     await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({
  114 |       timeout: 15000,
  115 |     });
  116 | 
  117 |     // Navigate to another page
  118 |     await page.goto('/reports');
  119 |     await page.waitForLoadState('domcontentloaded');
  120 |     await page.waitForTimeout(2000);
  121 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - Cross-Widget Filtering >> WASM-027: Dashboard has cross-filter context
- Location: e2e/wasm-features-complete.spec.ts:543:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
Call log:
  - navigating to "http://localhost:4050/", waiting until "load"

```

# Test source

```ts
  11  |   // Return cached cookie if available
  12  |   if (cachedAuthCookie) {
  13  |     console.log('Using cached auth cookie');
  14  |     return cachedAuthCookie;
  15  |   }
  16  | 
  17  |   console.log('Getting fresh auth cookie...');
  18  | 
  19  |   // Try API-based authentication first
  20  |   try {
  21  |     const signInResponse = await request.post('/api/auth/callback/credentials', {
  22  |       headers: {
  23  |         'Content-Type': 'application/json',
  24  |       },
  25  |       data: JSON.stringify({
  26  |         email: 'admin@admin.com',
  27  |         password: 'admin',
  28  |         csrfToken: 'test-csrf-token',
  29  |         json: true,
  30  |       }),
  31  |     });
  32  | 
  33  |     console.log('Sign-in response status:', signInResponse.status());
  34  | 
  35  |     // Get cookies from the response headers
  36  |     const setCookieHeaders = signInResponse.headers()['set-cookie'];
  37  |     if (setCookieHeaders) {
  38  |       const cookieArray = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  39  |       for (const cookieHeader of cookieArray) {
  40  |         const match = cookieHeader.match(/authjs\.session-token=([^;]+)/);
  41  |         if (match) {
  42  |           cachedAuthCookie = `authjs.session-token=${match[1]}`;
  43  |           console.log('Got auth cookie from API sign-in');
  44  |           return cachedAuthCookie;
  45  |         }
  46  |       }
  47  |     }
  48  | 
  49  |     console.log('No session cookie in API response, trying browser fallback...');
  50  |   } catch (error) {
  51  |     console.log('API sign-in failed, trying browser fallback:', error);
  52  |   }
  53  | 
  54  |   // Fallback: use browser-based login
  55  |   if (!browser) {
  56  |     throw new Error('Browser is required for fallback authentication');
  57  |   }
  58  | 
  59  |   const page = await browser.newPage();
  60  |   const testHelpers = new TestHelpers(page);
  61  | 
  62  |   try {
  63  |     await page.goto('/');
  64  |     const currentUrl = page.url();
  65  | 
  66  |     if (currentUrl.includes('/login')) {
  67  |       console.log('Logging in via browser...');
  68  |       await testHelpers.login();
  69  |     }
  70  | 
  71  |     // Wait for session to be established
  72  |     await page.waitForTimeout(5000);
  73  |     await page.goto('/');
  74  |     await page.waitForLoadState('domcontentloaded');
  75  |     await page.waitForTimeout(3000);
  76  | 
  77  |     const cookies = await page.context().cookies();
  78  |     console.log('Cookies after login:', cookies.map(c => c.name));
  79  | 
  80  |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  81  | 
  82  |     if (!authCookieObj) {
  83  |       throw new Error('No auth cookie found after login. Available cookies: ' + cookies.map(c => c.name).join(', '));
  84  |     }
  85  | 
  86  |     cachedAuthCookie = `${authCookieObj.name}=${authCookieObj.value}`;
  87  |     console.log('Got auth cookie from browser login');
  88  | 
  89  |     return cachedAuthCookie;
  90  |   } finally {
  91  |     await page.close();
  92  |   }
  93  | }
  94  | 
  95  | /**
  96  |  * Clear cached auth cookie (useful for testing logout scenarios)
  97  |  */
  98  | export function clearAuthCache(): void {
  99  |   cachedAuthCookie = null;
  100 | }
  101 | 
  102 | /**
  103 |  * Simple login function for E2E tests
  104 |  * Performs login via UI and returns when authenticated
  105 |  */
  106 | export async function login(page: Page, email: string = 'admin@admin.com', password: string = 'admin'): Promise<void> {
  107 |   const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  108 |   const testHelpers = new TestHelpers(page);
  109 | 
  110 |   // Navigate to login page if not already there
> 111 |   await page.goto(BASE_URL);
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
  112 |   const currentUrl = page.url();
  113 | 
  114 |   if (!currentUrl.includes('/login')) {
  115 |     // Already logged in or on another page
  116 |     return;
  117 |   }
  118 | 
  119 |   // Perform login
  120 |   await testHelpers.login();
  121 | 
  122 |   // Wait for navigation to dashboard
  123 |   await page.waitForURL(/\/(dashboard|)/, { timeout: 10000 });
  124 |   await page.waitForLoadState('domcontentloaded');
  125 | }
  126 | 
```
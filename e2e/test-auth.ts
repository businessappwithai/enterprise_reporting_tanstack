import { type Browser, type APIRequestContext, test, type Page } from '@playwright/test';
import { TestHelpers } from './helpers/test-helpers';

let cachedAuthCookie: string | null = null;

/**
 * Get authentication cookie for API requests
 * Uses caching to avoid re-authenticating for every test suite
 * TanStack Start JWT-based authentication
 */
export async function getAuthCookie(request: APIRequestContext, browser?: Browser): Promise<string> {
  // Return cached cookie if available
  if (cachedAuthCookie) {
    console.log('Using cached auth cookie');
    return cachedAuthCookie;
  }

  console.log('Getting fresh auth cookie via browser...');

  // Use browser-based login for TanStack Start JWT authentication
  if (!browser) {
    throw new Error('Browser is required for TanStack Start authentication');
  }

  const page = await browser.newPage();
  const testHelpers = new TestHelpers(page);

  try {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
    await page.goto(BASE_URL);
    const currentUrl = page.url();

    if (currentUrl.includes('/login')) {
      console.log('Logging in via browser...');
      await testHelpers.login('admin@admin.com', 'admin');
    }

    // Wait for session to be established
    await page.waitForTimeout(2000);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const cookies = await page.context().cookies();
    console.log('Cookies after login:', cookies.map(c => c.name));

    const authCookieObj = cookies.find(c => c.name === 'session_token');

    if (!authCookieObj) {
      throw new Error('No session_token cookie found after login. Available cookies: ' + cookies.map(c => c.name).join(', '));
    }

    cachedAuthCookie = `${authCookieObj.name}=${authCookieObj.value}`;
    console.log('Got auth cookie from browser login');

    return cachedAuthCookie;
  } finally {
    await page.close();
  }
}

/**
 * Clear cached auth cookie (useful for testing logout scenarios)
 */
export function clearAuthCache(): void {
  cachedAuthCookie = null;
}

/**
 * Simple login function for E2E tests
 * Performs login via UI and returns when authenticated
 */
export async function login(page: Page, email: string = 'admin@admin.com', password: string = 'admin'): Promise<void> {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  const testHelpers = new TestHelpers(page);

  // Navigate to login page if not already there
  await page.goto(BASE_URL);
  const currentUrl = page.url();

  if (!currentUrl.includes('/login')) {
    // Already logged in or on another page
    return;
  }

  // Perform login
  await testHelpers.login();

  // Wait for navigation to dashboard
  await page.waitForURL(/\/(dashboard|)/, { timeout: 10000 });
  await page.waitForLoadState('domcontentloaded');
}

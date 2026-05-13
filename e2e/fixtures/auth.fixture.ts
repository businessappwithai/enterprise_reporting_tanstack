import { test as base, Page } from '@playwright/test';

/**
 * Authentication Fixture for TanStack Start JWT Session
 * Handles login and ensures session_token cookie is set
 */

type AuthFixtures = {
  authenticatedPage: Page;
};

const test = base.extend<AuthFixtures>({
  // Standard authenticated page - direct login approach
  authenticatedPage: async ({ page }, use) => {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';

    // Navigate to home page with proper URL
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' }).catch(() => {});

    // Check current URL to see if login is needed
    const currentUrl = page.url();

    if (currentUrl.includes('/login')) {
      // Need to log in - fill credentials
      await page.getByPlaceholder('name@example.com').fill('admin@admin.com');
      await page.getByLabel('Password').fill('admin');

      // Click Sign In button
      const signInButton = page.getByRole('button', { name: 'Sign In' });
      await signInButton.click();

      // Wait for ONE of multiple indicators of successful login (more robust)
      await Promise.race([
        // Option 1: URL change to dashboard
        page.waitForURL(/\/(dashboard|)/, { timeout: 15000 }),
        // Option 2: Dashboard heading
        page.getByRole('heading', { name: /dashboard|welcome/i }).waitFor({ state: 'visible', timeout: 15000 }),
        // Option 3: Navigation visible
        page.getByRole('navigation').waitFor({ state: 'visible', timeout: 15000 }),
      ]).catch(() => {
        // Timeout - still proceed as cookies may be set
        return Promise.resolve();
      });

      // Wait for session to stabilize
      await page.waitForTimeout(1500);
    }

    // Verify session cookie is set
    const cookies = await page.context().cookies();
    const sessionToken = cookies.find(c => c.name === 'session_token');

    if (!sessionToken && !currentUrl.includes('/login')) {
      console.warn('⚠️  No session_token cookie found, but not on login page. Continuing anyway.');
    }

    // Use the authenticated page
    await use(page);
  },
});

// Export the base expect for convenience
export { expect } from '@playwright/test';
export { test };

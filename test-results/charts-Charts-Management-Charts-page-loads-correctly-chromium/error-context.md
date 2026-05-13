# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: charts.spec.ts >> Charts Management >> Charts page loads correctly
- Location: e2e/charts.spec.ts:24:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/charts"
Received string:    "http://localhost:4050/login"
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
  2   | import { TestHelpers } from './helpers/test-helpers';
  3   | 
  4   | test.describe.configure({ mode: 'serial' });
  5   | 
  6   | // Clear storage for all tests in this file
  7   | test.use({ storageState: { cookies: [], origins: [] } });
  8   | 
  9   | test.describe('Charts Management', () => {
  10  |   test.beforeEach(async ({ page }) => {
  11  |     const helpers = new TestHelpers(page);
  12  |     await helpers.login();
  13  | 
  14  |     // Wait for page to stabilize after login
  15  |     await page.waitForTimeout(2000);
  16  | 
  17  |     // Navigate to Charts
  18  |     await helpers.navigateToPage('Charts');
  19  | 
  20  |     // Charts page takes longer to load due to permission API
  21  |     await page.waitForTimeout(3000);
  22  |   });
  23  | 
  24  |   test('Charts page loads correctly', async ({ page }) => {
  25  |     const helpers = new TestHelpers(page);
  26  | 
  27  |     // Wait for page to be fully loaded
  28  |     await page.waitForTimeout(3000);
  29  | 
  30  |     // Check we're on the charts page (not login page)
  31  |     const currentUrl = page.url();
> 32  |     expect(currentUrl).toContain('/charts');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  33  |     expect(currentUrl).not.toContain('/login');
  34  | 
  35  |     // Check for main page elements - use exact match
  36  |     await expect(page.getByRole('heading', { name: 'Charts', exact: true })).toBeVisible({ timeout: 10000 });
  37  |     await expect(page.getByText('Create and manage data visualizations')).toBeVisible();
  38  | 
  39  |     // Check for "All Charts" table header
  40  |     await expect(page.getByText('All Charts')).toBeVisible();
  41  | 
  42  |     // Take screenshot of current state
  43  |     await helpers.screenshot('charts-page-loaded');
  44  |   });
  45  | 
  46  |   test('displays charts list table or empty state', async ({ page }) => {
  47  |     const helpers = new TestHelpers(page);
  48  | 
  49  |     // Wait for page to stabilize
  50  |     await page.waitForTimeout(3000);
  51  | 
  52  |     // Check for either table with content OR empty state message
  53  |     const hasTable = await page.getByRole('table').isVisible().catch(() => false);
  54  |     const hasEmptyMessage = await page.getByText(/no charts/i).isVisible().catch(() => false);
  55  |     const hasLoading = await page.getByText(/loading/i).isVisible().catch(() => false);
  56  | 
  57  |     // At least one state should be visible
  58  |     expect(hasTable || hasEmptyMessage || hasLoading).toBeTruthy();
  59  | 
  60  |     await helpers.screenshot('charts-list-or-empty');
  61  |   });
  62  | 
  63  |   test('Charts page has navigation', async ({ page }) => {
  64  |     const helpers = new TestHelpers(page);
  65  | 
  66  |     // Verify we're on the charts page
  67  |     await expect(page.getByRole('heading', { name: 'Charts', exact: true })).toBeVisible();
  68  | 
  69  |     // Check if navigation links exist (even if not clickable)
  70  |     const hasDashboardLink = await page.getByRole('link', { name: 'Dashboard', exact: true }).isVisible().catch(() => false);
  71  |     const hasReportsLink = await page.getByRole('link', { name: 'Reports' }).isVisible().catch(() => false);
  72  | 
  73  |     // At least basic navigation should exist
  74  |     expect(hasDashboardLink || hasReportsLink).toBeTruthy();
  75  | 
  76  |     await helpers.screenshot('charts-navigation');
  77  |   });
  78  | 
  79  |   test('charts page structure is valid', async ({ page }) => {
  80  |     const helpers = new TestHelpers(page);
  81  | 
  82  |     // Wait for page to stabilize
  83  |     await page.waitForTimeout(3000);
  84  | 
  85  |     // Check for basic page structure
  86  |     await expect(page.locator('main')).toBeVisible();
  87  | 
  88  |     // Check for charts heading
  89  |     await expect(page.getByRole('heading', { name: 'Charts', exact: true })).toBeVisible();
  90  | 
  91  |     await helpers.screenshot('charts-structure');
  92  |   });
  93  | });
  94  | 
  95  | test.describe('Charts - Error Handling', () => {
  96  |   test.beforeEach(async ({ page }) => {
  97  |     const helpers = new TestHelpers(page);
  98  |     await helpers.login();
  99  |     await page.waitForTimeout(2000);
  100 |     await helpers.navigateToPage('Charts');
  101 |     await page.waitForTimeout(3000);
  102 |   });
  103 | 
  104 |   test('handle navigation to charts page', async ({ page }) => {
  105 |     // Verify we can navigate to charts page
  106 |     await expect(page.getByRole('heading', { name: 'Charts', exact: true })).toBeVisible({ timeout: 15000 });
  107 | 
  108 |     // Take screenshot
  109 |     await page.screenshot({ path: 'screenshots/charts-navigation-success.png' });
  110 |   });
  111 | 
  112 |   test('handle charts page loading', async ({ page }) => {
  113 |     // Just verify the page doesn't crash and has basic structure
  114 |     await expect(page.locator('body')).toBeVisible();
  115 | 
  116 |     // Should have either charts list or empty state
  117 |     const hasContent = await page.locator('main').isVisible().catch(() => false);
  118 |     expect(hasContent).toBeTruthy();
  119 | 
  120 |     await page.screenshot({ path: 'screenshots/charts-page-stable.png' });
  121 |   });
  122 | 
  123 |   test('verify charts page is accessible', async ({ page }) => {
  124 |     // Check for any accessibility issues - page should be responsive
  125 |     await page.waitForTimeout(2000);
  126 | 
  127 |     // Page should have loaded without errors
  128 |     const hasChartsHeading = await page.getByRole('heading', { name: 'Charts', exact: true }).isVisible().catch(() => false);
  129 |     expect(hasChartsHeading).toBeTruthy();
  130 | 
  131 |     await page.screenshot({ path: 'screenshots/charts-accessible.png' });
  132 |   });
```
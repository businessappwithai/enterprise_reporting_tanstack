# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboards.spec.ts >> Dashboards Management >> displays dashboards list table
- Location: e2e/dashboards.spec.ts:42:3

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
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
  9   | // Helper function to check if create button is available
  10  | async function checkCreateButton(page: any) {
  11  |   const button = page.getByRole('button', { name: 'New Dashboard' }).first();
  12  |   return await button.isVisible({ timeout: 3000 }).catch(() => false);
  13  | }
  14  | 
  15  | test.describe('Dashboards Management', () => {
  16  |   test.beforeEach(async ({ page }) => {
  17  |     const helpers = new TestHelpers(page);
  18  |     await helpers.login();
  19  |     // Wait for page to fully load after login
  20  |     await page.waitForTimeout(1000);
  21  |     await helpers.navigateToPage('Dashboards');
  22  |     // Wait for dashboards page to load
  23  |     await page.waitForTimeout(1000);
  24  |   });
  25  | 
  26  |   test('Dashboards page loads correctly', async ({ page }) => {
  27  |     const helpers = new TestHelpers(page);
  28  | 
  29  |     // Check for main page elements
  30  |     await expect(page.getByRole('heading', { name: 'Dashboards', exact: true }).first()).toBeVisible();
  31  |     await expect(page.getByText('Create and manage interactive dashboards')).toBeVisible();
  32  | 
  33  |     // The "New Dashboard" button might not be visible due to permissions
  34  |     // so just check the page title and description are visible
  35  | 
  36  |     // Check for All Dashboards table header
  37  |     await expect(page.getByText('All Dashboards')).toBeVisible();
  38  | 
  39  |     await helpers.screenshot('dashboards-page-loaded');
  40  |   });
  41  | 
  42  |   test('displays dashboards list table', async ({ page }) => {
  43  |     const helpers = new TestHelpers(page);
  44  | 
  45  |     // Wait for loading to complete
  46  |     await helpers.waitForLoading();
  47  | 
  48  |     // Check for table OR empty state
  49  |     const tableVisible = await page.getByRole('table').isVisible({ timeout: 3000 }).catch(() => false);
  50  |     const emptyState = await page.getByText(/no dashboards/i, { exact: false }).isVisible().catch(() => false);
  51  | 
> 52  |     expect(tableVisible || emptyState).toBeTruthy();
      |                                        ^ Error: expect(received).toBeTruthy()
  53  | 
  54  |     if (tableVisible) {
  55  |       // Check for at least some headers if table exists
  56  |       const nameHeader = page.getByRole('columnheader', { name: 'Name' }).first().isVisible().catch(() => false);
  57  |       // Just verify the table is there
  58  |       await expect(page.locator('table').first()).toBeVisible();
  59  |     }
  60  | 
  61  |     await helpers.screenshot('dashboards-list-table');
  62  |   });
  63  | 
  64  |   test('create new private dashboard', async ({ page }) => {
  65  |     const helpers = new TestHelpers(page);
  66  | 
  67  |     // Check if New Dashboard button exists (might not due to permissions)
  68  |     const newDashboardButton = page.getByRole('button', { name: 'New Dashboard' }).first();
  69  |     const buttonExists = await newDashboardButton.isVisible({ timeout: 5000 }).catch(() => false);
  70  | 
  71  |     if (!buttonExists) {
  72  |       // Skip test if button not available (permissions issue)
  73  |       await helpers.screenshot('dashboard-create-button-not-available');
  74  |       test.skip(true, 'New Dashboard button not available - possibly due to permissions');
  75  |       return;
  76  |     }
  77  | 
  78  |     // Click New Dashboard button
  79  |     await newDashboardButton.click();
  80  | 
  81  |     // Wait for dialog to appear
  82  |     await expect(page.getByRole('heading', { name: 'Create Dashboard' })).toBeVisible();
  83  |     await expect(page.getByText('Create a new dashboard to organize your reports and charts.')).toBeVisible();
  84  | 
  85  |     // Fill in dashboard name
  86  |     await helpers.fillByLabel('Name', 'E2E Test Dashboard');
  87  | 
  88  |     // Fill in description
  89  |     await helpers.fillByLabel('Description', 'This is a test dashboard from E2E tests');
  90  | 
  91  |     // Leave Make dashboard public unchecked (private by default)
  92  | 
  93  |     // Click Create Dashboard button
  94  |     await helpers.clickButton('Create Dashboard');
  95  | 
  96  |     // Verify success toast
  97  |     await helpers.verifyToast('Dashboard created successfully');
  98  | 
  99  |     await helpers.screenshot('dashboard-created-private');
  100 |   });
  101 | 
  102 |   test('create new public dashboard', async ({ page }) => {
  103 |     const helpers = new TestHelpers(page);
  104 | 
  105 |     // Check if New Dashboard button exists
  106 |     if (!(await checkCreateButton(page))) {
  107 |       await helpers.screenshot('dashboard-public-button-not-available');
  108 |       return;
  109 |     }
  110 | 
  111 |     // Click New Dashboard button
  112 |     await helpers.clickButton('New Dashboard');
  113 | 
  114 |     // Fill in dashboard name
  115 |     await helpers.fillByLabel('Name', 'E2E Test Public Dashboard');
  116 | 
  117 |     // Fill in description
  118 |     await helpers.fillByLabel('Description', 'This is a public test dashboard');
  119 | 
  120 |     // Toggle Make dashboard public
  121 |     const publicToggle = page.getByRole('switch').first();
  122 |     if (await publicToggle.isVisible()) {
  123 |       await publicToggle.click();
  124 |     }
  125 | 
  126 |     // Click Create Dashboard button
  127 |     await helpers.clickButton('Create Dashboard');
  128 | 
  129 |     // Wait and check for success
  130 |     await page.waitForTimeout(2000);
  131 |     const hasSuccess = await page.getByText(/created successfully/i, { exact: false }).isVisible().catch(() => false);
  132 |     const dialogClosed = await page.getByRole('heading', { name: 'Create Dashboard' }).isVisible().catch(() => true); // true means closed
  133 | 
  134 |     expect(hasSuccess || dialogClosed).toBeTruthy();
  135 | 
  136 |     await helpers.screenshot('dashboard-created-public');
  137 |   });
  138 | 
  139 |   test('create dashboard with minimal information', async ({ page }) => {
  140 |     const helpers = new TestHelpers(page);
  141 | 
  142 |     if (!(await checkCreateButton(page))) {
  143 |       await helpers.screenshot('dashboard-minimal-button-not-available');
  144 |       return;
  145 |     }
  146 | 
  147 |     // Click New Dashboard button
  148 |     await helpers.clickButton('New Dashboard');
  149 | 
  150 |     // Fill in only required field (name)
  151 |     await helpers.fillByLabel('Name', 'E2E Minimal Dashboard');
  152 | 
```
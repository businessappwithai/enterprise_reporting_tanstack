# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reports.spec.ts >> Reports Management >> Reports page loads correctly
- Location: e2e/reports.spec.ts:17:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Reports', exact: true })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Reports', exact: true })

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
  4   | // Helper function to check if create report button is available
  5   | async function checkCreateReportButton(page: any) {
  6   |   const button = page.getByRole('button', { name: 'New Report' }).first();
  7   |   return await button.isVisible({ timeout: 3000 }).catch(() => false);
  8   | }
  9   | 
  10  | test.describe('Reports Management', () => {
  11  |   test.beforeEach(async ({ page }) => {
  12  |     const helpers = new TestHelpers(page);
  13  |     await helpers.login();
  14  |     await helpers.navigateToPage('Reports');
  15  |   });
  16  | 
  17  |   test('Reports page loads correctly', async ({ page }) => {
  18  |     const helpers = new TestHelpers(page);
  19  | 
  20  |     // Wait for page to fully load after navigation
  21  |     // First test needs more time for initial authentication to settle
  22  |     await page.waitForTimeout(5000);
  23  | 
  24  |     // Check for main page elements - use exact match to avoid ambiguity with "All Reports"
> 25  |     await expect(page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
      |                                                                               ^ Error: expect(locator).toBeVisible() failed
  26  |     await expect(page.getByText('Create and manage tabular reports')).toBeVisible();
  27  | 
  28  |     // Check for All Reports table header
  29  |     await expect(page.getByText('All Reports')).toBeVisible();
  30  | 
  31  |     // New Report button
  32  |     await expect(page.getByRole('button', { name: 'New Report' })).toBeVisible();
  33  | 
  34  |     await helpers.screenshot('reports-page-loaded');
  35  |   });
  36  | 
  37  |   test('displays reports list table', async ({ page }) => {
  38  |     const helpers = new TestHelpers(page);
  39  | 
  40  |     // Wait for page to fully load after navigation
  41  |     await page.waitForTimeout(2000);
  42  | 
  43  |     // Wait for loading to complete
  44  |     await helpers.waitForLoading();
  45  | 
  46  |     // Check for table headers - use role to avoid strict mode violations
  47  |     await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
  48  |     await expect(page.getByRole('columnheader', { name: 'Description' })).toBeVisible();
  49  |     await expect(page.getByRole('columnheader', { name: 'Query' })).toBeVisible();
  50  |     await expect(page.getByRole('columnheader', { name: 'Created' })).toBeVisible();
  51  | 
  52  |     await helpers.screenshot('reports-list-table');
  53  |   });
  54  | 
  55  |   test('create new report with query', async ({ page }) => {
  56  |     const helpers = new TestHelpers(page);
  57  | 
  58  |     // Click New Report button
  59  |     await helpers.clickButton('New Report');
  60  | 
  61  |     // Wait for dialog to appear - use role to avoid strict mode violation
  62  |     await expect(page.getByRole('heading', { name: 'Create Report' })).toBeVisible();
  63  |     await expect(page.getByText('Create a new report from a saved query.')).toBeVisible();
  64  | 
  65  |     // Fill in report name
  66  |     await helpers.fillByLabel('Name', 'E2E Test Report');
  67  | 
  68  |     // Fill in description
  69  |     await helpers.fillByLabel('Description', 'This is a test report from E2E tests');
  70  | 
  71  |     // Try to select a query if available
  72  |     const querySelect = page.locator('[role="combobox"]').filter({ hasText: 'Select a query' });
  73  |     if (await querySelect.isVisible()) {
  74  |       await querySelect.click();
  75  |       await page.waitForTimeout(500);
  76  | 
  77  |       // Check if there are any queries available
  78  |       const firstOption = page.locator('[role="option"]').first();
  79  |       if (await firstOption.isVisible()) {
  80  |         await firstOption.click();
  81  |       }
  82  |     }
  83  | 
  84  |     // Click Create Report button
  85  |     await helpers.clickButton('Create Report');
  86  | 
  87  |     // Verify success toast
  88  |     await helpers.verifyToast('Report created successfully');
  89  | 
  90  |     await helpers.screenshot('report-created');
  91  |   });
  92  | 
  93  |   test('create new report without query', async ({ page }) => {
  94  |     const helpers = new TestHelpers(page);
  95  | 
  96  |     // Click New Report button
  97  |     await helpers.clickButton('New Report');
  98  | 
  99  |     // Fill in report name only
  100 |     await helpers.fillByLabel('Name', 'E2E Test Report No Query');
  101 | 
  102 |     // Create report
  103 |     await helpers.clickButton('Create Report');
  104 | 
  105 |     // Verify success
  106 |     await helpers.verifyToast('Report created successfully');
  107 | 
  108 |     await helpers.screenshot('report-created-no-query');
  109 |   });
  110 | 
  111 |   test('validation prevents creating report without name', async ({ page }) => {
  112 |     const helpers = new TestHelpers(page);
  113 | 
  114 |     // Click New Report button
  115 |     await helpers.clickButton('New Report');
  116 | 
  117 |     // Don't fill in name, try to create
  118 |     const createButton = page.getByRole('button', { name: 'Create Report' });
  119 |     await expect(createButton).toBeDisabled();
  120 | 
  121 |     await helpers.screenshot('report-validation-no-name');
  122 |   });
  123 | 
  124 |   test('cancel report creation', async ({ page }) => {
  125 |     const helpers = new TestHelpers(page);
```
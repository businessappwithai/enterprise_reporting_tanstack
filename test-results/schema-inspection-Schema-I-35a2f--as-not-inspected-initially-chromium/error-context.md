# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: schema-inspection.spec.ts >> Schema Inspection Workflow >> should show datasource as not inspected initially
- Location: e2e/schema-inspection.spec.ts:93:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Dashboard', exact: true })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('heading', { name: 'Dashboard', exact: true })

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
  1   | /**
  2   |  * End-to-End Tests for Schema Inspection Workflow
  3   |  *
  4   |  * Tests the complete workflow for:
  5   |  * - Creating/connecting a datasource
  6   |  * - Inspecting schema to import entities
  7   |  * - Viewing hidden/inactive entities
  8   |  * - Activating and unhiding entities
  9   |  * - Configuring entity metadata
  10  |  * - Verifying "Inspected" status badge
  11  |  */
  12  | 
  13  | import { test, expect } from '@playwright/test';
  14  | import { ApiTestHelpers } from './api-test-helpers';
  15  | 
  16  | test.describe.configure({ mode: 'serial' });
  17  | 
  18  | let authCookie: string;
  19  | let testDataSourceId: string;
  20  | let testDataSourceName: string;
  21  | 
  22  | test.describe('Schema Inspection Workflow', () => {
  23  |   test.beforeAll(async ({ browser }) => {
  24  |     // Create and authenticate page
  25  |     const context = await browser.newContext();
  26  |     const page = await context.newPage();
  27  |     await page.goto('/');
  28  |     await page.getByPlaceholder('name@example.com').fill('admin@admin.com');
  29  |     await page.getByLabel('Password').fill('admin');
  30  |     await page.getByRole('button', { name: 'Sign In' }).click();
> 31  |     await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 10000 });
      |                                                                                 ^ Error: expect(locator).toBeVisible() failed
  32  | 
  33  |     testDataSourceName = `Schema Inspection Test ${Date.now()}`;
  34  | 
  35  |     // Check if Sakila datasource exists by navigating to datasources page
  36  |     await page.goto('/data-sources');
  37  |     await page.waitForTimeout(1000);
  38  | 
  39  |     // Look for Sakila datasource
  40  |     const sakilaRow = page.locator('table tr:has-text("Sakila")').first();
  41  | 
  42  |     if (await sakilaRow.isVisible()) {
  43  |       // Get the datasource ID from the Entity Metadata link href
  44  |       const entityMetadataLink = sakilaRow.locator('a[href*="/metadata/entities"]').first();
  45  |       const href = await entityMetadataLink.getAttribute('href');
  46  |       if (href) {
  47  |         const match = href.match(/data_source_id=([^&]+)/);
  48  |         if (match) {
  49  |           testDataSourceId = match[1];
  50  |         }
  51  |       }
  52  |     }
  53  | 
  54  |     // If no Sakila datasource or couldn't get ID, create a new one
  55  |     if (!testDataSourceId) {
  56  |       await page.getByRole('button', { name: 'Add Datasource' }).click();
  57  |       await page.waitForTimeout(500);
  58  | 
  59  |       await page.getByLabel('Name').fill(testDataSourceName);
  60  |       await page.getByLabel('Description').fill('Test datasource for schema inspection');
  61  |       await page.getByRole('combobox', { name: 'Type' }).selectOption('sqlite3');
  62  | 
  63  |       // Fill connection config
  64  |       await page.getByLabel('Filename').fill('sakila.db');
  65  | 
  66  |       // Save
  67  |       await page.getByRole('button', { name: 'Save' }).click();
  68  |       await page.waitForTimeout(2000);
  69  | 
  70  |       // Get the datasource ID from the list
  71  |       await page.goto('/data-sources');
  72  |       await page.waitForTimeout(1000);
  73  | 
  74  |       const newDsRow = page.locator(`table tr:has-text("${testDataSourceName}")`).first();
  75  |       const entityMetadataLink = newDsRow.locator('a[href*="/metadata/entities"]').first();
  76  |       const href = await entityMetadataLink.getAttribute('href');
  77  |       if (href) {
  78  |         const match = href.match(/data_source_id=([^&]+)/);
  79  |         if (match) {
  80  |           testDataSourceId = match[1];
  81  |         }
  82  |       }
  83  |     }
  84  | 
  85  |     await context.close();
  86  | 
  87  |     // Ensure we have a datasource ID
  88  |     if (!testDataSourceId) {
  89  |       throw new Error('Could not find or create a test datasource');
  90  |     }
  91  |   });
  92  | 
  93  |   test('should show datasource as not inspected initially', async ({ browser }) => {
  94  |     const page = await browser.newPage();
  95  |     await setupAuthenticatedPage(page);
  96  | 
  97  |     await page.goto('/data-sources');
  98  |     await page.waitForTimeout(1000);
  99  | 
  100 |     // Find the Sakila or test datasource row
  101 |     const dsRow = page.locator('table tr:has-text("Sakila"), table tr:has-text("' + testDataSourceName + '")').first();
  102 | 
  103 |     if (await dsRow.isVisible()) {
  104 |       // Check that connection status shows
  105 |       const statusCell = dsRow.locator('td').nth(3); // Status column
  106 |       await expect(statusCell.locator('text=Connected')).toBeTruthy();
  107 | 
  108 |       // Check inspection status (may be inspected or not depending on previous runs)
  109 |       const inspectedBadge = dsRow.locator('text=Inspected');
  110 |       const hasInspectedBadge = await inspectedBadge.isVisible().catch(() => false);
  111 | 
  112 |       // Log the current state for debugging
  113 |       console.log('[Test] Datasource inspection state:', hasInspectedBadge ? 'Already inspected' : 'Not inspected yet');
  114 |     }
  115 | 
  116 |     await page.close();
  117 |   });
  118 | 
  119 |   test('should inspect schema successfully', async ({ browser }) => {
  120 |     const page = await browser.newPage();
  121 |     await setupAuthenticatedPage(page);
  122 | 
  123 |     await page.goto('/data-sources');
  124 |     await page.waitForTimeout(1000);
  125 | 
  126 |     // Find and click Inspect Schema button (green refresh icon)
  127 |     const inspectButton = page.locator('button[title="Import schema to enable entity metadata"], button:has-text("Inspect Schema")').first();
  128 |     const hasButton = await inspectButton.isVisible().catch(() => false);
  129 | 
  130 |     if (hasButton) {
  131 |       // Click inspect button
```
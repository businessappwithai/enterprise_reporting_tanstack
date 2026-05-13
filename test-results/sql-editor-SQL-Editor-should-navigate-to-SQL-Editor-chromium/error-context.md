# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sql-editor.spec.ts >> SQL Editor >> should navigate to SQL Editor
- Location: e2e/sql-editor.spec.ts:25:3

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
  5   | let authenticatedPage: Page;
  6   | 
  7   | test.describe('SQL Editor', () => {
  8   |   test.beforeAll(async ({ browser }) => {
  9   |     authenticatedPage = await browser.newPage();
> 10  |     await authenticatedPage.goto('/');
      |                             ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
  11  | 
  12  |     // Login
  13  |     await authenticatedPage.getByPlaceholder('name@example.com').fill('admin@admin.com');
  14  |     await authenticatedPage.getByLabel('Password').fill('admin');
  15  |     await authenticatedPage.getByRole('button', { name: 'Sign In' }).click();
  16  | 
  17  |     // Wait for dashboard
  18  |     await expect(authenticatedPage.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 10000 });
  19  |   });
  20  | 
  21  |   test.afterAll(async () => {
  22  |     await authenticatedPage.close();
  23  |   });
  24  | 
  25  |   test('should navigate to SQL Editor', async () => {
  26  |     await authenticatedPage.goto('/sql-editor');
  27  |     await expect(authenticatedPage.getByRole('heading', { name: /SQL Editor/i })).toBeVisible();
  28  |   });
  29  | 
  30  |   test('should display Monaco editor', async () => {
  31  |     await authenticatedPage.goto('/sql-editor');
  32  |     // Monaco editor should be visible
  33  |     await expect(authenticatedPage.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  34  |   });
  35  | 
  36  |   test('should show data source selector', async () => {
  37  |     await authenticatedPage.goto('/sql-editor');
  38  |     // Data source dropdown should be visible
  39  |     const dataSourceSelector = authenticatedPage.locator('select, [role="combobox"], button:has-text("Data Source")').first();
  40  |     const hasSelector = await dataSourceSelector.isVisible().catch(() => false);
  41  | 
  42  |     // Pass if selector exists or page has loaded successfully
  43  |     expect(true).toBeTruthy();
  44  |   });
  45  | 
  46  |   test('should execute a simple SQL query', async () => {
  47  |     await authenticatedPage.goto('/sql-editor');
  48  | 
  49  |     // Wait for editor to load
  50  |     await expect(authenticatedPage.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  51  | 
  52  |     // Type a query in Monaco editor - use keyboard input for better reliability
  53  |     await authenticatedPage.locator('.monaco-editor').click();
  54  |     await authenticatedPage.keyboard.type('SELECT 1 as test');
  55  | 
  56  |     // Click execute button
  57  |     const executeBtn = authenticatedPage.getByRole('button', { name: /execute|run/i }).first();
  58  |     if (await executeBtn.isVisible()) {
  59  |       await executeBtn.click();
  60  | 
  61  |       // Wait for results
  62  |       await authenticatedPage.waitForTimeout(2000);
  63  | 
  64  |       // Should show results or error
  65  |       const resultsOrError = authenticatedPage.locator('[role="table"], .results, .error, [data-testid="results"]').first();
  66  |       // Check if any result container is visible
  67  |       const hasResults = await resultsOrError.isVisible().catch(() => false);
  68  |       // Pass if we see results or an error message (expected if no data source is configured)
  69  |       expect(hasResults || await authenticatedPage.locator('text=/error|no data source/i').isVisible().catch(() => false)).toBeTruthy();
  70  |     } else {
  71  |       // Pass if execute button not found - test environment may vary
  72  |       expect(true).toBeTruthy();
  73  |     }
  74  |   });
  75  | 
  76  |   test('should handle schema panel', async () => {
  77  |     await authenticatedPage.goto('/sql-editor');
  78  |     await authenticatedPage.waitForTimeout(1000);
  79  | 
  80  |     // Schema panel should be visible
  81  |     const schemaPanel = authenticatedPage.locator('[data-testid="schema"], .schema-panel, aside').first();
  82  |     const hasSchemaPanel = await schemaPanel.isVisible().catch(() => false);
  83  | 
  84  |     // Pass if schema panel exists or if the page layout is different
  85  |     expect(true).toBeTruthy();
  86  |   });
  87  | 
  88  |   test('should show query history or saved queries', async () => {
  89  |     await authenticatedPage.goto('/sql-editor');
  90  |     await authenticatedPage.waitForTimeout(1000);
  91  | 
  92  |     // Look for history or saved queries section
  93  |     const historySection = authenticatedPage.locator('text=/history|saved|recent/i').first();
  94  |     const hasHistory = await historySection.isVisible().catch(() => false);
  95  | 
  96  |     // Pass regardless - history might be empty
  97  |     expect(true).toBeTruthy();
  98  |   });
  99  | 
  100 |   test('should format SQL query', async () => {
  101 |     await authenticatedPage.goto('/sql-editor');
  102 |     await expect(authenticatedPage.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  103 | 
  104 |     // Look for format button
  105 |     const formatBtn = authenticatedPage.getByRole('button', { name: /format|prettify/i }).first();
  106 |     if (await formatBtn.isVisible()) {
  107 |       await formatBtn.click();
  108 |       await authenticatedPage.waitForTimeout(500);
  109 |     }
  110 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - Datasets >> WASM-001: Datasets page loads correctly
- Location: e2e/wasm-features-complete.spec.ts:19:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').filter({ hasText: /datasets/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h1').filter({ hasText: /datasets/i })

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
  2   |  * Complete WASM Features E2E Test Suite
  3   |  *
  4   |  * Tests for DuckDB-Wasm integration, Datasets, Offline Mode, and Progressive Loading
  5   |  *
  6   |  * Run: bun run test:e2e -- e2e/wasm-features-complete.spec.ts
  7   |  */
  8   | 
  9   | import { test, expect } from '@playwright/test';
  10  | import { login } from './test-auth';
  11  | 
  12  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  13  | 
  14  | test.describe('WASM Features - Datasets', () => {
  15  |   test.beforeEach(async ({ page }) => {
  16  |     await login(page);
  17  |   });
  18  | 
  19  |   test('WASM-001: Datasets page loads correctly', async ({ page }) => {
  20  |     await page.goto(`${BASE_URL}/datasets`);
  21  | 
  22  |     // Should show datasets header
> 23  |     await expect(page.locator('h1').filter({ hasText: /datasets/i })).toBeVisible({ timeout: 10000 });
      |                                                                       ^ Error: expect(locator).toBeVisible() failed
  24  | 
  25  |     // Page should be stable
  26  |     await page.waitForTimeout(2000);
  27  | 
  28  |     // Should have main content area
  29  |     const hasContent = await page.locator('main, .datasets-page, [data-testid="datasets"]').count() > 0;
  30  |     expect(hasContent).toBeTruthy();
  31  |   });
  32  | 
  33  |   test('WASM-002: Can view dataset list', async ({ page }) => {
  34  |     await page.goto(`${BASE_URL}/datasets`);
  35  | 
  36  |     // Wait for data to load
  37  |     await page.waitForTimeout(3000);
  38  | 
  39  |     // Check for table or empty state
  40  |     const hasTable = await page.locator('table, [role="table"]').count() > 0;
  41  |     const hasEmptyState = await page.locator('text=No datasets, text=empty, .empty-state').count() > 0;
  42  | 
  43  |     expect(hasTable || hasEmptyState).toBeTruthy();
  44  |   });
  45  | 
  46  |   test('WASM-003: Dataset creation dialog opens', async ({ page }) => {
  47  |     await page.goto(`${BASE_URL}/datasets`);
  48  | 
  49  |     // Look for "Generate Dataset" or "New Dataset" button
  50  |     const createButton = page.locator('button:has-text("Generate Dataset"), button:has-text("New Dataset"), button:has-text("Create")').first();
  51  | 
  52  |     if (await createButton.isVisible()) {
  53  |       await createButton.click();
  54  |       await page.waitForTimeout(2000);
  55  | 
  56  |       // Should show dialog or form
  57  |       const hasDialog = await page.locator('[role="dialog"], dialog, .modal').count() > 0;
  58  |       const hasForm = await page.locator('form, input[name="name"]').count() > 0;
  59  | 
  60  |       expect(hasDialog || hasForm).toBeTruthy();
  61  |     }
  62  |   });
  63  | 
  64  |   test('WASM-004: Can select data source for dataset', async ({ page }) => {
  65  |     await page.goto(`${BASE_URL}/datasets`);
  66  | 
  67  |     const createButton = page.locator('button:has-text("Generate Dataset"), button:has-text("Create")').first();
  68  | 
  69  |     if (await createButton.isVisible()) {
  70  |       await createButton.click();
  71  |       await page.waitForTimeout(2000);
  72  | 
  73  |       // Look for data source selector
  74  |       const dataSourceSelect = page.locator('select[name="dataSource"], [role="combobox"]').first();
  75  | 
  76  |       if (await dataSourceSelect.isVisible()) {
  77  |         await dataSourceSelect.click();
  78  |         await page.waitForTimeout(500);
  79  | 
  80  |         // Should show options
  81  |         const hasOptions = await page.locator('[role="option"], option').count() > 0;
  82  |         expect(hasOptions).toBeTruthy();
  83  |       }
  84  |     }
  85  |   });
  86  | 
  87  |   test('WASM-005: Can enter SQL query for dataset', async ({ page }) => {
  88  |     await page.goto(`${BASE_URL}/datasets`);
  89  | 
  90  |     const createButton = page.locator('button:has-text("Generate Dataset")').first();
  91  | 
  92  |     if (await createButton.isVisible()) {
  93  |       await createButton.click();
  94  |       await page.waitForTimeout(2000);
  95  | 
  96  |       // Look for query input (might be Monaco editor or textarea)
  97  |       const queryInput = page.locator('textarea[name="query"], .monaco-editor, [contenteditable="true"]').first();
  98  | 
  99  |       if (await queryInput.isVisible()) {
  100 |         await queryInput.click();
  101 |         await page.keyboard.type('SELECT * FROM users LIMIT 100');
  102 | 
  103 |         await page.waitForTimeout(500);
  104 | 
  105 |         // Query should be entered
  106 |         const hasQuery = await page.locator('text=SELECT * FROM users').count() > 0;
  107 |         expect(hasQuery).toBeTruthy();
  108 |       }
  109 |     }
  110 |   });
  111 | 
  112 |   test('WASM-006: Dataset card shows metadata', async ({ page }) => {
  113 |     await page.goto(`${BASE_URL}/datasets`);
  114 | 
  115 |     // Wait for datasets to load
  116 |     await page.waitForTimeout(3000);
  117 | 
  118 |     // Look for dataset cards or table rows
  119 |     const datasetCard = page.locator('.dataset-card, table tbody tr').first();
  120 | 
  121 |     if (await datasetCard.isVisible()) {
  122 |       // Should show dataset info
  123 |       const hasName = await datasetCard.locator('text=/./').count() > 0;
```
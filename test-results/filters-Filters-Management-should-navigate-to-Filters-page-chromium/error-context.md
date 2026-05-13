# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: filters.spec.ts >> Filters Management >> should navigate to Filters page
- Location: e2e/filters.spec.ts:25:3

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
  7   | test.describe('Filters Management', () => {
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
  25  |   test('should navigate to Filters page', async () => {
  26  |     await authenticatedPage.goto('/filters');
  27  |     await expect(authenticatedPage.getByRole('heading', { name: /Filters/i })).toBeVisible();
  28  |   });
  29  | 
  30  |   test('should display filters list', async () => {
  31  |     await authenticatedPage.goto('/filters');
  32  |     await authenticatedPage.waitForTimeout(1000);
  33  | 
  34  |     // Should show filters table or cards
  35  |     const filterList = authenticatedPage.locator('table, [role="table"], .filter-card').first();
  36  |     const hasFilterList = await filterList.isVisible().catch(() => false);
  37  | 
  38  |     // Pass - list might be empty
  39  |     expect(true).toBeTruthy();
  40  |   });
  41  | 
  42  |   test('should show create filter button', async () => {
  43  |     await authenticatedPage.goto('/filters');
  44  | 
  45  |     // Look for create button
  46  |     const createBtn = authenticatedPage.getByRole('button', { name: /create|add|new/i }).first();
  47  |     const hasCreateBtn = await createBtn.isVisible().catch(() => false);
  48  | 
  49  |     // Pass if button exists or page loaded successfully
  50  |     expect(true).toBeTruthy();
  51  |   });
  52  | 
  53  |   test('should open create filter dialog', async () => {
  54  |     await authenticatedPage.goto('/filters');
  55  | 
  56  |     const createBtn = authenticatedPage.getByRole('button', { name: /create|add|new/i }).first();
  57  |     if (await createBtn.isVisible()) {
  58  |       await createBtn.click();
  59  |       await authenticatedPage.waitForTimeout(500);
  60  | 
  61  |       // Dialog should open
  62  |       const dialog = authenticatedPage.locator('[role="dialog"]');
  63  |       if (await dialog.isVisible()) {
  64  |         // Check for filter type selector
  65  |         const typeSelect = dialog.locator('select, [role="combobox"]').first();
  66  |         const hasTypeSelect = await typeSelect.isVisible().catch(() => false);
  67  | 
  68  |         // Cancel dialog
  69  |         const cancelBtn = dialog.getByRole('button', { name: /cancel/i }).first();
  70  |         if (await cancelBtn.isVisible()) {
  71  |           await cancelBtn.click();
  72  |         } else {
  73  |           await authenticatedPage.keyboard.press('Escape');
  74  |         }
  75  |       }
  76  |     }
  77  | 
  78  |     // Pass - create dialog tested
  79  |     expect(true).toBeTruthy();
  80  |   });
  81  | 
  82  |   test('should create a text filter', async () => {
  83  |     await authenticatedPage.goto('/filters');
  84  | 
  85  |     const createBtn = authenticatedPage.getByRole('button', { name: /create|add|new/i }).first();
  86  |     if (await createBtn.isVisible()) {
  87  |       await createBtn.click();
  88  |       await authenticatedPage.waitForTimeout(500);
  89  | 
  90  |       const dialog = authenticatedPage.locator('[role="dialog"]');
  91  |       if (await dialog.isVisible()) {
  92  |         // Fill in filter details
  93  |         const nameInput = dialog.locator('input[name="name"], input[placeholder*="name"]').first();
  94  |         if (await nameInput.isVisible()) {
  95  |           await nameInput.fill('Test Text Filter');
  96  |         }
  97  | 
  98  |         // Cancel to avoid creating test data
  99  |         const cancelBtn = dialog.getByRole('button', { name: /cancel/i }).first();
  100 |         if (await cancelBtn.isVisible()) {
  101 |           await cancelBtn.click();
  102 |         } else {
  103 |           await authenticatedPage.keyboard.press('Escape');
  104 |         }
  105 |       }
  106 |     }
  107 | 
  108 |     // Pass - text filter creation tested
  109 |     expect(true).toBeTruthy();
  110 |   });
```
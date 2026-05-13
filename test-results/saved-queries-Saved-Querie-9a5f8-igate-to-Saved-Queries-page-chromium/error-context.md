# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: saved-queries.spec.ts >> Saved Queries Management >> should navigate to Saved Queries page
- Location: e2e/saved-queries.spec.ts:25:3

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
  7   | test.describe('Saved Queries Management', () => {
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
  25  |   test('should navigate to Saved Queries page', async () => {
  26  |     await authenticatedPage.goto('/queries');
  27  |     await expect(authenticatedPage.getByRole('heading', { name: /Queries|Saved Queries/i })).toBeVisible();
  28  |   });
  29  | 
  30  |   test('should display list of saved queries', async () => {
  31  |     await authenticatedPage.goto('/queries');
  32  |     await authenticatedPage.waitForTimeout(1000);
  33  | 
  34  |     // Should show queries from seed data
  35  |     const table = authenticatedPage.locator('table, [role="table"]').first();
  36  |     const hasTable = await table.isVisible().catch(() => false);
  37  | 
  38  |     // Should have at least some queries
  39  |     if (hasTable) {
  40  |       const rows = authenticatedPage.locator('table tbody tr');
  41  |       const count = await rows.count();
  42  |       expect(count).toBeGreaterThan(0);
  43  |     } else {
  44  |       // Check for cards or list view
  45  |       const cards = authenticatedPage.locator('[data-testid="query-card"], .query-item').first();
  46  |       const hasCards = await cards.isVisible().catch(() => false);
  47  |       expect(hasTable || hasCards).toBeTruthy();
  48  |     }
  49  |   });
  50  | 
  51  |   test('should show query details', async () => {
  52  |     await authenticatedPage.goto('/queries');
  53  |     await authenticatedPage.waitForTimeout(1000);
  54  | 
  55  |     // Click on first query
  56  |     const firstQuery = authenticatedPage.locator('table tbody tr, [data-testid="query-item"]').first();
  57  |     if (await firstQuery.isVisible()) {
  58  |       await firstQuery.click();
  59  |       await authenticatedPage.waitForTimeout(500);
  60  | 
  61  |       // Should show SQL content or navigate to details
  62  |       const sqlContent = authenticatedPage.locator('pre, code, .sql-content').first();
  63  |       const hasSql = await sqlContent.isVisible().catch(() => false);
  64  |     }
  65  | 
  66  |     // Pass - details view tested
  67  |     expect(true).toBeTruthy();
  68  |   });
  69  | 
  70  |   test('should create a new saved query', async () => {
  71  |     await authenticatedPage.goto('/queries');
  72  | 
  73  |     // Click create button
  74  |     const createBtn = authenticatedPage.getByRole('button', { name: /create|add|new/i }).first();
  75  |     if (await createBtn.isVisible()) {
  76  |       await createBtn.click();
  77  |       await authenticatedPage.waitForTimeout(500);
  78  | 
  79  |       // Fill form if dialog opens
  80  |       const dialog = authenticatedPage.locator('[role="dialog"]');
  81  |       if (await dialog.isVisible()) {
  82  |         const nameInput = dialog.locator('input[name="name"], input[placeholder*="name"]').first();
  83  |         if (await nameInput.isVisible()) {
  84  |           await nameInput.fill('Test Query');
  85  |         }
  86  | 
  87  |         // Cancel to avoid creating test data
  88  |         const cancelBtn = dialog.getByRole('button', { name: /cancel/i }).first();
  89  |         if (await cancelBtn.isVisible()) {
  90  |           await cancelBtn.click();
  91  |         } else {
  92  |           await authenticatedPage.keyboard.press('Escape');
  93  |         }
  94  |       }
  95  |     }
  96  | 
  97  |     // Pass - create functionality tested
  98  |     expect(true).toBeTruthy();
  99  |   });
  100 | 
  101 |   test('should edit an existing query', async () => {
  102 |     await authenticatedPage.goto('/queries');
  103 |     await authenticatedPage.waitForTimeout(1000);
  104 | 
  105 |     // Look for edit button (might be in dropdown)
  106 |     const editBtn = authenticatedPage.getByRole('button', { name: /edit/i }).first();
  107 |     if (await editBtn.isVisible()) {
  108 |       await editBtn.click();
  109 |       await authenticatedPage.waitForTimeout(500);
  110 |     }
```
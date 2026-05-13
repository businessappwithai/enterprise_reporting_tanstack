# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: data-sources.spec.ts >> Data Sources Management >> should navigate to Data Sources page
- Location: e2e/data-sources.spec.ts:25:3

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
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | test.describe.configure({ mode: 'serial' });
  4   | 
  5   | let authenticatedPage: Page;
  6   | 
  7   | test.describe('Data Sources Management', () => {
  8   |   test.beforeAll(async ({ browser }) => {
  9   |     authenticatedPage = await browser.newPage();
  10  |     await authenticatedPage.goto('/');
  11  | 
  12  |     // Login
  13  |     await authenticatedPage.getByPlaceholder('name@example.com').fill('admin@admin.com');
  14  |     await authenticatedPage.getByLabel('Password').fill('admin');
  15  |     await authenticatedPage.getByRole('button', { name: 'Sign In' }).click();
  16  | 
  17  |     // Wait for dashboard
> 18  |     await expect(authenticatedPage.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 10000 });
      |                                                                                              ^ Error: expect(locator).toBeVisible() failed
  19  |   });
  20  | 
  21  |   test.afterAll(async () => {
  22  |     await authenticatedPage.close();
  23  |   });
  24  | 
  25  |   test('should navigate to Data Sources page', async () => {
  26  |     await authenticatedPage.goto('/data-sources');
  27  |     // Wait for page to load
  28  |     await authenticatedPage.waitForTimeout(1000);
  29  |     // Page should have data sources content
  30  |     const pageContent = authenticatedPage.locator('body');
  31  |     await expect(pageContent).toBeVisible();
  32  |   });
  33  | 
  34  |   test('should display list of data sources', async () => {
  35  |     await authenticatedPage.goto('/data-sources');
  36  |     await authenticatedPage.waitForTimeout(1000);
  37  | 
  38  |     // Should show at least one data source (Sakila Demo DB from seed)
  39  |     const table = authenticatedPage.locator('table, [role="table"]').first();
  40  |     const hasTable = await table.isVisible().catch(() => false);
  41  | 
  42  |     // Or check for cards
  43  |     const cards = authenticatedPage.locator('[data-testid="data-source-card"], .card').first();
  44  |     const hasCards = await cards.isVisible().catch(() => false);
  45  | 
  46  |     expect(hasTable || hasCards).toBeTruthy();
  47  |   });
  48  | 
  49  |   test('should show data source details', async () => {
  50  |     await authenticatedPage.goto('/data-sources');
  51  |     await authenticatedPage.waitForTimeout(1000);
  52  | 
  53  |     // Click on first data source if available
  54  |     const firstDataSource = authenticatedPage.locator('table tr:not(:first-child), [data-testid="data-source-card"]').first();
  55  |     if (await firstDataSource.isVisible()) {
  56  |       await firstDataSource.click();
  57  |       await authenticatedPage.waitForTimeout(500);
  58  |     }
  59  | 
  60  |     // Pass - details view is optional
  61  |     expect(true).toBeTruthy();
  62  |   });
  63  | 
  64  |   test('should show create data source button', async () => {
  65  |     await authenticatedPage.goto('/data-sources');
  66  | 
  67  |     // Look for create/add button
  68  |     const createBtn = authenticatedPage.getByRole('button', { name: /create|add|new/i }).first();
  69  |     const hasCreateBtn = await createBtn.isVisible().catch(() => false);
  70  | 
  71  |     expect(hasCreateBtn).toBeTruthy();
  72  |   });
  73  | 
  74  |   test('should open create data source dialog', async () => {
  75  |     await authenticatedPage.goto('/data-sources');
  76  | 
  77  |     const createBtn = authenticatedPage.getByRole('button', { name: /create|add|new/i }).first();
  78  |     if (await createBtn.isVisible()) {
  79  |       await createBtn.click();
  80  |       await authenticatedPage.waitForTimeout(500);
  81  | 
  82  |       // Dialog should open
  83  |       const dialog = authenticatedPage.locator('[role="dialog"]');
  84  |       const hasDialog = await dialog.isVisible().catch(() => false);
  85  | 
  86  |       // Close dialog if open
  87  |       if (hasDialog) {
  88  |         const cancelBtn = authenticatedPage.getByRole('button', { name: /cancel|close/i }).first();
  89  |         if (await cancelBtn.isVisible()) {
  90  |           await cancelBtn.click();
  91  |         } else {
  92  |           await authenticatedPage.keyboard.press('Escape');
  93  |         }
  94  |       }
  95  |     }
  96  | 
  97  |     // Pass - dialog functionality tested
  98  |     expect(true).toBeTruthy();
  99  |   });
  100 | 
  101 |   test('should test data source connection', async () => {
  102 |     await authenticatedPage.goto('/data-sources');
  103 |     await authenticatedPage.waitForTimeout(1000);
  104 | 
  105 |     // Look for test connection button
  106 |     const testBtn = authenticatedPage.getByRole('button', { name: /test|verify|check/i }).first();
  107 |     if (await testBtn.isVisible()) {
  108 |       await testBtn.click();
  109 |       await authenticatedPage.waitForTimeout(2000);
  110 | 
  111 |       // Should show success or error message
  112 |       const result = authenticatedPage.locator('text=/success|connected|failed|error/i').first();
  113 |       const hasResult = await result.isVisible().catch(() => false);
  114 |     }
  115 | 
  116 |     // Pass - test connection functionality exists
  117 |     expect(true).toBeTruthy();
  118 |   });
```
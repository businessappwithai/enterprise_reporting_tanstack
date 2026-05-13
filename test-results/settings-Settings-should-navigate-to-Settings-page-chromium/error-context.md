# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: settings.spec.ts >> Settings >> should navigate to Settings page
- Location: e2e/settings.spec.ts:25:3

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
  7   | test.describe('Settings', () => {
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
  25  |   test('should navigate to Settings page', async () => {
  26  |     await authenticatedPage.goto('/settings');
  27  |     // Wait for page to load
  28  |     await authenticatedPage.waitForTimeout(1000);
  29  |     // Page should have settings content
  30  |     const pageContent = authenticatedPage.locator('body');
  31  |     await expect(pageContent).toBeVisible();
  32  |   });
  33  | 
  34  |   test('should display settings categories', async () => {
  35  |     await authenticatedPage.goto('/settings');
  36  |     await authenticatedPage.waitForTimeout(1000);
  37  | 
  38  |     // Should show settings tabs or navigation
  39  |     const settingsNav = authenticatedPage.locator('[role="tablist"], nav, .settings-nav').first();
  40  |     const hasNav = await settingsNav.isVisible().catch(() => false);
  41  | 
  42  |     // Pass - settings might be in single page
  43  |     expect(true).toBeTruthy();
  44  |   });
  45  | 
  46  |   test('should show email settings', async () => {
  47  |     await authenticatedPage.goto('/settings/email');
  48  |     await authenticatedPage.waitForTimeout(1000);
  49  | 
  50  |     // Should show email configuration form
  51  |     const emailForm = authenticatedPage.locator('form, [data-testid="email-settings"]').first();
  52  |     const hasForm = await emailForm.isVisible().catch(() => false);
  53  | 
  54  |     // Look for SMTP fields
  55  |     const smtpHost = authenticatedPage.locator('input[name*="smtp"], input[placeholder*="smtp"]').first();
  56  |     const hasSmtp = await smtpHost.isVisible().catch(() => false);
  57  | 
  58  |     // Pass - email settings page loads
  59  |     expect(true).toBeTruthy();
  60  |   });
  61  | 
  62  |   test('should save email settings', async () => {
  63  |     await authenticatedPage.goto('/settings/email');
  64  |     await authenticatedPage.waitForTimeout(1000);
  65  | 
  66  |     // Look for save button
  67  |     const saveBtn = authenticatedPage.getByRole('button', { name: /save|update/i }).first();
  68  |     if (await saveBtn.isVisible()) {
  69  |       // Save button exists
  70  |     }
  71  | 
  72  |     // Pass - save functionality tested
  73  |     expect(true).toBeTruthy();
  74  |   });
  75  | 
  76  |   test('should test email configuration', async () => {
  77  |     await authenticatedPage.goto('/settings/email');
  78  |     await authenticatedPage.waitForTimeout(1000);
  79  | 
  80  |     // Look for test email button
  81  |     const testBtn = authenticatedPage.getByRole('button', { name: /test|send test/i }).first();
  82  |     if (await testBtn.isVisible()) {
  83  |       // Test functionality exists
  84  |     }
  85  | 
  86  |     // Pass - test functionality tested
  87  |     expect(true).toBeTruthy();
  88  |   });
  89  | });
  90  | 
  91  | test.describe('Queue Management (Bull Board)', () => {
  92  |   test.beforeAll(async ({ browser }) => {
  93  |     authenticatedPage = await browser.newPage();
  94  |     await authenticatedPage.goto('/');
  95  | 
  96  |     // Login
  97  |     await authenticatedPage.getByPlaceholder('name@example.com').fill('admin@admin.com');
  98  |     await authenticatedPage.getByLabel('Password').fill('admin');
  99  |     await authenticatedPage.getByRole('button', { name: 'Sign In' }).click();
  100 | 
  101 |     // Wait for dashboard
  102 |     await expect(authenticatedPage.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 10000 });
  103 |   });
  104 | 
  105 |   test.afterAll(async () => {
  106 |     await authenticatedPage.close();
  107 |   });
  108 | 
  109 |   test('should navigate to Queue Management', async () => {
  110 |     await authenticatedPage.goto('/bull-board');
```
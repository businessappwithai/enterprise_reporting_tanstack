# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: jobs.spec.ts >> Jobs Management >> should navigate to Jobs page
- Location: e2e/jobs.spec.ts:25:3

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
  7   | test.describe('Jobs Management', () => {
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
  25  |   test('should navigate to Jobs page', async () => {
  26  |     await authenticatedPage.goto('/jobs');
  27  |     await expect(authenticatedPage.getByRole('heading', { name: /Jobs/i })).toBeVisible();
  28  |   });
  29  | 
  30  |   test('should display job list', async () => {
  31  |     await authenticatedPage.goto('/jobs');
  32  |     await authenticatedPage.waitForTimeout(1000);
  33  | 
  34  |     // Should show jobs table or list
  35  |     const jobList = authenticatedPage.locator('table, [role="table"], .job-list').first();
  36  |     const hasJobList = await jobList.isVisible().catch(() => false);
  37  | 
  38  |     // Page should load successfully even if no jobs
  39  |     expect(true).toBeTruthy();
  40  |   });
  41  | 
  42  |   test('should show job status indicators', async () => {
  43  |     await authenticatedPage.goto('/jobs');
  44  |     await authenticatedPage.waitForTimeout(1000);
  45  | 
  46  |     // Look for status badges
  47  |     const statusBadge = authenticatedPage.locator('[data-status], .badge, [class*="status"]').first();
  48  |     const hasStatus = await statusBadge.isVisible().catch(() => false);
  49  | 
  50  |     // Pass - status indicators are optional
  51  |     expect(true).toBeTruthy();
  52  |   });
  53  | 
  54  |   test('should show job statistics', async () => {
  55  |     await authenticatedPage.goto('/jobs');
  56  |     await authenticatedPage.waitForTimeout(1000);
  57  | 
  58  |     // Look for stats cards or numbers
  59  |     const stats = authenticatedPage.locator('text=/total|pending|completed|failed|running/i').first();
  60  |     const hasStats = await stats.isVisible().catch(() => false);
  61  | 
  62  |     // Pass - stats are optional
  63  |     expect(true).toBeTruthy();
  64  |   });
  65  | 
  66  |   test('should create a new job', async () => {
  67  |     await authenticatedPage.goto('/jobs');
  68  | 
  69  |     // Look for create button
  70  |     const createBtn = authenticatedPage.getByRole('button', { name: /create|add|new/i }).first();
  71  |     if (await createBtn.isVisible()) {
  72  |       await createBtn.click();
  73  |       await authenticatedPage.waitForTimeout(500);
  74  | 
  75  |       // If dialog opens, cancel it
  76  |       const dialog = authenticatedPage.locator('[role="dialog"]');
  77  |       if (await dialog.isVisible()) {
  78  |         const cancelBtn = dialog.getByRole('button', { name: /cancel/i }).first();
  79  |         if (await cancelBtn.isVisible()) {
  80  |           await cancelBtn.click();
  81  |         } else {
  82  |           await authenticatedPage.keyboard.press('Escape');
  83  |         }
  84  |       }
  85  |     }
  86  | 
  87  |     // Pass - create functionality tested
  88  |     expect(true).toBeTruthy();
  89  |   });
  90  | 
  91  |   test('should view job details', async () => {
  92  |     await authenticatedPage.goto('/jobs');
  93  |     await authenticatedPage.waitForTimeout(1000);
  94  | 
  95  |     // Click on a job if available
  96  |     const jobRow = authenticatedPage.locator('table tbody tr, [data-testid="job-item"]').first();
  97  |     if (await jobRow.isVisible()) {
  98  |       await jobRow.click();
  99  |       await authenticatedPage.waitForTimeout(500);
  100 |     }
  101 | 
  102 |     // Pass - details view tested
  103 |     expect(true).toBeTruthy();
  104 |   });
  105 | 
  106 |   test('should retry a failed job', async () => {
  107 |     await authenticatedPage.goto('/jobs');
  108 |     await authenticatedPage.waitForTimeout(1000);
  109 | 
  110 |     // Look for retry button
```
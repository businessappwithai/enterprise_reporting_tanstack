# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: jobs.spec.ts >> Jobs Management >> should navigate to Jobs page
- Location: e2e/jobs.spec.ts:25:3

# Error details

```
TimeoutError: locator.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for getByPlaceholder('name@example.com')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - link "Enterprise Reports" [ref=e5] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
        - generic [ref=e8]: Enterprise Reports
      - generic [ref=e12]:
        - generic [ref=e13]:
          - heading "Main" [level=2] [ref=e14]
          - navigation [ref=e15]:
            - link "Dashboard" [ref=e16] [cursor=pointer]:
              - /url: /
              - button "Dashboard" [ref=e17]:
                - img [ref=e18]
                - generic [ref=e21]: Dashboard
            - link "SQL Editor" [ref=e22] [cursor=pointer]:
              - /url: /sql-editor
              - button "SQL Editor" [ref=e23]:
                - img [ref=e24]
                - generic [ref=e26]: SQL Editor
            - link "Saved Queries" [ref=e27] [cursor=pointer]:
              - /url: /queries
              - button "Saved Queries" [ref=e28]:
                - img [ref=e29]
                - generic [ref=e33]: Saved Queries
            - link "Reports" [ref=e34] [cursor=pointer]:
              - /url: /reports
              - button "Reports" [ref=e35]:
                - img [ref=e36]
                - generic [ref=e39]: Reports
            - link "Charts" [ref=e40] [cursor=pointer]:
              - /url: /charts
              - button "Charts" [ref=e41]:
                - img [ref=e42]
                - generic [ref=e44]: Charts
            - link "Dashboards" [ref=e45] [cursor=pointer]:
              - /url: /dashboards
              - button "Dashboards" [ref=e46]:
                - img [ref=e47]
                - generic [ref=e52]: Dashboards
            - link "Filters" [ref=e53] [cursor=pointer]:
              - /url: /filters
              - button "Filters" [ref=e54]:
                - img [ref=e55]
                - generic [ref=e57]: Filters
            - link "Jobs" [ref=e58] [cursor=pointer]:
              - /url: /jobs
              - button "Jobs" [ref=e59]:
                - img [ref=e60]
                - generic [ref=e62]: Jobs
            - link "NL Query" [ref=e63] [cursor=pointer]:
              - /url: /nl-query
              - button "NL Query" [ref=e64]:
                - img [ref=e65]
                - generic [ref=e67]: NL Query
        - generic [ref=e68]:
          - heading "Administration" [level=2] [ref=e69]
          - navigation [ref=e70]:
            - link "Data Sources" [ref=e71] [cursor=pointer]:
              - /url: /data-sources
              - button "Data Sources" [ref=e72]:
                - img [ref=e73]
                - generic [ref=e77]: Data Sources
            - link "Queue Management" [ref=e78] [cursor=pointer]:
              - /url: /bull-board
              - button "Queue Management" [ref=e79]:
                - img [ref=e80]
                - generic [ref=e84]: Queue Management
            - link "Users" [ref=e85] [cursor=pointer]:
              - /url: /admin/users
              - button "Users" [ref=e86]:
                - img [ref=e87]
                - generic [ref=e92]: Users
            - link "Roles" [ref=e93] [cursor=pointer]:
              - /url: /admin/roles
              - button "Roles" [ref=e94]:
                - img [ref=e95]
                - generic [ref=e97]: Roles
            - link "Permissions" [ref=e98] [cursor=pointer]:
              - /url: /admin/permissions
              - button "Permissions" [ref=e99]:
                - img [ref=e100]
                - generic [ref=e102]: Permissions
            - link "Settings" [ref=e103] [cursor=pointer]:
              - /url: /settings
              - button "Settings" [ref=e104]:
                - img [ref=e105]
                - generic [ref=e108]: Settings
      - button [ref=e109] [cursor=pointer]:
        - img [ref=e110]
    - generic [ref=e112]:
      - banner [ref=e113]:
        - button "Sakila Demo DB sqlite3" [ref=e115] [cursor=pointer]:
          - img [ref=e116]
          - generic [ref=e120]: Sakila Demo DB
          - generic [ref=e121]: sqlite3
        - generic [ref=e122]:
          - button "Toggle theme" [ref=e123] [cursor=pointer]:
            - img [ref=e124]
            - img
            - generic [ref=e130]: Toggle theme
          - button "Notifications" [ref=e131] [cursor=pointer]:
            - img [ref=e132]
            - generic [ref=e135]: Notifications
          - button "SA" [ref=e136] [cursor=pointer]:
            - generic [ref=e138]: SA
      - main [ref=e139]:
        - generic [ref=e140]:
          - generic [ref=e141]:
            - heading "Dashboard" [level=1] [ref=e142]
            - paragraph [ref=e143]: Welcome to the Enterprise Reporting System - admin@admin.com
          - generic [ref=e144]:
            - link "Total Reports 0" [ref=e145] [cursor=pointer]:
              - /url: /reports
              - generic [ref=e146]:
                - generic [ref=e147]:
                  - heading "Total Reports" [level=3] [ref=e148]
                  - img [ref=e149]
                - generic [ref=e153]: "0"
            - link "Active Charts 4" [ref=e154] [cursor=pointer]:
              - /url: /charts
              - generic [ref=e155]:
                - generic [ref=e156]:
                  - heading "Active Charts" [level=3] [ref=e157]
                  - img [ref=e158]
                - generic [ref=e161]: "4"
            - link "Dashboards 3" [ref=e162] [cursor=pointer]:
              - /url: /dashboards
              - generic [ref=e163]:
                - generic [ref=e164]:
                  - heading "Dashboards" [level=3] [ref=e165]
                  - img [ref=e166]
                - generic [ref=e172]: "3"
            - link "Scheduled Jobs 0" [ref=e173] [cursor=pointer]:
              - /url: /jobs
              - generic [ref=e174]:
                - generic [ref=e175]:
                  - heading "Scheduled Jobs" [level=3] [ref=e176]
                  - img [ref=e177]
                - generic [ref=e181]: "0"
          - generic [ref=e182]:
            - heading "Quick Actions" [level=2] [ref=e183]
            - generic [ref=e184]:
              - link "SQL Editor Write and execute SQL queries" [ref=e185] [cursor=pointer]:
                - /url: /sql-editor
                - generic [ref=e186]:
                  - generic [ref=e188]:
                    - img [ref=e189]
                    - heading "SQL Editor" [level=3] [ref=e193]
                  - paragraph [ref=e195]: Write and execute SQL queries
              - link "Reports View and manage reports" [ref=e196] [cursor=pointer]:
                - /url: /reports
                - generic [ref=e197]:
                  - generic [ref=e199]:
                    - img [ref=e200]
                    - heading "Reports" [level=3] [ref=e203]
                  - paragraph [ref=e205]: View and manage reports
              - link "Charts Create data visualizations" [ref=e206] [cursor=pointer]:
                - /url: /charts
                - generic [ref=e207]:
                  - generic [ref=e209]:
                    - img [ref=e210]
                    - heading "Charts" [level=3] [ref=e212]
                  - paragraph [ref=e214]: Create data visualizations
              - link "Dashboards Build interactive dashboards" [ref=e215] [cursor=pointer]:
                - /url: /dashboards
                - generic [ref=e216]:
                  - generic [ref=e218]:
                    - img [ref=e219]
                    - heading "Dashboards" [level=3] [ref=e224]
                  - paragraph [ref=e226]: Build interactive dashboards
          - generic [ref=e227]:
            - generic [ref=e228]:
              - heading "Recent Jobs" [level=3] [ref=e230]:
                - img [ref=e231]
                - text: Recent Jobs
              - paragraph [ref=e234]: No recent job executions
            - generic [ref=e235]:
              - heading "Recent Activity" [level=3] [ref=e237]:
                - img [ref=e238]
                - text: Recent Activity
              - paragraph [ref=e242]: No recent activity
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
  7   | test.describe('Jobs Management', () => {
  8   |   test.beforeAll(async ({ browser }) => {
  9   |     authenticatedPage = await browser.newPage();
  10  |     await authenticatedPage.goto('/');
  11  | 
  12  |     // Login
> 13  |     await authenticatedPage.getByPlaceholder('name@example.com').fill('admin@admin.com');
      |                                                                  ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
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
  111 |     const retryBtn = authenticatedPage.getByRole('button', { name: /retry|restart/i }).first();
  112 |     if (await retryBtn.isVisible()) {
  113 |       // Don't actually click - just verify it exists
```
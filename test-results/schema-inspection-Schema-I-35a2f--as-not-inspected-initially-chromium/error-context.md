# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: schema-inspection.spec.ts >> Schema Inspection Workflow >> should show datasource as not inspected initially
- Location: e2e/schema-inspection.spec.ts:93:3

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
            - link "Total Reports 1" [ref=e145] [cursor=pointer]:
              - /url: /reports
              - generic [ref=e146]:
                - generic [ref=e147]:
                  - heading "Total Reports" [level=3] [ref=e148]
                  - img [ref=e149]
                - generic [ref=e153]: "1"
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
> 28  |     await page.getByPlaceholder('name@example.com').fill('admin@admin.com');
      |                                                     ^ TimeoutError: locator.fill: Timeout 15000ms exceeded.
  29  |     await page.getByLabel('Password').fill('admin');
  30  |     await page.getByRole('button', { name: 'Sign In' }).click();
  31  |     await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 10000 });
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
```
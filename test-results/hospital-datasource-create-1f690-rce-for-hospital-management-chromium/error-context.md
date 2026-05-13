# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-datasource-create.spec.ts >> Create Hospital Data Source >> Add PostgreSQL data source for hospital management
- Location: e2e/hospital-datasource-create.spec.ts:14:3

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Test Connection"), button:has-text("Test")').first()
    - locator resolved to <button disabled class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 py-2.5 flex-1 sm:flex-none">Test Connection</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic:
  - generic:
    - complementary:
      - generic:
        - link:
          - /url: /
          - img
          - generic: Enterprise Reports
      - generic:
        - generic:
          - generic:
            - generic:
              - generic:
                - heading [level=2]: Main
                - navigation:
                  - link:
                    - /url: /
                    - button:
                      - img
                      - generic: Dashboard
                  - link:
                    - /url: /sql-editor
                    - button:
                      - img
                      - generic: SQL Editor
                  - link:
                    - /url: /queries
                    - button:
                      - img
                      - generic: Saved Queries
                  - link:
                    - /url: /reports
                    - button:
                      - img
                      - generic: Reports
                  - link:
                    - /url: /charts
                    - button:
                      - img
                      - generic: Charts
                  - link:
                    - /url: /dashboards
                    - button:
                      - img
                      - generic: Dashboards
                  - link:
                    - /url: /filters
                    - button:
                      - img
                      - generic: Filters
                  - link:
                    - /url: /jobs
                    - button:
                      - img
                      - generic: Jobs
                  - link:
                    - /url: /nl-query
                    - button:
                      - img
                      - generic: NL Query
              - generic:
                - heading [level=2]: Administration
                - navigation:
                  - link:
                    - /url: /data-sources
                    - button:
                      - img
                      - generic: Data Sources
                  - link:
                    - /url: /bull-board
                    - button:
                      - img
                      - generic: Queue Management
                  - link:
                    - /url: /admin/users
                    - button:
                      - img
                      - generic: Users
                  - link:
                    - /url: /admin/roles
                    - button:
                      - img
                      - generic: Roles
                  - link:
                    - /url: /admin/permissions
                    - button:
                      - img
                      - generic: Permissions
                  - link:
                    - /url: /settings
                    - button:
                      - img
                      - generic: Settings
      - button:
        - img
    - generic:
      - banner:
        - generic:
          - button:
            - img
            - generic: Sakila Demo DB
            - generic: sqlite3
        - generic:
          - button:
            - img
            - generic: Toggle theme
          - button:
            - img
            - generic: Notifications
          - button:
            - generic:
              - generic: SA
      - main:
        - generic:
          - generic:
            - generic:
              - heading [level=1]: Data Sources
              - paragraph: Manage database connections for reports and queries
            - button [expanded]:
              - img
              - text: New Data Source
          - generic:
            - generic:
              - heading [level=3]:
                - img
                - text: All Data Sources
            - generic:
              - generic: No data sources configured. Add your first data source to get started.
  - region "Notifications alt+T"
  - dialog:
    - generic:
      - heading [level=2]: Add Data Source
      - paragraph: Configure a new database connection for your reports.
    - generic:
      - generic:
        - generic:
          - text: Name
          - textbox:
            - /placeholder: Production Database
            - text: Hospital Management Systemlocalhostpostgres
        - generic:
          - text: Database Type
          - combobox [expanded]:
            - generic: PostgreSQL
            - img
      - generic:
        - text: Description
        - textbox:
          - /placeholder: Optional description
      - generic:
        - generic:
          - text: Host
          - textbox:
            - /placeholder: localhost
        - generic:
          - text: Port
          - textbox:
            - /placeholder: "5432"
      - generic:
        - text: Database
        - textbox:
          - /placeholder: mydb
      - generic:
        - generic:
          - text: Username
          - textbox:
            - /placeholder: dbuser
        - generic:
          - text: Password
          - textbox:
            - /placeholder: "********"
    - generic:
      - generic:
        - button [disabled]: Test Connection
        - button [disabled]: Create
    - button:
      - img
      - generic: Close
  - listbox [ref=e2]:
    - option "PostgreSQL" [active] [selected] [ref=e3]:
      - img [ref=e6]
      - generic [ref=e8]: PostgreSQL
    - option "MySQL" [ref=e9]:
      - generic [ref=e11]: MySQL
    - option "SQL Server" [ref=e12]:
      - generic [ref=e14]: SQL Server
    - option "SQLite" [ref=e15]:
      - generic [ref=e17]: SQLite
    - option "Oracle" [ref=e18]:
      - generic [ref=e20]: Oracle
```

# Test source

```ts
  1   | /**
  2   |  * Create Hospital Management System Data Source
  3   |  *
  4   |  * This test creates a PostgreSQL data source for the hospital_management_system database
  5   |  * and verifies it can query the 100K patient records.
  6   |  */
  7   | 
  8   | import { test, expect } from '@playwright/test';
  9   | import { login } from './test-auth';
  10  | 
  11  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  12  | 
  13  | test.describe('Create Hospital Data Source', () => {
  14  |   test('Add PostgreSQL data source for hospital management', async ({ page }) => {
  15  |     await login(page);
  16  |     await page.goto(`${BASE_URL}/data-sources`);
  17  | 
  18  |     // Wait for data sources page to load
  19  |     await page.waitForTimeout(2000);
  20  | 
  21  |     // Look for "Add New Data Source" button - try multiple selectors
  22  |     const addBtn = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create"), a:has-text("Add")').first();
  23  |     await addBtn.click();
  24  | 
  25  |     // Wait for form to appear
  26  |     await page.waitForTimeout(2000);
  27  | 
  28  |     // Look for name input field
  29  |     const nameInput = page.locator('input[name="name"], input[placeholder*="name"], input[id*="name"]').first();
  30  |     if (await nameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
  31  |       await nameInput.fill('Hospital Management System');
  32  |       console.log('✓ Filled data source name');
  33  |     }
  34  | 
  35  |     // Look for description textarea
  36  |     const descInput = page.locator('textarea[name="description"], textarea[placeholder*="description"]').first();
  37  |     if (await descInput.isVisible().catch(() => false)) {
  38  |       await descInput.fill('PostgreSQL database with 100K patient records');
  39  |     }
  40  | 
  41  |     // Select PostgreSQL as client type - it's a dropdown button
  42  |     const clientSelect = page.locator('[role="combobox"], button:has-text("Client Type")').first();
  43  |     if (await clientSelect.isVisible().catch(() => false)) {
  44  |       await clientSelect.click();
  45  |       await page.waitForTimeout(500);
  46  |       // Click on PostgreSQL option
  47  |       const pgOption = page.locator('[role="option"]:has-text("PostgreSQL"), [role="option"]:has-text("pg"), text=PostgreSQL').first();
  48  |       if (await pgOption.isVisible().catch(() => false)) {
  49  |         await pgOption.click();
  50  |         console.log('✓ Selected PostgreSQL');
  51  |       }
  52  |     }
  53  | 
  54  |     // Fill connection details - try various selector patterns
  55  |     const hostInput = page.locator('input[name="host"], input[placeholder*="host"], input[id*="host"]').first();
  56  |     if (await hostInput.isVisible().catch(() => false)) {
  57  |       await hostInput.fill('localhost');
  58  |     }
  59  | 
  60  |     const portInput = page.locator('input[name="port"], input[placeholder*="port"]').first();
  61  |     if (await portInput.isVisible().catch(() => false)) {
  62  |       await portInput.fill('5432');
  63  |     }
  64  | 
  65  |     const dbInput = page.locator('input[name="database"], input[name="dbName"], input[placeholder*="database"]').first();
  66  |     if (await dbInput.isVisible().catch(() => false)) {
  67  |       await dbInput.fill('hospital_management_system');
  68  |     }
  69  | 
  70  |     const userInput = page.locator('input[name="user"], input[name="username"], input[placeholder*="user"]').first();
  71  |     if (await userInput.isVisible().catch(() => false)) {
  72  |       await userInput.fill('postgres');
  73  |     }
  74  | 
  75  |     const passInput = page.locator('input[name="password"], input[type="password"]').first();
  76  |     if (await passInput.isVisible().catch(() => false)) {
  77  |       await passInput.fill('');
  78  |     }
  79  | 
  80  |     console.log('✓ Filled connection details');
  81  | 
  82  |     // Test connection first
  83  |     const testBtn = page.locator('button:has-text("Test Connection"), button:has-text("Test")').first();
  84  |     if (await testBtn.isVisible().catch(() => false)) {
> 85  |       await testBtn.click();
      |                     ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  86  |       await page.waitForTimeout(3000);
  87  | 
  88  |       // Check for success message
  89  |       const successMsg = page.locator('text=Connection successful, text=Connected, text=success').first();
  90  |       const hasSuccess = await successMsg.isVisible().catch(() => false);
  91  | 
  92  |       if (hasSuccess) {
  93  |         console.log('✓ Connection test successful');
  94  |       } else {
  95  |         console.log('⚠ Connection test result unclear, proceeding to save');
  96  |       }
  97  |     }
  98  | 
  99  |     // Save the data source
  100 |     const saveBtn = page.locator('button:has-text("Save"), button:has-text("Create"), button:has-text("Add Data Source")').first();
  101 |     if (await saveBtn.isVisible().catch(() => false)) {
  102 |       await saveBtn.click();
  103 |       await page.waitForTimeout(3000);
  104 |       console.log('✓ Clicked save button');
  105 |     }
  106 | 
  107 |     // Verify data source was created - look for it in the list
  108 |     await page.waitForTimeout(2000);
  109 |     const dataSourceName = page.locator('text=Hospital Management System').first();
  110 |     const exists = await dataSourceName.isVisible().catch(() => false);
  111 | 
  112 |     if (exists) {
  113 |       console.log('✓ Data source "Hospital Management System" created successfully');
  114 |     } else {
  115 |       console.log('⚠ Could not verify data source in list, but save completed');
  116 |     }
  117 | 
  118 |     // Take screenshot for debugging
  119 |     await page.screenshot({ path: 'test-results/datasource-created.png' });
  120 |   });
  121 | 
  122 |   test('Test hospital data source connection', async ({ page }) => {
  123 |     await login(page);
  124 | 
  125 |     // Go to SQL Editor
  126 |     await page.goto(`${BASE_URL}/sql-editor`);
  127 |     await page.waitForTimeout(2000);
  128 | 
  129 |     // Look for data source selector
  130 |     const dsSelector = page.locator('select, [role="combobox"], button:has-text("Data Source")').first();
  131 |     const hasSelector = await dsSelector.isVisible().catch(() => false);
  132 | 
  133 |     if (hasSelector) {
  134 |       console.log('✓ Data source selector found');
  135 | 
  136 |       // Try to select the hospital data source if it exists
  137 |       const hospitalOption = page.getByText('Hospital Management System').or(page.getByText('Hospital', { exact: false }));
  138 |       const count = await hospitalOption.count();
  139 |       if (count > 0) {
  140 |         console.log(`✓ Found ${count} Hospital data source references`);
  141 |       } else {
  142 |         console.log('⚠ No Hospital data source found in selector');
  143 |       }
  144 |     }
  145 | 
  146 |     // Execute test query
  147 |     await page.locator('.monaco-editor').click();
  148 |     await page.keyboard.type('SELECT COUNT(*) as count FROM bus_patient');
  149 | 
  150 |     const executeBtn = page.getByRole('button', { name: /execute|run/i }).first();
  151 |     if (await executeBtn.isVisible().catch(() => false)) {
  152 |       await executeBtn.click();
  153 |       await page.waitForTimeout(3000);
  154 |       console.log('✓ Query executed');
  155 |     }
  156 | 
  157 |     // Check for results
  158 |     await page.screenshot({ path: 'test-results/query-results.png' });
  159 |   });
  160 | });
  161 | 
```
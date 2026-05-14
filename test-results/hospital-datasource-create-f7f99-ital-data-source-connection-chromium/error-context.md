# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-datasource-create.spec.ts >> Create Hospital Data Source >> Test hospital data source connection
- Location: e2e/hospital-datasource-create.spec.ts:122:3

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.monaco-editor')

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
            - generic [ref=e142]:
              - heading "SQL Editor" [level=1] [ref=e143]
              - paragraph [ref=e144]: Write and execute SQL queries
            - generic [ref=e145]:
              - button "Validate" [ref=e146] [cursor=pointer]
              - button "Run Query" [ref=e147] [cursor=pointer]
              - button "Save Query" [disabled] [ref=e148]
          - generic [ref=e150]:
            - paragraph [ref=e151]: "Data Source:"
            - button "▲" [ref=e152] [cursor=pointer]
          - button "Loading SQL Editor..." [ref=e153]:
            - generic [ref=e157]:
              - img [ref=e158]
              - generic [ref=e160]: Loading SQL Editor...
          - generic [ref=e161]:
            - generic [ref=e162]:
              - paragraph [ref=e163]: Schema Browser (Select a data source)
              - button "▼" [ref=e165] [cursor=pointer]
            - paragraph [ref=e167]: Select a data source to view schema
          - generic [ref=e168]:
            - generic [ref=e169]:
              - button "Results" [ref=e170] [cursor=pointer]
              - button "Errors" [ref=e171] [cursor=pointer]
              - button "Logs" [ref=e172] [cursor=pointer]
            - paragraph [ref=e176]: No results yet. Run a query to see results here.
  - region "Notifications alt+T"
```

# Test source

```ts
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
  85  |       await testBtn.click();
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
> 147 |     await page.locator('.monaco-editor').click();
      |                                          ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
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
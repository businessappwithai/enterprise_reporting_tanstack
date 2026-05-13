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
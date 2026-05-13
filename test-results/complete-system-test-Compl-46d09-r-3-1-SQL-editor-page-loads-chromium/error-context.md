# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> SQL Editor >> 3.1 SQL editor page loads
- Location: e2e/complete-system-test.spec.ts:176:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.monaco-editor, .editor-container')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.monaco-editor, .editor-container')

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
  80  |       expect(page.url()).toContain('/login');
  81  |     });
  82  | 
  83  |     test('1.4 Unauthenticated user is redirected to login', async ({ page }) => {
  84  |       await page.goto(`${BASE_URL}/reports`);
  85  | 
  86  |       // Should redirect to login
  87  |       await page.waitForURL('/login', { timeout: 5000 });
  88  |       expect(page.url()).toContain('/login');
  89  |     });
  90  |   });
  91  | 
  92  |   // ========================================================================
  93  |   // PART 2: DATA SOURCE MANAGEMENT
  94  |   // ========================================================================
  95  | 
  96  |   test.describe('Data Source Management', () => {
  97  |     test.beforeEach(async ({ page }) => {
  98  |       await login(page);
  99  |     });
  100 | 
  101 |     test('2.1 Can view data sources list', async ({ page }) => {
  102 |       await page.goto(`${BASE_URL}/data-sources`);
  103 | 
  104 |       // Page should load
  105 |       await expect(page.locator('h1').filter({ hasText: /data sources/i })).toBeVisible();
  106 | 
  107 |       // Should have a table of data sources
  108 |       await expect(page.locator('table, [role="table"]')).toBeVisible();
  109 |     });
  110 | 
  111 |     test('2.2 Can create a new data source', async ({ page }) => {
  112 |       await page.goto(`${BASE_URL}/data-sources`);
  113 | 
  114 |       // Click "New Data Source" button
  115 |       await page.click('button:has-text("New Data Source"), button:has-text("Add Data Source")');
  116 | 
  117 |       // Wait for dialog/modal
  118 |       await expect(page.locator('[role="dialog"], .dialog, dialog')).toBeVisible();
  119 | 
  120 |       // Fill form
  121 |       await page.fill('input[name="name"]', `E2E Test ${Date.now()}`);
  122 |       await page.selectOption('select[name="type"]', 'postgres');
  123 |       await page.fill('input[name="host"]', 'localhost');
  124 |       await page.fill('input[name="port"]', '5432');
  125 |       await page.fill('input[name="database"]', 'test_db');
  126 |       await page.fill('input[name="username"]', 'test_user');
  127 |       await page.fill('input[name="password"]', 'test_pass');
  128 | 
  129 |       // Submit
  130 |       await page.click('button:has-text("Save"), button:has-text("Create"), button[type="submit"]');
  131 | 
  132 |       // Should show success message
  133 |       await expect(page.locator('text=success, text=created, text=saved').first()).toBeVisible({ timeout: 5000 });
  134 |     });
  135 | 
  136 |     test('2.3 Can test data source connection', async ({ page }) => {
  137 |       await page.goto(`${BASE_URL}/data-sources`);
  138 | 
  139 |       // Find first data source with test button
  140 |       const testButton = page.locator('button:has-text("Test Connection")').first();
  141 |       if (await testButton.isVisible()) {
  142 |         await testButton.click();
  143 | 
  144 |         // Should show connection result
  145 |         await expect(page.locator('text=success, text=connected, text=failed').first()).toBeVisible({ timeout: 5000 });
  146 |       }
  147 |     });
  148 | 
  149 |     test('2.4 Can view data source schema', async ({ page }) => {
  150 |       await page.goto(`${BASE_URL}/data-sources`);
  151 | 
  152 |       // Click on a data source
  153 |       const firstRow = page.locator('table tbody tr, [role="row"]').first();
  154 |       await firstRow.click();
  155 | 
  156 |       // Should show schema or navigate to detail page
  157 |       await page.waitForTimeout(2000);
  158 | 
  159 |       // Look for tables or schema info
  160 |       const hasTables = await page.locator('text=table, text=Tables').count() > 0;
  161 |       const hasSchema = await page.locator('.schema, [data-testid="schema"]').count() > 0;
  162 | 
  163 |       expect(hasTables || hasSchema).toBeTruthy();
  164 |     });
  165 |   });
  166 | 
  167 |   // ========================================================================
  168 |   // PART 3: SQL EDITOR
  169 |   // ========================================================================
  170 | 
  171 |   test.describe('SQL Editor', () => {
  172 |     test.beforeEach(async ({ page }) => {
  173 |       await login(page);
  174 |     });
  175 | 
  176 |     test('3.1 SQL editor page loads', async ({ page }) => {
  177 |       await page.goto(`${BASE_URL}/sql-editor`);
  178 | 
  179 |       // Should have Monaco editor
> 180 |       await expect(page.locator('.monaco-editor, .editor-container')).toBeVisible({ timeout: 10000 });
      |                                                                       ^ Error: expect(locator).toBeVisible() failed
  181 | 
  182 |       // Should have execute button
  183 |       await expect(page.locator('button:has-text("Run"), button:has-text("Execute")')).toBeVisible();
  184 |     });
  185 | 
  186 |     test('3.2 Can execute a simple query', async ({ page }) => {
  187 |       await page.goto(`${BASE_URL}/sql-editor`);
  188 | 
  189 |       // Wait for editor to load
  190 |       await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  191 | 
  192 |       // Type a query
  193 |       await page.keyboard.type('SELECT 1 as test_column');
  194 | 
  195 |       // Click execute
  196 |       await page.click('button:has-text("Run"), button:has-text("Execute")');
  197 | 
  198 |       // Wait for results
  199 |       await page.waitForTimeout(3000);
  200 | 
  201 |       // Should show results table or no error
  202 |       const hasResults = await page.locator('table, [role="table"], .results').count() > 0;
  203 |       const hasNoError = await page.locator('text=error, text=Error').count() === 0;
  204 | 
  205 |       expect(hasResults || hasNoError).toBeTruthy();
  206 |     });
  207 | 
  208 |     test('3.3 Can save a query', async ({ page }) => {
  209 |       await page.goto(`${BASE_URL}/sql-editor`);
  210 | 
  211 |       await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  212 | 
  213 |       // Type query
  214 |       const queryName = `E2E Test Query ${Date.now()}`;
  215 |       await page.keyboard.type(`SELECT * FROM users LIMIT 10`);
  216 | 
  217 |       // Click save button
  218 |       await page.click('button:has-text("Save")');
  219 | 
  220 |       // Fill name in dialog
  221 |       await page.fill('input[name="name"], input[placeholder*="name"]', queryName);
  222 |       await page.click('button:has-text("Save"), button:has-text("Create")');
  223 | 
  224 |       // Should show success
  225 |       await expect(page.locator('text=saved, text=success').first()).toBeVisible({ timeout: 5000 });
  226 |     });
  227 | 
  228 |     test('3.4 Can view schema browser', async ({ page }) => {
  229 |       await page.goto(`${BASE_URL}/sql-editor`);
  230 | 
  231 |       // Look for schema browser panel
  232 |       const schemaBrowser = page.locator('.schema-browser, [data-testid="schema-browser"], .sidebar').first();
  233 | 
  234 |       if (await schemaBrowser.isVisible()) {
  235 |         // Should expand to show tables
  236 |         await expect(schemaBrowser).toBeVisible();
  237 |       }
  238 |     });
  239 |   });
  240 | 
  241 |   // ========================================================================
  242 |   // PART 4: REPORTS
  243 |   // ========================================================================
  244 | 
  245 |   test.describe('Reports', () => {
  246 |     test.beforeEach(async ({ page }) => {
  247 |       await login(page);
  248 |     });
  249 | 
  250 |     test('4.1 Can view reports list', async ({ page }) => {
  251 |       await page.goto(`${BASE_URL}/reports`);
  252 | 
  253 |       await expect(page.locator('h1').filter({ hasText: /reports/i })).toBeVisible();
  254 |       await expect(page.locator('table, [role="table"], .grid')).toBeVisible();
  255 |     });
  256 | 
  257 |     test('4.2 Can create a new report', async ({ page }) => {
  258 |       await page.goto(`${BASE_URL}/reports`);
  259 | 
  260 |       // Click new report button
  261 |       await page.click('button:has-text("New Report"), button:has-text("Create Report")');
  262 | 
  263 |       // Should navigate to editor or show dialog
  264 |       await page.waitForTimeout(2000);
  265 | 
  266 |       // Fill report name
  267 |       const reportName = `E2E Report ${Date.now()}`;
  268 |       const nameInput = page.locator('input[name="name"], input[placeholder*="name"]');
  269 |       if (await nameInput.isVisible()) {
  270 |         await nameInput.fill(reportName);
  271 |       }
  272 | 
  273 |       // Select data source
  274 |       const dataSourceSelect = page.locator('select[name="dataSource"], [role="combobox"]').first();
  275 |       if (await dataSourceSelect.isVisible()) {
  276 |         await dataSourceSelect.click();
  277 |         await page.keyboard.press('ArrowDown');
  278 |         await page.keyboard.press('Enter');
  279 |       }
  280 | 
```
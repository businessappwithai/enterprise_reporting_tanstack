# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Data Source Management >> 2.4 Can view data source schema
- Location: e2e/complete-system-test.spec.ts:149:5

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('table tbody tr, [role="row"]').first()

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
  54  | 
  55  |       // Should redirect to dashboard
  56  |       await page.waitForURL(/\/(dashboard|)$/, { timeout: 10000 });
  57  |       expect(page.url()).toMatch(/\/(dashboard|)$/);
  58  |     });
  59  | 
  60  |     test('1.2 User cannot login with invalid credentials', async ({ page }) => {
  61  |       await page.goto(`${BASE_URL}/login`);
  62  | 
  63  |       await page.fill('input[name="email"]', 'invalid@test.com');
  64  |       await page.fill('input[name="password"]', 'wrongpassword');
  65  |       await page.click('button[type="submit"]');
  66  | 
  67  |       // Should show error message
  68  |       await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 });
  69  |     });
  70  | 
  71  |     test('1.3 User can logout', async ({ page }) => {
  72  |       await login(page);
  73  | 
  74  |       // Click user menu and logout
  75  |       await page.click('[data-testid="user-menu-button"]');
  76  |       await page.click('text=Logout');
  77  | 
  78  |       // Should redirect to login
  79  |       await page.waitForURL('/login', { timeout: 10000 });
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
> 154 |       await firstRow.click();
      |                      ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
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
  180 |       await expect(page.locator('.monaco-editor, .editor-container')).toBeVisible({ timeout: 10000 });
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
```
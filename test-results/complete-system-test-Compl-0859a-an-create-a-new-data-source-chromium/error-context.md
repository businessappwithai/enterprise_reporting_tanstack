# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Data Source Management >> 2.2 Can create a new data source
- Location: e2e/complete-system-test.spec.ts:111:5

# Error details

```
TimeoutError: page.fill: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('input[name="name"]')

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
  - dialog "Add Data Source" [ref=e2]:
    - generic [ref=e3]:
      - heading "Add Data Source" [level=2] [ref=e4]
      - paragraph [ref=e5]: Configure a new database connection for your reports.
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]:
          - text: Name
          - textbox "Name" [active] [ref=e9]:
            - /placeholder: Production Database
        - generic [ref=e10]:
          - text: Database Type
          - combobox "Database Type" [ref=e11] [cursor=pointer]:
            - generic: PostgreSQL
            - img [ref=e12]
      - generic [ref=e14]:
        - text: Description
        - textbox "Description" [ref=e15]:
          - /placeholder: Optional description
      - generic [ref=e16]:
        - generic [ref=e17]:
          - text: Host
          - textbox "Host" [ref=e18]:
            - /placeholder: localhost
        - generic [ref=e19]:
          - text: Port
          - textbox "Port" [ref=e20]:
            - /placeholder: "5432"
      - generic [ref=e21]:
        - text: Database
        - textbox "Database" [ref=e22]:
          - /placeholder: mydb
      - generic [ref=e23]:
        - generic [ref=e24]:
          - text: Username
          - textbox "Username" [ref=e25]:
            - /placeholder: dbuser
        - generic [ref=e26]:
          - text: Password
          - textbox "Password" [ref=e27]:
            - /placeholder: "********"
    - generic [ref=e29]:
      - button "Test Connection" [disabled]
      - button "Create" [disabled]
    - button "Close" [ref=e30] [cursor=pointer]:
      - img [ref=e31]
      - generic [ref=e34]: Close
```

# Test source

```ts
  21  | import { test, expect } from '@playwright/test';
  22  | import { login } from './test-auth';
  23  | 
  24  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  25  | 
  26  | // Test credentials
  27  | const ADMIN_CREDS = { email: 'admin@admin.com', password: 'admin' };
  28  | const ANALYST_CREDS = { email: 'analyst@example.com', password: 'analyst123' };
  29  | 
  30  | // Test data
  31  | const TEST_DATA_SOURCE = {
  32  |   name: 'E2E Test DataSource',
  33  |   type: 'postgres',
  34  |   host: 'localhost',
  35  |   port: '5432',
  36  |   database: 'test_db',
  37  |   username: 'test_user',
  38  |   password: 'test_pass',
  39  | };
  40  | 
  41  | test.describe('Complete System Test Suite', () => {
  42  |   // ========================================================================
  43  |   // PART 1: AUTHENTICATION & AUTHORIZATION
  44  |   // ========================================================================
  45  | 
  46  |   test.describe('Authentication & Authorization', () => {
  47  |     test('1.1 User can login with valid credentials', async ({ page }) => {
  48  |       await page.goto(`${BASE_URL}/login`);
  49  | 
  50  |       // Fill login form
  51  |       await page.fill('input[name="email"]', ADMIN_CREDS.email);
  52  |       await page.fill('input[name="password"]', ADMIN_CREDS.password);
  53  |       await page.click('button[type="submit"]');
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
> 121 |       await page.fill('input[name="name"]', `E2E Test ${Date.now()}`);
      |                  ^ TimeoutError: page.fill: Timeout 15000ms exceeded.
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
```
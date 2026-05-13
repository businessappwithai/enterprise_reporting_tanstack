# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Authentication & Authorization >> 1.1 User can login with valid credentials
- Location: e2e/complete-system-test.spec.ts:47:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/login
Call log:
  - navigating to "http://localhost:4050/login", waiting until "load"

```

# Test source

```ts
  1   | /**
  2   |  * Complete System E2E Test Suite
  3   |  *
  4   |  * This test suite covers ALL functionality of the Enterprise Reporting System:
  5   |  * - Authentication & Authorization
  6   |  * - Data Source Management
  7   |  * - SQL Editor & Query Execution
  8   |  * - Reports (Create, Edit, View, Export)
  9   |  * - Charts (All chart types)
  10  |  * - Dashboards (Create, Edit, Widgets, Cross-Filtering)
  11  |  * - Filters (Saved, Dynamic)
  12  |  * - Metadata Entities (CRUD, Permissions)
  13  |  * - Jobs (Schedule, Monitor, Retry)
  14  |  * - Admin Panel (Users, Roles, Permissions)
  15  |  * - Settings (Email configuration)
  16  |  * - WASM Features (DuckDB, Datasets, Offline Mode, Progressive Loading)
  17  |  *
  18  |  * Run: bun run test:e2e -- e2e/complete-system-test.spec.ts
  19  |  */
  20  | 
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
> 48  |       await page.goto(`${BASE_URL}/login`);
      |                  ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/login
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
```
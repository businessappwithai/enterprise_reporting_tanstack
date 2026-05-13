# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: load-comprehensive.spec.ts >> Load Testing - Large Dataset >> L2. SQL Editor - Simple query on large dataset
- Location: e2e/load-comprehensive.spec.ts:30:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').or(locator('text=SQL')).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h1').or(locator('text=SQL')).first()

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
  1   | /**
  2   |  * Load and Comprehensive Testing Suite
  3   |  * Tests application with 300K+ records
  4   |  */
  5   | 
  6   | import { test, expect } from '@playwright/test';
  7   | 
  8   | test.describe('Load Testing - Large Dataset', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     // Login before each test
  11  |     await page.goto('/login');
  12  |     await page.fill('input[name="email"], input[type="email"]', 'admin@admin.com');
  13  |     await page.fill('input[name="password"], input[type="password"]', 'admin');
  14  |     await page.click('button[type="submit"]');
  15  |     await page.waitForURL(/\//);
  16  |   });
  17  | 
  18  |   test('L1. Dashboard loads with large dataset', async ({ page }) => {
  19  |     await page.goto('/');
  20  | 
  21  |     // Dashboard should load
  22  |     await expect(page.locator('h1').first()).toContainText('Dashboard', { timeout: 10000 });
  23  | 
  24  |     // Stats should be visible
  25  |     await expect(page.locator('text=Total Reports').first()).toBeVisible();
  26  |     await expect(page.locator('text=Active Charts').first()).toBeVisible();
  27  |     await expect(page.locator('text=Dashboards').first()).toBeVisible();
  28  |   });
  29  | 
  30  |   test('L2. SQL Editor - Simple query on large dataset', async ({ page }) => {
  31  |     await page.goto('/sql-editor');
  32  | 
  33  |     // Wait for page to load
> 34  |     await expect(page.locator('h1').or(page.locator('text=SQL')).first()).toBeVisible({ timeout: 10000 });
      |                                                                           ^ Error: expect(locator).toBeVisible() failed
  35  | 
  36  |     // Wait for Monaco editor to load
  37  |     await page.waitForSelector('.monaco-editor', { timeout: 10000 });
  38  | 
  39  |     // Click in the editor
  40  |     await page.locator('.monaco-editor').click();
  41  | 
  42  |     // Type simple query
  43  |     await page.keyboard.type('SELECT COUNT(*) as total FROM customers');
  44  | 
  45  |     // Look for and click execute button
  46  |     const executeBtn = page.locator('button:has-text("Execute"), button:has-text("Run"), button[title*="Execute"], button[title*="Run"]').first();
  47  |     if (await executeBtn.isVisible()) {
  48  |       await executeBtn.click();
  49  |     }
  50  | 
  51  |     // Wait for results
  52  |     await page.waitForTimeout(5000);
  53  |   });
  54  | 
  55  |   test('L3. Complex JOIN query performance', async ({ page }) => {
  56  |     await page.goto('/sql-editor');
  57  | 
  58  |     await expect(page.locator('text=SQL Editor').or(page.locator('h1'))).toBeVisible();
  59  | 
  60  |     const editor = page.locator('.monaco-editor, .view-line').first();
  61  |     await editor.click();
  62  | 
  63  |     // Complex JOIN query
  64  |     const complexQuery = `SELECT
  65  |   c.name,
  66  |   COUNT(o.order_id) as order_count,
  67  |   SUM(o.total_amount) as total_spent
  68  | FROM customers c
  69  | LEFT JOIN orders o ON c.customer_id = o.customer_id
  70  | GROUP BY c.customer_id
  71  | ORDER BY total_spent DESC
  72  | LIMIT 100`;
  73  | 
  74  |     await page.keyboard.type(complexQuery);
  75  | 
  76  |     // Execute and measure time
  77  |     const startTime = Date.now();
  78  |     await page.click('button:has-text("Execute"), button:has-text("Run"), button:has-text("▶")');
  79  | 
  80  |     // Wait for results
  81  |     await page.waitForTimeout(10000);
  82  |     const queryTime = Date.now() - startTime;
  83  | 
  84  |     console.log(`Complex JOIN query completed in ${queryTime}ms`);
  85  | 
  86  |     // Query should complete within 30 seconds
  87  |     expect(queryTime).toBeLessThan(30000);
  88  |   });
  89  | 
  90  |   test('L4. Large result set handling (1000 rows)', async ({ page }) => {
  91  |     await page.goto('/sql-editor');
  92  | 
  93  |     await expect(page.locator('text=SQL Editor').or(page.locator('h1'))).toBeVisible();
  94  | 
  95  |     const editor = page.locator('.monaco-editor, .view-line').first();
  96  |     await editor.click();
  97  | 
  98  |     await page.keyboard.type('SELECT * FROM orders ORDER BY id DESC LIMIT 1000');
  99  | 
  100 |     const startTime = Date.now();
  101 |     await page.click('button:has-text("Execute"), button:has-text("Run"), button:has-text("▶")');
  102 | 
  103 |     await page.waitForTimeout(15000);
  104 |     const queryTime = Date.now() - startTime;
  105 | 
  106 |     console.log(`1000 row query completed in ${queryTime}ms`);
  107 |   });
  108 | 
  109 |   test('L5. Aggregation query performance', async ({ page }) => {
  110 |     await page.goto('/sql-editor');
  111 | 
  112 |     await expect(page.locator('text=SQL Editor').or(page.locator('h1'))).toBeVisible();
  113 | 
  114 |     const editor = page.locator('.monaco-editor, .view-line').first();
  115 |     await editor.click();
  116 | 
  117 |     const aggQuery = `SELECT
  118 |   status,
  119 |   COUNT(*) as count,
  120 |   SUM(total_amount) as total,
  121 |   AVG(total_amount) as average
  122 | FROM orders
  123 | GROUP BY status`;
  124 | 
  125 |     await page.keyboard.type(aggQuery);
  126 | 
  127 |     const startTime = Date.now();
  128 |     await page.click('button:has-text("Execute"), button:has-text("Run"), button:has-text("▶")');
  129 | 
  130 |     await page.waitForTimeout(10000);
  131 |     const queryTime = Date.now() - startTime;
  132 | 
  133 |     console.log(`Aggregation query completed in ${queryTime}ms`);
  134 |     expect(queryTime).toBeLessThan(20000);
```
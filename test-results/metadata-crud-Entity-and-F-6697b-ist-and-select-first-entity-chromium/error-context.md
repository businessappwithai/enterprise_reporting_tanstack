# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: metadata-crud.spec.ts >> Entity and Field Metadata CRUD >> should navigate to entity list and select first entity
- Location: e2e/metadata-crud.spec.ts:87:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
Call log:
  - navigating to "http://localhost:4050/", waiting until "load"

```

# Test source

```ts
  1   | /**
  2   |  * End-to-End Tests for Entity and Field Metadata CRUD
  3   |  *
  4   |  * Tests the complete CRUD functionality for:
  5   |  * - Entity metadata (description, is_active, is_hidden)
  6   |  * - Field metadata (description, is_display_field, is_searchable, display_order, relationship_ui_type)
  7   |  * - Batch field updates
  8   |  * - Data persistence
  9   |  */
  10  | 
  11  | import { test, expect } from '@playwright/test';
  12  | 
  13  | test.describe.configure({ mode: 'serial' });
  14  | 
  15  | let testDataSourceId: string;
  16  | let testEntityId: string;
  17  | let testEntityName: string;
  18  | 
  19  | test.describe('Entity and Field Metadata CRUD', () => {
  20  |   test.beforeAll(async ({ browser }) => {
  21  |     // Setup authentication and get datasource
  22  |     const context = await browser.newContext();
  23  |     const page = await context.newPage();
  24  | 
  25  |     // Login
  26  |     console.log('[Test Setup] Navigating to login page...');
> 27  |     await page.goto('/', { timeout: 10000 });
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
  28  |     await page.waitForLoadState('networkidle');
  29  |     console.log('[Test Setup] Current URL:', page.url());
  30  | 
  31  |     // Check if already on dashboard
  32  |     const isDashboard = await page.getByRole('heading', { name: 'Dashboard', exact: true }).isVisible().catch(() => false);
  33  | 
  34  |     if (!isDashboard) {
  35  |       console.log('[Test Setup] Not logged in, checking for login form...');
  36  | 
  37  |       // Take screenshot for debugging
  38  |       await page.screenshot({ path: 'test-debug-login.png' });
  39  | 
  40  |       // Try multiple selectors
  41  |       const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[placeholder*="example"]').first();
  42  |       const hasEmailInput = await emailInput.isVisible().catch(() => false);
  43  |       console.log('[Test Setup] Email input visible:', hasEmailInput);
  44  | 
  45  |       if (hasEmailInput) {
  46  |         await emailInput.fill('admin@admin.com');
  47  |         const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
  48  |         await passwordInput.fill('admin');
  49  | 
  50  |         const signInButton = page.locator('button:has-text("Sign In"), button[type="submit"]').first();
  51  |         await signInButton.click();
  52  | 
  53  |         await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({ timeout: 15000 });
  54  |       } else {
  55  |         console.log('[Test Setup] Could not find login form elements');
  56  |         console.log('[Test Setup] Page title:', await page.title());
  57  |         console.log('[Test Setup] Page content:', await page.content());
  58  |         throw new Error('Login form not found');
  59  |       }
  60  |     } else {
  61  |       console.log('[Test Setup] Already logged in');
  62  |     }
  63  | 
  64  |     // Get Sakila datasource
  65  |     await page.goto('/data-sources');
  66  |     await page.waitForTimeout(1000);
  67  | 
  68  |     const sakilaRow = page.locator('table tr:has-text("Sakila")').first();
  69  |     if (await sakilaRow.isVisible()) {
  70  |       const entityMetadataLink = sakilaRow.locator('a[href*="/metadata/entities"]').first();
  71  |       const href = await entityMetadataLink.getAttribute('href');
  72  |       if (href) {
  73  |         const match = href.match(/data_source_id=([^&]+)/);
  74  |         if (match) {
  75  |           testDataSourceId = match[1];
  76  |         }
  77  |       }
  78  |     }
  79  | 
  80  |     await context.close();
  81  | 
  82  |     if (!testDataSourceId) {
  83  |       throw new Error('Could not find Sakila datasource');
  84  |     }
  85  |   });
  86  | 
  87  |   test('should navigate to entity list and select first entity', async ({ browser }) => {
  88  |     const page = await browser.newPage();
  89  |     await setupAuthenticatedPage(page);
  90  | 
  91  |     await page.goto(`/metadata/entities?data_source_id=${testDataSourceId}`);
  92  |     await page.waitForTimeout(2000);
  93  | 
  94  |     // Find first entity with fields (avoid empty entities)
  95  |     const entityRows = page.locator('table tbody tr');
  96  |     const count = await entityRows.count();
  97  | 
  98  |     let foundEntity = false;
  99  |     for (let i = 0; i < Math.min(count, 5); i++) {
  100 |       const row = entityRows.nth(i);
  101 |       const fieldCountCell = row.locator('td').nth(5); // Fields column
  102 |       const fieldCountText = await fieldCountCell.textContent();
  103 |       const fieldCount = parseInt(fieldCountText || '0');
  104 | 
  105 |       if (fieldCount > 0) {
  106 |         // Get entity name and ID
  107 |         const nameCell = row.locator('td').nth(0);
  108 |         testEntityName = await nameCell.locator('span.font-medium').textContent() || '';
  109 | 
  110 |         const manageLink = row.locator('a:has-text("Manage →")').first();
  111 |         const href = await manageLink.getAttribute('href');
  112 |         if (href) {
  113 |           const match = href.match(/\/metadata\/entities\/([a-f0-9-]+)$/);
  114 |           if (match) {
  115 |             testEntityId = match[1];
  116 |             foundEntity = true;
  117 |             break;
  118 |           }
  119 |         }
  120 |       }
  121 |     }
  122 | 
  123 |     expect(foundEntity).toBeTruthy();
  124 |     console.log('[Test] Selected entity:', testEntityName, 'ID:', testEntityId);
  125 | 
  126 |     await page.close();
  127 |   });
```
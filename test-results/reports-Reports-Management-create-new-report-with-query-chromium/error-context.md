# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reports.spec.ts >> Reports Management >> create new report with query
- Location: e2e/reports.spec.ts:55:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Create Report' }).first() to be visible

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
              - heading [level=1]: Reports
              - paragraph: Create and manage tabular reports
            - button [expanded]:
              - img
              - text: New Report
          - generic:
            - generic:
              - heading [level=3]:
                - img
                - text: All Reports
            - generic:
              - generic: No reports created yet. Create your first report to get started.
  - region "Notifications alt+T"
  - dialog:
    - generic:
      - heading [level=2]: Create Report
      - paragraph: Create a new report from a saved query.
    - generic:
      - generic:
        - text: Name
        - textbox:
          - /placeholder: My Report
          - text: E2E Test Report
      - generic:
        - text: Description
        - textbox:
          - /placeholder: Optional description
          - text: This is a test report from E2E tests
      - generic:
        - text: Saved Query
        - combobox [expanded]:
          - generic: Select a query
          - img
    - generic:
      - button: Cancel
      - button: Create Report
    - button:
      - img
      - generic: Close
  - listbox [active] [ref=e2]
```

# Test source

```ts
  30  |       await this.page.getByLabel('Password').fill(password);
  31  |       await this.page.getByRole('button', { name: 'Sign In' }).click();
  32  | 
  33  |       // Wait for successful login (multiple indicators for reliability)
  34  |       await Promise.race([
  35  |         this.page.waitForURL(/\/(dashboard|)/, { timeout: 15000 }),
  36  |         this.page.getByRole('heading', { name: /dashboard/i }).waitFor({ state: 'visible', timeout: 15000 }),
  37  |         this.page.getByRole('navigation').waitFor({ state: 'visible', timeout: 15000 }),
  38  |       ]).catch(() => this.page.waitForTimeout(3000));
  39  | 
  40  |       console.log('✓ Emergency re-authentication successful');
  41  |     } catch (error) {
  42  |       console.error('⚠️  Emergency re-auth failed:', error);
  43  |       throw error;
  44  |     }
  45  | 
  46  |     await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  47  |   }
  48  | 
  49  |   /**
  50  |    * Navigate to a specific page by name
  51  |    * Uses direct URL navigation for reliability
  52  |    */
  53  |   async navigateToPage(pageName: 'Dashboard' | 'SQL Editor' | 'Reports' | 'Charts' | 'Dashboards') {
  54  |     const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  55  | 
  56  |     // Map page names to their routes
  57  |     const routes: Record<string, string> = {
  58  |       'Dashboard': '/dashboard',
  59  |       'SQL Editor': '/sql-editor',
  60  |       'Reports': '/reports',
  61  |       'Charts': '/charts',
  62  |       'Dashboards': '/dashboards',
  63  |     };
  64  | 
  65  |     const route = routes[pageName];
  66  |     if (!route) {
  67  |       throw new Error(`Unknown page: ${pageName}`);
  68  |     }
  69  | 
  70  |     // Use direct URL navigation - most reliable
  71  |     await this.page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
  72  | 
  73  |     // Wait for page to be fully loaded
  74  |     await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  75  |     await this.page.waitForTimeout(1000);
  76  |   }
  77  | 
  78  |   /**
  79  |    * Wait for and verify toast notification
  80  |    */
  81  |   async verifyToast(message: string, type: 'success' | 'error' = 'success') {
  82  |     const toast = this.page.getByText(message).first();
  83  |     await toast.waitFor({ state: 'visible', timeout: 5000 });
  84  |     return toast;
  85  |   }
  86  | 
  87  |   /**
  88  |    * Select from a dropdown by trigger and option text
  89  |    * Improved to handle Radix UI dropdowns with better waiting
  90  |    */
  91  |   async selectDropdown(triggerText: string, optionText: string, timeout = 10000) {
  92  |     // Click the dropdown trigger
  93  |     const trigger = this.page.getByText(triggerText).first();
  94  |     await trigger.waitFor({ state: 'visible', timeout });
  95  |     await trigger.click();
  96  | 
  97  |     // Wait for dropdown content to appear - Radix UI uses portals
  98  |     await this.page.waitForTimeout(500);
  99  | 
  100 |     // Try to find the option with multiple selectors for robustness
  101 |     const option = this.page.getByRole('option', { name: optionText }).first();
  102 | 
  103 |     try {
  104 |       await option.waitFor({ state: 'visible', timeout: 5000 });
  105 |       await option.click();
  106 |     } catch (error) {
  107 |       // Fallback: try clicking by text if role='option' didn't work
  108 |       const textOption = this.page.getByText(optionText).first();
  109 |       await textOption.waitFor({ state: 'visible', timeout: 5000 });
  110 |       await textOption.click();
  111 |     }
  112 | 
  113 |     // Wait for selection to complete
  114 |     await this.page.waitForTimeout(300);
  115 |   }
  116 | 
  117 |   /**
  118 |    * Fill a form field by label
  119 |    */
  120 |   async fillByLabel(label: string, value: string) {
  121 |     await this.page.getByLabel(label).fill(value);
  122 |   }
  123 | 
  124 |   /**
  125 |    * Click a button by text
  126 |    * Waits for button to be visible and enabled before clicking
  127 |    */
  128 |   async clickButton(text: string, timeout = 10000) {
  129 |     const button = this.page.getByRole('button', { name: text }).first();
> 130 |     await button.waitFor({ state: 'visible', timeout });
      |                  ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  131 |     await button.click();
  132 |   }
  133 | 
  134 |   /**
  135 |    * Take a screenshot with a descriptive name
  136 |    */
  137 |   async screenshot(name: string) {
  138 |     await this.page.screenshot({
  139 |       path: `screenshots/${name}.png`,
  140 |       fullPage: true,
  141 |     });
  142 |   }
  143 | 
  144 |   /**
  145 |    * Wait for loading to complete (spinner disappears)
  146 |    */
  147 |   async waitForLoading() {
  148 |     const spinners = this.page.locator('.animate-spin');
  149 |     if (await spinners.count() > 0) {
  150 |       await spinners.first().waitFor({ state: 'hidden', timeout: 10000 });
  151 |     }
  152 |   }
  153 | 
  154 |   /**
  155 |    * Get table rows count
  156 |    */
  157 |   async getTableRowCount(tableLocator?: Locator) {
  158 |     const table = tableLocator || this.page.locator('table').first();
  159 |     const rows = await table.locator('tbody tr').all();
  160 |     return rows.length;
  161 |   }
  162 | 
  163 |   /**
  164 |    * Verify table has content
  165 |    */
  166 |   async verifyTableHasContent(expectedMinRows = 1) {
  167 |     const count = await this.getTableRowCount();
  168 |     if (count < expectedMinRows) {
  169 |       throw new Error(`Expected at least ${expectedMinRows} table rows, but found ${count}`);
  170 |     }
  171 |   }
  172 | 
  173 |   /**
  174 |    * Click a menu item in a dropdown menu
  175 |    */
  176 |   async clickMenuItem(menuTriggerText: string, menuItemText: string) {
  177 |     // Click the menu trigger (usually a button with icon)
  178 |     const trigger = this.page.getByRole('button').filter({ hasText: menuTriggerText }).first();
  179 |     await trigger.click();
  180 | 
  181 |     // Wait for menu to appear
  182 |     await this.page.waitForTimeout(200);
  183 | 
  184 |     // Click the menu item
  185 |     const menuItem = this.page.getByRole('menuitem').filter({ hasText: menuItemText }).first();
  186 |     await menuItem.click();
  187 |   }
  188 | 
  189 |   /**
  190 |    * Wait for Monaco Editor to be ready
  191 |    */
  192 |   async waitForMonacoEditor() {
  193 |     const editor = this.page.locator('.monaco-editor').first();
  194 |     await editor.waitFor({ state: 'visible', timeout: 5000 });
  195 |   }
  196 | 
  197 |   /**
  198 |    * Type in Monaco Editor
  199 |    */
  200 |   async typeInMonacoEditor(text: string, append = false) {
  201 |     await this.waitForMonacoEditor();
  202 | 
  203 |     // Click in the editor to focus it
  204 |     const editor = this.page.locator('.monaco-editor').first();
  205 |     await editor.click();
  206 | 
  207 |     if (!append) {
  208 |       // Select all and delete existing content
  209 |       await this.page.keyboard.press('ControlOrMeta+A');
  210 |       await this.page.keyboard.press('Delete');
  211 |     }
  212 | 
  213 |     // Type the new content
  214 |     await this.page.keyboard.type(text);
  215 |   }
  216 | 
  217 |   /**
  218 |    * Get Monaco Editor content
  219 |    */
  220 |   async getMonacoEditorContent(): Promise<string> {
  221 |     await this.waitForMonacoEditor();
  222 | 
  223 |     // Select all content
  224 |     await this.page.keyboard.press('ControlOrMeta+A');
  225 | 
  226 |     // Copy to clipboard
  227 |     await this.page.keyboard.press('ControlOrMeta+C');
  228 | 
  229 |     // Get from clipboard
  230 |     return await this.page.evaluate(() => navigator.clipboard.readText());
```
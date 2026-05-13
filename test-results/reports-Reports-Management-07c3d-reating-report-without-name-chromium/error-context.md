# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reports.spec.ts >> Reports Management >> validation prevents creating report without name
- Location: e2e/reports.spec.ts:111:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'New Report' }).first() to be visible

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
  28  |         this.page.getByRole('heading', { name: /dashboard/i }).waitFor({ state: 'visible', timeout: 15000 }),
  29  |         // Option 2: Navigation menu
  30  |         this.page.getByRole('navigation').waitFor({ state: 'visible', timeout: 15000 }),
  31  |         // Option 3: URL change to home (not login)
  32  |         this.page.waitForURL(url => !url.includes('/login'), { timeout: 15000 }),
  33  |       ]).catch(() => {
  34  |         // If none of the above work, just wait for the hard redirect timeout
  35  |         return this.page.waitForTimeout(5000);
  36  |       });
  37  |     } else {
  38  |       // Already at home page, wait for it to be fully loaded
  39  |       await this.page.waitForTimeout(2000);
  40  |     }
  41  | 
  42  |     // Wait for page to be fully loaded
  43  |     await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  44  | 
  45  |     // Additional wait for session to be established
  46  |     await this.page.waitForTimeout(1500);
  47  |   }
  48  | 
  49  |   /**
  50  |    * Navigate to a specific page by name
  51  |    * Uses direct URL navigation for reliability
  52  |    */
  53  |   async navigateToPage(pageName: 'Dashboard' | 'SQL Editor' | 'Reports' | 'Charts' | 'Dashboards') {
  54  |     // Map page names to their routes
  55  |     const routes: Record<string, string> = {
  56  |       'Dashboard': '/',
  57  |       'SQL Editor': '/sql-editor',
  58  |       'Reports': '/reports',
  59  |       'Charts': '/charts',
  60  |       'Dashboards': '/dashboards',
  61  |     };
  62  | 
  63  |     const route = routes[pageName];
  64  |     if (!route) {
  65  |       throw new Error(`Unknown page: ${pageName}`);
  66  |     }
  67  | 
  68  |     // Use direct URL navigation - most reliable
  69  |     await this.page.goto(route, { waitUntil: 'domcontentloaded' });
  70  | 
  71  |     // Wait for page to be fully loaded
  72  |     await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  73  |     await this.page.waitForTimeout(1000);
  74  |   }
  75  | 
  76  |   /**
  77  |    * Wait for and verify toast notification
  78  |    */
  79  |   async verifyToast(message: string, type: 'success' | 'error' = 'success') {
  80  |     const toast = this.page.getByText(message).first();
  81  |     await toast.waitFor({ state: 'visible', timeout: 5000 });
  82  |     return toast;
  83  |   }
  84  | 
  85  |   /**
  86  |    * Select from a dropdown by trigger and option text
  87  |    * Improved to handle Radix UI dropdowns with better waiting
  88  |    */
  89  |   async selectDropdown(triggerText: string, optionText: string, timeout = 10000) {
  90  |     // Click the dropdown trigger
  91  |     const trigger = this.page.getByText(triggerText).first();
  92  |     await trigger.waitFor({ state: 'visible', timeout });
  93  |     await trigger.click();
  94  | 
  95  |     // Wait for dropdown content to appear - Radix UI uses portals
  96  |     await this.page.waitForTimeout(500);
  97  | 
  98  |     // Try to find the option with multiple selectors for robustness
  99  |     const option = this.page.getByRole('option', { name: optionText }).first();
  100 | 
  101 |     try {
  102 |       await option.waitFor({ state: 'visible', timeout: 5000 });
  103 |       await option.click();
  104 |     } catch (error) {
  105 |       // Fallback: try clicking by text if role='option' didn't work
  106 |       const textOption = this.page.getByText(optionText).first();
  107 |       await textOption.waitFor({ state: 'visible', timeout: 5000 });
  108 |       await textOption.click();
  109 |     }
  110 | 
  111 |     // Wait for selection to complete
  112 |     await this.page.waitForTimeout(300);
  113 |   }
  114 | 
  115 |   /**
  116 |    * Fill a form field by label
  117 |    */
  118 |   async fillByLabel(label: string, value: string) {
  119 |     await this.page.getByLabel(label).fill(value);
  120 |   }
  121 | 
  122 |   /**
  123 |    * Click a button by text
  124 |    * Waits for button to be visible and enabled before clicking
  125 |    */
  126 |   async clickButton(text: string, timeout = 10000) {
  127 |     const button = this.page.getByRole('button', { name: text }).first();
> 128 |     await button.waitFor({ state: 'visible', timeout });
      |                  ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  129 |     await button.click();
  130 |   }
  131 | 
  132 |   /**
  133 |    * Take a screenshot with a descriptive name
  134 |    */
  135 |   async screenshot(name: string) {
  136 |     await this.page.screenshot({
  137 |       path: `screenshots/${name}.png`,
  138 |       fullPage: true,
  139 |     });
  140 |   }
  141 | 
  142 |   /**
  143 |    * Wait for loading to complete (spinner disappears)
  144 |    */
  145 |   async waitForLoading() {
  146 |     const spinners = this.page.locator('.animate-spin');
  147 |     if (await spinners.count() > 0) {
  148 |       await spinners.first().waitFor({ state: 'hidden', timeout: 10000 });
  149 |     }
  150 |   }
  151 | 
  152 |   /**
  153 |    * Get table rows count
  154 |    */
  155 |   async getTableRowCount(tableLocator?: Locator) {
  156 |     const table = tableLocator || this.page.locator('table').first();
  157 |     const rows = await table.locator('tbody tr').all();
  158 |     return rows.length;
  159 |   }
  160 | 
  161 |   /**
  162 |    * Verify table has content
  163 |    */
  164 |   async verifyTableHasContent(expectedMinRows = 1) {
  165 |     const count = await this.getTableRowCount();
  166 |     if (count < expectedMinRows) {
  167 |       throw new Error(`Expected at least ${expectedMinRows} table rows, but found ${count}`);
  168 |     }
  169 |   }
  170 | 
  171 |   /**
  172 |    * Click a menu item in a dropdown menu
  173 |    */
  174 |   async clickMenuItem(menuTriggerText: string, menuItemText: string) {
  175 |     // Click the menu trigger (usually a button with icon)
  176 |     const trigger = this.page.getByRole('button').filter({ hasText: menuTriggerText }).first();
  177 |     await trigger.click();
  178 | 
  179 |     // Wait for menu to appear
  180 |     await this.page.waitForTimeout(200);
  181 | 
  182 |     // Click the menu item
  183 |     const menuItem = this.page.getByRole('menuitem').filter({ hasText: menuItemText }).first();
  184 |     await menuItem.click();
  185 |   }
  186 | 
  187 |   /**
  188 |    * Wait for Monaco Editor to be ready
  189 |    */
  190 |   async waitForMonacoEditor() {
  191 |     const editor = this.page.locator('.monaco-editor').first();
  192 |     await editor.waitFor({ state: 'visible', timeout: 5000 });
  193 |   }
  194 | 
  195 |   /**
  196 |    * Type in Monaco Editor
  197 |    */
  198 |   async typeInMonacoEditor(text: string, append = false) {
  199 |     await this.waitForMonacoEditor();
  200 | 
  201 |     // Click in the editor to focus it
  202 |     const editor = this.page.locator('.monaco-editor').first();
  203 |     await editor.click();
  204 | 
  205 |     if (!append) {
  206 |       // Select all and delete existing content
  207 |       await this.page.keyboard.press('ControlOrMeta+A');
  208 |       await this.page.keyboard.press('Delete');
  209 |     }
  210 | 
  211 |     // Type the new content
  212 |     await this.page.keyboard.type(text);
  213 |   }
  214 | 
  215 |   /**
  216 |    * Get Monaco Editor content
  217 |    */
  218 |   async getMonacoEditorContent(): Promise<string> {
  219 |     await this.waitForMonacoEditor();
  220 | 
  221 |     // Select all content
  222 |     await this.page.keyboard.press('ControlOrMeta+A');
  223 | 
  224 |     // Copy to clipboard
  225 |     await this.page.keyboard.press('ControlOrMeta+C');
  226 | 
  227 |     // Get from clipboard
  228 |     return await this.page.evaluate(() => navigator.clipboard.readText());
```
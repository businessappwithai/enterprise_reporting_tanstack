# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reproduce-encryption-error.spec.ts >> SQL Editor - Reproduce Encryption Error >> should execute Sakila query successfully
- Location: e2e/reproduce-encryption-error.spec.ts:17:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('button').filter({ hasText: /Select data source/i }).first() to be visible

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
  231 |   }
  232 | 
  233 |   /**
  234 |    * Switch to a specific tab by text
  235 |    */
  236 |   async switchTab(tabText: string) {
  237 |     const tab = this.page.getByRole('tab', { name: tabText });
  238 |     await tab.click();
  239 |     await this.page.waitForTimeout(200);
  240 |   }
  241 | 
  242 |   /**
  243 |    * Verify no console errors
  244 |    */
  245 |   async verifyNoConsoleErrors() {
  246 |     const errors: string[] = [];
  247 | 
  248 |     this.page.on('console', msg => {
  249 |       if (msg.type() === 'error') {
  250 |         errors.push(msg.text());
  251 |       }
  252 |     });
  253 | 
  254 |     // Wait a bit for any async errors
  255 |     await this.page.waitForTimeout(1000);
  256 | 
  257 |     return errors;
  258 |   }
  259 | 
  260 |   /**
  261 |    * Handle a dialog (confirm/alert)
  262 |    */
  263 |   async handleDialog(accept: boolean, promptText?: string) {
  264 |     this.page.once('dialog', async dialog => {
  265 |       if (promptText) {
  266 |         await dialog.accept(promptText);
  267 |       } else if (accept) {
  268 |         await dialog.accept();
  269 |       } else {
  270 |         await dialog.dismiss();
  271 |       }
  272 |     });
  273 |   }
  274 | 
  275 |   /**
  276 |    * Verify element visibility with timeout
  277 |    */
  278 |   async verifyVisible(selector: string, timeout = 5000) {
  279 |     await this.page.locator(selector).first().waitFor({ state: 'visible', timeout });
  280 |   }
  281 | 
  282 |   /**
  283 |    * Select a data source in SQL Editor
  284 |    * Uses JavaScript clicks to avoid Playwright timeout issues with Radix UI components
  285 |    */
  286 |   async selectDataSource(dataSourceName?: string) {
  287 |     // Wait for data source dropdown to be available
  288 |     const selectTrigger = this.page.locator('button').filter({ hasText: /Select data source/i }).first();
  289 | 
  290 |     // Wait for trigger to be visible
> 291 |     await selectTrigger.waitFor({ state: 'visible', timeout: 10000 });
      |                         ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  292 | 
  293 |     // Wait for React state to settle
  294 |     await this.page.waitForTimeout(1000);
  295 | 
  296 |     // Check if data sources are available - retry check
  297 |     let isDisabled = true;
  298 |     for (let i = 0; i < 5; i++) {
  299 |       isDisabled = await selectTrigger.isDisabled();
  300 |       if (!isDisabled) break;
  301 |       await this.page.waitForTimeout(500);
  302 |     }
  303 | 
  304 |     if (isDisabled) {
  305 |       throw new Error('No data sources available - button is disabled');
  306 |     }
  307 | 
  308 |     // Click using JavaScript (more reliable for Radix UI)
  309 |     await this.page.evaluate((element) => element.click(), await selectTrigger.elementHandle());
  310 | 
  311 |     // Wait for options to appear with a longer timeout
  312 |     await this.page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 });
  313 |     await this.page.waitForTimeout(300);
  314 | 
  315 |     // Select first option or specific data source by name using JavaScript
  316 |     if (dataSourceName) {
  317 |       const option = this.page.locator('[role="option"]').filter({ hasText: dataSourceName }).first();
  318 |       await option.waitFor({ state: 'visible', timeout: 5000 });
  319 |       await this.page.evaluate((el) => el.click(), await option.elementHandle());
  320 |     } else {
  321 |       const firstOption = this.page.locator('[role="option"]').first();
  322 |       await firstOption.waitFor({ state: 'visible', timeout: 5000 });
  323 |       await this.page.evaluate((el) => el.click(), await firstOption.elementHandle());
  324 |     }
  325 | 
  326 |     // Wait for selection to complete and schema to start loading
  327 |     await this.page.waitForTimeout(1000);
  328 | 
  329 |     // Wait for the dropdown to close
  330 |     await this.page.waitForSelector('[role="option"]', { state: 'hidden', timeout: 5000 }).catch(() => {
  331 |       // Dropdown might close immediately, which is fine
  332 |     });
  333 | 
  334 |     // Additional wait for schema loading to start
  335 |     await this.page.waitForTimeout(500);
  336 |   }
  337 | 
  338 |   /**
  339 |    * Retry a function with delay
  340 |    */
  341 |   async retry<T>(
  342 |     fn: () => Promise<T>,
  343 |     retries = 3,
  344 |     delay = 1000
  345 |   ): Promise<T> {
  346 |     let lastError: Error | undefined;
  347 | 
  348 |     for (let i = 0; i < retries; i++) {
  349 |       try {
  350 |         return await fn();
  351 |       } catch (error) {
  352 |         lastError = error as Error;
  353 |         if (i < retries - 1) {
  354 |           await this.page.waitForTimeout(delay);
  355 |         }
  356 |       }
  357 |     }
  358 | 
  359 |     throw lastError;
  360 |   }
  361 | }
  362 | 
  363 | /**
  364 |  * SQL queries for testing
  365 |  */
  366 | export const TEST_QUERIES = {
  367 |   simple: 'SELECT * FROM users LIMIT 10;',
  368 |   join: `
  369 |     SELECT
  370 |       u.name,
  371 |       u.email,
  372 |       o.id as order_id,
  373 |       o.total_amount,
  374 |       o.status
  375 |     FROM users u
  376 |     LEFT JOIN orders o ON u.id = o.user_id
  377 |     LIMIT 20;
  378 |   `,
  379 |   complexJoin: `
  380 |     SELECT
  381 |       u.name,
  382 |       u.email,
  383 |       COUNT(o.id) as order_count,
  384 |       SUM(o.total_amount) as total_spent,
  385 |       AVG(o.total_amount) as avg_order_value
  386 |     FROM users u
  387 |     LEFT JOIN orders o ON u.id = o.user_id
  388 |     GROUP BY u.id, u.name, u.email
  389 |     HAVING COUNT(o.id) > 0
  390 |     ORDER BY total_spent DESC
  391 |     LIMIT 10;
```
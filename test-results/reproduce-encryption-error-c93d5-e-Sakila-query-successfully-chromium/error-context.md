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
  229 |   }
  230 | 
  231 |   /**
  232 |    * Switch to a specific tab by text
  233 |    */
  234 |   async switchTab(tabText: string) {
  235 |     const tab = this.page.getByRole('tab', { name: tabText });
  236 |     await tab.click();
  237 |     await this.page.waitForTimeout(200);
  238 |   }
  239 | 
  240 |   /**
  241 |    * Verify no console errors
  242 |    */
  243 |   async verifyNoConsoleErrors() {
  244 |     const errors: string[] = [];
  245 | 
  246 |     this.page.on('console', msg => {
  247 |       if (msg.type() === 'error') {
  248 |         errors.push(msg.text());
  249 |       }
  250 |     });
  251 | 
  252 |     // Wait a bit for any async errors
  253 |     await this.page.waitForTimeout(1000);
  254 | 
  255 |     return errors;
  256 |   }
  257 | 
  258 |   /**
  259 |    * Handle a dialog (confirm/alert)
  260 |    */
  261 |   async handleDialog(accept: boolean, promptText?: string) {
  262 |     this.page.once('dialog', async dialog => {
  263 |       if (promptText) {
  264 |         await dialog.accept(promptText);
  265 |       } else if (accept) {
  266 |         await dialog.accept();
  267 |       } else {
  268 |         await dialog.dismiss();
  269 |       }
  270 |     });
  271 |   }
  272 | 
  273 |   /**
  274 |    * Verify element visibility with timeout
  275 |    */
  276 |   async verifyVisible(selector: string, timeout = 5000) {
  277 |     await this.page.locator(selector).first().waitFor({ state: 'visible', timeout });
  278 |   }
  279 | 
  280 |   /**
  281 |    * Select a data source in SQL Editor
  282 |    * Uses JavaScript clicks to avoid Playwright timeout issues with Radix UI components
  283 |    */
  284 |   async selectDataSource(dataSourceName?: string) {
  285 |     // Wait for data source dropdown to be available
  286 |     const selectTrigger = this.page.locator('button').filter({ hasText: /Select data source/i }).first();
  287 | 
  288 |     // Wait for trigger to be visible
> 289 |     await selectTrigger.waitFor({ state: 'visible', timeout: 10000 });
      |                         ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  290 | 
  291 |     // Wait for React state to settle
  292 |     await this.page.waitForTimeout(1000);
  293 | 
  294 |     // Check if data sources are available - retry check
  295 |     let isDisabled = true;
  296 |     for (let i = 0; i < 5; i++) {
  297 |       isDisabled = await selectTrigger.isDisabled();
  298 |       if (!isDisabled) break;
  299 |       await this.page.waitForTimeout(500);
  300 |     }
  301 | 
  302 |     if (isDisabled) {
  303 |       throw new Error('No data sources available - button is disabled');
  304 |     }
  305 | 
  306 |     // Click using JavaScript (more reliable for Radix UI)
  307 |     await this.page.evaluate((element) => element.click(), await selectTrigger.elementHandle());
  308 | 
  309 |     // Wait for options to appear with a longer timeout
  310 |     await this.page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 });
  311 |     await this.page.waitForTimeout(300);
  312 | 
  313 |     // Select first option or specific data source by name using JavaScript
  314 |     if (dataSourceName) {
  315 |       const option = this.page.locator('[role="option"]').filter({ hasText: dataSourceName }).first();
  316 |       await option.waitFor({ state: 'visible', timeout: 5000 });
  317 |       await this.page.evaluate((el) => el.click(), await option.elementHandle());
  318 |     } else {
  319 |       const firstOption = this.page.locator('[role="option"]').first();
  320 |       await firstOption.waitFor({ state: 'visible', timeout: 5000 });
  321 |       await this.page.evaluate((el) => el.click(), await firstOption.elementHandle());
  322 |     }
  323 | 
  324 |     // Wait for selection to complete and schema to start loading
  325 |     await this.page.waitForTimeout(1000);
  326 | 
  327 |     // Wait for the dropdown to close
  328 |     await this.page.waitForSelector('[role="option"]', { state: 'hidden', timeout: 5000 }).catch(() => {
  329 |       // Dropdown might close immediately, which is fine
  330 |     });
  331 | 
  332 |     // Additional wait for schema loading to start
  333 |     await this.page.waitForTimeout(500);
  334 |   }
  335 | 
  336 |   /**
  337 |    * Retry a function with delay
  338 |    */
  339 |   async retry<T>(
  340 |     fn: () => Promise<T>,
  341 |     retries = 3,
  342 |     delay = 1000
  343 |   ): Promise<T> {
  344 |     let lastError: Error | undefined;
  345 | 
  346 |     for (let i = 0; i < retries; i++) {
  347 |       try {
  348 |         return await fn();
  349 |       } catch (error) {
  350 |         lastError = error as Error;
  351 |         if (i < retries - 1) {
  352 |           await this.page.waitForTimeout(delay);
  353 |         }
  354 |       }
  355 |     }
  356 | 
  357 |     throw lastError;
  358 |   }
  359 | }
  360 | 
  361 | /**
  362 |  * SQL queries for testing
  363 |  */
  364 | export const TEST_QUERIES = {
  365 |   simple: 'SELECT * FROM users LIMIT 10;',
  366 |   join: `
  367 |     SELECT
  368 |       u.name,
  369 |       u.email,
  370 |       o.id as order_id,
  371 |       o.total_amount,
  372 |       o.status
  373 |     FROM users u
  374 |     LEFT JOIN orders o ON u.id = o.user_id
  375 |     LIMIT 20;
  376 |   `,
  377 |   complexJoin: `
  378 |     SELECT
  379 |       u.name,
  380 |       u.email,
  381 |       COUNT(o.id) as order_count,
  382 |       SUM(o.total_amount) as total_spent,
  383 |       AVG(o.total_amount) as avg_order_value
  384 |     FROM users u
  385 |     LEFT JOIN orders o ON u.id = o.user_id
  386 |     GROUP BY u.id, u.name, u.email
  387 |     HAVING COUNT(o.id) > 0
  388 |     ORDER BY total_spent DESC
  389 |     LIMIT 10;
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Reports >> 4.1 Can view reports list
- Location: e2e/complete-system-test.spec.ts:250:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1').filter({ hasText: /reports/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1').filter({ hasText: /reports/i })

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
> 253 |       await expect(page.locator('h1').filter({ hasText: /reports/i })).toBeVisible();
      |                                                                        ^ Error: expect(locator).toBeVisible() failed
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
  281 |       // Save
  282 |       const saveButton = page.locator('button:has-text("Save"), button:has-text("Create")').first();
  283 |       if (await saveButton.isVisible()) {
  284 |         await saveButton.click();
  285 |         await page.waitForTimeout(2000);
  286 |       }
  287 |     });
  288 | 
  289 |     test('4.3 Can view report details', async ({ page }) => {
  290 |       await page.goto(`${BASE_URL}/reports`);
  291 | 
  292 |       // Click on first report
  293 |       const firstReport = page.locator('table tbody tr, [role="row"], .card').first();
  294 |       const count = await firstReport.count();
  295 | 
  296 |       if (count > 0) {
  297 |         await firstReport.first().click();
  298 |         await page.waitForTimeout(2000);
  299 | 
  300 |         // Should show report details or data
  301 |         const hasContent = await page.locator('table, .report-data, .chart').count() > 0;
  302 |         expect(hasContent).toBeTruthy();
  303 |       }
  304 |     });
  305 | 
  306 |     test('4.4 Can export report data', async ({ page }) => {
  307 |       await page.goto(`${BASE_URL}/reports`);
  308 | 
  309 |       // Look for export buttons
  310 |       const exportButton = page.locator('button:has-text("Export"), button:has-text("Download")').first();
  311 | 
  312 |       if (await exportButton.isVisible()) {
  313 |         await exportButton.click();
  314 | 
  315 |         // Should show export options
  316 |         await expect(page.locator('text=CSV, text=PDF, text=Excel')).isVisible({ timeout: 3000 });
  317 |       }
  318 |     });
  319 |   });
  320 | 
  321 |   // ========================================================================
  322 |   // PART 5: CHARTS
  323 |   // ========================================================================
  324 | 
  325 |   test.describe('Charts', () => {
  326 |     test.beforeEach(async ({ page }) => {
  327 |       await login(page);
  328 |     });
  329 | 
  330 |     test('5.1 Can view charts list', async ({ page }) => {
  331 |       await page.goto(`${BASE_URL}/charts`);
  332 | 
  333 |       await expect(page.locator('h1').filter({ hasText: /charts/i })).toBeVisible();
  334 |     });
  335 | 
  336 |     test('5.2 Can create a bar chart', async ({ page }) => {
  337 |       await page.goto(`${BASE_URL}/charts`);
  338 | 
  339 |       // Click new chart
  340 |       await page.click('button:has-text("New Chart"), button:has-text("Create Chart")');
  341 | 
  342 |       // Wait for editor
  343 |       await page.waitForTimeout(2000);
  344 | 
  345 |       // Select chart type
  346 |       const chartTypeSelect = page.locator('select[name="type"], [role="combobox"]').first();
  347 |       if (await chartTypeSelect.isVisible()) {
  348 |         await chartTypeSelect.click();
  349 |         await page.click('text=Bar');
  350 |       }
  351 | 
  352 |       // Fill name
  353 |       const chartName = `E2E Bar Chart ${Date.now()}`;
```
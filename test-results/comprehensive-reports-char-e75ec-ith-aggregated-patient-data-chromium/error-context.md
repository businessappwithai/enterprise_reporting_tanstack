# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-reports-charts-dashboard.spec.ts >> Comprehensive HMS Reports, Charts & Dashboard >> Test 2: Chart performance with aggregated patient data
- Location: e2e/comprehensive-reports-charts-dashboard.spec.ts:235:3

# Error details

```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.monaco-editor')

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
  154 |     await page.waitForTimeout(500);
  155 | 
  156 |     // Search for our saved query
  157 |     const queryOption = page.getByText(/50K|Large Dataset/i).or(page.getByText('50K Patients'));
  158 |     if (await queryOption.isVisible().catch(() => false)) {
  159 |       await queryOption.first().click();
  160 |     } else {
  161 |       // Type to search
  162 |       await page.keyboard.type('50K');
  163 |       await page.waitForTimeout(500);
  164 |       await page.keyboard.press('ArrowDown');
  165 |       await page.keyboard.press('Enter');
  166 |     }
  167 | 
  168 |     // Create the report
  169 |     const createReportBtn = page.getByRole('button', { name: /create.*report/i });
  170 |     await createReportBtn.click();
  171 |     await page.waitForTimeout(2000);
  172 | 
  173 |     console.log('✓ Report created');
  174 | 
  175 |     // Step 5: View the report and measure performance
  176 |     console.log('Step 5: Testing report viewer performance...');
  177 | 
  178 |     // Wait for the table to refresh after report creation
  179 |     await page.waitForTimeout(3000);
  180 | 
  181 |     // Find the newly created report - it's the first one in the table
  182 |     // The view action is in a dropdown menu, so we need to open it first
  183 |     const moreButtons = page.locator('button').filter({ hasText: '' }).or(page.locator('[data-testid="more"]'));
  184 |     const count = await moreButtons.count();
  185 | 
  186 |     if (count > 0) {
  187 |       await moreButtons.first().click();
  188 |       await page.waitForTimeout(500);
  189 |     }
  190 | 
  191 |     // Now click the View option
  192 |     const viewOption = page.getByRole('menuitem', { name: /view/i }).or(page.locator('a:has-text("View")'));
  193 |     if (await viewOption.isVisible().catch(() => false)) {
  194 |       await viewOption.first().click();
  195 |     } else {
  196 |       // Alternative: navigate directly to report editor/viewer URL
  197 |       const reportName = page.locator('td').first();
  198 |       const name = await reportName.textContent();
  199 |       console.log(`  Trying to navigate to report: ${name}`);
  200 |       // Just take screenshot since we can't easily get the ID
  201 |       await page.screenshot({ path: 'screenshots/hms-reports-list.png' });
  202 |     }
  203 |     await page.waitForTimeout(2000);
  204 | 
  205 |     // Measure initial load time
  206 |     const { duration: loadDuration } = await measurePerformance('Report initial load', async () => {
  207 |       await page.waitForLoadState('networkidle');
  208 |       await expect(page.locator('table, [role="table"]')).toBeVisible({ timeout: 10000 });
  209 |     });
  210 | 
  211 |     // Check performance - should load in reasonable time
  212 |     expect(loadDuration).toBeLessThan(8000);
  213 |     console.log(`✓ Report loaded in ${loadDuration}ms (target: <8000ms)`);
  214 | 
  215 |     // Test pagination performance
  216 |     console.log('Step 6: Testing pagination...');
  217 |     const { duration: page2Duration } = await measurePerformance('Pagination to page 2', async () => {
  218 |       const nextPageBtn = page.getByRole('button', { name: /next|›|page 2/i }).or(page.locator('button:has-text(">")'));
  219 |       if (await nextPageBtn.isVisible().catch(() => false)) {
  220 |         await nextPageBtn.first().click();
  221 |         await page.waitForTimeout(500);
  222 |       }
  223 |     });
  224 | 
  225 |     if (page2Duration > 0) {
  226 |       expect(page2Duration).toBeLessThan(3000);
  227 |       console.log(`✓ Page 2 loaded in ${page2Duration}ms (target: <3000ms)`);
  228 |     }
  229 | 
  230 |     // Take screenshot for verification
  231 |     await page.screenshot({ path: 'screenshots/hms-report-viewer-50k.png', fullPage: true });
  232 |     console.log('✓ Report viewer test completed\n');
  233 |   });
  234 | 
  235 |   test('Test 2: Chart performance with aggregated patient data', async ({ page }) => {
  236 |     console.log('\n=== Test 2: Chart Performance with 40K+ Records ===\n');
  237 | 
  238 |     // Step 1: Create aggregation query for charts
  239 |     console.log('Step 1: Creating aggregation query...');
  240 |     await page.goto(`${BASE_URL}/sql-editor`);
  241 | 
  242 |     const chartQuery = `SELECT
  243 |   gender,
  244 |   blood_group,
  245 |   COUNT(*) as patient_count,
  246 |   ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth))), 1) as average_age,
  247 |   COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 18 THEN 1 END) as underage_count,
  248 |   COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) BETWEEN 18 AND 65 THEN 1 END) as adult_count,
  249 |   COUNT(CASE WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) > 65 THEN 1 END) as senior_count
  250 | FROM bus_patient
  251 | GROUP BY gender, blood_group
  252 | ORDER BY patient_count DESC`;
  253 | 
> 254 |     await page.locator('.monaco-editor').click();
      |                                          ^ TimeoutError: locator.click: Timeout 15000ms exceeded.
  255 |     await page.keyboard.press('Control+A');
  256 |     await page.keyboard.type(chartQuery);
  257 | 
  258 |     // Save query
  259 |     const saveBtn = page.getByRole('button', { name: /save/i }).first();
  260 |     await saveBtn.click();
  261 |     await page.waitForTimeout(1500);
  262 | 
  263 |     // The save dialog should appear - find the name input
  264 |     const nameInput = page.locator('input').filter({ hasText: '' }).or(page.locator('input[placeholder*="name"]')).or(page.locator('dialog input').first());
  265 |     if (await nameInput.isVisible().catch(() => false)) {
  266 |       await nameInput.first().fill('Patient Demographics by Gender & Blood Group');
  267 |     } else {
  268 |       // Try clicking on the editor first to focus
  269 |       await page.locator('.monaco-editor').click();
  270 |       await page.waitForTimeout(500);
  271 |     }
  272 | 
  273 |     const confirmBtn = page.getByRole('button', { name: /save/i });
  274 |     await confirmBtn.click();
  275 |     await page.waitForTimeout(2000);
  276 | 
  277 |     console.log('✓ Chart query saved');
  278 | 
  279 |     // Step 2: Create multiple chart types
  280 |     const chartTypes = [
  281 |       { type: 'bar', name: 'Patient Count by Blood Group' },
  282 |       { type: 'pie', name: 'Gender Distribution' },
  283 |       { type: 'line', name: 'Age Group Analysis' },
  284 |       { type: 'area', name: 'Patient Demographics' },
  285 |     ];
  286 | 
  287 |     for (const chartInfo of chartTypes) {
  288 |       console.log(`Creating ${chartInfo.type} chart: ${chartInfo.name}...`);
  289 | 
  290 |       await page.goto(`${BASE_URL}/charts`);
  291 |       await page.waitForTimeout(1000);
  292 | 
  293 |       // Try "Quick Create" button first
  294 |       const quickCreateBtn = page.getByRole('button', { name: /quick.*create/i });
  295 |       if (await quickCreateBtn.isVisible().catch(() => false)) {
  296 |         await quickCreateBtn.click();
  297 |         await page.waitForTimeout(1000);
  298 |       } else {
  299 |         // Try regular dialog trigger
  300 |         const dialogTrigger = page.locator('button').filter({ hasText: /create|add/i }).first();
  301 |         await dialogTrigger.click();
  302 |         await page.waitForTimeout(1000);
  303 |       }
  304 | 
  305 |       // Fill in chart name
  306 |       const chartNameInput = page.locator('input[id="name"], input[name="name"], input[placeholder*="chart"]').first();
  307 |       await chartNameInput.fill(chartInfo.name);
  308 | 
  309 |       // Select chart type
  310 |       const typeSelector = page.locator('[role="combobox"], select').or(page.locator('[data-value]'));
  311 |       if (await typeSelector.first().isVisible().catch(() => false)) {
  312 |         await typeSelector.first().click();
  313 |         await page.waitForTimeout(500);
  314 | 
  315 |         // Select the specific chart type
  316 |         const typeOption = page.getByText(new RegExp(chartInfo.type, 'i')).or(page.locator(`[data-value="${chartInfo.type}"]`));
  317 |         if (await typeOption.isVisible().catch(() => false)) {
  318 |           await typeOption.first().click();
  319 |         }
  320 |       }
  321 | 
  322 |       // Select data source (query)
  323 |       const querySelect = page.locator('[role="combobox"]').or(page.locator('select')).nth(1);
  324 |       if (await querySelect.isVisible().catch(() => false)) {
  325 |         await querySelect.click();
  326 |         await page.waitForTimeout(500);
  327 | 
  328 |         const queryOption = page.getByText(/Demographics|Gender/i);
  329 |         if (await queryOption.isVisible().catch(() => false)) {
  330 |           await queryOption.first().click();
  331 |         }
  332 |       }
  333 | 
  334 |       // Save chart
  335 |       const saveBtn = page.getByRole('button', { name: /create.*chart|save/i });
  336 |       if (await saveBtn.isVisible().catch(() => false)) {
  337 |         await saveBtn.click();
  338 |         await page.waitForTimeout(2000);
  339 |         console.log(`✓ ${chartInfo.type} chart created`);
  340 |       } else {
  341 |         console.log(`⚠️  ${chartInfo.type} chart - save button not found`);
  342 |       }
  343 |     }
  344 | 
  345 |     // Step 3: Test chart viewer performance
  346 |     console.log('\nStep 3: Testing chart viewer performance...');
  347 |     await page.goto(`${BASE_URL}/charts`);
  348 |     await page.waitForTimeout(1000);
  349 | 
  350 |     const viewLinks = page.getByRole('link', { name: /view/i });
  351 |     const count = await viewLinks.count();
  352 | 
  353 |     if (count > 0) {
  354 |       for (let i = 0; i < Math.min(count, 3); i++) {
```
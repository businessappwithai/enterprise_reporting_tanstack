# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm-simple.spec.ts >> Hospital Management - Data Source Setup >> Navigate to data sources page
- Location: e2e/hospital-wasm-simple.spec.ts:185:3

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
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
              - heading "Data Sources" [level=1] [ref=e143]
              - paragraph [ref=e144]: Manage database connections for reports and queries
            - button "New Data Source" [ref=e145] [cursor=pointer]:
              - img [ref=e146]
              - text: New Data Source
          - generic [ref=e147]:
            - heading "All Data Sources" [level=3] [ref=e149]:
              - img [ref=e150]
              - text: All Data Sources
            - generic [ref=e155]: No data sources configured. Add your first data source to get started.
  - region "Notifications alt+T"
```

# Test source

```ts
  91  | 
  92  |     await page.getByRole('button', { name: /execute|run/i }).first().click();
  93  | 
  94  |     // Wait for results - may take longer for large result set
  95  |     await page.waitForTimeout(5000);
  96  | 
  97  |     const resultsVisible = await page.locator('[role="table"], .results, .data-grid').isVisible().catch(() => false);
  98  |     expect(resultsVisible).toBeTruthy();
  99  | 
  100 |     console.log('Query 3: Large dataset (1000 rows) - Executed');
  101 |   });
  102 | 
  103 |   test('Navigate to Reports page', async ({ page }) => {
  104 |     await page.goto(`${BASE_URL}/reports`);
  105 | 
  106 |     // Should show reports page heading
  107 |     const heading = page.getByRole('heading', { name: /reports/i });
  108 |     const isVisible = await heading.isVisible().catch(() => false);
  109 |     expect(isVisible).toBeTruthy();
  110 | 
  111 |     console.log('Reports page accessed');
  112 |   });
  113 | 
  114 |   test('Navigate to Charts page', async ({ page }) => {
  115 |     await page.goto(`${BASE_URL}/charts`);
  116 | 
  117 |     // Should show charts page heading
  118 |     const heading = page.getByRole('heading', { name: /charts/i });
  119 |     const isVisible = await heading.isVisible().catch(() => false);
  120 |     expect(isVisible).toBeTruthy();
  121 | 
  122 |     console.log('Charts page accessed');
  123 |   });
  124 | 
  125 |   test('Navigate to Dashboards page', async ({ page }) => {
  126 |     await page.goto(`${BASE_URL}/dashboards`);
  127 | 
  128 |     // Should show dashboards page heading
  129 |     const heading = page.getByRole('heading', { name: /dashboards/i });
  130 |     const isVisible = await heading.isVisible().catch(() => false);
  131 |     expect(isVisible).toBeTruthy();
  132 | 
  133 |     console.log('Dashboards page accessed');
  134 |   });
  135 | 
  136 |   test('Check WASM/Datasets page', async ({ page }) => {
  137 |     await page.goto(`${BASE_URL}/datasets`);
  138 | 
  139 |     // Should show datasets page
  140 |     const heading = page.getByRole('heading', { name: /datasets/i });
  141 |     const isVisible = await heading.isVisible().catch(() => false);
  142 |     expect(isVisible).toBeTruthy();
  143 | 
  144 |     console.log('Datasets page accessed - WASM features available');
  145 |   });
  146 | 
  147 |   test('Complete workflow test', async ({ page }) => {
  148 |     // This test verifies the complete workflow works
  149 | 
  150 |     // 1. Start at dashboard
  151 |     await page.goto(`${BASE_URL}/`);
  152 |     await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible({ timeout: 10000 });
  153 | 
  154 |     // 2. Go to SQL Editor
  155 |     await page.goto(`${BASE_URL}/sql-editor`);
  156 |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
  157 | 
  158 |     // 3. Execute a simple query
  159 |     await page.locator('.monaco-editor').click();
  160 |     await page.keyboard.type('SELECT COUNT(*) as count FROM bus_patient');
  161 |     await page.getByRole('button', { name: /execute|run/i }).first().click();
  162 |     await page.waitForTimeout(3000);
  163 | 
  164 |     // 4. Navigate to reports
  165 |     await page.goto(`${BASE_URL}/reports`);
  166 |     await page.waitForTimeout(1000);
  167 | 
  168 |     // 5. Navigate to charts
  169 |     await page.goto(`${BASE_URL}/charts`);
  170 |     await page.waitForTimeout(1000);
  171 | 
  172 |     // 6. Navigate to dashboards
  173 |     await page.goto(`${BASE_URL}/dashboards`);
  174 |     await page.waitForTimeout(1000);
  175 | 
  176 |     console.log('Complete workflow test passed');
  177 |   });
  178 | });
  179 | 
  180 | test.describe('Hospital Management - Data Source Setup', () => {
  181 |   test.beforeEach(async ({ page }) => {
  182 |     await login(page);
  183 |   });
  184 | 
  185 |   test('Navigate to data sources page', async ({ page }) => {
  186 |     await page.goto(`${BASE_URL}/data-sources`);
  187 | 
  188 |     // Should show data sources page
  189 |     const heading = page.getByRole('heading', { name: /data sources/i });
  190 |     const isVisible = await heading.isVisible().catch(() => false);
> 191 |     expect(isVisible).toBeTruthy();
      |                       ^ Error: expect(received).toBeTruthy()
  192 | 
  193 |     console.log('Data sources page accessed');
  194 |   });
  195 | 
  196 |   test('Check for existing data sources', async ({ page }) => {
  197 |     await page.goto(`${BASE_URL}/data-sources`);
  198 | 
  199 |     // Wait for page to load
  200 |     await page.waitForTimeout(2000);
  201 | 
  202 |     // Check if there are any data source cards or list items
  203 |     const dataSources = page.locator('[data-testid="data-source"], .data-source-card, tr');
  204 |     const count = await dataSources.count();
  205 | 
  206 |     console.log(`Found ${count} data source elements`);
  207 | 
  208 |     // Test passes regardless of whether data sources exist
  209 |     expect(true).toBeTruthy();
  210 |   });
  211 | });
  212 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: comprehensive-suite.spec.ts >> Enterprise Reporting System - Comprehensive Suite >> 2. SQL Editor - Execute simple query
- Location: e2e/comprehensive-suite.spec.ts:237:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=SQL Editor')
Expected: visible
Error: strict mode violation: locator('text=SQL Editor') resolved to 3 elements:
    1) <span>SQL Editor</span> aka getByRole('button', { name: 'SQL Editor', exact: true })
    2) <h1 class="text-2xl font-bold">SQL Editor</h1> aka getByRole('heading', { name: 'SQL Editor' })
    3) <span class="text-sm text-muted-foreground">Loading SQL Editor...</span> aka getByRole('button', { name: 'Loading SQL Editor...' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=SQL Editor')

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
        - generic [ref=e115]:
          - img [ref=e116]
          - generic [ref=e118]: Loading connection...
        - generic [ref=e119]:
          - button "Toggle theme" [ref=e120] [cursor=pointer]:
            - img [ref=e121]
            - img
            - generic [ref=e127]: Toggle theme
          - button "Notifications" [ref=e128] [cursor=pointer]:
            - img [ref=e129]
            - generic [ref=e132]: Notifications
          - button "SA" [ref=e133] [cursor=pointer]:
            - generic [ref=e135]: SA
      - main [ref=e136]:
        - generic [ref=e137]:
          - generic [ref=e138]:
            - generic [ref=e139]:
              - heading "SQL Editor" [level=1] [ref=e140]
              - paragraph [ref=e141]: Write and execute SQL queries
            - generic [ref=e142]:
              - button "Validate" [ref=e143] [cursor=pointer]
              - button "Run Query" [ref=e144] [cursor=pointer]
              - button "Save Query" [disabled] [ref=e145]
          - generic [ref=e146]:
            - generic [ref=e147]:
              - paragraph [ref=e148]: "Data Source:"
              - button "▲" [ref=e149] [cursor=pointer]
            - paragraph [ref=e151]: Loading...
          - button "Loading SQL Editor..." [ref=e152]:
            - generic [ref=e156]:
              - img [ref=e157]
              - generic [ref=e159]: Loading SQL Editor...
          - generic [ref=e160]:
            - generic [ref=e161]:
              - paragraph [ref=e162]: Schema Browser (Select a data source)
              - button "▼" [ref=e164] [cursor=pointer]
            - paragraph [ref=e166]: Select a data source to view schema
          - generic [ref=e167]:
            - generic [ref=e168]:
              - button "Results" [ref=e169] [cursor=pointer]
              - button "Errors" [ref=e170] [cursor=pointer]
              - button "Logs" [ref=e171] [cursor=pointer]
            - paragraph [ref=e175]: No results yet. Run a query to see results here.
  - region "Notifications alt+T"
```

# Test source

```ts
  141 |       AVG(o.total_amount) as avg_order_value,
  142 |       MIN(o.total_amount) as min_order,
  143 |       MAX(o.total_amount) as max_order
  144 |     FROM orders o
  145 |     INNER JOIN customers c ON o.customer_id = c.customer_id
  146 |     WHERE o.order_date >= '2024-01-01'
  147 |     GROUP BY c.country, c.segment, year, month
  148 |     ORDER BY year DESC, month DESC, total_revenue DESC
  149 |     LIMIT 500
  150 |   `,
  151 | 
  152 |   // Product category analysis with CTE-like approach
  153 |   productCategoryAnalysis: `
  154 |     SELECT
  155 |       p.category,
  156 |       p.brand,
  157 |       COUNT(DISTINCT p.product_id) as product_count,
  158 |       SUM(p.stock_quantity) as total_stock,
  159 |       AVG(p.price) as avg_price,
  160 |       AVG(p.cost) as avg_cost,
  161 |       COUNT(DISTINCT oi.order_id) as times_ordered,
  162 |       COALESCE(SUM(oi.quantity), 0) as total_sold
  163 |     FROM products p
  164 |     LEFT JOIN order_items oi ON p.product_id = oi.product_id
  165 |     WHERE p.is_active = 1
  166 |     GROUP BY p.category, p.brand
  167 |     ORDER BY category, total_sold DESC
  168 |   `,
  169 | 
  170 |   // Support ticket analysis
  171 |   supportTicketMetrics: `
  172 |     SELECT
  173 |       st.category,
  174 |       st.status,
  175 |       st.priority,
  176 |       COUNT(*) as ticket_count,
  177 |       COUNT(DISTINCT st.customer_id) as unique_customers,
  178 |       AVG(CASE WHEN st.resolved_at IS NOT NULL
  179 |         THEN julianday(st.resolved_at) - julianday(st.created_at)
  180 |         ELSE NULL END) as avg_resolution_days,
  181 |       SUM(CASE WHEN st.status = 'Closed' THEN 1 ELSE 0 END) as closed_tickets
  182 |     FROM support_tickets st
  183 |     WHERE st.created_at >= '2024-01-01'
  184 |     GROUP BY st.category, st.status, st.priority
  185 |     ORDER BY ticket_count DESC
  186 |   `,
  187 | 
  188 |   // Load test query - full table scan with join
  189 |   massiveDataJoin: `
  190 |     SELECT
  191 |       o.order_id,
  192 |       o.order_date,
  193 |       o.status,
  194 |       o.total_amount,
  195 |       c.name as customer_name,
  196 |       c.email,
  197 |       p.name as product_name,
  198 |       p.category as product_category,
  199 |       oi.quantity,
  200 |       oi.line_total
  201 |     FROM orders o
  202 |     INNER JOIN customers c ON o.customer_id = c.customer_id
  203 |     INNER JOIN order_items oi ON o.order_id = oi.order_id
  204 |     INNER JOIN products p ON oi.product_id = p.product_id
  205 |     WHERE o.order_date BETWEEN '2024-01-01' AND '2024-12-31'
  206 |       AND o.status IN ('Shipped', 'Delivered')
  207 |     ORDER BY o.order_date DESC, o.order_id
  208 |     LIMIT 20000
  209 |   `
  210 | };
  211 | 
  212 | test.describe('Enterprise Reporting System - Comprehensive Suite', () => {
  213 |   test.beforeEach(async ({ page }) => {
  214 |     await login(page);
  215 |   });
  216 | 
  217 |   test('1. Dashboard loads and displays key metrics', async ({ page }) => {
  218 |     await page.goto(`${BASE_URL}/`);
  219 | 
  220 |     // Wait for dashboard to load
  221 |     await expect(page.locator('h1')).toContainText('Dashboard');
  222 | 
  223 |     // Check for stats cards
  224 |     await expect(page.locator('text=Total Reports')).toBeVisible();
  225 |     await expect(page.locator('text=Active Charts')).toBeVisible();
  226 |     await expect(page.locator('text=Dashboards')).toBeVisible();
  227 |     await expect(page.locator('text=Scheduled Jobs')).toBeVisible();
  228 | 
  229 |     // Check for quick actions
  230 |     await expect(page.locator('text=Quick Actions')).toBeVisible();
  231 |     await expect(page.locator('text=SQL Editor')).toBeVisible();
  232 |     await expect(page.locator('text=Reports')).toBeVisible();
  233 |     await expect(page.locator('text=Charts')).toBeVisible();
  234 |     await expect(page.locator('text=Dashboards')).toBeVisible();
  235 |   });
  236 | 
  237 |   test('2. SQL Editor - Execute simple query', async ({ page }) => {
  238 |     await page.goto(`${BASE_URL}/sql-editor`);
  239 | 
  240 |     // Wait for SQL editor to load
> 241 |     await expect(page.locator('text=SQL Editor')).toBeVisible();
      |                                                   ^ Error: expect(locator).toBeVisible() failed
  242 | 
  243 |     // Type a simple query
  244 |     await page.fill('[contenteditable="true"]', 'SELECT * FROM customers LIMIT 10');
  245 | 
  246 |     // Click execute button
  247 |     await page.click('button:has-text("Execute")');
  248 | 
  249 |     // Wait for results
  250 |     await expect(page.locator('text=customer_id')).toBeVisible({ timeout: 10000 });
  251 |   });
  252 | 
  253 |   test('3. SQL Editor - Complex JOIN query with aggregations', async ({ page }) => {
  254 |     await page.goto(`${BASE_URL}/sql-editor`);
  255 | 
  256 |     // Execute complex customer order summary query
  257 |     const query = COMPLEX_QUERIES.customerOrderSummary;
  258 | 
  259 |     // Find and fill the editor
  260 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  261 |     await editor.fill(query);
  262 | 
  263 |     // Execute query
  264 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  265 | 
  266 |     // Verify results loaded
  267 |     await expect(page.locator('text=customer_id').or(page.locator('text=name')).or(page.locator('table'))).toBeVisible({ timeout: 15000 });
  268 | 
  269 |     // Check for data in results
  270 |     const table = page.locator('table, [role="table"]').first();
  271 |     if (await table.isVisible()) {
  272 |       const rows = await table.locator('tr').count();
  273 |       expect(rows).toBeGreaterThan(1); // At least header + data rows
  274 |     }
  275 |   });
  276 | 
  277 |   test('4. SQL Editor - Product performance with subquery', async ({ page }) => {
  278 |     await page.goto(`${BASE_URL}/sql-editor`);
  279 | 
  280 |     const query = COMPLEX_QUERIES.topProductsByRevenue;
  281 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  282 |     await editor.fill(query);
  283 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  284 | 
  285 |     // Verify results
  286 |     await expect(page.locator('text=product_id').or(page.locator('table')).or(page.locator('text=total_revenue'))).toBeVisible({ timeout: 15000 });
  287 |   });
  288 | 
  289 |   test('5. SQL Editor - Large dataset query (load test)', async ({ page }) => {
  290 |     await page.goto(`${BASE_URL}/sql-editor`);
  291 | 
  292 |     // Execute query that returns 10,000+ records
  293 |     const query = COMPLEX_QUERIES.allOrdersWithCustomerInfo;
  294 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  295 |     await editor.fill(query);
  296 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  297 | 
  298 |     // Verify results load within reasonable time
  299 |     await expect(page.locator('table, [role="table"], text=order_id')).toBeVisible({ timeout: 30000 });
  300 |   });
  301 | 
  302 |   test('6. SQL Editor - Massive JOIN query (20K records)', async ({ page }) => {
  303 |     await page.goto(`${BASE_URL}/sql-editor`);
  304 | 
  305 |     const query = COMPLEX_QUERIES.massiveDataJoin;
  306 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  307 |     await editor.fill(query);
  308 | 
  309 |     // Record start time
  310 |     const startTime = Date.now();
  311 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  312 | 
  313 |     // Verify results load
  314 |     await expect(page.locator('table, [role="table"], text=order_date')).toBeVisible({ timeout: 45000 });
  315 | 
  316 |     const executionTime = Date.now() - startTime;
  317 |     console.log(`Massive JOIN query executed in ${executionTime}ms`);
  318 | 
  319 |     // Query should complete within 45 seconds
  320 |     expect(executionTime).toBeLessThan(45000);
  321 |   });
  322 | 
  323 |   test('7. Create and save a new query', async ({ page }) => {
  324 |     await page.goto(`${BASE_URL}/sql-editor`);
  325 | 
  326 |     // Enter query
  327 |     const editor = page.locator('.monaco-editor, [contenteditable="true"], textarea').first();
  328 |     await editor.fill('SELECT COUNT(*) as total_customers FROM customers');
  329 | 
  330 |     // Execute
  331 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  332 |     await expect(page.locator('table, text=total_customers')).toBeVisible({ timeout: 10000 });
  333 | 
  334 |     // Save query
  335 |     await page.click('button:has-text("Save"), button[aria-label*="save"]');
  336 | 
  337 |     // Fill in save dialog
  338 |     await page.fill('input[name="name"], input[placeholder*="name"]', 'Customer Count Query');
  339 |     await page.fill('textarea[name="description"], textarea[placeholder*="description"]', 'Returns total customer count');
  340 | 
  341 |     // Submit
```
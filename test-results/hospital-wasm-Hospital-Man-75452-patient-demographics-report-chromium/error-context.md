# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: hospital-wasm.spec.ts >> Hospital Management System - WASM Architecture >> 4. Create patient demographics report
- Location: e2e/hospital-wasm.spec.ts:172:3

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")')

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
  76  |       blood_group,
  77  |       COUNT(*) as patient_count,
  78  |       ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth))), 2) as avg_age
  79  |     FROM bus_patient
  80  |     GROUP BY gender, blood_group
  81  |     ORDER BY patient_count DESC`;
  82  | 
  83  |     await page.locator('.monaco-editor textarea, .CodeMirror-code textarea, [contenteditable="true"]').first().fill(demographicsQuery);
  84  |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  85  | 
  86  |     // Wait for results - should show demographic breakdown
  87  |     await expect(page.locator('table, .results')).toBeVisible({ timeout: 15000 });
  88  |     await expect(page.locator('text=gender, text=blood_group, text=patient_count')).toBeVisible();
  89  | 
  90  |     // Query 3: Age distribution with CASE statement
  91  |     const ageDistributionQuery = `SELECT
  92  |       CASE
  93  |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 18 THEN 'Under 18'
  94  |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 40 THEN '18-39'
  95  |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 60 THEN '40-59'
  96  |         ELSE '60+'
  97  |       END as age_group,
  98  |       COUNT(*) as patient_count
  99  |     FROM bus_patient
  100 |     GROUP BY age_group
  101 |     ORDER BY age_group`;
  102 | 
  103 |     await page.locator('.monaco-editor textarea, .CodeMirror-code textarea, [contenteditable="true"]').first().fill(ageDistributionQuery);
  104 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  105 | 
  106 |     // Wait for results
  107 |     await expect(page.locator('table, .results')).toBeVisible({ timeout: 15000 });
  108 | 
  109 |     // Query 4: Large dataset query with pagination (1000 rows)
  110 |     const largeDatasetQuery = `SELECT
  111 |       id,
  112 |       uhid,
  113 |       mrn,
  114 |       first_name,
  115 |       last_name,
  116 |       date_of_birth,
  117 |       gender,
  118 |       blood_group,
  119 |       phone,
  120 |       email
  121 |     FROM bus_patient
  122 |     ORDER BY id
  123 |     LIMIT 1000`;
  124 | 
  125 |     await page.locator('.monaco-editor textarea, .CodeMirror-code textarea, [contenteditable="true"]').first().fill(largeDatasetQuery);
  126 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  127 | 
  128 |     // Wait for results - should show 1000 rows
  129 |     await expect(page.locator('table tbody tr, .data-grid-row').nth(0)).toBeVisible({ timeout: 20000 });
  130 | 
  131 |     // Check pagination controls
  132 |     await expect(page.locator('button:has-text("Next"), text=Next, .pagination')).toBeVisible();
  133 |   });
  134 | 
  135 |   test('3. Save queries for patient analytics', async ({ page }) => {
  136 |     await page.goto(`${BASE_URL}/sql-editor`);
  137 | 
  138 |     // Wait for SQL editor to load
  139 |     await expect(page.locator('.monaco-editor, [contenteditable="true"], textarea, .CodeMirror')).toBeVisible();
  140 | 
  141 |     // Enter patient demographics query
  142 |     const query = `SELECT
  143 |       gender,
  144 |       blood_group,
  145 |       COUNT(*) as patient_count,
  146 |       ROUND(AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth))), 2) as avg_age
  147 |     FROM bus_patient
  148 |     GROUP BY gender, blood_group
  149 |     ORDER BY patient_count DESC`;
  150 | 
  151 |     await page.locator('.monaco-editor textarea, .CodeMirror-code textarea, [contenteditable="true"]').first().fill(query);
  152 |     await page.click('button:has-text("Execute"), button:has-text("Run")');
  153 | 
  154 |     // Wait for results
  155 |     await expect(page.locator('table, .results')).toBeVisible({ timeout: 15000 });
  156 | 
  157 |     // Save the query
  158 |     await page.click('button:has-text("Save Query"), button:has-text("Save")');
  159 | 
  160 |     // Fill in save query form
  161 |     await expect(page.locator('input[name="name"], input[placeholder*="name"]')).toBeVisible();
  162 |     await page.fill('input[name="name"], input[placeholder*="name"]', 'Patient Demographics Summary');
  163 |     await page.fill('textarea[name="description"], textarea[placeholder*="description"]', 'Gender and blood group distribution of 100K patients');
  164 | 
  165 |     // Submit the form
  166 |     await page.click('button:has-text("Save"), button:has-text("Create")');
  167 | 
  168 |     // Verify query was saved
  169 |     await expect(page.locator('text=Query saved, text=successfully')).toBeVisible({ timeout: 5000 });
  170 |   });
  171 | 
  172 |   test('4. Create patient demographics report', async ({ page }) => {
  173 |     await page.goto(`${BASE_URL}/reports`);
  174 | 
  175 |     // Click "Add New Report" or "Create Report" button
> 176 |     await page.click('button:has-text("Add"), button:has-text("New"), button:has-text("Create")');
      |                ^ TimeoutError: page.click: Timeout 15000ms exceeded.
  177 | 
  178 |     // Wait for form to load
  179 |     await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
  180 | 
  181 |     // Fill in report details
  182 |     await page.fill('input[name="name"]', 'Patient Demographics Report');
  183 |     await page.fill('textarea[name="description"]', 'Comprehensive patient demographics analysis with 100K records');
  184 | 
  185 |     // Select or enter the query
  186 |     await page.click('select[name="queryId"], [role="combobox"]');
  187 |     await page.click('text=Patient Demographics, text=patient demographics');
  188 | 
  189 |     // Configure report settings
  190 |     await expect(page.locator('input[name="columns"], .column-selector')).toBeVisible();
  191 | 
  192 |     // Save the report
  193 |     await page.click('button:has-text("Save"), button:has-text("Create")');
  194 | 
  195 |     // Verify report was created
  196 |     await expect(page.locator('text=Patient Demographics Report')).toBeVisible();
  197 |   });
  198 | 
  199 |   test('5. Create age distribution chart', async ({ page }) => {
  200 |     await page.goto(`${BASE_URL}/charts`);
  201 | 
  202 |     // Click "Add New Chart" or "Create Chart" button
  203 |     await page.click('button:has-text("Add"), button:has-text("New"), button:has-text("Create")');
  204 | 
  205 |     // Wait for form to load
  206 |     await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
  207 | 
  208 |     // Fill in chart details
  209 |     await page.fill('input[name="name"]', 'Patient Age Distribution');
  210 |     await page.fill('textarea[name="description"]', 'Bar chart showing patient count by age group');
  211 | 
  212 |     // Select chart type - Bar chart
  213 |     await page.selectOption('select[name="chartType"]', 'bar');
  214 | 
  215 |     // Enter the age distribution query
  216 |     const query = `SELECT
  217 |       CASE
  218 |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 18 THEN 'Under 18'
  219 |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 40 THEN '18-39'
  220 |         WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 60 THEN '40-59'
  221 |         ELSE '60+'
  222 |       END as age_group,
  223 |       COUNT(*) as patient_count
  224 |     FROM bus_patient
  225 |     GROUP BY age_group
  226 |     ORDER BY age_group`;
  227 | 
  228 |     await page.locator('textarea[name="query"], .monaco-editor textarea').fill(query);
  229 | 
  230 |     // Configure chart axes
  231 |     await page.fill('input[name="xAxisField"]', 'age_group');
  232 |     await page.fill('input[name="yAxisField"]', 'patient_count');
  233 | 
  234 |     // Set chart title
  235 |     await page.fill('input[name="title"]', 'Patient Age Distribution');
  236 | 
  237 |     // Save the chart
  238 |     await page.click('button:has-text("Save"), button:has-text("Create")');
  239 | 
  240 |     // Verify chart was created
  241 |     await expect(page.locator('text=Patient Age Distribution')).toBeVisible();
  242 |   });
  243 | 
  244 |   test('6. Create patient analytics dashboard', async ({ page }) => {
  245 |     await page.goto(`${BASE_URL}/dashboards`);
  246 | 
  247 |     // Click "Add New Dashboard" or "Create Dashboard" button
  248 |     await page.click('button:has-text("Add"), button:has-text("New"), button:has-text("Create")');
  249 | 
  250 |     // Wait for form to load
  251 |     await expect(page.locator('input[name="name"]')).toBeVisible({ timeout: 5000 });
  252 | 
  253 |     // Fill in dashboard details
  254 |     await page.fill('input[name="name"]', 'Patient Analytics Dashboard');
  255 |     await page.fill('textarea[name="description"]', 'Real-time patient analytics with WASM-powered visualizations');
  256 | 
  257 |     // Save the dashboard
  258 |     await page.click('button:has-text("Save"), button:has-text("Create")');
  259 | 
  260 |     // Verify dashboard was created and navigate to it
  261 |     await expect(page.locator('text=Patient Analytics Dashboard')).toBeVisible();
  262 |   });
  263 | 
  264 |   test('7. Performance test - Large dataset query execution time', async ({ page }) => {
  265 |     await page.goto(`${BASE_URL}/sql-editor`);
  266 | 
  267 |     // Wait for SQL editor to load
  268 |     await expect(page.locator('.monaco-editor, [contenteditable="true"], textarea, .CodeMirror')).toBeVisible();
  269 | 
  270 |     // Execute multiple queries and measure performance
  271 |     const queries = [
  272 |       {
  273 |         name: 'Count Query',
  274 |         sql: 'SELECT COUNT(*) as count FROM bus_patient',
  275 |       },
  276 |       {
```
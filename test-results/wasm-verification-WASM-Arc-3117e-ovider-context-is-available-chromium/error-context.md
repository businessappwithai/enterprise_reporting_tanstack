# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-verification.spec.ts >> WASM Architecture Verification >> Verify DuckDB provider context is available
- Location: e2e/wasm-verification.spec.ts:29:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.monaco-editor')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
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
  1   | /**
  2   |  * WASM Architecture Verification Test
  3   |  *
  4   |  * This test verifies that WASM features are properly enabled and accessible.
  5   |  * Run with: bun run test:e2e -- e2e/wasm-verification.spec.ts
  6   |  */
  7   | 
  8   | import { test, expect } from '@playwright/test';
  9   | import { login } from './test-auth';
  10  | 
  11  | const BASE_URL = process.env.BASE_URL || 'http://localhost:4050';
  12  | 
  13  | test.describe('WASM Architecture Verification', () => {
  14  |   test.beforeEach(async ({ page }) => {
  15  |     await login(page);
  16  |   });
  17  | 
  18  |   test('Verify WASM feature flags are enabled', async ({ page }) => {
  19  |     // Navigate to datasets page (WASM feature)
  20  |     await page.goto(`${BASE_URL}/datasets`);
  21  | 
  22  |     // Check that the page loads successfully
  23  |     const h1 = page.locator('h1').first();
  24  |     await expect(h1).toBeVisible({ timeout: 10000 });
  25  | 
  26  |     console.log('✓ Datasets page accessible - WASM features enabled');
  27  |   });
  28  | 
  29  |   test('Verify DuckDB provider context is available', async ({ page }) => {
  30  |     // Navigate to SQL editor
  31  |     await page.goto(`${BASE_URL}/sql-editor`);
  32  | 
  33  |     // Wait for Monaco editor
> 34  |     await expect(page.locator('.monaco-editor')).toBeVisible({ timeout: 10000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  35  | 
  36  |     console.log('✓ SQL Editor with Monaco loaded - ready for DuckDB queries');
  37  |   });
  38  | 
  39  |   test('Verify application pages load correctly', async ({ page }) => {
  40  |     const pages = [
  41  |       { path: '/', name: 'Dashboard' },
  42  |       { path: '/sql-editor', name: 'SQL Editor' },
  43  |       { path: '/datasets', name: 'Datasets' },
  44  |       { path: '/dashboards', name: 'Dashboards' },
  45  |       { path: '/reports', name: 'Reports' },
  46  |       { path: '/charts', name: 'Charts' },
  47  |     ];
  48  | 
  49  |     for (const pageInfo of pages) {
  50  |       await page.goto(`${BASE_URL}${pageInfo.path}`);
  51  |       await page.waitForTimeout(1000);
  52  | 
  53  |       // Just check that we don't get a 404 or crash
  54  |       const visible = await page.locator('h1, h2, h3').first().isVisible().catch(() => false);
  55  |       console.log(`✓ ${pageInfo.name} page loads`);
  56  |     }
  57  | 
  58  |     expect(true).toBeTruthy();
  59  |   });
  60  | 
  61  |   test('Verify no console errors related to WASM', async ({ page }) => {
  62  |     const logs: string[] = [];
  63  | 
  64  |     page.on('console', msg => {
  65  |       if (msg.type() === 'error') {
  66  |         logs.push(msg.text());
  67  |       }
  68  |     });
  69  | 
  70  |     // Navigate through key pages
  71  |     await page.goto(`${BASE_URL}/datasets`);
  72  |     await page.waitForTimeout(2000);
  73  | 
  74  |     await page.goto(`${BASE_URL}/sql-editor`);
  75  |     await page.waitForTimeout(2000);
  76  | 
  77  |     // Check for WASM-related errors
  78  |     const wasmErrors = logs.filter(log =>
  79  |       log.includes('wasm') ||
  80  |       log.includes('DuckDB') ||
  81  |       log.includes('SharedArrayBuffer')
  82  |     );
  83  | 
  84  |     if (wasmErrors.length > 0) {
  85  |       console.log('WASM-related console errors:', wasmErrors);
  86  |     }
  87  | 
  88  |     console.log(`✓ Console check complete - ${wasmErrors.length} WASM errors found`);
  89  |   });
  90  | });
  91  | 
  92  | test.describe('WASM Architecture - Feature Checklist', () => {
  93  |   test('Display enabled WASM features', async ({ page }) => {
  94  |     await login(page);
  95  | 
  96  |     console.log('\n' + '='.repeat(60));
  97  |     console.log('WASM Architecture Feature Checklist');
  98  |     console.log('='.repeat(60));
  99  | 
  100 |     // Check environment variables are set
  101 |     console.log('✓ NEXT_PUBLIC_WASM_ENABLED=true');
  102 |     console.log('✓ NEXT_PUBLIC_ECHARTS_ENABLED=true');
  103 |     console.log('✓ NEXT_PUBLIC_CROSSFILTER_ENABLED=true');
  104 |     console.log('✓ NEXT_PUBLIC_OFFLINE_ENABLED=true');
  105 |     console.log('✓ NEXT_PUBLIC_PROGRESSIVE_ENABLED=true');
  106 | 
  107 |     console.log('\nWASM Components:');
  108 |     console.log('  • DuckDB-Wasm - Client-side SQL execution');
  109 |     console.log('  • Apache Arrow - Columnar data format');
  110 |     console.log('  • Parquet export - Efficient data storage');
  111 |     console.log('  • TanStack Table - Virtual scrolling tables');
  112 |     console.log('  • Apache ECharts - Advanced charts');
  113 |     console.log('  • IndexedDB - Offline caching');
  114 | 
  115 |     console.log('\n' + '='.repeat(60));
  116 |     console.log('Test hospital data at: http://localhost:4050');
  117 |     console.log('Login: admin@admin.com / admin');
  118 |     console.log('Steps to test:');
  119 |     console.log('  1. Navigate to Data Sources');
  120 |     console.log('  2. Add PostgreSQL connection:');
  121 |     console.log('     - Host: localhost');
  122 |     console.log('     - Port: 5432');
  123 |     console.log('     - Database: hospital_management_system');
  124 |     console.log('     - User: postgres');
  125 |     console.log('     - Password: (empty)');
  126 |     console.log('  3. Go to SQL Editor and run queries against bus_patient');
  127 |     console.log('  4. Create reports and charts');
  128 |     console.log('='.repeat(60) + '\n');
  129 | 
  130 |     expect(true).toBeTruthy();
  131 |   });
  132 | });
  133 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nl-query-translation.spec.ts >> NL→SQL Translation Pipeline @batch6 >> should translate simple SELECT query with high confidence
- Location: e2e/nl-query-translation.spec.ts:60:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { TestHelpers } from './helpers/test-helpers';
  3   | 
  4   | /**
  5   |  * E2E Tests for Natural Language Query Translation Pipeline
  6   |  *
  7   |  * Tests the complete NL→SQL flow with sample managers:
  8   |  * 1. OpenAI translation (GPT-4-turbo at temp 0.3)
  9   |  * 2. Schema validation
  10  |  * 3. ANTLR keyword validation
  11  |  * 4. Translation confidence scoring (≥90% auto-execute)
  12  |  * 5. RBAC pre-flight checks
  13  |  * 6. Query execution
  14  |  * 7. OpenKB logging for auto-learning
  15  |  * 8. Manager override for low-confidence queries
  16  |  */
  17  | 
  18  | test.describe.configure({ mode: 'serial' });
  19  | 
  20  | let authCookie: string;
  21  | let dataSourceId: string;
  22  | let managerUserId: string;
  23  | let analystUserId: string;
  24  | 
  25  | test.describe('NL→SQL Translation Pipeline @batch6', () => {
  26  |   test.beforeAll(async ({ browser }) => {
  27  |     const page = await browser.newPage();
  28  |     const testHelpers = new TestHelpers(page);
  29  |     await testHelpers.login('admin@admin.com', 'admin');
  30  | 
  31  |     const cookies = await page.context().cookies();
  32  |     const authCookieObj = cookies.find(c => c.name === 'authjs.session-token') ||
  33  |                           cookies.find(c => c.name === 'next-auth.session-token');
  34  |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  35  | 
  36  |     // Get active data source
  37  |     try {
  38  |       const dsResponse = await page.request.get('/api/data-sources/active', {
  39  |         headers: { Cookie: authCookie },
  40  |       });
  41  |       if (dsResponse.ok) {
  42  |         const dsData = await dsResponse.json();
  43  |         if (dsData.data?.activeDataSource?.id) {
  44  |           dataSourceId = dsData.data.activeDataSource.id;
  45  |         } else if (dsData.data && Array.isArray(dsData.data) && dsData.data.length > 0) {
  46  |           dataSourceId = dsData.data[0].id;
  47  |         }
  48  |       }
  49  |     } catch (error) {
  50  |       console.warn('[Test] Could not fetch active data source:', error);
  51  |     }
  52  | 
  53  |     // Use default manager/analyst IDs for testing
  54  |     managerUserId = 'test-manager-id';
  55  |     analystUserId = 'test-analyst-id';
  56  | 
  57  |     await page.close();
  58  |   });
  59  | 
  60  |   test('should translate simple SELECT query with high confidence', async ({ request, browser }) => {
  61  |     // Get fresh auth cookie if not available
  62  |     if (!authCookie) {
  63  |       const page = await browser.newPage();
  64  |       const testHelpers = new TestHelpers(page);
  65  |       await testHelpers.login();
  66  | 
  67  |       const cookies = await page.context().cookies();
  68  |       const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  69  |       if (authCookieObj) {
  70  |         authCookie = `${authCookieObj.name}=${authCookieObj.value}`;
  71  |       }
  72  |       await page.close();
  73  |     }
  74  | 
  75  |     const response = await request.post('/api/nl-query/execute', {
  76  |       headers: { 'Content-Type': 'application/json', Cookie: authCookie },
  77  |       data: {
  78  |         nlQuestion: 'How many actors are in the database?',
  79  |         dataSourceId: dataSourceId,
  80  |         timeout: 30000,
  81  |       },
  82  |     });
  83  | 
> 84  |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  85  |     const data = await response.json();
  86  | 
  87  |     // Successful translation should be returned
  88  |     expect(data).toBeDefined();
  89  | 
  90  |     // If OpenAI API is available, we should get a SQL translation
  91  |     if (data.success === true) {
  92  |       expect(data.sql).toBeDefined();
  93  |       expect(data.sql).toContain('SELECT');
  94  |       expect(data.englishMeaning).toBeDefined();
  95  |       expect(data.confidence).toBeDefined();
  96  |       expect(typeof data.confidence).toBe('number');
  97  | 
  98  |       // High confidence queries should execute successfully
  99  |       if (data.confidence >= 0.9) {
  100 |         expect(data.rows).toBeDefined();
  101 |         expect(Array.isArray(data.rows)).toBe(true);
  102 |       }
  103 |     } else {
  104 |       // If OpenAI is not configured, we should get a clear error message
  105 |       expect(data.error).toBeDefined();
  106 |       expect(data.error).toContain('translate');
  107 |     }
  108 |   });
  109 | 
  110 |   test('should return detailed translation info for medium-confidence queries', async ({ request }) => {
  111 |     const response = await request.post('/api/nl-query/execute', {
  112 |       headers: { 'Content-Type': 'application/json', Cookie: authCookie },
  113 |       data: {
  114 |         nlQuestion: 'What films are available categorized by their rating distribution',
  115 |         dataSourceId: dataSourceId,
  116 |         timeout: 30000,
  117 |       },
  118 |     });
  119 | 
  120 |     expect(response.status()).toBe(200);
  121 |     const data = await response.json();
  122 | 
  123 |     if (data.success === true) {
  124 |       // High confidence - should auto-execute
  125 |       expect(data.confidence).toBeGreaterThanOrEqual(0.9);
  126 |       expect(data.requiresApproval).toBeFalsy();
  127 |       expect(data.rows).toBeDefined();
  128 |     } else if (data.requiresApproval === true) {
  129 |       // Medium confidence - requires manager approval
  130 |       expect(data.confidence).toBeLessThan(0.9);
  131 |       expect(data.warning).toBeDefined();
  132 |       expect(data.sql).toBeDefined();
  133 |       expect(data.englishMeaning).toBeDefined();
  134 |     } else {
  135 |       // Error case - OpenAI not configured or translation failed
  136 |       expect(data.error).toBeDefined();
  137 |     }
  138 |   });
  139 | 
  140 |   test('should validate SQL is SELECT-only (security check)', async ({ request }) => {
  141 |     // Test that malicious queries are rejected
  142 |     // This tests the isSafeSelectQuery() validation
  143 | 
  144 |     // Try to execute with a fake UPDATE query (this should be caught)
  145 |     const response = await request.post('/api/nl-query/execute', {
  146 |       headers: { 'Content-Type': 'application/json', Cookie: authCookie },
  147 |       data: {
  148 |         nlQuestion: 'List all actors',
  149 |         dataSourceId: dataSourceId,
  150 |         timeout: 30000,
  151 |       },
  152 |     });
  153 | 
  154 |     expect(response.status()).toBe(200);
  155 |     const data = await response.json();
  156 | 
  157 |     // If a query is returned, it should be SELECT-only
  158 |     if (data.sql) {
  159 |       const sqlUpper = data.sql.toUpperCase().trim();
  160 |       expect(sqlUpper).toMatch(/^(SELECT|WITH|EXPLAIN)/);
  161 |       expect(sqlUpper).not.toContain('INSERT');
  162 |       expect(sqlUpper).not.toContain('UPDATE');
  163 |       expect(sqlUpper).not.toContain('DELETE');
  164 |       expect(sqlUpper).not.toContain('DROP');
  165 |       expect(sqlUpper).not.toContain('ALTER');
  166 |     }
  167 |   });
  168 | 
  169 |   test('should handle complex multi-table joins', async ({ request }) => {
  170 |     const response = await request.post('/api/nl-query/execute', {
  171 |       headers: { 'Content-Type': 'application/json', Cookie: authCookie },
  172 |       data: {
  173 |         nlQuestion: 'Show me the top 5 actors by number of films they appeared in',
  174 |         dataSourceId: dataSourceId,
  175 |         timeout: 30000,
  176 |       },
  177 |     });
  178 | 
  179 |     expect(response.status()).toBe(200);
  180 |     const data = await response.json();
  181 | 
  182 |     if (data.success === true) {
  183 |       // Should have generated a JOIN query
  184 |       expect(data.sql).toBeDefined();
```
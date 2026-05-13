# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-comprehensive.spec.ts >> API - Data Sources >> POST /api/data-sources - should create SQLite data source
- Location: e2e/api-comprehensive.spec.ts:83:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 200
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { ApiTestHelpers } from './api-test-helpers';
  3   | import { TestHelpers } from './helpers/test-helpers';
  4   | 
  5   | /**
  6   |  * Comprehensive API Tests
  7   |  *
  8   |  * These tests verify:
  9   |  * 1. All API endpoints work correctly
  10  |  * 2. Proper authentication/authorization
  11  |  * 3. Detailed logging is in place
  12  |  * 4. Error handling is correct
  13  |  */
  14  | 
  15  | test.describe('API - Health Check', () => {
  16  |   test('should return health status', async ({ request }) => {
  17  |     const response = await request.get('/api/health');
  18  |     expect(response.status()).toBe(200);
  19  | 
  20  |     const data = await response.json();
  21  |     expect(data).toHaveProperty('status', 'ok');
  22  |     expect(data).toHaveProperty('timestamp');
  23  |   });
  24  | });
  25  | 
  26  | test.describe('API - Authentication', () => {
  27  |   let authCookie: string;
  28  | 
  29  |   test.beforeAll(async ({ browser }) => {
  30  |     // Login to get auth cookie
  31  |     const page = await browser.newPage();
  32  |     const testHelpers = new TestHelpers(page);
  33  |     await testHelpers.login();
  34  | 
  35  |     // Get cookies
  36  |     const cookies = await page.context().cookies();
  37  |     const authCookieObj = cookies.find(c => c.name === 'authjs.session-token') ||
  38  |                           cookies.find(c => c.name === 'next-auth.session-token');
  39  | 
  40  |     authCookie = authCookieObj
  41  |       ? `${authCookieObj.name}=${authCookieObj.value}`
  42  |       : '';
  43  | 
  44  |     await page.close();
  45  |   });
  46  | 
  47  |   test('should reject unauthenticated requests', async ({ request }) => {
  48  |     const response = await request.get('/api/queries');
  49  |     expect(response.status()).toBe(401);
  50  | 
  51  |     const data = await response.json();
  52  |     expect(data.success).toBe(false);
  53  |     expect(data.error.code).toBe('UNAUTHORIZED');
  54  |   });
  55  | });
  56  | 
  57  | test.describe('API - Data Sources', () => {
  58  |   let authCookie: string;
  59  | 
  60  |   test.beforeAll(async ({ browser }) => {
  61  |     const page = await browser.newPage();
  62  |     const testHelpers = new TestHelpers(page);
  63  |     await testHelpers.login();
  64  | 
  65  |     const cookies = await page.context().cookies();
  66  |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  67  |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  68  |     await page.close();
  69  |   });
  70  | 
  71  |   test('GET /api/data-sources - should fetch all data sources', async ({ request }) => {
  72  |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  73  |     const response = await apiHelpers.getDataSources();
  74  |     expect(response.status()).toBe(200);
  75  | 
  76  |     const data = await ApiTestHelpers.extractJson(response);
  77  |     expect(data.success).toBe(true);
  78  |     expect(data.data).toHaveProperty('items');
  79  |     expect(Array.isArray(data.data.items)).toBe(true);
  80  |     expect(data.data).toHaveProperty('meta');
  81  |   });
  82  | 
  83  |   test('POST /api/data-sources - should create SQLite data source', async ({ request }) => {
  84  |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  85  |     const testDataSource = {
  86  |       name: `Test SQLite ${Date.now()}`,
  87  |       description: 'Test SQLite database for API testing',
  88  |       clientType: 'sqlite3',
  89  |       connectionConfig: {
  90  |         filename: ':memory:',
  91  |       },
  92  |     };
  93  | 
  94  |     const response = await apiHelpers.createDataSource(testDataSource);
> 95  |     expect(response.status()).toBe(201);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  96  | 
  97  |     const data = await ApiTestHelpers.extractJson(response);
  98  |     expect(data.success).toBe(true);
  99  |     expect(data.data).toHaveProperty('id');
  100 |     expect(data.data.name).toBe(testDataSource.name);
  101 |     expect(data.data.client_type).toBe('sqlite3');
  102 |   });
  103 | 
  104 |   test('POST /api/data-sources - should validate required fields', async ({ request }) => {
  105 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  106 |     const invalidData = {
  107 |       name: 'Invalid Data Source',
  108 |       // Missing clientType and connectionConfig
  109 |     };
  110 | 
  111 |     const response = await apiHelpers.createDataSource(invalidData as any);
  112 |     expect(response.status()).toBe(400);
  113 | 
  114 |     const data = await ApiTestHelpers.extractJson(response);
  115 |     expect(data.success).toBe(false);
  116 |     expect(data.error.code).toBe('INVALID_INPUT');
  117 |   });
  118 | 
  119 |   test('GET /api/data-sources/:id - should fetch specific data source', async ({ request }) => {
  120 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  121 |     // First create a data source
  122 |     const createResponse = await apiHelpers.createDataSource({
  123 |       name: `Test DS ${Date.now()}`,
  124 |       clientType: 'sqlite3',
  125 |       connectionConfig: { filename: ':memory:' },
  126 |     });
  127 | 
  128 |     const createData = await ApiTestHelpers.extractJson(createResponse);
  129 |     const dataSourceId = createData.data.id;
  130 | 
  131 |     // Then fetch it
  132 |     const response = await apiHelpers.getDataSource(dataSourceId);
  133 |     expect(response.status()).toBe(200);
  134 | 
  135 |     const data = await ApiTestHelpers.extractJson(response);
  136 |     expect(data.success).toBe(true);
  137 |     expect(data.data.id).toBe(dataSourceId);
  138 |     expect(data.data).toHaveProperty('connectionConfig'); // Decrypted
  139 |   });
  140 | 
  141 |   test('GET /api/data-sources/active - should fetch active data source', async ({ request }) => {
  142 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  143 |     const response = await apiHelpers.getActiveDataSources();
  144 |     expect(response.status()).toBe(200);
  145 | 
  146 |     const data = await ApiTestHelpers.extractJson(response);
  147 |     expect(data.success).toBe(true);
  148 |     // API returns { data: { activeDataSource: {...} } }
  149 |     expect(data.data).toHaveProperty('activeDataSource');
  150 |     // activeDataSource can be null if no active source exists
  151 |     if (data.data.activeDataSource) {
  152 |       expect(data.data.activeDataSource).toHaveProperty('id');
  153 |       expect(data.data.activeDataSource).toHaveProperty('name');
  154 |     }
  155 |   });
  156 | });
  157 | 
  158 | test.describe('API - Saved Queries', () => {
  159 |   let authCookie: string;
  160 |   let testDataSourceId: string;
  161 | 
  162 |   test.beforeAll(async ({ browser, request }) => {
  163 |     const page = await browser.newPage();
  164 |     const testHelpers = new TestHelpers(page);
  165 |     await testHelpers.login();
  166 | 
  167 |     const cookies = await page.context().cookies();
  168 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  169 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  170 | 
  171 |     await page.close();
  172 | 
  173 |     // Create a test data source for use in tests
  174 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  175 |     const dsResponse = await apiHelpers.createDataSource({
  176 |       name: `Test DS for Queries ${Date.now()}`,
  177 |       clientType: 'sqlite3',
  178 |       connectionConfig: { filename: ':memory:' },
  179 |     });
  180 |     const dsData = await ApiTestHelpers.extractJson(dsResponse);
  181 |     testDataSourceId = dsData.data.id;
  182 |   });
  183 | 
  184 |   test('GET /api/queries - should fetch saved queries', async ({ request }) => {
  185 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  186 |     const response = await apiHelpers.getQueries();
  187 |     expect(response.status()).toBe(200);
  188 | 
  189 |     const data = await ApiTestHelpers.extractJson(response);
  190 |     expect(data.success).toBe(true);
  191 |     expect(data.data).toHaveProperty('items');
  192 |     expect(data.data).toHaveProperty('meta');
  193 |   });
  194 | 
  195 |   test('POST /api/queries - should create a saved query', async ({ request }) => {
```
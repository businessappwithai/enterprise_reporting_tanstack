# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nl-query-rbac.spec.ts >> Data Source RBAC API @batch6 >> should reject unauthenticated requests to DS roles
- Location: e2e/nl-query-rbac.spec.ts:45:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 401
Received: 404
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { TestHelpers } from './helpers/test-helpers';
  3   | import { ApiTestHelpers } from './api-test-helpers';
  4   | 
  5   | /**
  6   |  * End-to-end tests for Natural Language Query with RBAC
  7   |  *
  8   |  * Tests cover:
  9   |  * 1. Data Source RBAC - roles, user assignments, entity permissions
  10  |  * 2. NL Query API - schema introspection, query execution, access control
  11  |  * 3. NL Query UI - page loads, data source selection, CopilotKit sidebar
  12  |  * 4. SQL Parser - entity extraction, access validation
  13  |  * 5. Query History - tracking and retrieval
  14  |  */
  15  | 
  16  | test.describe.configure({ mode: 'serial' });
  17  | 
  18  | let authCookie: string;
  19  | let dataSourceId: string;
  20  | let dsRoleId: string;
  21  | 
  22  | test.describe('Data Source RBAC API @batch6', () => {
  23  |   test.beforeAll(async ({ browser }) => {
  24  |     const page = await browser.newPage();
  25  |     const testHelpers = new TestHelpers(page);
  26  |     await testHelpers.login();
  27  | 
  28  |     const cookies = await page.context().cookies();
  29  |     const authCookieObj = cookies.find(c => c.name === 'authjs.session-token') ||
  30  |                           cookies.find(c => c.name === 'next-auth.session-token');
  31  |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  32  | 
  33  |     // Get the existing data source
  34  |     const dsResponse = await page.request.get('/api/data-sources/active', {
  35  |       headers: { Cookie: authCookie },
  36  |     });
  37  |     const dsData = await dsResponse.json();
  38  |     if (dsData.data && dsData.data.length > 0) {
  39  |       dataSourceId = dsData.data[0].id;
  40  |     }
  41  | 
  42  |     await page.close();
  43  |   });
  44  | 
  45  |   test('should reject unauthenticated requests to DS roles', async ({ request }) => {
  46  |     const response = await request.get(`/api/data-sources/${dataSourceId}/roles`);
> 47  |     expect(response.status()).toBe(401);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  48  |   });
  49  | 
  50  |   test('should create a data source role', async ({ request }) => {
  51  |     const response = await request.post(`/api/data-sources/${dataSourceId}/roles`, {
  52  |       headers: { 'Content-Type': 'application/json', Cookie: authCookie },
  53  |       data: { name: 'Test Analyst Role', description: 'E2E test role for entity access' },
  54  |     });
  55  | 
  56  |     expect(response.status()).toBe(201);
  57  |     const data = await response.json();
  58  |     expect(data.success).toBe(true);
  59  |     expect(data.data).toHaveProperty('id');
  60  |     expect(data.data.name).toBe('Test Analyst Role');
  61  |     dsRoleId = data.data.id;
  62  |   });
  63  | 
  64  |   test('should list data source roles', async ({ request }) => {
  65  |     const response = await request.get(`/api/data-sources/${dataSourceId}/roles`, {
  66  |       headers: { Cookie: authCookie },
  67  |     });
  68  | 
  69  |     expect(response.status()).toBe(200);
  70  |     const data = await response.json();
  71  |     expect(data.success).toBe(true);
  72  |     expect(Array.isArray(data.data)).toBe(true);
  73  |     expect(data.data.length).toBeGreaterThanOrEqual(1);
  74  |   });
  75  | 
  76  |   test('should get a specific data source role', async ({ request }) => {
  77  |     const response = await request.get(`/api/data-sources/${dataSourceId}/roles/${dsRoleId}`, {
  78  |       headers: { Cookie: authCookie },
  79  |     });
  80  | 
  81  |     expect(response.status()).toBe(200);
  82  |     const data = await response.json();
  83  |     expect(data.success).toBe(true);
  84  |     expect(data.data.name).toBe('Test Analyst Role');
  85  |   });
  86  | 
  87  |   test('should update a data source role', async ({ request }) => {
  88  |     const response = await request.put(`/api/data-sources/${dataSourceId}/roles/${dsRoleId}`, {
  89  |       headers: { 'Content-Type': 'application/json', Cookie: authCookie },
  90  |       data: { description: 'Updated description for E2E test' },
  91  |     });
  92  | 
  93  |     expect(response.status()).toBe(200);
  94  |     const data = await response.json();
  95  |     expect(data.success).toBe(true);
  96  |     expect(data.data.description).toBe('Updated description for E2E test');
  97  |   });
  98  | 
  99  |   test('should prevent duplicate role names for same data source', async ({ request }) => {
  100 |     const response = await request.post(`/api/data-sources/${dataSourceId}/roles`, {
  101 |       headers: { 'Content-Type': 'application/json', Cookie: authCookie },
  102 |       data: { name: 'Test Analyst Role' },
  103 |     });
  104 | 
  105 |     expect(response.status()).toBe(409);
  106 |     const data = await response.json();
  107 |     expect(data.success).toBe(false);
  108 |   });
  109 | 
  110 |   test('should add entity permission to role', async ({ request }) => {
  111 |     const response = await request.post(`/api/data-sources/${dataSourceId}/entity-permissions`, {
  112 |       headers: { 'Content-Type': 'application/json', Cookie: authCookie },
  113 |       data: {
  114 |         ds_role_id: dsRoleId,
  115 |         entity_name: 'actor',
  116 |         entity_type: 'table',
  117 |         permission_level: 'select',
  118 |       },
  119 |     });
  120 | 
  121 |     expect(response.status()).toBe(201);
  122 |     const data = await response.json();
  123 |     expect(data.success).toBe(true);
  124 |     expect(data.data.entity_name).toBe('actor');
  125 |     expect(data.data.permission_level).toBe('select');
  126 |   });
  127 | 
  128 |   test('should add multiple entity permissions', async ({ request }) => {
  129 |     const tables = ['film', 'film_actor', 'category', 'payment'];
  130 |     for (const tableName of tables) {
  131 |       const response = await request.post(`/api/data-sources/${dataSourceId}/entity-permissions`, {
  132 |         headers: { 'Content-Type': 'application/json', Cookie: authCookie },
  133 |         data: {
  134 |           ds_role_id: dsRoleId,
  135 |           entity_name: tableName,
  136 |           entity_type: 'table',
  137 |           permission_level: 'select',
  138 |         },
  139 |       });
  140 |       expect(response.status()).toBe(201);
  141 |     }
  142 |   });
  143 | 
  144 |   test('should list entity permissions', async ({ request }) => {
  145 |     const response = await request.get(
  146 |       `/api/data-sources/${dataSourceId}/entity-permissions?ds_role_id=${dsRoleId}`,
  147 |       { headers: { Cookie: authCookie } }
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: metadata-entity-rbac.spec.ts >> Entity Metadata - API Tests >> setup - create test data source and tables
- Location: e2e/metadata-entity-rbac.spec.ts:30:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 200
```

# Test source

```ts
  1   | /**
  2   |  * End-to-End Tests for Entity Metadata Management and RBAC
  3   |  *
  4   |  * Tests the new metadata entity management features including:
  5   |  * - Metadata entity and field CRUD operations
  6   |  * - Schema sync integration
  7   |  * - Permission management
  8   |  * - Foreign key relationship configuration
  9   |  * - CRUD operations on entity data
  10  |  */
  11  | 
  12  | import { test, expect } from '@playwright/test';
  13  | import { ApiTestHelpers } from './api-test-helpers';
  14  | import { TestHelpers } from './helpers/test-helpers';
  15  | import { getAuthCookie } from './test-auth';
  16  | 
  17  | test.describe.configure({ mode: 'serial' });
  18  | 
  19  | let authCookie: string;
  20  | let testDataSourceId: string;
  21  | 
  22  | test.describe('Entity Metadata - API Tests', () => {
  23  |   let authCookie: string;
  24  |   let testDataSourceId: string;
  25  | 
  26  |   test.beforeAll(async ({ request, browser }) => {
  27  |     authCookie = await getAuthCookie(request, browser);
  28  |   });
  29  | 
  30  |   test('setup - create test data source and tables', async ({ request }) => {
  31  |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  32  |     const testDbFile = `/tmp/test-ds-${Date.now()}.sqlite`;
  33  | 
  34  |     // Create a test data source
  35  |     const createResponse = await apiHelpers.createDataSource({
  36  |       name: `E2E Test DS ${Date.now()}`,
  37  |       description: 'Test data source for metadata e2e tests',
  38  |       clientType: 'sqlite3',
  39  |       connectionConfig: {
  40  |         filename: testDbFile,
  41  |       },
  42  |     });
  43  | 
> 44  |     expect(createResponse.status()).toBe(201);
      |                                     ^ Error: expect(received).toBe(expected) // Object.is equality
  45  | 
  46  |     const createData = await ApiTestHelpers.extractJson(createResponse);
  47  |     expect(createData.success).toBe(true);
  48  |     expect(createData.data).toBeDefined();
  49  |     expect(createData.data.id).toBeDefined();
  50  | 
  51  |     testDataSourceId = createData.data.id;
  52  | 
  53  |     // Create a table in the test datasource
  54  |     const sqlResponse = await apiHelpers.executeTestSql({
  55  |       sql: `
  56  |         CREATE TABLE test_customers (
  57  |           id INTEGER PRIMARY KEY AUTOINCREMENT,
  58  |           name TEXT NOT NULL,
  59  |           email TEXT,
  60  |           status TEXT DEFAULT 'active',
  61  |           created_at TEXT DEFAULT CURRENT_TIMESTAMP
  62  |         );
  63  | 
  64  |         CREATE TABLE test_orders (
  65  |           id INTEGER PRIMARY KEY AUTOINCREMENT,
  66  |           customer_id INTEGER,
  67  |           order_date TEXT DEFAULT CURRENT_DATE,
  68  |           total DECIMAL(10,2),
  69  |           status TEXT DEFAULT 'pending',
  70  |           FOREIGN KEY (customer_id) REFERENCES test_customers(id)
  71  |         );
  72  | 
  73  |         INSERT INTO test_customers (name, email, status) VALUES
  74  |           ('John Doe', 'john@example.com', 'active'),
  75  |           ('Jane Smith', 'jane@example.com', 'active'),
  76  |           ('Bob Johnson', 'bob@example.com', 'inactive');
  77  |       `,
  78  |       dataSourceId: testDataSourceId,
  79  |     });
  80  | 
  81  |     expect(sqlResponse.status()).toBe(200);
  82  |   });
  83  | 
  84  |   test('GET /api/metadata/entities - should list entities', async ({ request }) => {
  85  |     const response = await request.get(`/api/metadata/entities?data_source_id=${testDataSourceId}`, {
  86  |       headers: {
  87  |         'Cookie': authCookie,
  88  |       },
  89  |     });
  90  | 
  91  |     expect(response.status()).toBe(200);
  92  | 
  93  |     const data = await response.json();
  94  |     expect(data.success).toBe(true);
  95  |     expect(data.data).toHaveProperty('entities');
  96  |     expect(Array.isArray(data.data.entities)).toBe(true);
  97  |     expect(data.data).toHaveProperty('total');
  98  |   });
  99  | 
  100 |   test('GET /api/metadata/entities/:id - should get entity with fields', async ({ request }) => {
  101 |     // First list entities to get one
  102 |     const listResponse = await request.get(`/api/metadata/entities?data_source_id=${testDataSourceId}`, {
  103 |       headers: { 'Cookie': authCookie },
  104 |     });
  105 | 
  106 |     const listData = await listResponse.json();
  107 |     const entityId = listData.data.entities[0]?.id;
  108 | 
  109 |     if (!entityId) {
  110 |       test.skip('No entities found - skipping test');
  111 |       return;
  112 |     }
  113 | 
  114 |     const response = await request.get(`/api/metadata/entities/${entityId}`, {
  115 |       headers: { 'Cookie': authCookie },
  116 |     });
  117 | 
  118 |     expect(response.status()).toBe(200);
  119 | 
  120 |     const data = await response.json();
  121 |     expect(data.success).toBe(true);
  122 |     expect(data.data).toHaveProperty('entity_name');
  123 |     expect(data.data).toHaveProperty('fields');
  124 |     expect(Array.isArray(data.data.fields)).toBe(true);
  125 |   });
  126 | 
  127 |   test('PUT /api/metadata/entities/:id - should update entity metadata', async ({ request }) => {
  128 |     // First get or create an entity
  129 |     const listResponse = await request.get(`/api/metadata/entities?data_source_id=${testDataSourceId}`, {
  130 |       headers: { 'Cookie': authCookie },
  131 |     });
  132 | 
  133 |     const listData = await listResponse.json();
  134 |     const entityId = listData.data.entities?.find((e: any) => e.entity_name === 'test_customers')?.id;
  135 | 
  136 |     if (!entityId) {
  137 |       test.skip('test_customers entity not found - skipping test');
  138 |       return;
  139 |     }
  140 | 
  141 |     const updateResponse = await request.put(`/api/metadata/entities/${entityId}`, {
  142 |       headers: {
  143 |         'Cookie': authCookie,
  144 |         'Content-Type': 'application/json',
```
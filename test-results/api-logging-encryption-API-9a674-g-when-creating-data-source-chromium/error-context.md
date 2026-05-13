# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-logging-encryption.spec.ts >> API - Encryption & Decryption >> should encrypt connection config when creating data source
- Location: e2e/api-logging-encryption.spec.ts:38:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 200
```

# Test source

```ts
  1   | import { test, expect, APIRequestContext } from '@playwright/test';
  2   | import { ApiTestHelpers } from './api-test-helpers';
  3   | import { TestHelpers } from './helpers/test-helpers';
  4   | 
  5   | /**
  6   |  * API Logging and Encryption Tests
  7   |  *
  8   |  * These tests verify:
  9   |  * 1. Encryption/decryption works correctly for data sources
  10  |  * 2. All API endpoints log correctly (info, warn, error)
  11  |  * 3. Error scenarios are properly logged
  12  |  * 4. SQL execution logging is comprehensive
  13  |  */
  14  | 
  15  | test.describe('API - Encryption & Decryption', () => {
  16  |   let authCookie: string;
  17  |   let authContext: any;
  18  |   let authPage: any;
  19  | 
  20  |   test.beforeAll(async ({ browser }) => {
  21  |     // Create a page for authentication
  22  |     authContext = await browser.newContext();
  23  |     authPage = await authContext.newPage();
  24  | 
  25  |     const testHelpers = new TestHelpers(authPage);
  26  |     await testHelpers.login();
  27  | 
  28  |     const cookies = await authContext.cookies();
  29  |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  30  |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  31  |   });
  32  | 
  33  |   test.afterAll(async () => {
  34  |     if (authPage) await authPage.close();
  35  |     if (authContext) await authContext.close();
  36  |   });
  37  | 
  38  |   test('should encrypt connection config when creating data source', async ({ request }) => {
  39  |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  40  |     const connectionConfig = {
  41  |       host: 'localhost',
  42  |       port: 5432,
  43  |       database: 'testdb',
  44  |       user: 'testuser',
  45  |       password: 'testpassword123',
  46  |       ssl: false,
  47  |     };
  48  | 
  49  |     const createResponse = await apiHelpers.createDataSource({
  50  |       name: `Test Encrypted DS ${Date.now()}`,
  51  |       description: 'Test encrypted connection config',
  52  |       clientType: 'pg',
  53  |       connectionConfig,
  54  |     });
  55  | 
> 56  |     expect(createResponse.status()).toBe(201);
      |                                     ^ Error: expect(received).toBe(expected) // Object.is equality
  57  | 
  58  |     const createData = await ApiTestHelpers.extractJson(createResponse);
  59  |     expect(createData.success).toBe(true);
  60  | 
  61  |     // Verify connection_config is encrypted (not plain JSON)
  62  |     const connectionConfigRaw = createData.data.connection_config;
  63  |     expect(connectionConfigRaw).toBeDefined();
  64  |     expect(connectionConfigRaw).not.toContain('localhost');
  65  |     expect(connectionConfigRaw).not.toContain('testpassword');
  66  |     // Encrypted data should be hex string
  67  |     expect(/^[0-9a-fA-F]+$/.test(connectionConfigRaw)).toBe(true);
  68  |   });
  69  | 
  70  |   test('should decrypt connection config when fetching data source', async ({ request }) => {
  71  |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  72  |     const connectionConfig = {
  73  |       host: 'localhost',
  74  |       port: 5432,
  75  |       database: 'testdb',
  76  |       user: 'testuser',
  77  |       password: 'testpassword123',
  78  |       ssl: false,
  79  |     };
  80  | 
  81  |     // Create data source
  82  |     const createResponse = await apiHelpers.createDataSource({
  83  |       name: `Test Decrypt DS ${Date.now()}`,
  84  |       clientType: 'pg',
  85  |       connectionConfig,
  86  |     });
  87  | 
  88  |     const createData = await ApiTestHelpers.extractJson(createResponse);
  89  |     const dataSourceId = createData.data.id;
  90  | 
  91  |     // Fetch data source
  92  |     const getResponse = await apiHelpers.getDataSource(dataSourceId);
  93  |     expect(getResponse.status()).toBe(200);
  94  | 
  95  |     const getData = await ApiTestHelpers.extractJson(getResponse);
  96  |     expect(getData.success).toBe(true);
  97  | 
  98  |     // Verify connection config is decrypted
  99  |     const decryptedConfig = getData.data.connectionConfig;
  100 |     expect(decryptedConfig).toBeDefined();
  101 |     expect(decryptedConfig.host).toBe('localhost');
  102 |     expect(decryptedConfig.port).toBe(5432);
  103 |     expect(decryptedConfig.database).toBe('testdb');
  104 |     expect(decryptedConfig.user).toBe('testuser');
  105 |     expect(decryptedConfig.password).toBe('testpassword123');
  106 |   });
  107 | 
  108 |   test('should handle SQLite connection encryption/decryption', async ({ request }) => {
  109 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  110 |     const connectionConfig = {
  111 |       filename: ':memory:',
  112 |     };
  113 | 
  114 |     const createResponse = await apiHelpers.createDataSource({
  115 |       name: `Test SQLite Encrypt ${Date.now()}`,
  116 |       clientType: 'sqlite3',
  117 |       connectionConfig,
  118 |     });
  119 | 
  120 |     expect(createResponse.status()).toBe(201);
  121 | 
  122 |     const createData = await ApiTestHelpers.extractJson(createResponse);
  123 |     const dataSourceId = createData.data.id;
  124 | 
  125 |     // Fetch and verify decryption
  126 |     const getResponse = await apiHelpers.getDataSource(dataSourceId);
  127 |     const getData = await ApiTestHelpers.extractJson(getResponse);
  128 | 
  129 |     expect(getData.data.connectionConfig.filename).toBe(':memory:');
  130 |   });
  131 | 
  132 |   test('should handle MySQL connection encryption/decryption', async ({ request }) => {
  133 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  134 |     const connectionConfig = {
  135 |       host: 'localhost',
  136 |       port: 3306,
  137 |       database: 'testdb',
  138 |       user: 'mysqluser',
  139 |       password: 'mysqlpassword123',
  140 |       ssl: false,
  141 |     };
  142 | 
  143 |     const createResponse = await apiHelpers.createDataSource({
  144 |       name: `Test MySQL Encrypt ${Date.now()}`,
  145 |       clientType: 'mysql',
  146 |       connectionConfig,
  147 |     });
  148 | 
  149 |     expect(createResponse.status()).toBe(201);
  150 | 
  151 |     const createData = await ApiTestHelpers.extractJson(createResponse);
  152 |     const dataSourceId = createData.data.id;
  153 | 
  154 |     // Fetch and verify decryption
  155 |     const getResponse = await apiHelpers.getDataSource(dataSourceId);
  156 |     const getData = await ApiTestHelpers.extractJson(getResponse);
```
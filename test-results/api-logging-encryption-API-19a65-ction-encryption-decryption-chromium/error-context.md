# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-logging-encryption.spec.ts >> API - Encryption & Decryption >> should handle SQLite connection encryption/decryption
- Location: e2e/api-logging-encryption.spec.ts:108:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 200
```

# Test source

```ts
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
  56  |     expect(createResponse.status()).toBe(201);
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
> 120 |     expect(createResponse.status()).toBe(201);
      |                                     ^ Error: expect(received).toBe(expected) // Object.is equality
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
  157 | 
  158 |     expect(getData.data.connectionConfig.host).toBe('localhost');
  159 |     expect(getData.data.connectionConfig.port).toBe(3306);
  160 |     expect(getData.data.connectionConfig.password).toBe('mysqlpassword123');
  161 |   });
  162 | });
  163 | 
  164 | test.describe('API - SQL Execution with Logging', () => {
  165 |   let authCookie: string;
  166 |   let sqliteDataSourceId: string;
  167 |   let authContext: any;
  168 |   let authPage: any;
  169 | 
  170 |   test.beforeAll(async ({ browser, request }) => {
  171 |     authContext = await browser.newContext();
  172 |     authPage = await authContext.newPage();
  173 | 
  174 |     const testHelpers = new TestHelpers(authPage);
  175 |     await testHelpers.login();
  176 | 
  177 |     const cookies = await authContext.cookies();
  178 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  179 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  180 | 
  181 |     // Create SQLite data source for testing
  182 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  183 |     const dsResponse = await apiHelpers.createDataSource({
  184 |       name: `SQLite for SQL Tests ${Date.now()}`,
  185 |       clientType: 'sqlite3',
  186 |       connectionConfig: { filename: ':memory:' },
  187 |     });
  188 | 
  189 |     const dsData = await ApiTestHelpers.extractJson(dsResponse);
  190 |     sqliteDataSourceId = dsData.data.id;
  191 |   });
  192 | 
  193 |   test.afterAll(async () => {
  194 |     if (authPage) await authPage.close();
  195 |     if (authContext) await authContext.close();
  196 |   });
  197 | 
  198 |   test('should execute simple SELECT query', async ({ request }) => {
  199 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  200 |     const response = await apiHelpers.executeSql({
  201 |       sql: 'SELECT 1 as number, "test" as text',
  202 |       dataSourceId: sqliteDataSourceId,
  203 |     });
  204 | 
  205 |     expect(response.status()).toBe(200);
  206 | 
  207 |     const data = await ApiTestHelpers.extractJson(response);
  208 |     expect(data.success).toBe(true);
  209 |     expect(data.data.rows).toHaveLength(1);
  210 |     expect(data.data.rows[0]).toHaveProperty('number', 1);
  211 |     expect(data.data.rows[0]).toHaveProperty('text', 'test');
  212 |   });
  213 | 
  214 |   test('should execute query with JOIN', async ({ request }) => {
  215 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  216 |     const response = await apiHelpers.executeSql({
  217 |       sql: `
  218 |         WITH users(id, name) AS (
  219 |           SELECT 1, 'Alice'
  220 |           UNION ALL
```
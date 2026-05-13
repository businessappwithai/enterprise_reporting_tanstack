# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-comprehensive.spec.ts >> API - Dashboards >> POST /api/dashboards - should create a public dashboard
- Location: e2e/api-comprehensive.spec.ts:419:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 401
```

# Test source

```ts
  327 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  328 | 
  329 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  330 |     await page.close();
  331 | 
  332 |     // Create a test data source and query
  333 |     const dsResponse = await apiHelpers.createDataSource({
  334 |       name: `Test DS for Reports ${Date.now()}`,
  335 |       clientType: 'sqlite3',
  336 |       connectionConfig: { filename: ':memory:' },
  337 |     });
  338 |     const dsData = await ApiTestHelpers.extractJson(dsResponse);
  339 | 
  340 |     const qResponse = await apiHelpers.createQuery({
  341 |       name: `Test Query for Reports ${Date.now()}`,
  342 |       dataSourceId: dsData.data.id,
  343 |       sqlContent: 'SELECT 1 as test',
  344 |     });
  345 |     const qData = await ApiTestHelpers.extractJson(qResponse);
  346 |     testQueryId = qData.data.id;
  347 |   });
  348 | 
  349 |   test('GET /api/reports - should fetch reports', async ({ request }) => {
  350 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  351 |     const response = await apiHelpers.getReports();
  352 |     expect(response.status()).toBe(200);
  353 | 
  354 |     const data = await ApiTestHelpers.extractJson(response);
  355 |     expect(data.success).toBe(true);
  356 |     expect(data.data).toHaveProperty('items');
  357 |     expect(Array.isArray(data.data.items)).toBe(true);
  358 |   });
  359 | 
  360 |   test('POST /api/reports - should create a report', async ({ request }) => {
  361 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  362 |     const response = await apiHelpers.createReport({
  363 |       name: `Test Report ${Date.now()}`,
  364 |       description: 'Test report for API testing',
  365 |       savedQueryId: testQueryId,
  366 |     });
  367 | 
  368 |     expect(response.status()).toBe(201);
  369 | 
  370 |     const data = await ApiTestHelpers.extractJson(response);
  371 |     expect(data.success).toBe(true);
  372 |     expect(data.data).toHaveProperty('id');
  373 |     expect(data.data.name).toContain('Test Report');
  374 |   });
  375 | });
  376 | 
  377 | test.describe('API - Dashboards', () => {
  378 |   let authCookie: string;
  379 | 
  380 |   test.beforeAll(async ({ browser }) => {
  381 |     const page = await browser.newPage();
  382 |     const testHelpers = new TestHelpers(page);
  383 |     await testHelpers.login();
  384 | 
  385 |     const cookies = await page.context().cookies();
  386 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  387 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  388 | 
  389 |     await page.close();
  390 |   });
  391 | 
  392 |   test('GET /api/dashboards - should fetch dashboards', async ({ request }) => {
  393 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  394 |     const response = await apiHelpers.getDashboards();
  395 |     expect(response.status()).toBe(200);
  396 | 
  397 |     const data = await ApiTestHelpers.extractJson(response);
  398 |     expect(data.success).toBe(true);
  399 |     expect(data.data).toHaveProperty('items');
  400 |   });
  401 | 
  402 |   test('POST /api/dashboards - should create a private dashboard', async ({ request }) => {
  403 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  404 |     const response = await apiHelpers.createDashboard({
  405 |       name: `Test Private Dashboard ${Date.now()}`,
  406 |       description: 'Test private dashboard',
  407 |       isPublic: false,
  408 |     });
  409 | 
  410 |     expect(response.status()).toBe(201);
  411 | 
  412 |     const data = await ApiTestHelpers.extractJson(response);
  413 |     expect(data.success).toBe(true);
  414 |     expect(data.data).toHaveProperty('id');
  415 |     // SQLite returns boolean as integer (0 or 1)
  416 |     expect(data.data.is_public).toBeFalsy();
  417 |   });
  418 | 
  419 |   test('POST /api/dashboards - should create a public dashboard', async ({ request }) => {
  420 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  421 |     const response = await apiHelpers.createDashboard({
  422 |       name: `Test Public Dashboard ${Date.now()}`,
  423 |       description: 'Test public dashboard',
  424 |       isPublic: true,
  425 |     });
  426 | 
> 427 |     expect(response.status()).toBe(201);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  428 | 
  429 |     const data = await ApiTestHelpers.extractJson(response);
  430 |     expect(data.success).toBe(true);
  431 |     expect(data.data).toHaveProperty('id');
  432 |     // SQLite returns boolean as integer (0 or 1)
  433 |     expect(data.data.is_public).toBeTruthy();
  434 |   });
  435 | });
  436 | 
  437 | test.describe('API - Jobs', () => {
  438 |   let authCookie: string;
  439 |   let testQueryId: string;
  440 | 
  441 |   test.beforeAll(async ({ browser, request }) => {
  442 |     const page = await browser.newPage();
  443 |     const testHelpers = new TestHelpers(page);
  444 |     await testHelpers.login();
  445 | 
  446 |     const cookies = await page.context().cookies();
  447 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  448 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  449 | 
  450 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  451 |     await page.close();
  452 | 
  453 |     // Create test query for jobs
  454 |     const dsResponse = await apiHelpers.createDataSource({
  455 |       name: `Test DS for Jobs ${Date.now()}`,
  456 |       clientType: 'sqlite3',
  457 |       connectionConfig: { filename: ':memory:' },
  458 |     });
  459 |     const dsData = await ApiTestHelpers.extractJson(dsResponse);
  460 | 
  461 |     const qResponse = await apiHelpers.createQuery({
  462 |       name: `Test Query for Jobs ${Date.now()}`,
  463 |       dataSourceId: dsData.data.id,
  464 |       sqlContent: 'SELECT 1 as test',
  465 |     });
  466 |     const qData = await ApiTestHelpers.extractJson(qResponse);
  467 |     testQueryId = qData.data.id;
  468 |   });
  469 | 
  470 |   test('GET /api/jobs - should fetch job definitions', async ({ request }) => {
  471 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  472 |     const response = await apiHelpers.getJobs();
  473 |     expect(response.status()).toBe(200);
  474 | 
  475 |     const data = await ApiTestHelpers.extractJson(response);
  476 |     expect(data.success).toBe(true);
  477 |   });
  478 | 
  479 |   test('POST /api/jobs - should create a job definition', async ({ request }) => {
  480 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  481 |     const response = await apiHelpers.createJob({
  482 |       name: `Test Job ${Date.now()}`,
  483 |       description: 'Test job definition',
  484 |       savedQueryId: testQueryId,
  485 |       schedule: '0 0 * * *', // Daily at midnight
  486 |     });
  487 | 
  488 |     expect(response.status()).toBe(201);
  489 | 
  490 |     const data = await ApiTestHelpers.extractJson(response);
  491 |     expect(data.success).toBe(true);
  492 |     expect(data.data).toHaveProperty('id');
  493 |   });
  494 | });
  495 | 
  496 | test.describe('API - Admin', () => {
  497 |   let authCookie: string;
  498 | 
  499 |   test.beforeAll(async ({ browser }) => {
  500 |     const page = await browser.newPage();
  501 |     const testHelpers = new TestHelpers(page);
  502 |     // Login as admin
  503 |     await testHelpers.login('admin@admin.com', 'admin');
  504 | 
  505 |     const cookies = await page.context().cookies();
  506 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  507 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  508 | 
  509 |     await page.close();
  510 |   });
  511 | 
  512 |   test('GET /api/admin/users - should fetch all users', async ({ request }) => {
  513 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  514 |     const response = await apiHelpers.getAdminUsers();
  515 |     expect(response.status()).toBe(200);
  516 | 
  517 |     const data = await ApiTestHelpers.extractJson(response);
  518 |     expect(data.success).toBe(true);
  519 |     expect(Array.isArray(data.data)).toBe(true);
  520 |   });
  521 | 
  522 |   test('GET /api/admin/roles - should fetch all roles', async ({ request }) => {
  523 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  524 |     const response = await apiHelpers.getRoles();
  525 |     expect(response.status()).toBe(200);
  526 | 
  527 |     const data = await ApiTestHelpers.extractJson(response);
```
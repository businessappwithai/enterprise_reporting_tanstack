# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-comprehensive.spec.ts >> API - Admin >> POST /api/admin/roles - should create a new role
- Location: e2e/api-comprehensive.spec.ts:532:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 200
```

# Test source

```ts
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
  528 |     expect(data.success).toBe(true);
  529 |     expect(Array.isArray(data.data)).toBe(true);
  530 |   });
  531 | 
  532 |   test('POST /api/admin/roles - should create a new role', async ({ request }) => {
  533 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  534 |     const response = await apiHelpers.createRole({
  535 |       name: `Test Role ${Date.now()}`,
  536 |       description: 'Test role for API testing',
  537 |       permissions: ['view:dashboard', 'view:reports'],
  538 |     });
  539 | 
> 540 |     expect(response.status()).toBe(201);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  541 | 
  542 |     const data = await ApiTestHelpers.extractJson(response);
  543 |     expect(data.success).toBe(true);
  544 |     expect(data.data).toHaveProperty('id');
  545 |   });
  546 | });
  547 | 
  548 | test.describe('API - Error Handling', () => {
  549 |   let authCookie: string;
  550 | 
  551 |   test.beforeAll(async ({ browser }) => {
  552 |     const page = await browser.newPage();
  553 |     const testHelpers = new TestHelpers(page);
  554 |     await testHelpers.login();
  555 | 
  556 |     const cookies = await page.context().cookies();
  557 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  558 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  559 | 
  560 |     await page.close();
  561 |   });
  562 | 
  563 |   test('should return 404 for non-existent data source', async ({ request }) => {
  564 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  565 |     const response = await apiHelpers.getDataSource('non-existent-id');
  566 |     expect(response.status()).toBe(404);
  567 | 
  568 |     const data = await ApiTestHelpers.extractJson(response);
  569 |     expect(data.success).toBe(false);
  570 |     expect(data.error.code).toBe('NOT_FOUND');
  571 |   });
  572 | 
  573 |   test('should return 404 for non-existent query', async ({ request }) => {
  574 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  575 |     const response = await apiHelpers.getQuery('non-existent-id');
  576 |     expect(response.status()).toBe(404);
  577 | 
  578 |     const data = await ApiTestHelpers.extractJson(response);
  579 |     expect(data.success).toBe(false);
  580 |     expect(data.error.code).toBe('NOT_FOUND');
  581 |   });
  582 | });
  583 | 
```
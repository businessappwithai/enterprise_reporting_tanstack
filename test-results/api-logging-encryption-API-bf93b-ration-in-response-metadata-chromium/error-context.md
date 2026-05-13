# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-logging-encryption.spec.ts >> API - Performance Logging >> should include duration in response metadata
- Location: e2e/api-logging-encryption.spec.ts:437:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
```

# Test source

```ts
  346 | 
  347 |     const data = await ApiTestHelpers.extractJson(response);
  348 |     expect(data.success).toBe(true);
  349 |     expect(data.data).toHaveProperty('isValid');
  350 |   });
  351 | });
  352 | 
  353 | test.describe('API - Error Logging Scenarios', () => {
  354 |   let authCookie: string;
  355 |   let authContext: any;
  356 |   let authPage: any;
  357 | 
  358 |   test.beforeAll(async ({ browser }) => {
  359 |     authContext = await browser.newContext();
  360 |     authPage = await authContext.newPage();
  361 | 
  362 |     const testHelpers = new TestHelpers(authPage);
  363 |     await testHelpers.login();
  364 | 
  365 |     const cookies = await authContext.cookies();
  366 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  367 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  368 |   });
  369 | 
  370 |   test.afterAll(async () => {
  371 |     if (authPage) await authPage.close();
  372 |     if (authContext) await authContext.close();
  373 |   });
  374 | 
  375 |   test('should log validation errors for missing fields', async ({ request }) => {
  376 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  377 |     // Test data source creation with missing fields
  378 |     const response = await apiHelpers.createDataSource({
  379 |       name: 'Invalid DS',
  380 |       // Missing clientType and connectionConfig
  381 |     } as any);
  382 | 
  383 |     expect(response.status()).toBe(400);
  384 | 
  385 |     const data = await ApiTestHelpers.extractJson(response);
  386 |     expect(data.success).toBe(false);
  387 |     expect(data.error.code).toBe('INVALID_INPUT');
  388 |   });
  389 | 
  390 |   test('should log validation errors for queries', async ({ request }) => {
  391 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  392 |     const response = await apiHelpers.createQuery({
  393 |       name: 'Invalid Query',
  394 |       // Missing dataSourceId and sqlContent
  395 |     } as any);
  396 | 
  397 |     expect(response.status()).toBe(400);
  398 | 
  399 |     const data = await ApiTestHelpers.extractJson(response);
  400 |     expect(data.success).toBe(false);
  401 |     expect(data.error.code).toBe('INVALID_INPUT');
  402 |   });
  403 | 
  404 |   test('should log not found errors', async ({ request }) => {
  405 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  406 |     const response = await apiHelpers.getDataSource('non-existent-id-12345');
  407 |     expect(response.status()).toBe(404);
  408 | 
  409 |     const data = await ApiTestHelpers.extractJson(response);
  410 |     expect(data.success).toBe(false);
  411 |     expect(data.error.code).toBe('NOT_FOUND');
  412 |   });
  413 | });
  414 | 
  415 | test.describe('API - Performance Logging', () => {
  416 |   let authCookie: string;
  417 |   let authContext: any;
  418 |   let authPage: any;
  419 | 
  420 |   test.beforeAll(async ({ browser }) => {
  421 |     authContext = await browser.newContext();
  422 |     authPage = await authContext.newPage();
  423 | 
  424 |     const testHelpers = new TestHelpers(authPage);
  425 |     await testHelpers.login();
  426 | 
  427 |     const cookies = await authContext.cookies();
  428 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  429 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  430 |   });
  431 | 
  432 |   test.afterAll(async () => {
  433 |     if (authPage) await authPage.close();
  434 |     if (authContext) await authContext.close();
  435 |   });
  436 | 
  437 |   test('should include duration in response metadata', async ({ request }) => {
  438 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  439 |     const startTime = Date.now();
  440 | 
  441 |     const response = await apiHelpers.getQueries();
  442 | 
  443 |     const endTime = Date.now();
  444 |     const requestDuration = endTime - startTime;
  445 | 
> 446 |     expect(response.status()).toBe(200);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  447 | 
  448 |     // The request should complete in reasonable time
  449 |     expect(requestDuration).toBeLessThan(5000);
  450 |   });
  451 | 
  452 |   test('should handle concurrent requests', async ({ request }) => {
  453 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  454 |     // Create multiple concurrent requests
  455 |     const promises = [
  456 |       apiHelpers.getQueries(),
  457 |       apiHelpers.getDataSources(),
  458 |       apiHelpers.getReports(),
  459 |       apiHelpers.getDashboards(),
  460 |     ];
  461 | 
  462 |     const results = await Promise.all(promises);
  463 | 
  464 |     // All requests should succeed
  465 |     for (const response of results) {
  466 |       expect(response.status()).toBeGreaterThanOrEqual(200);
  467 |       expect(response.status()).toBeLessThan(300);
  468 |     }
  469 |   });
  470 | });
  471 | 
```
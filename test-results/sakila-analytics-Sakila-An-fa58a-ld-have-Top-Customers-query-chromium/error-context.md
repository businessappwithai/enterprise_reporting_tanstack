# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sakila-analytics.spec.ts >> Sakila Analytics - Queries >> should have Top Customers query
- Location: e2e/sakila-analytics.spec.ts:66:3

# Error details

```
TypeError: Cannot read properties of undefined (reading 'items')
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { ApiTestHelpers } from './api-test-helpers';
  3   | import { TestHelpers } from './helpers/test-helpers';
  4   | 
  5   | /**
  6   |  * Sakila Analytics Tests
  7   |  *
  8   |  * Tests for the complete Sakila analytics suite including:
  9   |  * - 15 Saved Queries
  10  |  * - 4 Reports
  11  |  * - 8 Charts
  12  |  * - 1 Dashboard with 5 Widgets
  13  |  */
  14  | 
  15  | test.describe('Sakila Analytics - Queries', () => {
  16  |   let authCookie: string;
  17  |   let authContext: any;
  18  |   let authPage: any;
  19  | 
  20  |   test.beforeAll(async ({ browser }) => {
  21  |     authContext = await browser.newContext();
  22  |     authPage = await authContext.newPage();
  23  | 
  24  |     const testHelpers = new TestHelpers(authPage);
  25  |     await testHelpers.login();
  26  | 
  27  |     const cookies = await authContext.cookies();
  28  |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  29  |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  30  |   });
  31  | 
  32  |   test.afterAll(async () => {
  33  |     if (authPage) await authPage.close();
  34  |     if (authContext) await authContext.close();
  35  |   });
  36  | 
  37  |   test('should fetch all saved queries', async ({ request }) => {
  38  |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  39  |     const response = await apiHelpers.getQueries();
  40  |     expect(response.status()).toBe(200);
  41  | 
  42  |     const data = await ApiTestHelpers.extractJson(response);
  43  |     expect(data.success).toBe(true);
  44  |     expect(data.data.items.length).toBeGreaterThanOrEqual(15);
  45  |   });
  46  | 
  47  |   test('should have Monthly Revenue Trend query', async ({ request }) => {
  48  |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  49  |     const response = await apiHelpers.getQueries();
  50  |     const data = await ApiTestHelpers.extractJson(response);
  51  | 
  52  |     const query = data.data.items.find((q: any) => q.name === 'Monthly Revenue Trend');
  53  |     expect(query).toBeDefined();
  54  |     expect(query.description).toContain('revenue');
  55  |   });
  56  | 
  57  |   test('should have Revenue by Store query', async ({ request }) => {
  58  |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  59  |     const response = await apiHelpers.getQueries();
  60  |     const data = await ApiTestHelpers.extractJson(response);
  61  | 
  62  |     const query = data.data.items.find((q: any) => q.name === 'Revenue by Store');
  63  |     expect(query).toBeDefined();
  64  |   });
  65  | 
  66  |   test('should have Top Customers query', async ({ request }) => {
  67  |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  68  |     const response = await apiHelpers.getQueries();
  69  |     const data = await ApiTestHelpers.extractJson(response);
  70  | 
> 71  |     const query = data.data.items.find((q: any) => q.name === 'Top Customers by Spending');
      |                             ^ TypeError: Cannot read properties of undefined (reading 'items')
  72  |     expect(query).toBeDefined();
  73  |   });
  74  | });
  75  | 
  76  | test.describe('Sakila Analytics - SQL Execution', () => {
  77  |   let authCookie: string;
  78  |   let authContext: any;
  79  |   let authPage: any;
  80  | 
  81  |   test.beforeAll(async ({ browser }) => {
  82  |     authContext = await browser.newContext();
  83  |     authPage = await authContext.newPage();
  84  | 
  85  |     const testHelpers = new TestHelpers(authPage);
  86  |     await testHelpers.login();
  87  | 
  88  |     const cookies = await authContext.cookies();
  89  |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  90  |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  91  |   });
  92  | 
  93  |   test.afterAll(async () => {
  94  |     if (authPage) await authPage.close();
  95  |     if (authContext) await authContext.close();
  96  |   });
  97  | 
  98  |   test('should execute Monthly Revenue Trend query', async ({ request }) => {
  99  |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  100 |     const queriesResponse = await apiHelpers.getQueries();
  101 |     const queriesData = await ApiTestHelpers.extractJson(queriesResponse);
  102 |     const query = queriesData.data.items.find((q: any) => q.name === 'Monthly Revenue Trend');
  103 | 
  104 |     const executeResponse = await apiHelpers.executeQuery(query.id);
  105 |     expect(executeResponse.status()).toBe(200);
  106 | 
  107 |     const result = await ApiTestHelpers.extractJson(executeResponse);
  108 |     expect(result.success).toBe(true);
  109 |     expect(result.data.rows).toBeInstanceOf(Array);
  110 |     expect(result.data.rows.length).toBeGreaterThan(0);
  111 |   });
  112 | 
  113 |   test('should execute Revenue by Category query', async ({ request }) => {
  114 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  115 |     const queriesResponse = await apiHelpers.getQueries();
  116 |     const queriesData = await ApiTestHelpers.extractJson(queriesResponse);
  117 |     const query = queriesData.data.items.find((q: any) => q.name === 'Revenue by Film Category');
  118 | 
  119 |     const executeResponse = await apiHelpers.executeQuery(query.id);
  120 |     expect(executeResponse.status()).toBe(200);
  121 | 
  122 |     const result = await ApiTestHelpers.extractJson(executeResponse);
  123 |     expect(result.success).toBe(true);
  124 |     expect(result.data.rows).toBeInstanceOf(Array);
  125 |   });
  126 | 
  127 |   test('should execute Top Customers query', async ({ request }) => {
  128 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  129 |     const queriesResponse = await apiHelpers.getQueries();
  130 |     const queriesData = await ApiTestHelpers.extractJson(queriesResponse);
  131 |     const query = queriesData.data.items.find((q: any) => q.name === 'Top Customers by Spending');
  132 | 
  133 |     const executeResponse = await apiHelpers.executeQuery(query.id);
  134 |     expect(executeResponse.status()).toBe(200);
  135 | 
  136 |     const result = await ApiTestHelpers.extractJson(executeResponse);
  137 |     expect(result.success).toBe(true);
  138 |     expect(result.data.rows).toBeInstanceOf(Array);
  139 |     expect(result.data.rows.length).toBeGreaterThan(0);
  140 |   });
  141 | });
  142 | 
  143 | test.describe('Sakila Analytics - Reports', () => {
  144 |   let authCookie: string;
  145 |   let authContext: any;
  146 |   let authPage: any;
  147 | 
  148 |   test.beforeAll(async ({ browser }) => {
  149 |     authContext = await browser.newContext();
  150 |     authPage = await authContext.newPage();
  151 | 
  152 |     const testHelpers = new TestHelpers(authPage);
  153 |     await testHelpers.login();
  154 | 
  155 |     const cookies = await authContext.cookies();
  156 |     const authCookieObj = cookies.find(c => c.name.includes('session-token'));
  157 |     authCookie = authCookieObj ? `${authCookieObj.name}=${authCookieObj.value}` : '';
  158 |   });
  159 | 
  160 |   test.afterAll(async () => {
  161 |     if (authPage) await authPage.close();
  162 |     if (authContext) await authContext.close();
  163 |   });
  164 | 
  165 |   test('should have Monthly Revenue Report', async ({ request }) => {
  166 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  167 |     const response = await apiHelpers.getReports();
  168 |     expect(response.status()).toBe(200);
  169 | 
  170 |     const data = await ApiTestHelpers.extractJson(response);
  171 |     const report = data.data.items.find((r: any) => r.name === 'Monthly Revenue Report');
```
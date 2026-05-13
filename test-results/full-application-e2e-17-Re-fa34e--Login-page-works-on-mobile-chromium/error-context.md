# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-application-e2e.spec.ts >> 17. Responsive Design >> 17.1 Login page works on mobile
- Location: e2e/full-application-e2e.spec.ts:766:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/login
Call log:
  - navigating to "http://localhost:4050/login", waiting until "load"

```

# Test source

```ts
  668 |     expect(data.success).toBe(true);
  669 |   });
  670 | 
  671 |   test('16.6 GET /api/admin/users returns data', async ({ request }) => {
  672 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  673 |     const response = await apiHelpers.getAdminUsers();
  674 |     expect(response.status()).toBe(200);
  675 |     const data = await ApiTestHelpers.extractJson(response);
  676 |     expect(data.success).toBe(true);
  677 |   });
  678 | 
  679 |   test('16.7 GET /api/admin/roles returns data', async ({ request }) => {
  680 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  681 |     const response = await apiHelpers.getRoles();
  682 |     expect(response.status()).toBe(200);
  683 |     const data = await ApiTestHelpers.extractJson(response);
  684 |     expect(data.success).toBe(true);
  685 |   });
  686 | 
  687 |   test('16.8 POST /api/data-sources creates data source', async ({ request }) => {
  688 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  689 |     const response = await apiHelpers.createDataSource({
  690 |       name: `E2E DS ${Date.now()}`,
  691 |       clientType: 'sqlite3',
  692 |       connectionConfig: { filename: ':memory:' },
  693 |     });
  694 |     expect(response.status()).toBe(201);
  695 |     const data = await ApiTestHelpers.extractJson(response);
  696 |     expect(data.success).toBe(true);
  697 |     expect(data.data).toHaveProperty('id');
  698 |   });
  699 | 
  700 |   test('16.9 SQL execution works via API', async ({ request }) => {
  701 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  702 |     const dsResponse = await apiHelpers.createDataSource({
  703 |       name: `E2E SQL DS ${Date.now()}`,
  704 |       clientType: 'sqlite3',
  705 |       connectionConfig: { filename: ':memory:' },
  706 |     });
  707 |     const dsData = await ApiTestHelpers.extractJson(dsResponse);
  708 | 
  709 |     const sqlResponse = await apiHelpers.executeSql({
  710 |       sql: 'SELECT 1 as result, 2 as value',
  711 |       dataSourceId: dsData.data.id,
  712 |     });
  713 |     expect(sqlResponse.status()).toBe(200);
  714 |     const sqlData = await ApiTestHelpers.extractJson(sqlResponse);
  715 |     expect(sqlData.success).toBe(true);
  716 |     expect(sqlData.data.rows.length).toBe(1);
  717 |   });
  718 | 
  719 |   test('16.10 SQL validation works', async ({ request }) => {
  720 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  721 |     const response = await apiHelpers.validateSql({
  722 |       sql: 'SELECT * FROM users WHERE id = 1',
  723 |     });
  724 |     expect(response.status()).toBe(200);
  725 |     const data = await ApiTestHelpers.extractJson(response);
  726 |     expect(data.success).toBe(true);
  727 |     expect(data.data).toHaveProperty('isValid');
  728 |   });
  729 | 
  730 |   test('16.11 Non-SELECT SQL is rejected', async ({ request }) => {
  731 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  732 |     const dsResponse = await apiHelpers.createDataSource({
  733 |       name: `E2E DDL DS ${Date.now()}`,
  734 |       clientType: 'sqlite3',
  735 |       connectionConfig: { filename: ':memory:' },
  736 |     });
  737 |     const dsData = await ApiTestHelpers.extractJson(dsResponse);
  738 | 
  739 |     const response = await apiHelpers.executeSql({
  740 |       sql: 'DROP TABLE users',
  741 |       dataSourceId: dsData.data.id,
  742 |     });
  743 |     expect(response.status()).toBe(403);
  744 |   });
  745 | 
  746 |   test('16.12 Invalid input is rejected', async ({ request }) => {
  747 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  748 |     const response = await apiHelpers.createDataSource({ name: 'Invalid' } as any);
  749 |     expect(response.status()).toBe(400);
  750 |   });
  751 | 
  752 |   test('16.13 404 for non-existent resource', async ({ request }) => {
  753 |     const apiHelpers = new ApiTestHelpers(request, authCookie);
  754 |     const response = await apiHelpers.getDataSource('non-existent-id');
  755 |     expect(response.status()).toBe(404);
  756 |   });
  757 | });
  758 | 
  759 | // ============================================================================
  760 | // 17. RESPONSIVE DESIGN
  761 | // ============================================================================
  762 | 
  763 | test.describe('17. Responsive Design', () => {
  764 |   test.use({ storageState: { cookies: [], origins: [] } });
  765 | 
  766 |   test('17.1 Login page works on mobile', async ({ page }) => {
  767 |     await page.setViewportSize({ width: 375, height: 667 });
> 768 |     await page.goto('/login');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/login
  769 |     await page.waitForLoadState('domcontentloaded');
  770 | 
  771 |     await expect(page.getByText('Welcome back')).toBeVisible({ timeout: 10000 });
  772 |     await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  773 |   });
  774 | 
  775 |   test('17.2 Dashboard works on tablet', async ({ page }) => {
  776 |     await page.setViewportSize({ width: 768, height: 1024 });
  777 |     await loginViaApi(page);
  778 |     await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible({
  779 |       timeout: 15000,
  780 |     });
  781 |   });
  782 | });
  783 | 
```
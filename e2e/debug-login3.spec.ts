import { test } from '@playwright/test';

test('debug server fn response', async ({ page }) => {
  let serverFnResponse: any = null;
  
  page.on('response', async res => {
    if (res.url().includes('_serverFn')) {
      const body = await res.text().catch(() => '(error reading body)');
      serverFnResponse = { status: res.status(), headers: res.headers(), body: body.substring(0, 500) };
    }
  });
  
  await page.goto('http://localhost:4050/login');
  await page.waitForLoadState('networkidle');
  await page.getByPlaceholder('name@example.com').fill('admin@admin.com');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForTimeout(4000);
  
  console.log('Server fn response:', JSON.stringify(serverFnResponse, null, 2));
  console.log('Final URL:', page.url());
  const alertText = await page.locator('[role="alert"]').innerText().catch(() => '(no alert)');
  console.log('Alert:', alertText);
});

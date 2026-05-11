import { test } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('check permissions error', async ({ page }) => {
  const errors: string[] = [];
  page.on('response', async res => {
    if (res.url().includes('permissions')) {
      const body = await res.text();
      errors.push(`${res.status()}: ${body}`);
    }
  });
  
  await page.goto('/');
  await page.getByPlaceholder('name@example.com').fill('admin@admin.com');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForTimeout(4000);
  
  console.log('Permissions responses:', errors.join('\n'));
});

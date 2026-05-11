import { test, expect } from '@playwright/test';

test('debug login form submission', async ({ page }) => {
  const allRequests: Array<{method: string, url: string, postData: string | null}> = [];
  
  page.on('request', req => {
    allRequests.push({
      method: req.method(),
      url: req.url().replace('http://localhost:4050', ''),
      postData: req.postData()
    });
  });
  
  await page.goto('http://localhost:4050/login');
  await page.waitForLoadState('networkidle');
  
  // Fill form
  await page.getByPlaceholder('name@example.com').fill('admin@admin.com');
  await page.getByLabel('Password').fill('admin');
  
  // Wait and then click
  await page.waitForTimeout(500);
  
  // Check if button is disabled
  const btn = page.getByRole('button', { name: 'Sign In' });
  const disabled = await btn.getAttribute('disabled');
  console.log('Button disabled:', disabled);
  
  await btn.click();
  await page.waitForTimeout(5000);
  
  console.log('Final URL:', page.url());
  
  // Print ALL requests including POSTs
  const postReqs = allRequests.filter(r => r.method === 'POST' || r.url.includes('_server'));
  console.log('POST / server requests:', JSON.stringify(postReqs, null, 2) || '(none)');
  
  // Print all unique request URLs that are not node_modules
  const meaningful = allRequests
    .filter(r => !r.url.startsWith('/node_modules') && !r.url.startsWith('/@'))
    .map(r => `${r.method} ${r.url}`);
  console.log('Meaningful requests:', meaningful.join('\n'));
});

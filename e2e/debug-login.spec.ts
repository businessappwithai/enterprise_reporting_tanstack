import { test, expect } from '@playwright/test';

test('debug login', async ({ page }) => {
  const allMessages: string[] = [];
  const errors: string[] = [];
  const allRequests: string[] = [];
  
  page.on('console', msg => allMessages.push(`${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => errors.push(err.message));
  page.on('request', req => allRequests.push(`${req.method()} ${req.url().replace('http://localhost:4050', '')}`));
  
  await page.goto('http://localhost:4050/login');
  await page.fill('input[placeholder="name@example.com"]', 'admin@admin.com');
  await page.fill('input[type="password"]', 'admin');
  
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  
  console.log('URL after login:', page.url());
  // Only print relevant requests
  const serverRequests = allRequests.filter(r => r.includes('_server') || r.includes('POST') || r.includes('login'));
  console.log('Server/POST requests:', serverRequests.join('\n') || '(none)');
  
  const relevantMessages = allMessages.filter(m => 
    !m.includes('vite') && !m.includes('DevTools') && !m.includes('font-weight')
  );
  console.log('Console:', relevantMessages.join('\n') || '(none)');
  console.log('Errors:', errors.join('\n') || '(none)');
  
  // Check error alert
  const errorAlert = page.locator('[role="alert"]');
  if (await errorAlert.isVisible()) {
    console.log('Error alert text:', await errorAlert.innerText());
  }
});

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reports-charts-comprehensive.spec.ts >> Reporting and Charting Comprehensive Test >> Check API endpoints for reporting
- Location: e2e/reports-charts-comprehensive.spec.ts:190:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 4
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e7]
      - heading "Welcome back" [level=3] [ref=e9]
      - paragraph [ref=e10]: Sign in to your Enterprise Reporting account
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - text: Email
          - textbox "Email" [ref=e14]:
            - /placeholder: name@example.com
        - generic [ref=e15]:
          - text: Password
          - textbox "Password" [ref=e16]
      - button "Sign In" [ref=e18] [cursor=pointer]
  - region "Notifications alt+T"
```

# Test source

```ts
  135 |     await saveDashboardBtn.click();
  136 |     await page.waitForTimeout(2000);
  137 | 
  138 |     console.log('✓ Dashboard created successfully');
  139 | 
  140 |     // Step 5: Add widgets to dashboard
  141 |     console.log('Step 5: Adding widgets to dashboard...');
  142 |     const addWidgetBtn = page.getByRole('button', { name: /add.*widget|widget/i }).or(page.getByRole('button', { name: /\+/i }).first());
  143 |     if (await addWidgetBtn.isVisible().catch(() => false)) {
  144 |       await addWidgetBtn.click();
  145 |       await page.waitForTimeout(1000);
  146 |       console.log('✓ Widget dialog opened');
  147 |     }
  148 | 
  149 |     console.log('\n=== Complete Workflow Test Finished ===\n');
  150 | 
  151 |     // Take final screenshot
  152 |     await page.screenshot({ path: 'test-results/reports-charts-workflow.png' });
  153 |   });
  154 | 
  155 |   test('Verify all reporting pages are accessible', async ({ page }) => {
  156 |     const pages = [
  157 |       { path: '/reports', name: 'Reports' },
  158 |       { path: '/charts', name: 'Charts' },
  159 |       { path: '/dashboards', name: 'Dashboards' },
  160 |       { path: '/sql-editor', name: 'SQL Editor' },
  161 |     ];
  162 | 
  163 |     for (const pageInfo of pages) {
  164 |       await page.goto(`${BASE_URL}${pageInfo.path}`);
  165 |       await page.waitForTimeout(1000);
  166 | 
  167 |       const h1 = page.locator('h1').first();
  168 |       const isVisible = await h1.isVisible().catch(() => false);
  169 | 
  170 |       console.log(`${isVisible ? '✓' : '✗'} ${pageInfo.name} page: ${isVisible ? 'Accessible' : 'Issue detected'}`);
  171 | 
  172 |       // Check for console errors
  173 |       const errors: string[] = [];
  174 |       page.on('response', response => {
  175 |         if (response.status() >= 400) {
  176 |           errors.push(`${response.url()}: ${response.status()}`);
  177 |         }
  178 |       });
  179 | 
  180 |       await page.waitForTimeout(500);
  181 | 
  182 |       if (errors.length > 0) {
  183 |         console.log(`  Warnings: ${errors.length} error responses`);
  184 |       }
  185 |     }
  186 | 
  187 |     console.log('\n✓ All reporting pages verified');
  188 |   });
  189 | 
  190 |   test('Check API endpoints for reporting', async ({ page }) => {
  191 |     const endpoints = [
  192 |       '/api/reports',
  193 |       '/api/charts',
  194 |       '/api/dashboards',
  195 |       '/api/queries',
  196 |     ];
  197 | 
  198 |     const apiErrors: string[] = [];
  199 | 
  200 |     // Listen for API errors
  201 |     page.on('response', response => {
  202 |       if (response.url().includes('/api/') && response.status() === 500) {
  203 |         apiErrors.push(`${response.url()}: 500`);
  204 |       }
  205 |     });
  206 | 
  207 |     for (const endpoint of endpoints) {
  208 |       await page.goto(`${BASE_URL}/reports`); // Navigate to authenticated page first
  209 |       await page.waitForTimeout(500);
  210 | 
  211 |       // Make fetch request via page.evaluate
  212 |       const result = await page.evaluate(async (url) => {
  213 |         try {
  214 |           const response = await fetch(url);
  215 |           return { status: response.status, ok: response.ok };
  216 |         } catch (e) {
  217 |           return { status: 0, ok: false, error: (e as Error).message };
  218 |         }
  219 |       }, `${BASE_URL}${endpoint}?pageSize=10`);
  220 | 
  221 |       const status = result.ok ? '✓' : '✗';
  222 |       console.log(`${status} ${endpoint}: ${result.status}`);
  223 | 
  224 |       if (!result.ok) {
  225 |         apiErrors.push(`${endpoint}: ${result.status}`);
  226 |       }
  227 |     }
  228 | 
  229 |     console.log('\n✓ API endpoint check complete');
  230 | 
  231 |     if (apiErrors.length > 0) {
  232 |       console.log('API Errors:', apiErrors);
  233 |     }
  234 | 
> 235 |     expect(apiErrors.length).toBe(0);
      |                              ^ Error: expect(received).toBe(expected) // Object.is equality
  236 |   });
  237 | });
  238 | 
```
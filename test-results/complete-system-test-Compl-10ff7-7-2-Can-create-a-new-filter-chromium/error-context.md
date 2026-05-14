# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: complete-system-test.spec.ts >> Complete System Test Suite >> Filters >> 7.2 Can create a new filter
- Location: e2e/complete-system-test.spec.ts:499:5

# Error details

```
TimeoutError: page.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('button:has-text("New Filter"), button:has-text("Create Filter")')

```

# Page snapshot

```yaml
- generic:
  - generic:
    - generic:
      - generic:
        - generic:
          - img
      - generic:
        - heading [level=1]: Something went wrong
        - paragraph: An unexpected error has occurred. Our team has been notified and we're working to fix it.
      - generic:
        - paragraph: filters?.map is not a function
      - generic:
        - button:
          - img
          - text: Reload Page
        - button: Report Error
      - paragraph: If this problem persists, please contact your system administrator.
  - dialog "Error Report" [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - img [ref=e5]
        - heading "Error Report" [level=2] [ref=e7]
      - paragraph [ref=e8]: An unexpected error occurred. Please help us improve by reporting this issue.
    - generic [ref=e9]:
      - generic [ref=e10]:
        - paragraph [ref=e11]: filters?.map is not a function
        - paragraph [ref=e12]: 2026-05-14T05:19:22.553Z
      - generic [ref=e13]:
        - text: Additional Information (Optional)
        - textbox "Additional Information (Optional)" [active] [ref=e14]:
          - /placeholder: Describe what you were doing when this error occurred...
      - generic [ref=e15]:
        - text: Email Preview
        - generic [ref=e16]:
          - textbox "Email Preview" [ref=e17]: "ERROR REPORT ============ Timestamp: 2026-05-14T05:19:22.553Z Error: filters?.map is not a function Stack Trace: TypeError: filters?.map is not a function at FiltersPage (http://localhost:4050/src/routes/_authed/filters/index.tsx?tsr-split=component:397:27) at Object.react_stack_bottom_frame (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:18509:20) at renderWithHooks (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:5654:24) at updateFunctionComponent (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:7475:21) at beginWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:8525:20) at runWithFiberInDEV (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:997:72) at performUnitOfWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12561:98) at workLoopSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12424:43) at renderRootSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12408:13) at performWorkOnRoot (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:11827:37) Component Stack: at FiltersPage (http://localhost:4050/src/routes/_authed/filters/index.tsx?tsr-split=component:40:23) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at main (<anonymous>) at div (<anonymous>) at div (<anonymous>) at ActiveDataSourceProvider (http://localhost:4050/src/lib/hooks/use-active-datasource.tsx:20:44) at AppShell (http://localhost:4050/src/components/layout/app-shell.tsx:23:28) at AuthedLayout (http://localhost:4050/src/routes/_authed.tsx?tsr-split=component:25:13) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at Suspense (<anonymous>) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at V (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:44:25) at J (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:42:18) at QueryClientProvider (http://localhost:4050/node_modules/.vite/deps/@tanstack_react-query.js?v=a26a3e3e:3170:3) at Provider (http://localhost:4050/node_modules/.vite/deps/chunk-GQ5SNI5U.js?v=a26a3e3e:43:15) at TooltipProvider (http://localhost:4050/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=a26a3e3e:157:5) at TanStackDBWrapper (http://localhost:4050/src/lib/tanstack-db/provider.tsx:29:37) at ErrorBoundary (http://localhost:4050/src/components/errors/error-boundary.tsx:11:5) at body (<anonymous>) at html (<anonymous>) at RootComponent (http://localhost:4050/src/routes/__root.tsx:44:33) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at CatchBoundaryImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:20:5) at CatchBoundary (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:5:32) at MatchesInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:24:18) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at Matches (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:14:18) at RouterContextProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:12:34) at RouterProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:37:27) at AwaitInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:27:15) at Await (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:20:12) at StartClient (<anonymous>) Context: URL: http://localhost:4050/filters User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36"
          - button "Copy" [ref=e18] [cursor=pointer]:
            - img [ref=e19]
            - text: Copy
        - paragraph [ref=e22]: This will be sent to admin@yourcompany.com
      - paragraph [ref=e24]:
        - strong [ref=e25]: "What happens next:"
        - text: Clicking "Send Error Report" will open your email client with the error details pre-filled. You can review the contents before sending.
    - generic [ref=e26]:
      - button "Dismiss" [ref=e27] [cursor=pointer]:
        - img [ref=e28]
        - text: Dismiss
      - button "Copy to Clipboard" [ref=e31] [cursor=pointer]:
        - img [ref=e32]
        - text: Copy to Clipboard
      - button "Send Error Report" [ref=e35] [cursor=pointer]:
        - img [ref=e36]
        - text: Send Error Report
    - button "Close" [ref=e39] [cursor=pointer]:
      - img [ref=e40]
      - generic [ref=e43]: Close
```

# Test source

```ts
  403 |         const hasChart = await page.locator('canvas, svg, .echarts, .recharts').count() > 0;
  404 |         expect(hasChart).toBeTruthy();
  405 |       }
  406 |     });
  407 |   });
  408 | 
  409 |   // ========================================================================
  410 |   // PART 6: DASHBOARDS
  411 |   // ========================================================================
  412 | 
  413 |   test.describe('Dashboards', () => {
  414 |     test.beforeEach(async ({ page }) => {
  415 |       await login(page);
  416 |     });
  417 | 
  418 |     test('6.1 Can view dashboards list', async ({ page }) => {
  419 |       await page.goto(`${BASE_URL}/dashboards`);
  420 | 
  421 |       await expect(page.locator('h1').filter({ hasText: /dashboards/i })).toBeVisible();
  422 |     });
  423 | 
  424 |     test('6.2 Can create a new dashboard', async ({ page }) => {
  425 |       await page.goto(`${BASE_URL}/dashboards`);
  426 | 
  427 |       // Click new dashboard
  428 |       await page.click('button:has-text("New Dashboard"), button:has-text("Create Dashboard")');
  429 | 
  430 |       // Fill name
  431 |       const dashboardName = `E2E Dashboard ${Date.now()}`;
  432 |       await page.fill('input[name="name"]', dashboardName);
  433 | 
  434 |       // Save
  435 |       await page.click('button:has-text("Save"), button:has-text("Create")');
  436 | 
  437 |       await page.waitForTimeout(2000);
  438 |     });
  439 | 
  440 |     test('6.3 Can add widgets to dashboard', async ({ page }) => {
  441 |       await page.goto(`${BASE_URL}/dashboards`);
  442 | 
  443 |       // Navigate to first dashboard
  444 |       const firstDashboard = page.locator('table tbody tr, [role="row"], .card').first();
  445 |       const count = await firstDashboard.count();
  446 | 
  447 |       if (count > 0) {
  448 |         await firstDashboard.first().click();
  449 |         await page.waitForTimeout(2000);
  450 | 
  451 |         // Look for add widget button
  452 |         const addButton = page.locator('button:has-text("Add Widget"), button:has-text("Add")').first();
  453 | 
  454 |         if (await addButton.isVisible()) {
  455 |           await addButton.click();
  456 | 
  457 |           // Should show widget options
  458 |           await expect(page.locator('text=Chart, text=Metric, text=Table')).isVisible({ timeout: 3000 });
  459 |         }
  460 |       }
  461 |     });
  462 | 
  463 |     test('6.4 Can rearrange dashboard widgets', async ({ page }) => {
  464 |       await page.goto(`${BASE_URL}/dashboards`);
  465 | 
  466 |       const firstDashboard = page.locator('.dashboard-card, [data-testid="dashboard"]').first();
  467 | 
  468 |       if (await firstDashboard.isVisible()) {
  469 |         await firstDashboard.click();
  470 |         await page.waitForTimeout(2000);
  471 | 
  472 |         // Look for draggable widgets
  473 |         const widgets = page.locator('.widget, [draggable="true"]');
  474 |         const widgetCount = await widgets.count();
  475 | 
  476 |         if (widgetCount > 1) {
  477 |           // Widgets should be present and potentially draggable
  478 |           expect(widgetCount).toBeGreaterThan(0);
  479 |         }
  480 |       }
  481 |     });
  482 |   });
  483 | 
  484 |   // ========================================================================
  485 |   // PART 7: FILTERS
  486 |   // ========================================================================
  487 | 
  488 |   test.describe('Filters', () => {
  489 |     test.beforeEach(async ({ page }) => {
  490 |       await login(page);
  491 |     });
  492 | 
  493 |     test('7.1 Can view saved filters', async ({ page }) => {
  494 |       await page.goto(`${BASE_URL}/filters`);
  495 | 
  496 |       await expect(page.locator('h1').filter({ hasText: /filters/i })).toBeVisible();
  497 |     });
  498 | 
  499 |     test('7.2 Can create a new filter', async ({ page }) => {
  500 |       await page.goto(`${BASE_URL}/filters`);
  501 | 
  502 |       // Click new filter button
> 503 |       await page.click('button:has-text("New Filter"), button:has-text("Create Filter")');
      |                  ^ TimeoutError: page.click: Timeout 15000ms exceeded.
  504 | 
  505 |       // Fill filter details
  506 |       const filterName = `E2E Filter ${Date.now()}`;
  507 |       await page.fill('input[name="name"]', filterName);
  508 | 
  509 |       // Select field
  510 |       const fieldSelect = page.locator('select[name="field"], [role="combobox"]').first();
  511 |       if (await fieldSelect.isVisible()) {
  512 |         await fieldSelect.click();
  513 |         await page.keyboard.press('ArrowDown');
  514 |         await page.keyboard.press('Enter');
  515 |       }
  516 | 
  517 |       // Select operator
  518 |       const operatorSelect = page.locator('select[name="operator"]').first();
  519 |       if (await operatorSelect.isVisible()) {
  520 |         await operatorSelect.selectOption('equals');
  521 |       }
  522 | 
  523 |       // Enter value
  524 |       await page.fill('input[name="value"]', 'test_value');
  525 | 
  526 |       // Save
  527 |       await page.click('button:has-text("Save")');
  528 |       await page.waitForTimeout(2000);
  529 |     });
  530 | 
  531 |     test('7.3 Can apply filter to report', async ({ page }) => {
  532 |       await page.goto(`${BASE_URL}/reports`);
  533 | 
  534 |       // Navigate to a report
  535 |       const firstReport = page.locator('table tbody tr').first();
  536 |       const count = await firstReport.count();
  537 | 
  538 |       if (count > 0) {
  539 |         await firstReport.click();
  540 |         await page.waitForTimeout(2000);
  541 | 
  542 |         // Look for filter UI
  543 |         const filterSection = page.locator('.filter-bar, [data-testid="filters"]').first();
  544 | 
  545 |         if (await filterSection.isVisible()) {
  546 |           // Should have filter options
  547 |           expect(filterSection).toBeVisible();
  548 |         }
  549 |       }
  550 |     });
  551 |   });
  552 | 
  553 |   // ========================================================================
  554 |   // PART 8: METADATA ENTITIES
  555 |   // ========================================================================
  556 | 
  557 |   test.describe('Metadata Entities', () => {
  558 |     test.beforeEach(async ({ page }) => {
  559 |       await login(page);
  560 |     });
  561 | 
  562 |     test('8.1 Can view metadata entities', async ({ page }) => {
  563 |       await page.goto(`${BASE_URL}/metadata/entities`);
  564 | 
  565 |       await expect(page.locator('h1').filter({ hasText: /metadata/i })).toBeVisible();
  566 |     });
  567 | 
  568 |     test('8.2 Can create a metadata entity', async ({ page }) => {
  569 |       await page.goto(`${BASE_URL}/metadata/entities`);
  570 | 
  571 |       // Click new entity button
  572 |       await page.click('button:has-text("New Entity"), button:has-text("Create Entity")');
  573 | 
  574 |       // Wait for form
  575 |       await page.waitForTimeout(1000);
  576 | 
  577 |       // Fill entity details
  578 |       const entityName = `e2e_entity_${Date.now()}`;
  579 |       const nameInput = page.locator('input[name="name"], input[name="entity_name"]');
  580 | 
  581 |       if (await nameInput.isVisible()) {
  582 |         await nameInput.fill(entityName);
  583 | 
  584 |         // Select data source
  585 |         const dataSourceSelect = page.locator('select[name="dataSource"]').first();
  586 |         if (await dataSourceSelect.isVisible()) {
  587 |           await dataSourceSelect.click();
  588 |           await page.keyboard.press('ArrowDown');
  589 |           await page.keyboard.press('Enter');
  590 |         }
  591 | 
  592 |         // Save
  593 |         await page.click('button:has-text("Save"), button:has-text("Create")');
  594 |         await page.waitForTimeout(2000);
  595 |       }
  596 |     });
  597 | 
  598 |     test('8.3 Can configure entity fields', async ({ page }) => {
  599 |       await page.goto(`${BASE_URL}/metadata/entities`);
  600 | 
  601 |       // Click on first entity
  602 |       const firstEntity = page.locator('table tbody tr, [role="row"]').first();
  603 |       const count = await firstEntity.count();
```
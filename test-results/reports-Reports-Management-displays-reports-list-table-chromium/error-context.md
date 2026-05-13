# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reports.spec.ts >> Reports Management >> displays reports list table
- Location: e2e/reports.spec.ts:37:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
Call log:
  - navigating to "http://localhost:4050/", waiting until "load"

```

# Test source

```ts
  1   | import { Page, Locator } from '@playwright/test';
  2   | 
  3   | export class TestHelpers {
  4   |   constructor(private page: Page) {}
  5   | 
  6   |   /**
  7   |    * Login to the application with default credentials
  8   |    * Goes to home page first, then logs in if needed
  9   |    */
  10  |   async login(email = 'admin@admin.com', password = 'admin') {
  11  |     // Start at home page - this will redirect to login if not authenticated
> 12  |     await this.page.goto('/');
      |                     ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:4050/
  13  | 
  14  |     // Wait for page load
  15  |     await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  16  | 
  17  |     // Check if we're on login page
  18  |     const currentUrl = this.page.url();
  19  |     if (currentUrl.includes('/login')) {
  20  |       // Need to log in
  21  |       await this.page.getByPlaceholder('name@example.com').fill(email);
  22  |       await this.page.getByLabel('Password').fill(password);
  23  |       await this.page.getByRole('button', { name: 'Sign In' }).click();
  24  | 
  25  |       // Wait for ONE of multiple indicators of successful login (more robust)
  26  |       await Promise.race([
  27  |         // Option 1: Dashboard heading (case-insensitive)
  28  |         this.page.getByRole('heading', { name: /dashboard/i }).waitFor({ state: 'visible', timeout: 15000 }),
  29  |         // Option 2: Navigation menu
  30  |         this.page.getByRole('navigation').waitFor({ state: 'visible', timeout: 15000 }),
  31  |         // Option 3: URL change to home (not login)
  32  |         this.page.waitForURL(url => !url.includes('/login'), { timeout: 15000 }),
  33  |       ]).catch(() => {
  34  |         // If none of the above work, just wait for the hard redirect timeout
  35  |         return this.page.waitForTimeout(5000);
  36  |       });
  37  |     } else {
  38  |       // Already at home page, wait for it to be fully loaded
  39  |       await this.page.waitForTimeout(2000);
  40  |     }
  41  | 
  42  |     // Wait for page to be fully loaded
  43  |     await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  44  | 
  45  |     // Additional wait for session to be established
  46  |     await this.page.waitForTimeout(1500);
  47  |   }
  48  | 
  49  |   /**
  50  |    * Navigate to a specific page by name
  51  |    * Uses direct URL navigation for reliability
  52  |    */
  53  |   async navigateToPage(pageName: 'Dashboard' | 'SQL Editor' | 'Reports' | 'Charts' | 'Dashboards') {
  54  |     // Map page names to their routes
  55  |     const routes: Record<string, string> = {
  56  |       'Dashboard': '/',
  57  |       'SQL Editor': '/sql-editor',
  58  |       'Reports': '/reports',
  59  |       'Charts': '/charts',
  60  |       'Dashboards': '/dashboards',
  61  |     };
  62  | 
  63  |     const route = routes[pageName];
  64  |     if (!route) {
  65  |       throw new Error(`Unknown page: ${pageName}`);
  66  |     }
  67  | 
  68  |     // Use direct URL navigation - most reliable
  69  |     await this.page.goto(route, { waitUntil: 'domcontentloaded' });
  70  | 
  71  |     // Wait for page to be fully loaded
  72  |     await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 }).catch(() => {});
  73  |     await this.page.waitForTimeout(1000);
  74  |   }
  75  | 
  76  |   /**
  77  |    * Wait for and verify toast notification
  78  |    */
  79  |   async verifyToast(message: string, type: 'success' | 'error' = 'success') {
  80  |     const toast = this.page.getByText(message).first();
  81  |     await toast.waitFor({ state: 'visible', timeout: 5000 });
  82  |     return toast;
  83  |   }
  84  | 
  85  |   /**
  86  |    * Select from a dropdown by trigger and option text
  87  |    * Improved to handle Radix UI dropdowns with better waiting
  88  |    */
  89  |   async selectDropdown(triggerText: string, optionText: string, timeout = 10000) {
  90  |     // Click the dropdown trigger
  91  |     const trigger = this.page.getByText(triggerText).first();
  92  |     await trigger.waitFor({ state: 'visible', timeout });
  93  |     await trigger.click();
  94  | 
  95  |     // Wait for dropdown content to appear - Radix UI uses portals
  96  |     await this.page.waitForTimeout(500);
  97  | 
  98  |     // Try to find the option with multiple selectors for robustness
  99  |     const option = this.page.getByRole('option', { name: optionText }).first();
  100 | 
  101 |     try {
  102 |       await option.waitFor({ state: 'visible', timeout: 5000 });
  103 |       await option.click();
  104 |     } catch (error) {
  105 |       // Fallback: try clicking by text if role='option' didn't work
  106 |       const textOption = this.page.getByText(optionText).first();
  107 |       await textOption.waitFor({ state: 'visible', timeout: 5000 });
  108 |       await textOption.click();
  109 |     }
  110 | 
  111 |     // Wait for selection to complete
  112 |     await this.page.waitForTimeout(300);
```
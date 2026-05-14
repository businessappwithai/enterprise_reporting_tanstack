# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: wasm-features-complete.spec.ts >> WASM Features - Datasets >> WASM-008: Dataset shows row count
- Location: e2e/wasm-features-complete.spec.ts:148:3

# Error details

```
Error: locator.isVisible: SyntaxError: Invalid flags supplied to RegExp constructor 'i, .row-count, [data-testid="row-count"]'
    at new RegExp (<anonymous>)
    at createTextMatcher (<anonymous>:7846:16)
    at Object.queryAll (<anonymous>:6672:33)
    at InjectedScript._queryEngineAll (<anonymous>:6645:49)
    at InjectedScript.querySelectorAll (<anonymous>:6632:30)
    at InjectedScript.querySelector (<anonymous>:6544:25)
    at eval (eval at evaluate (:302:30), <anonymous>:2:34)
    at UtilityScript.evaluate (<anonymous>:304:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
Call log:
    - checking visibility of locator('text=/rows?/i, .row-count, [data-testid="row-count"]')

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
        - paragraph: useDuckDB must be used within a DuckDBProvider
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
        - paragraph [ref=e11]: useDuckDB must be used within a DuckDBProvider
        - paragraph [ref=e12]: 2026-05-14T05:39:59.055Z
      - generic [ref=e13]:
        - text: Additional Information (Optional)
        - textbox "Additional Information (Optional)" [active] [ref=e14]:
          - /placeholder: Describe what you were doing when this error occurred...
      - generic [ref=e15]:
        - text: Email Preview
        - generic [ref=e16]:
          - textbox "Email Preview" [ref=e17]: "ERROR REPORT ============ Timestamp: 2026-05-14T05:39:59.055Z Error: useDuckDB must be used within a DuckDBProvider Stack Trace: Error: useDuckDB must be used within a DuckDBProvider at useDuckDB (http://localhost:4050/src/components/duckdb/DuckDBProvider.tsx:152:11) at DatasetsPage (http://localhost:4050/src/routes/_authed/datasets/index.tsx?tsr-split=component:29:7) at Object.react_stack_bottom_frame (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:18509:20) at renderWithHooks (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:5654:24) at updateFunctionComponent (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:7475:21) at beginWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:8525:20) at runWithFiberInDEV (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:997:72) at performUnitOfWork (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12561:98) at workLoopSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12424:43) at renderRootSync (http://localhost:4050/node_modules/.vite/deps/react-dom_client.js?v=a26a3e3e:12408:13) Component Stack: at DatasetsPage (http://localhost:4050/src/routes/_authed/datasets/index.tsx?tsr-split=component:29:7) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at main (<anonymous>) at div (<anonymous>) at div (<anonymous>) at ActiveDataSourceProvider (http://localhost:4050/src/lib/hooks/use-active-datasource.tsx:20:44) at AppShell (http://localhost:4050/src/components/layout/app-shell.tsx:23:28) at AuthedLayout (http://localhost:4050/src/routes/_authed.tsx?tsr-split=component:25:13) at Lazy (<anonymous>) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at Suspense (<anonymous>) at OutletImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:250:18) at V (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:44:25) at J (http://localhost:4050/node_modules/.vite/deps/next-themes.js?v=a26a3e3e:42:18) at QueryClientProvider (http://localhost:4050/node_modules/.vite/deps/@tanstack_react-query.js?v=a26a3e3e:3170:3) at Provider (http://localhost:4050/node_modules/.vite/deps/chunk-GQ5SNI5U.js?v=a26a3e3e:43:15) at TooltipProvider (http://localhost:4050/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=a26a3e3e:157:5) at TanStackDBWrapper (http://localhost:4050/src/lib/tanstack-db/provider.tsx:29:37) at ErrorBoundary (http://localhost:4050/src/components/errors/error-boundary.tsx:11:5) at body (<anonymous>) at html (<anonymous>) at RootComponent (http://localhost:4050/src/routes/__root.tsx:44:33) at MatchInnerImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:127:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at MatchView (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:66:22) at MatchImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Match.js?v=a26a3e3e:16:47) at CatchBoundaryImpl (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:20:5) at CatchBoundary (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/CatchBoundary.js?v=a26a3e3e:5:32) at MatchesInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:24:18) at SafeFragment (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/SafeFragment.js?v=a26a3e3e:5:57) at Matches (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/Matches.js?v=a26a3e3e:14:18) at RouterContextProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:12:34) at RouterProvider (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/RouterProvider.js?v=a26a3e3e:37:27) at AwaitInner (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:27:15) at Await (http://localhost:4050/node_modules/@tanstack/react-router/dist/esm/awaited.js?v=a26a3e3e:20:12) at StartClient (<anonymous>) Context: URL: http://localhost:4050/datasets User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36"
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
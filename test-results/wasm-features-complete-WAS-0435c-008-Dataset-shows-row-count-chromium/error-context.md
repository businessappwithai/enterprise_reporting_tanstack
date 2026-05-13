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
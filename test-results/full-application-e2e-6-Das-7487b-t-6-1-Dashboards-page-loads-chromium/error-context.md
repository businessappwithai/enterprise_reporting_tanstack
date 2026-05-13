# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-application-e2e.spec.ts >> 6. Dashboards Management >> 6.1 Dashboards page loads
- Location: e2e/full-application-e2e.spec.ts:334:3

# Error details

```
Error: apiRequestContext.get: connect ECONNREFUSED ::1:4050
Call log:
  - → GET http://localhost:4050/api/auth/csrf
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br

```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-comprehensive.spec.ts >> API - Health Check >> should return health status
- Location: e2e/api-comprehensive.spec.ts:16:3

# Error details

```
Error: apiRequestContext.get: connect ECONNREFUSED ::1:4050
Call log:
  - → GET http://localhost:4050/api/health
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.15 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br

```
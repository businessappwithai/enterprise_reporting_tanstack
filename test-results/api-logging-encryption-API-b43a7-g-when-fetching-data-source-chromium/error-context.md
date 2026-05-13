# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api-logging-encryption.spec.ts >> API - Encryption & Decryption >> should decrypt connection config when fetching data source
- Location: e2e/api-logging-encryption.spec.ts:70:3

# Error details

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

# Test source

```ts
  411 | 
  412 |   /**
  413 |    * Update user roles
  414 |    */
  415 |   async updateUserRoles(userId: string, roleIds: string[]) {
  416 |     return await this.authenticatedRequest('PATCH', `/api/admin/users/${userId}/roles`, { roleIds });
  417 |   }
  418 | 
  419 |   /**
  420 |    * Get roles
  421 |    */
  422 |   async getRoles() {
  423 |     return await this.authenticatedRequest('GET', '/api/admin/roles');
  424 |   }
  425 | 
  426 |   /**
  427 |    * Create role
  428 |    */
  429 |   async createRole(data: {
  430 |     name: string;
  431 |     description?: string;
  432 |     permissions?: string[];
  433 |   }) {
  434 |     return await this.authenticatedRequest('POST', '/api/admin/roles', data);
  435 |   }
  436 | 
  437 |   /**
  438 |    * Get health status
  439 |    */
  440 |   async getHealth() {
  441 |     return await this.authenticatedRequest('GET', '/api/health');
  442 |   }
  443 | 
  444 |   /**
  445 |    * List data sources (alias for getDataSources)
  446 |    */
  447 |   async listDataSources() {
  448 |     return this.getDataSources();
  449 |   }
  450 | 
  451 |   /**
  452 |    * Inspect datasource schema
  453 |    */
  454 |   async inspectSchema(dataSourceId: string) {
  455 |     return await this.authenticatedRequest('POST', `/api/data-sources/${dataSourceId}/inspect`);
  456 |   }
  457 | 
  458 |   /**
  459 |    * Get metadata entities for a datasource
  460 |    */
  461 |   async getMetadataEntities(dataSourceId: string, params?: {
  462 |     include_hidden?: boolean;
  463 |     is_active?: boolean;
  464 |   }) {
  465 |     const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  466 |     return await this.authenticatedRequest('GET', `/api/metadata/entities${queryString}`);
  467 |   }
  468 | 
  469 |   /**
  470 |    * Reset inspection state for testing
  471 |    */
  472 |   async resetInspectionState(dataSourceId: string) {
  473 |     const headers = {
  474 |       'Content-Type': 'application/json',
  475 |       'Cookie': this.authCookie,
  476 |       'x-test-mode': 'true',
  477 |     };
  478 | 
  479 |     return await this.request.post('/api/test/sql/execute', {
  480 |       headers,
  481 |       data: JSON.stringify({
  482 |         sql: `UPDATE data_sources SET is_inspected = 0 WHERE id = '${dataSourceId}'`,
  483 |         dataSourceId,
  484 |       }),
  485 |     });
  486 |   }
  487 | 
  488 |   /**
  489 |    * Clear metadata entities for testing
  490 |    */
  491 |   async clearMetadataEntities(dataSourceId: string) {
  492 |     const headers = {
  493 |       'Content-Type': 'application/json',
  494 |       'Cookie': this.authCookie,
  495 |       'x-test-mode': 'true',
  496 |     };
  497 | 
  498 |     return await this.request.post('/api/test/sql/execute', {
  499 |       headers,
  500 |       data: JSON.stringify({
  501 |         sql: `DELETE FROM metadata_entity_field WHERE entity_header_id IN (SELECT id FROM metadata_entity_header WHERE data_source_id = '${dataSourceId}'); DELETE FROM metadata_entity_header WHERE data_source_id = '${dataSourceId}'`,
  502 |         dataSourceId,
  503 |       }),
  504 |     });
  505 |   }
  506 | 
  507 |   /**
  508 |    * Helper to extract response data
  509 |    */
  510 |   static async extractJson<T = any>(response: APIResponse): Promise<T> {
> 511 |     return await response.json() as Promise<T>;
      |            ^ SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
  512 |   }
  513 | 
  514 |   /**
  515 |    * Helper to check if response is successful
  516 |    */
  517 |   static isSuccess(response: APIResponse): boolean {
  518 |     return response.status() >= 200 && response.status() < 300;
  519 |   }
  520 | }
  521 | 
```
/**
 * Remove dataset rows an earlier build left in the browser.
 *
 * `useDataset` and `useDatasetEnhanced` used to write every loaded dataset to IndexedDB as
 * `parquet_<id>`, and the enhanced hook served it back without asking the server. Those rows were
 * produced under the permissions the person held at the time; a copy that outlives them (a role
 * revoked, a shared browser, a different user signing in on the same machine) is data they may no
 * longer read. Nothing writes the cache now, so this only ever deletes: it runs when the Datasets
 * page opens and on sign-out. Best effort - IndexedDB can be unavailable (private windows).
 */
export async function purgeDatasetCache(): Promise<number> {
  try {
    const { delMany, keys } = await import("idb-keyval");
    const stale = (await keys()).filter(
      (key) => typeof key === "string" && key.startsWith("parquet_")
    );
    if (stale.length > 0) await delMany(stale);
    return stale.length;
  } catch {
    return 0;
  }
}

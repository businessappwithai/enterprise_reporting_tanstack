"use client";

/**
 * Hook for loading and managing datasets in DuckDB-Wasm.
 * Fetches a dataset (an Arrow IPC stream built from its saved query, for the signed-in
 * user) from the server and loads it into DuckDB. Nothing is cached in the browser: the
 * rows were produced under the caller's permissions at that moment, and a copy left in
 * IndexedDB would outlive them.
 */

import { useCallback, useState } from "react";
import { useDuckDB } from "@/components/duckdb/DuckDBProvider";
import { fetchParquetBuffer } from "@/lib/arrow/parquet";
import type { DatasetInfo } from "@/types/datasets";

interface UseDatasetReturn {
  datasets: DatasetInfo[];
  isLoading: boolean;
  error: Error | null;
  loadDataset: (params: {
    id: string;
    name: string;
    dataSourceId: string;
    url: string;
  }) => Promise<void>;
  unloadDataset: (datasetId: string) => Promise<void>;
  refreshDataset: (datasetId: string, url: string) => Promise<void>;
}

export function useDataset(): UseDatasetReturn {
  const { loadArrowBuffer, dropTable, getTableSchema, status } = useDuckDB();
  const [datasets, setDatasets] = useState<DatasetInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadDataset = useCallback(
    async (params: { id: string; name: string; dataSourceId: string; url: string }) => {
      if (status !== "ready") throw new Error("DuckDB not ready");

      setIsLoading(true);
      setError(null);

      // Optimistic entry
      const tableName = `ds_${params.id}`;
      const placeholder: DatasetInfo = {
        id: params.id,
        name: params.name,
        dataSourceId: params.dataSourceId,
        tableName,
        rowCount: 0,
        fileSize: 0,
        memorySize: 0,
        schema: [],
        cacheStatus: "not-cached",
        isLoading: true,
        loadProgress: 0,
        loadedAt: new Date(),
      };

      setDatasets((prev) => [...prev.filter((d) => d.id !== params.id), placeholder]);

      try {
        // Fetch the dataset
        const buffer = await fetchParquetBuffer(params.url, (loaded, total) => {
          setDatasets((prev) =>
            prev.map((d) =>
              d.id === params.id ? { ...d, loadProgress: total > 0 ? loaded / total : 0 } : d
            )
          );
        });

        // Read the size first: handing the buffer to DuckDB's worker transfers it, which
        // leaves this view detached with a byteLength of 0.
        const byteLength = buffer.byteLength;

        // Load into DuckDB
        await loadArrowBuffer(tableName, buffer);

        // Get schema info
        const schema = await getTableSchema(tableName);

        setDatasets((prev) =>
          prev.map((d) =>
            d.id === params.id
              ? {
                  ...d,
                  rowCount: schema.rowCount ?? 0,
                  fileSize: byteLength,
                  memorySize: byteLength,
                  schema: schema.columns,
                  cacheStatus: "cached" as const,
                  isLoading: false,
                  loadProgress: 1,
                }
              : d
          )
        );
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        setDatasets((prev) => prev.filter((d) => d.id !== params.id));
      } finally {
        setIsLoading(false);
      }
    },
    [status, loadArrowBuffer, getTableSchema]
  );

  const unloadDataset = useCallback(
    async (datasetId: string) => {
      const ds = datasets.find((d) => d.id === datasetId);
      if (ds) {
        await dropTable(ds.tableName);
        setDatasets((prev) => prev.filter((d) => d.id !== datasetId));
      }
    },
    [datasets, dropTable]
  );

  const refreshDataset = useCallback(
    async (datasetId: string, url: string) => {
      const ds = datasets.find((d) => d.id === datasetId);
      if (!ds) return;
      await unloadDataset(datasetId);
      await loadDataset({
        id: ds.id,
        name: ds.name,
        dataSourceId: ds.dataSourceId,
        url,
      });
    },
    [datasets, unloadDataset, loadDataset]
  );

  return { datasets, isLoading, error, loadDataset, unloadDataset, refreshDataset };
}

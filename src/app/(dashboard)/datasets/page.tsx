"use client";

/**
 * Datasets management page.
 * Lists server-side datasets and allows loading into DuckDB-Wasm.
 */

import React, { useEffect, useState } from "react";
import { DatasetManager } from "@/components/datasets/DatasetManager";
import { Button } from "@/components/ui/button";
import { useDuckDB } from "@/components/duckdb/DuckDBProvider";
import { useDataset } from "@/hooks/useDataset";
import type { DatasetInfo } from "@/types/wasm";
import { isFeatureEnabled } from "@/lib/feature-flags";

interface ServerDataset {
  id: string;
  name: string;
  dataSourceId: string;
  rowCount: number;
  fileSize: number;
  columns: { name: string; type: string; nullable: boolean }[];
  status: string;
}

export default function DatasetsPage() {
  const wasmEnabled = isFeatureEnabled("wasmEnabled");
  const { status: duckdbStatus } = useDuckDB();
  const { datasets, loadDataset, unloadDataset } = useDataset();
  const [serverDatasets, setServerDatasets] = useState<ServerDataset[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const res = await fetch("/api/datasets?pageSize=100");
        const json = await res.json();
        if (json.success) {
          setServerDatasets(json.data.datasets);
        }
      } catch (err) {
        console.error("Failed to fetch datasets:", err);
      } finally {
        setIsLoadingList(false);
      }
    }

    fetchDatasets();
  }, []);

  // Merge server datasets with local loading state
  const merged: DatasetInfo[] = serverDatasets.map((sd) => {
    const local = datasets.find((d) => d.id === sd.id);
    if (local) return local;

    return {
      id: sd.id,
      name: sd.name,
      dataSourceId: sd.dataSourceId,
      tableName: `ds_${sd.id}`,
      rowCount: sd.rowCount,
      fileSize: sd.fileSize,
      memorySize: 0,
      schema: sd.columns,
      cacheStatus: "not-cached" as const,
      isLoading: false,
    };
  });

  const handleLoad = async (id: string) => {
    const sd = serverDatasets.find((d) => d.id === id);
    if (!sd) return;
    await loadDataset({
      id: sd.id,
      name: sd.name,
      dataSourceId: sd.dataSourceId,
      url: `/api/datasets/${sd.id}/parquet`,
    });
  };

  const handleUnload = async (id: string) => {
    await unloadDataset(id);
  };

  if (!wasmEnabled) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Datasets</h1>
        <p className="mt-2 text-muted-foreground">
          WASM mode is not enabled. Enable NEXT_PUBLIC_WASM_ENABLED to use client-side datasets.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Datasets</h1>
          <p className="text-sm text-muted-foreground">
            Manage datasets loaded in DuckDB-Wasm for client-side analytics.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">DuckDB: {duckdbStatus}</span>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh List
          </Button>
        </div>
      </div>

      {isLoadingList ? (
        <div className="text-sm text-muted-foreground">Loading datasets…</div>
      ) : (
        <DatasetManager datasets={merged} onLoad={handleLoad} onUnload={handleUnload} />
      )}
    </div>
  );
}

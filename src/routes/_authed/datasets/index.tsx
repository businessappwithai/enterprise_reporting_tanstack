import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { DatasetManager } from "@/components/datasets/DatasetManager";
import { NewDatasetDialog } from "@/components/datasets/NewDatasetDialog";
import { purgeDatasetCache } from "@/lib/datasets/purge-cache";
import { useDuckDB } from "@/components/duckdb/DuckDBProvider";
import { Button } from "@/components/ui/button";
import { useDataset } from "@/hooks/useDataset";
import { isFeatureEnabled } from "@/lib/feature-flags";
import type { DatasetInfo } from "@/types/datasets";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/_authed/datasets/")({
  component: DatasetsPage,
});

interface ServerDataset {
  id: string;
  name: string;
  dataSourceId: string;
  rowCount: number;
  fileSize: number;
  columns: { name: string; type: string; nullable: boolean }[];
  status: string;
}

function DatasetsPage() {
  const wasmEnabled = isFeatureEnabled("wasmEnabled");
  const { status: duckdbStatus, error: duckdbError } = useDuckDB();
  const { datasets, error: loadError, loadDataset, unloadDataset } = useDataset();
  const [serverDatasets, setServerDatasets] = useState<ServerDataset[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchDatasets = useCallback(async () => {
    try {
      const res = await fetch("/api/datasets?pageSize=100");
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error?.message ?? `HTTP ${res.status}: Failed to load datasets`);
      }
      setServerDatasets(json.data.datasets);
      setListError(null);
    } catch (err) {
      setListError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  // Rows an earlier build cached in this browser; nothing writes that cache any more.
  useEffect(() => {
    void purgeDatasetCache();
  }, []);

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
      url: `/api/datasets/${sd.id}/data`,
    });
  };

  const handleUnload = async (id: string) => {
    await unloadDataset(id);
  };

  const handleRefresh = async (id: string) => {
    await handleUnload(id);
    await handleLoad(id);
  };

  const handleDelete = async (id: string) => {
    const sd = serverDatasets.find((d) => d.id === id);
    if (!window.confirm(`Delete the dataset "${sd?.name ?? id}"? Its saved query is kept.`)) return;
    const res = await fetch(`/api/datasets/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      setListError(json?.error?.message ?? `HTTP ${res.status}: Failed to delete the dataset`);
      return;
    }
    if (datasets.some((d) => d.id === id)) await unloadDataset(id);
    await fetchDatasets();
  };

  if (!wasmEnabled) {
    return (
      <div className="p-6">
        <h1 className="font-semibold text-2xl text-tremor-content-strong">Datasets</h1>
        <p className="mt-2 text-tremor-default text-tremor-content">
          WASM mode is not enabled. Set NEXT_PUBLIC_WASM_ENABLED=true to use client-side datasets.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title="Datasets"
          description="Manage datasets loaded in DuckDB-Wasm for client-side analytics."
        />
        <div className="flex items-center gap-2">
          <span className="text-tremor-default text-tremor-content">DuckDB: {duckdbStatus}</span>
          <Button variant="outline" onClick={fetchDatasets}>
            Refresh List
          </Button>
          <Button onClick={() => setCreating(true)}>New dataset</Button>
        </div>
      </div>

      {(listError || loadError || duckdbError) && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-3 text-red-700 text-sm"
        >
          {listError ?? loadError?.message ?? `DuckDB could not start: ${duckdbError?.message}`}
        </p>
      )}

      {isLoadingList ? (
        <div className="text-tremor-default text-tremor-content">Loading datasets…</div>
      ) : (
        <DatasetManager
          datasets={merged}
          onLoad={handleLoad}
          onUnload={handleUnload}
          onRefresh={handleRefresh}
          onDelete={handleDelete}
        />
      )}

      <NewDatasetDialog open={creating} onOpenChange={setCreating} onCreated={fetchDatasets} />
    </div>
  );
}

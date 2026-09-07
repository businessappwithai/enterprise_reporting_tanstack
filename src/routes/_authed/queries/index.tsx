import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/reporting/data-table";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataSource, SavedQuery } from "@/types/database";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/_authed/queries/")({
  component: QueriesPage,
});

function QueriesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  // Searching narrows the result set, so page 1 is the only page it is safe
  // to land on.
  const onSearchChange = useCallback((term: string) => {
    setSearch(term.trim());
    setPagination((p) => (p.pageIndex === 0 ? p : { ...p, pageIndex: 0 }));
  }, []);

  const {
    data: queriesData,
    isLoading,
    refetch,
  } = useQuery<{
    items: SavedQuery[];
    meta: { total: number };
  }>({
    queryKey: ["saved-queries", pagination.pageIndex, pagination.pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(pagination.pageIndex),
        pageSize: String(pagination.pageSize),
      });
      if (search) params.set("search", search);
      const res = await fetch(`/api/queries?${params}`);
      const data = await res.json();
      return data.data;
    },
    // Without this the table blanks out between page turns.
    placeholderData: (prev) => prev,
  });

  const { data: dataSources } = useQuery<DataSource[]>({
    queryKey: ["data-sources"],
    queryFn: async () => {
      const res = await fetch("/api/data-sources");
      const data = await res.json();
      return data.data?.items || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (queryId: string) => {
      await fetch(`/api/queries/${queryId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-queries"] });
      setShowDeleteConfirm(null);
    },
  });

  const queries = queriesData?.items || [];
  const totalQueries = queriesData?.meta?.total ?? 0;

  // Both are used by the columns memo below. A plain function is a new object
  // on every render, so listing one as a dependency would rebuild the columns
  // every render.
  const handleEdit = useCallback(
    (query: SavedQuery) => {
      navigate({ to: "/sql-editor", search: { queryId: query.id } });
    },
    [navigate]
  );

  const getDataSourceName = useCallback(
    (dataSourceId: string) => dataSources?.find((ds) => ds.id === dataSourceId)?.name || "Unknown",
    [dataSources]
  );

  const columns = useMemo<ColumnDef<SavedQuery>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-tremor-content">
            {row.original.description || <span className="italic">No description</span>}
          </span>
        ),
      },
      {
        id: "data_source",
        header: "Data Source",
        cell: ({ row }) => (
          <Badge variant="outline">{getDataSourceName(row.original.data_source_id)}</Badge>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-tremor-default text-tremor-content">
            {new Date(row.original.created_at).toLocaleDateString()}
          </span>
        ),
      },
      {
        accessorKey: "updated_at",
        header: "Modified",
        cell: ({ row }) => (
          <span className="text-tremor-default text-tremor-content">
            {new Date(row.original.updated_at).toLocaleDateString()}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={() => handleEdit(row.original)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Edit query"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(row.original.id)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              title="Delete query"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [getDataSourceName, handleEdit]
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Saved Queries" description="Manage your saved SQL queries" />
        <Button
          onClick={() => navigate({ to: "/sql-editor" })}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Query
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* The shared table in its server-side mode: it renders the page the
          server sent and takes the row count from meta.total. Search is a
          server round trip too, so it reaches every row rather than the
          twenty on screen. */}
      <DataTable<SavedQuery>
        data={queries}
        columns={columns}
        isLoading={isLoading}
        serverSide
        totalRows={totalQueries}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        onPaginationChange={setPagination}
        onSearchChange={onSearchChange}
      />

      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          style={{ zIndex: 99999 }}
        >
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this query? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => deleteMutation.mutate(showDeleteConfirm)}
                variant="destructive"
                className="flex-1"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

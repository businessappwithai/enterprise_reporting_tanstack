import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { FilterDefinition } from "@/types/database";
import { FilterFormFields, type FilterFormData } from "@/components/filters/filter-form-fields";

export const Route = createFileRoute('/_authed/filters/')({
  component: FiltersPage,
})

const DEFAULT_FORM: FilterFormData = {
  name: "",
  description: "",
  query_id: "",
  data_source_id: "",
  filter_query: "",
  display_field: [],
  value_field: "",
  field_type: "id",
  operator: "in",
  max_from_date: "",
  min_to_date: "",
};

function FiltersPage() {
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<FilterDefinition | null>(null);
  const [availableFields, setAvailableFields] = useState<Array<{ name: string; type: string }>>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const [formData, setFormData] = useState<FilterFormData>(DEFAULT_FORM);

  const { data: filters, isLoading } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      const res = await fetch("/api/filters");
      if (!res.ok) throw new Error("Failed to fetch filters");
      return res.json() as Promise<FilterDefinition[]>;
    },
  });

  const { data: dataSources } = useQuery({
    queryKey: ["data-sources"],
    queryFn: async () => {
      const res = await fetch("/api/data-sources");
      if (!res.ok) throw new Error("Failed to fetch data sources");
      const json = await res.json();
      return json.data?.items || json;
    },
  });

  const { data: savedQueries } = useQuery({
    queryKey: ["queries"],
    queryFn: async () => {
      const res = await fetch("/api/queries");
      if (!res.ok) throw new Error("Failed to fetch queries");
      const json = await res.json();
      return json.data?.items || json;
    },
  });

  const createFilter = useMutation({
    mutationFn: async (data: FilterFormData) => {
      const res = await fetch("/api/filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSubmitData(data)),
      });
      if (!res.ok) throw new Error("Failed to create filter");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
  });

  const updateFilter = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FilterFormData }) => {
      const res = await fetch(`/api/filters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSubmitData(data)),
      });
      if (!res.ok) throw new Error("Failed to update filter");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
      setIsEditDialogOpen(false);
      setEditingFilter(null);
      resetForm();
    },
  });

  const deleteFilter = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/filters/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete filter");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["filters"] });
    },
  });

  function buildSubmitData(data: FilterFormData) {
    let displayFieldValue = Array.isArray(data.display_field)
      ? data.display_field.join(", ")
      : data.display_field;
    if (data.field_type === "number" || data.field_type === "date" || data.field_type === "text") {
      displayFieldValue = data.value_field;
    }
    const result: Record<string, unknown> = { ...data, display_field: displayFieldValue };
    if (data.field_type === "date" && (data.max_from_date || data.min_to_date)) {
      result.date_validation_config = JSON.stringify({
        max_from_date: data.max_from_date || undefined,
        min_to_date: data.min_to_date || undefined,
      });
    }
    return result;
  }

  const resetForm = () => {
    setFormData(DEFAULT_FORM);
    setAvailableFields([]);
  };

  const loadQueryFields = async (queryId: string) => {
    setIsLoadingFields(true);
    setAvailableFields([]);
    try {
      const res = await fetch(`/api/queries/${queryId}/execute`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data.columns) {
          const columnTypes = data.data.types || {};
          setAvailableFields(
            data.data.columns.map((name: string) => ({ name, type: columnTypes[name] || "text" }))
          );
        } else {
          setAvailableFields([]);
        }
      } else {
        setAvailableFields([]);
      }
    } catch {
      setAvailableFields([]);
    } finally {
      setIsLoadingFields(false);
    }
  };

  const handleQueryChange = async (queryId: string) => {
    const selectedQuery = savedQueries?.find((q: { id: string }) => q.id === queryId);
    if (selectedQuery) {
      setFormData((prev) => ({
        ...prev,
        query_id: queryId,
        data_source_id: selectedQuery.data_source_id,
        filter_query: selectedQuery.sql_content,
        value_field: "",
      }));
      loadQueryFields(selectedQuery.id);
    } else {
      setFormData((prev) => ({ ...prev, query_id: queryId }));
    }
  };

  const handleEdit = (filter: FilterDefinition) => {
    setEditingFilter(filter);
    let dateValidationConfig = { max_from_date: "", min_to_date: "" };
    if (filter.date_validation_config) {
      try {
        dateValidationConfig = JSON.parse(filter.date_validation_config);
      } catch { /* ignore */ }
    }
    const matchingQuery = savedQueries?.find(
      (q: { sql_content: string }) => q.sql_content === filter.filter_query,
    );
    setFormData({
      name: filter.name,
      description: filter.description || "",
      query_id: matchingQuery?.id || "",
      data_source_id: filter.data_source_id,
      filter_query: filter.filter_query,
      display_field: Array.isArray(filter.display_field)
        ? filter.display_field
        : [filter.display_field].filter(Boolean),
      value_field: filter.value_field,
      field_type: filter.field_type || "id",
      operator: filter.operator || "in",
      max_from_date: dateValidationConfig.max_from_date || "",
      min_to_date: dateValidationConfig.min_to_date || "",
    });
    setIsEditDialogOpen(true);
    if (matchingQuery) {
      loadQueryFields(matchingQuery.id);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this filter?")) {
      deleteFilter.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading filters...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Filters</h1>
          <p className="text-muted-foreground">Manage reusable filters for reports and charts</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Filter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Filter</DialogTitle>
              <DialogDescription>Create a reusable filter for reports and charts.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <FilterFormFields
                formData={formData}
                onFormDataChange={setFormData}
                savedQueries={savedQueries}
                availableFields={availableFields}
                isLoadingFields={isLoadingFields}
                onQueryChange={handleQueryChange}
                idPrefix="create-"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => createFilter.mutate(formData)} disabled={createFilter.isPending}>
                {createFilter.isPending ? "Creating..." : "Create Filter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Data Source</TableHead>
              <TableHead>Display Fields</TableHead>
              <TableHead>Value Field</TableHead>
              <TableHead>Query</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filters?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No filters found. Create your first filter to get started.
                </TableCell>
              </TableRow>
            ) : (
              filters?.map((filter) => (
                <TableRow key={filter.id}>
                  <TableCell className="font-medium">{filter.name}</TableCell>
                  <TableCell className="text-muted-foreground">{filter.description || "-"}</TableCell>
                  <TableCell>
                    {dataSources?.find((ds: { id: string; name: string }) => ds.id === filter.data_source_id)?.name || filter.data_source_id}
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{filter.display_field}</code>
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{filter.value_field}</code>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded block max-w-[300px] truncate">
                      {filter.filter_query}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(filter)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(filter.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Filter</DialogTitle>
            <DialogDescription>Update the filter configuration.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <FilterFormFields
              formData={formData}
              onFormDataChange={setFormData}
              savedQueries={savedQueries}
              availableFields={availableFields}
              isLoadingFields={isLoadingFields}
              onQueryChange={handleQueryChange}
              idPrefix="edit-"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => editingFilter && updateFilter.mutate({ id: editingFilter.id, data: formData })}
              disabled={updateFilter.isPending}
            >
              {updateFilter.isPending ? "Updating..." : "Update Filter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

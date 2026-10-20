"use client";

/**
 * Create a dataset from a saved query. The query list is searched at the server
 * (`/api/queries?search=`), ten at a time, rather than fetched whole.
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SavedQueryOption {
  id: string;
  name: string;
  description: string | null;
}

interface NewDatasetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export function NewDatasetDialog({ open, onOpenChange, onCreated }: NewDatasetDialogProps) {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<SavedQueryOption[]>([]);
  const [selected, setSelected] = useState<SavedQueryOption | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/queries?pageSize=10&search=${encodeURIComponent(search)}`);
        const body = await res.json();
        if (!res.ok || !body.success) {
          throw new Error(body.error?.message ?? `HTTP ${res.status}`);
        }
        setOptions(body.data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [open, search]);

  const pick = (option: SavedQueryOption) => {
    setSelected(option);
    setName((current) => current || option.name);
  };

  const create = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/datasets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, savedQueryId: selected.id }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.error?.message ?? `HTTP ${res.status}`);
      setSelected(null);
      setName("");
      setSearch("");
      onOpenChange(false);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New dataset</DialogTitle>
          <DialogDescription>
            A dataset is a saved query loaded into your browser for fast analysis. It is run under
            your own permissions each time it is loaded.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="dataset-query-search">Saved query</Label>
            <Input
              id="dataset-query-search"
              placeholder="Search saved queries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="max-h-48 space-y-1 overflow-y-auto" aria-label="Saved queries">
              {options.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => pick(option)}
                    aria-pressed={selected?.id === option.id}
                    className={`w-full rounded-md border px-3 py-2 text-left text-sm ${
                      selected?.id === option.id ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <span className="font-medium">{option.name}</span>
                    {option.description && (
                      <span className="block text-muted-foreground text-xs">
                        {option.description}
                      </span>
                    )}
                  </button>
                </li>
              ))}
              {options.length === 0 && (
                <li className="px-1 text-muted-foreground text-sm">No saved queries match.</li>
              )}
            </ul>
          </div>

          <div className="space-y-1">
            <Label htmlFor="dataset-name">Dataset name</Label>
            <Input id="dataset-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {error && (
            <p role="alert" className="text-red-600 text-sm">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={create} disabled={!selected || !name.trim() || saving}>
            {saving ? "Creating…" : "Create dataset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { z } from "zod";

export const activeFilterSchema = z.object({
  id: z.string().uuid(),
  widgetId: z.string(),
  columnName: z.string(),
  value: z.unknown(),
  operator: z.enum(["equals", "contains", "gt", "lt", "gte", "lte", "in", "between"]).default("equals"),
  timestamp: z.number(),
});

export type ActiveFilter = z.infer<typeof activeFilterSchema>;

export const filterLinkSchema = z.object({
  id: z.string().uuid(),
  sourceWidgetId: z.string(),
  targetWidgetId: z.string(),
  sourceColumn: z.string(),
  targetColumn: z.string(),
});

export type FilterLink = z.infer<typeof filterLinkSchema>;

export interface ActiveFiltersState {
  filters: ActiveFilter[];
  filterLinks: FilterLink[];
}

export const initialActiveFiltersState: ActiveFiltersState = {
  filters: [],
  filterLinks: [],
};

export interface ActiveFilterCollectionActions {
  setFilters: (filters: ActiveFilter[]) => void;
  addFilter: (filter: ActiveFilter) => void;
  removeFilter: (filterId: string) => void;
  removeFiltersByWidget: (widgetId: string) => void;
  clearFilters: () => void;
  setFilterLinks: (links: FilterLink[]) => void;
}

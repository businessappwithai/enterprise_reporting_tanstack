"use client";

import { X } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { NlResultsChart } from "@/components/nl-query/nl-results-chart";
import { NlResultsTable } from "@/components/nl-query/nl-results-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTremorChartPalette } from "@/components/charts/tremor-chart-theme";
import { applySpec } from "@/lib/intelligent-ui/apply-spec";
import type { ViewSpec } from "@/lib/intelligent-ui/spec";
import type { NlChartConfig } from "@/types/database";

interface IntelligentViewProps {
  spec: ViewSpec;
  columns: string[];
  rows: Record<string, unknown>[];
  onRemove?: () => void;
}

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });

function formatValue(value: unknown): string {
  if (typeof value === "number") return numberFormat.format(value);
  if (value === null || value === undefined) return "—";
  return String(value);
}

/**
 * Renders one validated spec over the rows the NL pipeline returned. It builds
 * nothing from model text: the figures come from applySpec, and the components are
 * the ones the NL Query page already uses.
 */
export function IntelligentView({ spec, columns, rows, onRemove }: IntelligentViewProps) {
  const applied = useMemo(() => applySpec(columns, rows, spec), [columns, rows, spec]);

  const title = spec.title ?? (spec.view === "kpi" ? (spec.y?.[0] ?? "Total") : "Result");

  const chartConfig = useMemo<NlChartConfig | null>(() => {
    if (spec.view === "table" || spec.view === "kpi" || !spec.x || !spec.y?.length) return null;
    return {
      chartType: spec.view,
      title: "",
      xAxis: { field: spec.x, label: spec.x },
      yAxis: spec.y.map((field) => ({ field, label: field })),
      colors: getTremorChartPalette(Math.max(spec.y.length, 5)),
    };
  }, [spec]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {spec.aggregation && <Badge variant="secondary">{spec.aggregation}</Badge>}
          {applied.truncated && <Badge variant="outline">first {applied.rows.length} rows</Badge>}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              aria-label="Remove view"
              onClick={onRemove}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {spec.view === "kpi" ? (
          <div className="text-4xl font-semibold tabular-nums">
            {formatValue(applied.rows[0]?.[spec.y?.[0] ?? ""])}
          </div>
        ) : chartConfig ? (
          // The chart sizes itself (title + a 400px plot); a fixed-height wrapper clipped its
          // rotated axis labels. Its own title would repeat the card's, so it is hidden.
          <div className="[&_h3:empty]:hidden">
            <NlResultsChart data={applied.rows} config={chartConfig} />
          </div>
        ) : (
          <NlResultsTable
            columns={applied.columns}
            rows={applied.rows}
            totalRows={applied.rows.length}
          />
        )}
      </CardContent>
    </Card>
  );
}

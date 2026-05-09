"use client";

/**
 * Universal ECharts chart renderer.
 * Replaces Recharts for canvas-based, high-performance charting.
 */

import React, { useMemo } from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  HeatmapChart,
  TreemapChart,
  SunburstChart,
  SankeyChart,
  FunnelChart,
  GaugeChart,
  BoxplotChart,
  CandlestickChart,
  ParallelChart,
  MapChart,
  GraphChart,
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
  ToolboxComponent,
  TitleComponent,
  GeoComponent,
  ParallelComponent as ParallelComp,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import { ChartTypeFactory } from "./ChartTypeFactory";
import { getBaseEChartsOption, getEChartsThemeColors } from "./ThemeAdapter";
import type { EChartsConfig } from "@/types/wasm";
import { useTheme } from "next-themes";

// Register ECharts components (tree-shakeable)
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  HeatmapChart,
  TreemapChart,
  SunburstChart,
  SankeyChart,
  FunnelChart,
  GaugeChart,
  BoxplotChart,
  CandlestickChart,
  ParallelChart,
  MapChart,
  GraphChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  VisualMapComponent,
  ToolboxComponent,
  TitleComponent,
  GeoComponent,
  ParallelComp,
  CanvasRenderer,
]);

interface EChartsRendererProps {
  /** Chart configuration */
  config: EChartsConfig;
  /** Data rows */
  data: Record<string, unknown>[];
  /** Chart height */
  height?: string | number;
  /** Enable zoom / dataZoom */
  enableZoom?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: Error | null;
  /** On chart click */
  onChartClick?: (params: { name?: string; value?: unknown; seriesName?: string }) => void;
}

export function EChartsRenderer({
  config,
  data,
  height = 400,
  enableZoom = false,
  loading = false,
  error,
  onChartClick,
}: EChartsRendererProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const option = useMemo(() => {
    if (data.length === 0) return {};

    const base = getBaseEChartsOption(isDark);
    const chart = ChartTypeFactory.build(config, data);

    // Merge base theme, chart config, and user customOptions
    const merged = deepMerge(base, chart);

    console.log(
      "[EChartsRenderer] Merged option series:",
      merged.series?.map((s: any) => ({
        name: s.name,
        type: s.type,
        hasStack: "stack" in s,
        stackValue: s.stack,
        allKeys: Object.keys(s),
      }))
    );
    console.log(
      "[EChartsRenderer] First merged series:",
      JSON.stringify(merged.series?.[0], null, 2)
    );
    console.log(
      "[EChartsRenderer] Second merged series:",
      JSON.stringify(merged.series?.[1], null, 2)
    );

    // Apply title
    if (config.title) {
      merged.title = { ...(merged.title as object), text: config.title, subtext: config.subtitle };
    }

    // Apply colors
    merged.color = config.colors ?? getEChartsThemeColors();

    // Apply animation
    if (config.animation === false) {
      merged.animation = false;
    }

    // Apply dataZoom
    if (enableZoom) {
      merged.dataZoom = [
        { type: "inside", start: 0, end: 100 },
        { type: "slider", start: 0, end: 100 },
      ];
    }

    // Merge custom options last
    if (config.customOptions) {
      return deepMerge(merged, config.customOptions);
    }

    return merged;
  }, [config, data, isDark, enableZoom]);

  if (error) {
    return (
      <div
        className="flex items-center justify-center rounded-md border border-destructive p-4 text-sm text-destructive"
        style={{ height }}
      >
        {error.message}
      </div>
    );
  }

  if (data.length === 0 && !loading) {
    return (
      <div
        className="flex items-center justify-center rounded-md border text-sm text-muted-foreground"
        style={{ height }}
      >
        No data to display
      </div>
    );
  }

  const events = onChartClick
    ? {
        click: (params: { name?: string; value?: unknown; seriesName?: string }) => {
          onChartClick(params);
        },
      }
    : undefined;

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height, width: "100%" }}
      showLoading={loading}
      onEvents={events}
      notMerge
      lazyUpdate
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

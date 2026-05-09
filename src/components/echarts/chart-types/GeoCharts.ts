/**
 * Geospatial chart type builders: map, geoScatter.
 * NOTE: Full geo map support requires loading map registration data
 * (e.g. echarts.registerMap). These builders provide the config structure.
 */

import type { EChartsOption } from "echarts";
import type { EChartsConfig } from "@/types/wasm";

export class GeoCharts {
  static buildMap(config: EChartsConfig, rows: Record<string, unknown>[]): EChartsOption {
    const valueCol = Array.isArray(config.dataMapping.y)
      ? config.dataMapping.y[0]
      : (config.dataMapping.y ?? "");

    const data = rows.map((r) => ({
      name: String(r[config.dataMapping.x!] ?? ""),
      value: Number(r[valueCol] ?? 0),
    }));

    const values = data.map((d) => d.value);

    return {
      visualMap: {
        min: Math.min(...values, 0),
        max: Math.max(...values, 1),
        calculable: true,
        left: "left",
        top: "bottom",
      },
      series: [
        {
          type: "map" as const,
          map: "world",
          roam: true,
          data,
          emphasis: { label: { show: true } },
        },
      ],
      tooltip: { trigger: "item" },
    };
  }

  static buildGeoScatter(config: EChartsConfig, rows: Record<string, unknown>[]): EChartsOption {
    // Expects x = longitude column, y = latitude column, size/color optional
    const lonCol = config.dataMapping.x ?? "";
    const latCol = Array.isArray(config.dataMapping.y)
      ? config.dataMapping.y[0]
      : (config.dataMapping.y ?? "");
    const sizeCol = config.dataMapping.size;

    const data = rows.map((r) => ({
      name: String(r[config.dataMapping.group ?? ""] ?? ""),
      value: [
        Number(r[lonCol] ?? 0),
        Number(r[latCol] ?? 0),
        sizeCol ? Number(r[sizeCol] ?? 1) : 1,
      ],
    }));

    return {
      geo: { map: "world", roam: true },
      series: [
        {
          type: "scatter" as const,
          coordinateSystem: "geo",
          data,
          symbolSize: (val: number[]) => Math.max(val[2] ?? 4, 4),
        },
      ],
      tooltip: { trigger: "item" },
    };
  }
}

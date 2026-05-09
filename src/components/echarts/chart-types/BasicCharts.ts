/**
 * Basic chart type builders: bar, line, area, pie, doughnut, scatter.
 */

import type { EChartsOption } from "echarts";
import type { EChartsConfig } from "@/types/wasm";
import {
  extractCategories,
  extractSeries,
  extractGroupedSeries,
  extractPieData,
  extractScatterData,
} from "../DataAdapter";

export class BasicCharts {
  static buildBar(config: EChartsConfig, rows: Record<string, unknown>[]): EChartsOption {
    const categories = extractCategories(rows, config.dataMapping);
    const series = config.dataMapping.group
      ? extractGroupedSeries(rows, config.dataMapping)
      : extractSeries(rows, config.dataMapping);

    const seriesWithStack = series.map((s, index) => {
      const baseSeries = {
        name: s.name,
        type: "bar" as const,
        data: s.data,
        // Only add stack property if stacked is explicitly true
        ...(config.stacked === true && { stack: "stack-1" }),
      };

      // Apply series-specific color if available
      if (config.seriesColors && config.seriesColors[index]) {
        return {
          ...baseSeries,
          itemStyle: {
            color: config.seriesColors[index],
          },
        };
      }

      return baseSeries;
    });

    console.log("[BasicCharts.buildBar] Input config.stacked:", config.stacked);
    console.log("[BasicCharts.buildBar] Series colors:", config.seriesColors);
    console.log(
      "[BasicCharts.buildBar] Series:",
      seriesWithStack.map((s) => ({
        name: s.name,
        hasStack: "stack" in s,
        stackValue: s.stack,
        dataLength: s.data?.length,
        allKeys: Object.keys(s),
        type: s.type,
        hasColor: "itemStyle" in s,
      }))
    );
    console.log(
      "[BasicCharts.buildBar] First series object:",
      JSON.stringify(seriesWithStack[0], null, 2)
    );
    console.log(
      "[BasicCharts.buildBar] Second series object:",
      JSON.stringify(seriesWithStack[1], null, 2)
    );

    const result = {
      xAxis: {
        type: "category",
        data: categories,
        axisLabel: { interval: 0, rotate: 30 },
        ...config.xAxis,
      },
      yAxis: {
        type: "value",
        ...config.yAxis,
      },
      series: seriesWithStack.map((s) => ({
        ...s,
        // Explicitly set bar spacing to ensure side-by-side rendering
        barGap: "0%", // gap between bars in same category
        barCategoryGap: "20%", // gap between categories
      })),
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
      },
      legend:
        series.length > 1
          ? {
              data: series.map((s) => s.name),
              orient: "horizontal",
              top: "bottom",
              left: "center",
              itemGap: 20,
              padding: [20, 0, 0, 0],
            }
          : undefined,
      // Ensure bars are grouped side-by-side, not stacked
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%", // Increased bottom padding to accommodate legend below
        containLabel: true,
      },
    };

    console.log("[BasicCharts.buildBar] Result:", result);

    return result;
  }

  static buildLine(config: EChartsConfig, rows: Record<string, unknown>[]): EChartsOption {
    const categories = extractCategories(rows, config.dataMapping);
    const series = config.dataMapping.group
      ? extractGroupedSeries(rows, config.dataMapping)
      : extractSeries(rows, config.dataMapping);

    return {
      xAxis: { type: "category", data: categories, ...config.xAxis },
      yAxis: { type: "value", ...config.yAxis },
      series: series.map((s, index) => {
        const baseSeries = {
          name: s.name,
          type: "line" as const,
          data: s.data,
          smooth: true,
        };

        // Apply series-specific color if available
        if (config.seriesColors && config.seriesColors[index]) {
          return {
            ...baseSeries,
            itemStyle: {
              color: config.seriesColors[index],
            },
          };
        }

        return baseSeries;
      }),
      tooltip: { trigger: "axis" },
      legend: series.length > 1 ? { data: series.map((s) => s.name) } : undefined,
    };
  }

  static buildArea(config: EChartsConfig, rows: Record<string, unknown>[]): EChartsOption {
    const categories = extractCategories(rows, config.dataMapping);
    const series = config.dataMapping.group
      ? extractGroupedSeries(rows, config.dataMapping)
      : extractSeries(rows, config.dataMapping);

    return {
      xAxis: { type: "category", data: categories, ...config.xAxis },
      yAxis: { type: "value", ...config.yAxis },
      series: series.map((s, index) => {
        const baseSeries = {
          name: s.name,
          type: "line" as const,
          data: s.data,
          smooth: true,
          areaStyle: {},
        };

        // Apply series-specific color if available
        if (config.seriesColors && config.seriesColors[index]) {
          return {
            ...baseSeries,
            itemStyle: {
              color: config.seriesColors[index],
            },
            areaStyle: {
              color: config.seriesColors[index],
            },
          };
        }

        return baseSeries;
      }),
      tooltip: { trigger: "axis" },
      legend: series.length > 1 ? { data: series.map((s) => s.name) } : undefined,
    };
  }

  static buildPie(config: EChartsConfig, rows: Record<string, unknown>[]): EChartsOption {
    const data = extractPieData(rows, config.dataMapping);

    return {
      series: [
        {
          type: "pie" as const,
          data,
          radius: "60%",
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" },
          },
        },
      ],
      tooltip: { trigger: "item" },
      legend: { orient: "vertical" as const, left: "left" },
    };
  }

  static buildDoughnut(config: EChartsConfig, rows: Record<string, unknown>[]): EChartsOption {
    const data = extractPieData(rows, config.dataMapping);

    return {
      series: [
        {
          type: "pie" as const,
          data,
          radius: ["40%", "70%"],
          emphasis: {
            itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" },
          },
        },
      ],
      tooltip: { trigger: "item" },
      legend: { orient: "vertical" as const, left: "left" },
    };
  }

  static buildScatter(config: EChartsConfig, rows: Record<string, unknown>[]): EChartsOption {
    const data = extractScatterData(rows, config.dataMapping);

    return {
      xAxis: { type: "value", ...config.xAxis },
      yAxis: { type: "value", ...config.yAxis },
      series: [
        {
          type: "scatter" as const,
          data,
          symbolSize: 8,
        },
      ],
      tooltip: { trigger: "item" },
    };
  }
}

/**
 * Factory that dispatches chart building to the appropriate type builder.
 */

import type { EChartsOption } from 'echarts';
import type { EChartsConfig, ChartType } from '@/types/wasm';
import { BasicCharts } from './chart-types/BasicCharts';
import { AdvancedCharts } from './chart-types/AdvancedCharts';
import { StatisticalCharts } from './chart-types/StatisticalCharts';
import { GeoCharts } from './chart-types/GeoCharts';

export class ChartTypeFactory {
  static build(
    config: EChartsConfig,
    rows: Record<string, unknown>[],
  ): EChartsOption {
    const builder = BUILDER_MAP[config.type];
    if (!builder) {
      console.warn(`Unknown chart type "${config.type}", falling back to bar`);
      return BasicCharts.buildBar(config, rows);
    }
    return builder(config, rows);
  }
}

type Builder = (config: EChartsConfig, rows: Record<string, unknown>[]) => EChartsOption;

const BUILDER_MAP: Record<ChartType, Builder> = {
  // Basic
  bar: BasicCharts.buildBar,
  line: BasicCharts.buildLine,
  area: BasicCharts.buildArea,
  pie: BasicCharts.buildPie,
  doughnut: BasicCharts.buildDoughnut,
  scatter: BasicCharts.buildScatter,

  // Advanced
  heatmap: AdvancedCharts.buildHeatmap,
  treemap: AdvancedCharts.buildTreemap,
  sunburst: AdvancedCharts.buildSunburst,
  sankey: AdvancedCharts.buildSankey,
  funnel: AdvancedCharts.buildFunnel,
  gauge: AdvancedCharts.buildGauge,

  // Geospatial
  map: GeoCharts.buildMap,
  geoScatter: GeoCharts.buildGeoScatter,

  // Relational (placeholder — same as treemap structure)
  graph: AdvancedCharts.buildSankey,
  tree: AdvancedCharts.buildTreemap,

  // Statistical
  boxplot: StatisticalCharts.buildBoxplot,
  candlestick: StatisticalCharts.buildCandlestick,
  parallel: StatisticalCharts.buildParallel,

  // 3D placeholders (require echarts-gl extension)
  bar3d: BasicCharts.buildBar,
  scatter3d: BasicCharts.buildScatter,
  surface3d: BasicCharts.buildScatter,
};

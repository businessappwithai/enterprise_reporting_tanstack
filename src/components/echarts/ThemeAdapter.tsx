'use client';

/**
 * ECharts theme adapter that bridges shadcn/ui CSS variables to ECharts theme objects.
 */

import type { EChartsOption } from 'echarts';

export function getEChartsThemeColors(): string[] {
  return [
    'hsl(var(--primary))',
    'hsl(var(--chart-1, 220 70% 50%))',
    'hsl(var(--chart-2, 340 75% 55%))',
    'hsl(var(--chart-3, 160 60% 45%))',
    'hsl(var(--chart-4, 30 80% 55%))',
    'hsl(var(--chart-5, 280 65% 60%))',
    'hsl(var(--chart-6, 200 70% 50%))',
    'hsl(var(--chart-7, 10 75% 55%))',
  ];
}

export function getBaseEChartsOption(isDark: boolean): EChartsOption {
  const textColor = isDark ? '#e5e5e5' : '#333333';
  const borderColor = isDark ? '#333333' : '#e5e5e5';
  const bgColor = 'transparent';

  return {
    backgroundColor: bgColor,
    textStyle: {
      color: textColor,
      fontFamily: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
      fontSize: 12,
    },
    title: {
      textStyle: { color: textColor, fontSize: 16, fontWeight: 600 },
      subtextStyle: { color: isDark ? '#999' : '#666', fontSize: 12 },
    },
    legend: {
      textStyle: { color: textColor },
    },
    tooltip: {
      backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
      borderColor,
      textStyle: { color: textColor },
    },
    xAxis: {
      axisLine: { lineStyle: { color: borderColor } },
      axisTick: { lineStyle: { color: borderColor } },
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: borderColor, type: 'dashed' } },
    },
    yAxis: {
      axisLine: { lineStyle: { color: borderColor } },
      axisTick: { lineStyle: { color: borderColor } },
      axisLabel: { color: textColor },
      splitLine: { lineStyle: { color: borderColor, type: 'dashed' } },
    },
  };
}

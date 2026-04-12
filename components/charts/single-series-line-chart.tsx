"use client";

import { chartTheme } from "@/components/charts/chart-theme";
import { ChartMeasure } from "@/components/charts/chart-measure";
import {
  formatChartAxisTick,
  formatChartTooltipDate,
  selectAxisTickIndices,
} from "@/features/dashboard/utils/chart-dates";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = { rawLabel: string; value: number };

type SingleSeriesLineChartProps = {
  labels: string[];
  values: number[];
  name?: string;
  loading?: boolean;
  emptyLabel?: string;
  stroke?: string;
  className?: string;
  minChartHeight?: number;
};

export function SingleSeriesLineChart({
  labels,
  values,
  name = "Valor",
  loading,
  emptyLabel = "Sem dados no período",
  stroke = chartTheme.platformLine.sessions.stroke,
  className,
  minChartHeight = 240,
}: SingleSeriesLineChartProps) {
  const rows: Row[] = labels.map((raw, i) => ({
    rawLabel: raw,
    value: Number(values[i] ?? 0),
  }));

  const hasPoints = rows.some((r) => r.value > 0);
  const tickSubset =
    labels.length > 0
      ? selectAxisTickIndices(labels.length, 7).map((i) => labels[i])
      : [];

  if (loading) {
    return (
      <div
        className="flex items-center justify-center text-sm text-hk-muted"
        style={{ minHeight: minChartHeight }}
      >
        Carregando série…
      </div>
    );
  }

  if (!hasPoints) {
    return (
      <div
        className="flex items-center justify-center px-4 text-center text-sm text-hk-muted"
        style={{ minHeight: minChartHeight }}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <ChartMeasure minHeight={minChartHeight} className={className}>
      {(dim) => (
        <LineChart
          width={dim.width}
          height={dim.height}
          data={rows}
          margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={chartTheme.grid}
          />
          <XAxis
            dataKey="rawLabel"
            ticks={tickSubset}
            tick={{ fontSize: 11, fill: chartTheme.axis }}
            tickFormatter={(v) => formatChartAxisTick(String(v))}
            axisLine={false}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 11, fill: chartTheme.axis }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v) => formatCompactNumber(Number(v))}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${chartTheme.grid}`,
              fontSize: 12,
            }}
            labelFormatter={(_, payload) => {
              const raw = payload?.[0]?.payload?.rawLabel;
              return typeof raw === "string"
                ? formatChartTooltipDate(raw)
                : "";
            }}
            formatter={(value) => [
              formatCompactNumber(Number(value)),
              name,
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            name={name}
            stroke={stroke}
            strokeWidth={chartTheme.platformLine.sessions.strokeWidth}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </LineChart>
      )}
    </ChartMeasure>
  );
}

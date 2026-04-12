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
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type ComparisonLineDef = {
  id: string;
  dataKey: string;
  name: string;
  stroke: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDasharray?: string;
};

type MultiSeriesLineChartProps = {
  labels: string[];
  lines: ComparisonLineDef[];
  rows: Record<string, string | number>[];
  loading?: boolean;
  emptyLabel?: string;
  className?: string;
  minChartHeight?: number;
};

export function MultiSeriesLineChart({
  labels,
  lines,
  rows,
  loading,
  emptyLabel = "Sem dados no período",
  className,
  minChartHeight = 280,
}: MultiSeriesLineChartProps) {
  const hasPoints =
    rows.length > 0 &&
    lines.some((ln) =>
      rows.some(
        (r) =>
          typeof r[ln.dataKey] === "number" && Number(r[ln.dataKey]) > 0,
      ),
    );

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
              boxShadow: "0 4px 12px rgb(14 14 82 / 0.06)",
            }}
            labelFormatter={(_, payload) => {
              const raw = payload?.[0]?.payload?.rawLabel;
              return typeof raw === "string"
                ? formatChartTooltipDate(raw)
                : "";
            }}
            formatter={(value, name) => [
              formatCompactNumber(Number(value)),
              String(name),
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value) => (
              <span className="text-hk-muted">{value}</span>
            )}
          />
          {lines.map((ln) => (
            <Line
              key={ln.id}
              type="monotone"
              dataKey={ln.dataKey}
              name={ln.name}
              stroke={ln.stroke}
              strokeWidth={ln.strokeWidth ?? 2}
              strokeOpacity={ln.strokeOpacity ?? 1}
              strokeDasharray={ln.strokeDasharray}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      )}
    </ChartMeasure>
  );
}

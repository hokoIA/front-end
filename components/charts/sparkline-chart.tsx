"use client";

import { chartTheme } from "@/components/charts/chart-theme";
import { ChartMeasure } from "@/components/charts/chart-measure";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { Line, LineChart, Tooltip, YAxis } from "recharts";

type SparklineChartProps = {
  values: number[];
  loading?: boolean;
  className?: string;
};

export function SparklineChart({
  values,
  loading,
  className,
}: SparklineChartProps) {
  const rows = values.map((v, i) => ({ i, v: Number(v) || 0 }));
  const has = rows.some((r) => r.v > 0);

  if (loading) {
    return (
      <div className="h-14 w-full animate-pulse rounded-md bg-hk-canvas/80" />
    );
  }

  if (!has) {
    return (
      <div className="flex h-14 items-center text-[11px] text-hk-muted">
        Sem série de leads/dia.
      </div>
    );
  }

  return (
    <ChartMeasure minHeight={56} className={className}>
      {(dim) => (
        <LineChart
          width={dim.width}
          height={dim.height}
          data={rows}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Tooltip
            contentStyle={{
              borderRadius: 6,
              border: `1px solid ${chartTheme.grid}`,
              fontSize: 11,
            }}
            formatter={(v) => [
              formatCompactNumber(Number(v ?? 0)),
              "Leads/dia",
            ]}
            labelFormatter={() => ""}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke={chartTheme.platformLine.leads.stroke}
            strokeWidth={chartTheme.platformLine.leads.strokeWidth}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      )}
    </ChartMeasure>
  );
}

"use client";

import { chartTheme } from "@/components/charts/chart-theme";
import { ChartMeasure } from "@/components/charts/chart-measure";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { Cell, Label, Pie, PieChart, Tooltip } from "recharts";

export type SourceSlice = {
  id: string;
  name: string;
  value: number;
};

type SourceDonutChartProps = {
  sources: SourceSlice[];
  loading?: boolean;
  className?: string;
  /** Altura mínima do container medido (sidebar vs. modal). */
  minChartHeight?: number;
};

export function SourceDonutChart({
  sources,
  loading,
  className,
  minChartHeight = 200,
}: SourceDonutChartProps) {
  const data = sources.filter((s) => s.value > 0);
  const total = data.reduce((a, s) => a + s.value, 0);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center text-xs text-hk-muted"
        style={{ minHeight: minChartHeight }}
      >
        Carregando…
      </div>
    );
  }

  if (total <= 0 || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-center text-xs text-hk-muted"
        style={{ minHeight: minChartHeight }}
      >
        Sem distribuição por fonte no período.
      </div>
    );
  }

  return (
    <ChartMeasure minHeight={minChartHeight} className={className}>
      {(dim) => {
        const size = Math.min(dim.width, dim.height);
        const outer = Math.max(28, Math.round(size * 0.36));
        const inner = Math.round(outer * 0.58);
        return (
          <PieChart width={dim.width} height={dim.height}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={inner}
              outerRadius={outer}
              paddingAngle={2}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell
                  key={data[i].id}
                  fill={chartTheme.donut[i % chartTheme.donut.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  const vb = viewBox as {
                    cx?: number;
                    cy?: number;
                  };
                  const cx = vb.cx ?? 0;
                  const cy = vb.cy ?? 0;
                  return (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={cx}
                        dy="-0.35em"
                        fill="var(--hk-neutral-mid)"
                        style={{ fontSize: 10 }}
                      >
                        Total
                      </tspan>
                      <tspan
                        x={cx}
                        dy="1.2em"
                        fill="var(--hk-primary-deep)"
                        style={{ fontSize: 13, fontWeight: 600 }}
                      >
                        {formatCompactNumber(total)}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
            <Tooltip
              formatter={(value, name, item) => {
                const pl = item?.payload as { name?: string } | undefined;
                return [
                  formatCompactNumber(Number(value ?? 0)),
                  pl?.name ?? String(name ?? ""),
                ];
              }}
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${chartTheme.grid}`,
                fontSize: 12,
              }}
            />
          </PieChart>
        );
      }}
    </ChartMeasure>
  );
}

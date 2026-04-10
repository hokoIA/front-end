"use client";

import type { MetricSeriesPoint } from "@/features/dashboard/types";
import { chartTheme } from "@/components/charts/chart-theme";
import { cn } from "@/lib/utils/cn";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartCardProps = {
  title?: string;
  data: MetricSeriesPoint[];
  loading?: boolean;
  emptyLabel?: string;
  className?: string;
};

export function ChartCard({
  title,
  data,
  loading,
  emptyLabel = "Sem pontos para este período",
  className,
}: ChartCardProps) {
  const chartData = data;

  return (
    <div
      className={cn(
        "rounded-lg border border-hk-border-subtle bg-hk-surface",
        className,
      )}
    >
      {title && (
        <div className="border-b border-hk-border-subtle px-4 py-2.5">
          <p className="text-xs font-semibold text-hk-deep">{title}</p>
        </div>
      )}
      <div className="relative h-[260px] w-full p-2 md:p-3">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-hk-muted">
            Carregando série…
          </div>
        ) : chartData.length === 0 || chartData.every((d) => d.value === 0) ? (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-hk-muted">
            {emptyLabel}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={chartTheme.grid}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: chartTheme.axis }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={56}
              />
              <YAxis
                tick={{ fontSize: 11, fill: chartTheme.axis }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                cursor={{ fill: "rgba(25, 43, 194, 0.06)" }}
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${chartTheme.grid}`,
                  fontSize: 12,
                  boxShadow: "0 4px 12px rgb(14 14 82 / 0.06)",
                }}
                formatter={(value) => [
                  typeof value === "number"
                    ? new Intl.NumberFormat("pt-BR").format(value)
                    : String(value ?? "—"),
                  "Valor",
                ]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={52}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={
                      chartTheme.barPalette[
                        index % chartTheme.barPalette.length
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

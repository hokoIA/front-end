"use client";

import { ChartMeasure } from "@/components/charts/chart-measure";
import { chartTheme } from "@/components/charts/chart-theme";
import { DataPanel } from "@/components/data-display/data-panel";
import { SectionHeader } from "@/components/data-display/section-header";
import { PlatformIcon } from "@/components/platforms/platform-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  paidMediaMock,
  type PaidMediaLevelKey,
  type PaidMediaMetricKey,
  type PaidMediaPlatformKey,
  type PaidMediaPlatformMock,
  type PaidMediaRow,
} from "@/features/dashboard/mocks/paid-media.mock";
import type { DashboardPeriodRange } from "@/features/dashboard/types";
import { formatCompactNumber } from "@/features/dashboard/utils/format";
import { cn } from "@/lib/utils/cn";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Megaphone, RadioTower, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

type PaidMediaAdsSectionProps = {
  period: DashboardPeriodRange | null;
  metaAdsData?: unknown;
  metaAdsLoading?: boolean;
  metaAdsError?: unknown;
};

type PaidMediaSummary = {
  investment: number;
  impressions: number;
  reach: number;
  actions: number;
  roas: number;
  cpl: number;
};

type PaidMediaColumn = {
  key: PaidMediaMetricKey | "name";
  label: string;
  align?: "left" | "right";
};

const platformAccent: Record<
  PaidMediaPlatformKey,
  { border: string; background: string; bar: string }
> = {
  meta: {
    border: "border-hk-action/30",
    background: "bg-hk-action/[0.055]",
    bar: "#192BC2",
  },
  google: {
    border: "border-hk-lime/45",
    background: "bg-hk-lime/[0.12]",
    bar: "#8AA83D",
  },
  linkedin: {
    border: "border-hk-cyan/45",
    background: "bg-hk-cyan/[0.13]",
    bar: "#5DA7D9",
  },
};

const levelLabels: Record<PaidMediaLevelKey, string> = {
  campaign: "Campanha",
  adSet: "Conjunto",
  ad: "An\u00fancio",
};

const commonAdSetColumns: PaidMediaColumn[] = [
  { key: "name", label: "Conjunto" },
  { key: "investment", label: "Investimento", align: "right" },
  { key: "reach", label: "Alcance", align: "right" },
  { key: "frequency", label: "Freq.", align: "right" },
  { key: "cpm", label: "CPM", align: "right" },
  { key: "ctr", label: "CTR", align: "right" },
];

const commonAdColumns: PaidMediaColumn[] = [
  { key: "name", label: "An\u00fancio" },
  { key: "impressions", label: "Impress\u00f5es", align: "right" },
  { key: "ctr", label: "CTR", align: "right" },
  { key: "cpc", label: "CPC", align: "right" },
  { key: "cpm", label: "CPM", align: "right" },
  { key: "costPerLead", label: "CPL", align: "right" },
];

const campaignColumns: Record<PaidMediaPlatformKey, PaidMediaColumn[]> = {
  meta: [
    { key: "name", label: "Campanha" },
    { key: "objective", label: "Objetivo" },
    { key: "investment", label: "Investimento", align: "right" },
    { key: "impressions", label: "Impress\u00f5es", align: "right" },
    { key: "reach", label: "Alcance", align: "right" },
    { key: "frequency", label: "Freq.", align: "right" },
    { key: "cpm", label: "CPM", align: "right" },
    { key: "conversationsStarted", label: "Conversas", align: "right" },
    { key: "roas", label: "ROAS", align: "right" },
    { key: "costPerLead", label: "CPL", align: "right" },
  ],
  google: [
    { key: "name", label: "Campanha" },
    { key: "investment", label: "Investimento", align: "right" },
    { key: "impressions", label: "Impress\u00f5es", align: "right" },
    { key: "reach", label: "Alcance", align: "right" },
    { key: "frequency", label: "Freq.", align: "right" },
    { key: "cpm", label: "CPM", align: "right" },
    { key: "conversions", label: "Convers\u00f5es", align: "right" },
    { key: "roas", label: "ROAS", align: "right" },
    { key: "costPerConversion", label: "Custo/convers\u00e3o", align: "right" },
  ],
  linkedin: [
    { key: "name", label: "Campanha" },
    { key: "objective", label: "Objetivo" },
    { key: "investment", label: "Investimento", align: "right" },
    { key: "impressions", label: "Impress\u00f5es", align: "right" },
    { key: "reach", label: "Alcance", align: "right" },
    { key: "frequency", label: "Freq.", align: "right" },
    { key: "cpm", label: "CPM", align: "right" },
    { key: "leads", label: "Leads", align: "right" },
    { key: "ctr", label: "CTR", align: "right" },
    { key: "costPerLead", label: "CPL", align: "right" },
    { key: "roas", label: "ROAS", align: "right" },
  ],
};

function asNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function numberFromUnknown(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function stringFromUnknown(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function rowsFromUnknown(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    : [];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyPrecise(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercentValue(value: number): string {
  return `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

function formatDecimal(value: number, digits = 2): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatMetricValue(
  key: PaidMediaColumn["key"],
  value: number | string | undefined,
) {
  if (value === undefined || value === "") return "-";
  if (typeof value === "string") return value;

  if (
    key === "investment" ||
    key === "cpm" ||
    key === "cpc" ||
    key === "costPerLead" ||
    key === "costPerConversion"
  ) {
    return formatCurrencyPrecise(value);
  }

  if (key === "ctr") return formatPercentValue(value);
  if (key === "roas") return `${formatDecimal(value, 1)}x`;
  if (key === "frequency") return formatDecimal(value, 2);
  return formatCompactNumber(value);
}

function getCampaignRows(platform: PaidMediaPlatformMock) {
  return platform.levels.find((level) => level.key === "campaign")?.rows ?? [];
}

function buildMetaPlatformFromResponse(
  data: unknown,
): PaidMediaPlatformMock | null {
  const root = record(data);
  if (root.success !== true) return null;

  const campaignRows = rowsFromUnknown(root.campaign);
  const adSetRows = rowsFromUnknown(root.adSet);
  const adRows = rowsFromUnknown(root.ad);

  if (campaignRows.length === 0 && adSetRows.length === 0 && adRows.length === 0) {
    return null;
  }

  return {
    key: "meta",
    label: "Meta Ads",
    shortLabel: "Meta",
    primaryActionLabel: "Conversas",
    levels: [
      {
        key: "campaign",
        label: "Campanhas",
        rows: campaignRows.map((row, index) => ({
          id: stringFromUnknown(row.id, `meta-campaign-${index}`),
          name: stringFromUnknown(row.name, "Campanha Meta"),
          values: {
            investment: numberFromUnknown(row.investment),
            impressions: numberFromUnknown(row.impressions),
            reach: numberFromUnknown(row.reach),
            frequency: numberFromUnknown(row.frequency),
            cpm: numberFromUnknown(row.cpm),
            objective: stringFromUnknown(row.objective, "-"),
            conversationsStarted: numberFromUnknown(row.conversationsStarted),
            roas: numberFromUnknown(row.roas),
            costPerLead: numberFromUnknown(row.costPerLead),
          },
        })),
      },
      {
        key: "adSet",
        label: "Conjuntos",
        rows: adSetRows.map((row, index) => ({
          id: stringFromUnknown(row.id, `meta-adset-${index}`),
          name: stringFromUnknown(row.name, "Conjunto Meta"),
          values: {
            investment: numberFromUnknown(row.investment),
            reach: numberFromUnknown(row.reach),
            frequency: numberFromUnknown(row.frequency),
            cpm: numberFromUnknown(row.cpm),
            ctr: numberFromUnknown(row.ctr),
          },
        })),
      },
      {
        key: "ad",
        label: "An\u00fancios",
        rows: adRows.map((row, index) => ({
          id: stringFromUnknown(row.id, `meta-ad-${index}`),
          name: stringFromUnknown(row.name, "An\u00fancio Meta"),
          values: {
            impressions: numberFromUnknown(row.impressions),
            ctr: numberFromUnknown(row.ctr),
            cpc: numberFromUnknown(row.cpc),
            cpm: numberFromUnknown(row.cpm),
            costPerLead: numberFromUnknown(row.costPerLead),
          },
        })),
      },
    ],
  };
}

function summarizePlatform(platform: PaidMediaPlatformMock): PaidMediaSummary {
  const rows = getCampaignRows(platform);
  const investment = rows.reduce(
    (sum, row) => sum + asNumber(row.values.investment),
    0,
  );
  const impressions = rows.reduce(
    (sum, row) => sum + asNumber(row.values.impressions),
    0,
  );
  const reach = rows.reduce((sum, row) => sum + asNumber(row.values.reach), 0);
  const actions = rows.reduce(
    (sum, row) =>
      sum +
      asNumber(row.values.conversationsStarted) +
      asNumber(row.values.conversions) +
      asNumber(row.values.leads),
    0,
  );
  const revenue = rows.reduce(
    (sum, row) =>
      sum + asNumber(row.values.investment) * asNumber(row.values.roas),
    0,
  );

  return {
    investment,
    impressions,
    reach,
    actions,
    roas: investment > 0 ? revenue / investment : 0,
    cpl: actions > 0 ? investment / actions : 0,
  };
}

function summarizeAll(platforms: PaidMediaPlatformMock[]): PaidMediaSummary {
  const summaries = platforms.map(summarizePlatform);
  const investment = summaries.reduce((sum, item) => sum + item.investment, 0);
  const revenue = summaries.reduce(
    (sum, item) => sum + item.investment * item.roas,
    0,
  );
  const actions = summaries.reduce((sum, item) => sum + item.actions, 0);

  return {
    investment,
    impressions: summaries.reduce((sum, item) => sum + item.impressions, 0),
    reach: summaries.reduce((sum, item) => sum + item.reach, 0),
    actions,
    roas: investment > 0 ? revenue / investment : 0,
    cpl: actions > 0 ? investment / actions : 0,
  };
}

function getColumns(
  platformKey: PaidMediaPlatformKey,
  levelKey: PaidMediaLevelKey,
): PaidMediaColumn[] {
  if (levelKey === "campaign") return campaignColumns[platformKey];
  if (levelKey === "adSet") return commonAdSetColumns;
  return commonAdColumns;
}

function PaidMediaSummaryCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-hk-border-subtle bg-hk-surface px-4 py-3 shadow-hk-xs">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-[10px] font-bold uppercase tracking-[0.11em] text-hk-muted">
          {label}
        </p>
        {icon ? (
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-hk-surface-muted text-hk-deep">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums tracking-[-0.02em] text-hk-deep">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-hk-muted">{hint}</p> : null}
    </div>
  );
}

function InvestmentShareList({
  platformSummaries,
  totalInvestment,
}: {
  platformSummaries: Array<{
    platform: PaidMediaPlatformMock;
    summary: PaidMediaSummary;
  }>;
  totalInvestment: number;
}) {
  return (
    <div className="rounded-lg border border-hk-border-subtle bg-hk-surface p-4 shadow-hk-xs">
      <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-hk-muted">
        {"Distribui\u00e7\u00e3o do investimento"}
      </p>
      <div className="mt-4 space-y-3">
        {platformSummaries.map(({ platform, summary }) => {
          const share =
            totalInvestment > 0 ? (summary.investment / totalInvestment) * 100 : 0;
          return (
            <div key={platform.key} className="space-y-1.5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="flex min-w-0 items-center gap-2 font-semibold text-hk-deep">
                  <PlatformIcon platform={platform.key} plain size="sm" />
                  <span className="truncate">{platform.label}</span>
                </span>
                <span className="shrink-0 tabular-nums text-hk-muted">
                  {formatCurrency(summary.investment)} - {formatDecimal(share, 1)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-hk-surface-strong">
                <div
                  className={cn(
                    "h-full rounded-full",
                    platformAccent[platform.key].background,
                  )}
                  style={{
                    width: `${Math.max(share, 3)}%`,
                    backgroundColor: platformAccent[platform.key].bar,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlatformEfficiencyChart({
  platformSummaries,
}: {
  platformSummaries: Array<{
    platform: PaidMediaPlatformMock;
    summary: PaidMediaSummary;
  }>;
}) {
  const rows = platformSummaries.map(({ platform, summary }) => ({
    platform: platform.shortLabel,
    roas: Number(summary.roas.toFixed(2)),
    actions: summary.actions,
    fill: platformAccent[platform.key].bar,
  }));

  return (
    <div className="rounded-lg border border-hk-border-subtle bg-hk-surface p-4 shadow-hk-xs">
      <p className="text-[10px] font-bold uppercase tracking-[0.11em] text-hk-muted">
        {"Retorno e volume de a\u00e7\u00f5es"}
      </p>
      <ChartMeasure minHeight={210} className="mt-2">
        {(dim) => (
          <BarChart
            width={dim.width}
            height={dim.height}
            data={rows}
            margin={{ top: 12, right: 12, bottom: 4, left: 0 }}
          >
            <CartesianGrid
              stroke={chartTheme.grid}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="platform"
              tick={{ fontSize: 11, fill: chartTheme.axis }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: chartTheme.axis }}
              axisLine={false}
              tickLine={false}
              width={38}
              tickFormatter={(value) => `${Number(value).toFixed(0)}x`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: chartTheme.axis }}
              axisLine={false}
              tickLine={false}
              width={42}
              tickFormatter={(value) => formatCompactNumber(Number(value))}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: `1px solid ${chartTheme.grid}`,
                fontSize: 12,
                boxShadow: "0 4px 12px rgb(14 14 82 / 0.06)",
              }}
              formatter={(value, name) => {
                if (name === "roas") return [`${formatDecimal(Number(value), 1)}x`, "ROAS"];
                return [formatCompactNumber(Number(value)), "A\u00e7\u00f5es"];
              }}
            />
            <Bar
              yAxisId="left"
              dataKey="roas"
              name="roas"
              radius={[6, 6, 0, 0]}
              fill={chartTheme.primary}
            />
            <Bar
              yAxisId="right"
              dataKey="actions"
              name="actions"
              radius={[6, 6, 0, 0]}
              fill={chartTheme.accent}
            />
          </BarChart>
        )}
      </ChartMeasure>
    </div>
  );
}

function PaidMediaTable({
  platform,
  level,
}: {
  platform: PaidMediaPlatformMock;
  level: PaidMediaLevelKey;
}) {
  const rows = platform.levels.find((item) => item.key === level)?.rows ?? [];
  const columns = getColumns(platform.key, level);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-hk-deep">
            {platform.label} - {levelLabels[level]}
          </p>
          <p className="text-xs text-hk-muted">
            {"Dados mockados por n\u00edvel de entrega."}
          </p>
        </div>
        <Badge variant="secondary">Mock</Badge>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={cn(column.align === "right" && "text-right")}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: PaidMediaRow) => (
            <TableRow key={row.id}>
              {columns.map((column) => {
                const value =
                  column.key === "name" ? row.name : row.values[column.key];
                return (
                  <TableCell
                    key={column.key}
                    className={cn(
                      column.key === "name" && "min-w-[220px] font-semibold text-hk-deep",
                      column.key === "objective" && "min-w-[140px] text-xs text-hk-muted",
                      column.align === "right" && "text-right tabular-nums",
                      column.key !== "name" &&
                        column.key !== "objective" &&
                        "whitespace-nowrap text-xs",
                    )}
                  >
                    {column.key === "name"
                      ? value
                      : formatMetricValue(column.key, value)}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function PlatformPaidMediaPanel({
  platform,
  level,
  onLevelChange,
}: {
  platform: PaidMediaPlatformMock;
  level: PaidMediaLevelKey;
  onLevelChange: (level: PaidMediaLevelKey) => void;
}) {
  const summary = summarizePlatform(platform);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "grid gap-3 rounded-lg border p-3 md:grid-cols-4",
          platformAccent[platform.key].border,
          platformAccent[platform.key].background,
        )}
      >
        <PaidMediaSummaryCard
          label="Investimento"
          value={formatCurrency(summary.investment)}
        />
        <PaidMediaSummaryCard
          label={"Impress\u00f5es"}
          value={formatCompactNumber(summary.impressions)}
        />
        <PaidMediaSummaryCard
          label={platform.primaryActionLabel}
          value={formatCompactNumber(summary.actions)}
        />
        <PaidMediaSummaryCard
          label={"ROAS m\u00e9dio"}
          value={`${formatDecimal(summary.roas, 1)}x`}
          hint={`CPL/CPA ${formatCurrencyPrecise(summary.cpl)}`}
        />
      </div>

      <div className="flex flex-wrap gap-2 print:hidden">
        {platform.levels.map((item) => (
          <Button
            key={item.key}
            type="button"
            size="sm"
            variant={level === item.key ? "default" : "outline"}
            onClick={() => onLevelChange(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <PaidMediaTable platform={platform} level={level} />
    </div>
  );
}

export function PaidMediaAdsSection({
  period,
  metaAdsData,
  metaAdsLoading = false,
  metaAdsError,
}: PaidMediaAdsSectionProps) {
  const [activePlatform, setActivePlatform] =
    useState<PaidMediaPlatformKey>("meta");
  const [levelByPlatform, setLevelByPlatform] = useState<
    Record<PaidMediaPlatformKey, PaidMediaLevelKey>
  >({
    meta: "campaign",
    google: "campaign",
    linkedin: "campaign",
  });

  const platforms = useMemo(() => {
    const liveMeta = buildMetaPlatformFromResponse(metaAdsData);
    return paidMediaMock.map((platform) =>
      platform.key === "meta" && liveMeta ? liveMeta : platform,
    );
  }, [metaAdsData]);

  const hasLiveMetaAds = Boolean(buildMetaPlatformFromResponse(metaAdsData));

  const platformSummaries = useMemo(
    () =>
      platforms.map((platform) => ({
        platform,
        summary: summarizePlatform(platform),
      })),
    [platforms],
  );
  const totalSummary = useMemo(() => summarizeAll(platforms), [platforms]);

  const periodLabel = period ? `${period.start} a ${period.end}` : "Per\u00edodo atual";

  return (
    <DataPanel
      id="paid-media"
      className="space-y-5 border-hk-action/20 bg-[color-mix(in_srgb,var(--hk-surface)_88%,var(--hk-info-soft))]"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <SectionHeader
          compact
          title={"M\u00eddia paga"}
          description={
            "Meta Ads, Google Ads e LinkedIn Ads em uma \u00e1rea separada dos indicadores org\u00e2nicos."
          }
        />
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="info">Patrocinado</Badge>
          {metaAdsLoading ? <Badge variant="secondary">Meta carregando</Badge> : null}
          {!metaAdsLoading && hasLiveMetaAds ? (
            <Badge variant="success">Meta real</Badge>
          ) : null}
          {!metaAdsLoading && !hasLiveMetaAds && metaAdsError ? (
            <Badge variant="secondary">Meta mock</Badge>
          ) : null}
          <Badge variant="outline">{periodLabel}</Badge>
          <Badge variant="secondary">
            {hasLiveMetaAds ? "Google/LinkedIn mock" : "Dados mock"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <PaidMediaSummaryCard
          label="Investimento total"
          value={formatCurrency(totalSummary.investment)}
          icon={<Megaphone className="size-4" />}
        />
        <PaidMediaSummaryCard
          label={"Impress\u00f5es pagas"}
          value={formatCompactNumber(totalSummary.impressions)}
          icon={<RadioTower className="size-4" />}
        />
        <PaidMediaSummaryCard
          label="Alcance pago"
          value={formatCompactNumber(totalSummary.reach)}
        />
        <PaidMediaSummaryCard
          label={"A\u00e7\u00f5es geradas"}
          value={formatCompactNumber(totalSummary.actions)}
        />
        <PaidMediaSummaryCard
          label="ROAS consolidado"
          value={`${formatDecimal(totalSummary.roas, 1)}x`}
          hint={`CPL/CPA m\u00e9dio ${formatCurrencyPrecise(totalSummary.cpl)}`}
          icon={<TrendingUp className="size-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <InvestmentShareList
          platformSummaries={platformSummaries}
          totalInvestment={totalSummary.investment}
        />
        <PlatformEfficiencyChart platformSummaries={platformSummaries} />
      </div>

      <Tabs
        value={activePlatform}
        onValueChange={(value) =>
          setActivePlatform(value as PaidMediaPlatformKey)
        }
      >
        <TabsList className="h-auto flex-wrap justify-start">
          {platforms.map((platform) => (
            <TabsTrigger
              key={platform.key}
              value={platform.key}
              className="gap-2"
            >
              <PlatformIcon platform={platform.key} plain size="sm" />
              {platform.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent key={platform.key} value={platform.key}>
            <PlatformPaidMediaPanel
              platform={platform}
              level={levelByPlatform[platform.key]}
              onLevelChange={(level) =>
                setLevelByPlatform((current) => ({
                  ...current,
                  [platform.key]: level,
                }))
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </DataPanel>
  );
}

"use client";

import {
  buildBlockInsightPayload,
  buildPeriodInsightPayload,
} from "@/features/dashboard/api/insight-adapter";
import { ChartCard } from "@/features/dashboard/components/chart-card";
import { DashboardGlobalLoading } from "@/features/dashboard/components/dashboard-global-loading";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { DashboardPeriodToolbar } from "@/features/dashboard/components/dashboard-period-toolbar";
import {
  DashboardErrorState,
  DashboardNoCustomerState,
  DashboardNoDataState,
  DashboardNoIntegrationsState,
} from "@/features/dashboard/components/dashboard-states";
import { InsightPanel } from "@/features/dashboard/components/insight-panel";
import { InsightTriggerButton } from "@/features/dashboard/components/insight-trigger-button";
import { IntegrationStatusCard } from "@/features/dashboard/components/integration-status-card";
import { MetricOverviewCard } from "@/features/dashboard/components/metric-overview-card";
import { MetricSection } from "@/features/dashboard/components/metric-section";
import { PostsPerformanceTable } from "@/features/dashboard/components/posts-performance-table";
import { TopPostsPanel } from "@/features/dashboard/components/top-posts-panel";
import { useDashboardPeriodQueries } from "@/features/dashboard/hooks/use-dashboard-period-queries";
import { useIntegrationDashboardCards } from "@/features/dashboard/hooks/use-integration-status";
import type {
  DashboardPeriodRange,
  MetricBlockModel,
} from "@/features/dashboard/types";
import { extractInsightText } from "@/features/dashboard/utils/insight-text";
import {
  blockHasNumericData,
  pickTopPosts,
} from "@/features/dashboard/utils/normalize";
import { useSelectedCustomer } from "@/components/providers/selected-customer-provider";
import { useAnalyzeMutation } from "@/hooks/api/use-analyze-mutations";
import type { AnalyzeRequestBody } from "@/lib/types/analyze";
import { useMemo, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

function defaultRange(): DashboardPeriodRange {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { start: fmt(start), end: fmt(end) };
}

function snapshotHasData(s: ReturnType<typeof useDashboardPeriodQueries>["snapshot"]) {
  if (!s) return false;
  return (
    blockHasNumericData(s.reach) ||
    blockHasNumericData(s.impressions) ||
    blockHasNumericData(s.followers) ||
    blockHasNumericData(s.traffic) ||
    blockHasNumericData(s.search) ||
    s.posts.length > 0
  );
}

export function DashboardView() {
  const { selected, isReady: customerReady } = useSelectedCustomer();
  const customerId = selected?.id_customer ?? null;

  const [draft, setDraft] = useState(defaultRange);
  const [appliedRange, setAppliedRange] = useState<DashboardPeriodRange | null>(
    null,
  );

  useEffect(() => {
    setAppliedRange(null);
  }, [customerId]);

  const {
    queries,
    isPending,
    isFetching,
    isError,
    errors,
    snapshot,
    refetchAll,
    queryReach,
    queryPosts,
  } = useDashboardPeriodQueries(customerId, appliedRange);

  const hasData = snapshotHasData(snapshot);
  const { cards: integrationCards, isLoading: intLoading } =
    useIntegrationDashboardCards(customerId, appliedRange !== null, hasData);

  const connectedCount = integrationCards.filter(
    (c) => c.operational === "connected",
  ).length;

  const analyzeMutation = useAnalyzeMutation();
  const [insightLoadingKey, setInsightLoadingKey] = useState<string | null>(
    null,
  );
  const [periodInsight, setPeriodInsight] = useState<string | null>(null);
  const [blockInsights, setBlockInsights] = useState<Record<string, string>>(
    {},
  );

  const runInsight = useCallback(
    async (key: string, body: AnalyzeRequestBody) => {
      setInsightLoadingKey(key);
      try {
        const res = await analyzeMutation.mutateAsync(body);
        const text = extractInsightText(res);
        if (key === "period") setPeriodInsight(text);
        else setBlockInsights((prev) => ({ ...prev, [key]: text }));
      } catch {
        toast.error("Não foi possível gerar o insight. Verifique o serviço de IA.");
      } finally {
        setInsightLoadingKey(null);
      }
    },
    [analyzeMutation],
  );

  const onPeriodAnalyze = useCallback(() => {
    if (!customerId || !appliedRange || !snapshot) return;
    runInsight(
      "period",
      buildPeriodInsightPayload(customerId, appliedRange, {
        reach: snapshot.reach,
        impressions: snapshot.impressions,
        followers: snapshot.followers,
        traffic: snapshot.traffic,
        search: snapshot.search,
        postsCount: snapshot.posts.length,
      }),
    );
  }, [customerId, appliedRange, snapshot, runInsight]);

  const makeBlockHandler = useCallback(
    (
      key: "reach" | "impressions" | "followers" | "traffic" | "search",
      title: string,
      block: MetricBlockModel | null,
    ) => {
      if (!customerId || !appliedRange) return;
      runInsight(
        key,
        buildBlockInsightPayload(customerId, appliedRange, key, title, block),
      );
    },
    [customerId, appliedRange, runInsight],
  );

  const firstError = errors[0];

  const overviewLoading = appliedRange !== null && isPending;

  const qImp = queries[1];
  const qFol = queries[2];
  const qTra = queries[3];
  const qSea = queries[4];

  const trafficBlock = snapshot?.traffic ?? {
    total: 0,
    series: [],
    byPlatform: {},
  };
  const searchBlock = snapshot?.search ?? {
    total: 0,
    series: [],
    byPlatform: {},
  };

  const followersExtra = useMemo(() => {
    if (!snapshot) return null;
    const s = snapshot.followers.series;
    if (s.length === 0 && !blockHasNumericData(snapshot.followers)) return null;
    return (
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {s.map((row) => (
          <div
            key={row.name}
            className="rounded-lg border border-hk-border-subtle bg-hk-canvas/40 px-3 py-2.5"
          >
            <p className="text-[11px] font-semibold uppercase text-hk-muted">
              {row.name}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-hk-deep">
              {new Intl.NumberFormat("pt-BR").format(row.value)}
            </p>
            <p className="text-[11px] text-hk-muted">Valor no período / snapshot</p>
          </div>
        ))}
      </div>
    );
  }, [snapshot]);

  if (!customerReady) {
    return (
      <div className="space-y-8">
        <DashboardPageHeader />
        <div className="h-32 animate-pulse rounded-lg bg-hk-border-subtle" />
      </div>
    );
  }

  if (!customerId) {
    return (
      <div className="space-y-8">
        <DashboardPageHeader />
        <DashboardNoCustomerState />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <DashboardGlobalLoading active={isFetching} />
      <DashboardPageHeader />

      <DashboardPeriodToolbar
        customerId={customerId}
        dateStart={draft.start}
        dateEnd={draft.end}
        onDateStartChange={(v) => setDraft((d) => ({ ...d, start: v }))}
        onDateEndChange={(v) => setDraft((d) => ({ ...d, end: v }))}
        onApply={() => {
          if (draft.start > draft.end) {
            toast.error("A data inicial não pode ser posterior à final.");
            return;
          }
          setAppliedRange({ ...draft });
        }}
        isLoading={isPending}
        disabled={!customerId}
      />

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-hk-muted">
          Integrações
        </p>
        <div className="flex flex-wrap gap-2">
          {intLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[72px] min-w-[140px] flex-1 animate-pulse rounded-lg bg-hk-border-subtle"
                />
              ))
            : integrationCards.map((c) => (
                <IntegrationStatusCard key={c.surface} card={c} />
              ))}
        </div>
      </div>

      {appliedRange && !intLoading && connectedCount === 0 && (
        <DashboardNoIntegrationsState />
      )}

      {appliedRange && isError && firstError && (
        <DashboardErrorState error={firstError} onRetry={() => refetchAll()} />
      )}

      {appliedRange && !isPending && !isError && snapshot && !hasData && (
        <DashboardNoDataState />
      )}

      {appliedRange && snapshot && (
        <>
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-hk-deep">
              Visão geral do período
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <MetricOverviewCard
                label="Alcance consolidado"
                value={snapshot.reach.total ?? null}
                loading={overviewLoading}
              />
              <MetricOverviewCard
                label="Impressões / views"
                value={snapshot.impressions.total ?? null}
                loading={overviewLoading}
              />
              <MetricOverviewCard
                label="Audiência (snapshot)"
                value={snapshot.followers.total ?? null}
                hint="Seguidores / base no período conforme API"
                loading={overviewLoading}
              />
              <MetricOverviewCard
                label="Tráfego (site)"
                value={snapshot.traffic.total ?? null}
                loading={overviewLoading}
              />
              <MetricOverviewCard
                label="Volume de busca"
                value={snapshot.search.total ?? null}
                loading={overviewLoading}
              />
              <MetricOverviewCard
                label="Conteúdos publicados"
                value={snapshot.posts.length}
                loading={overviewLoading}
              />
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-hk-deep">
                Leitura assistida do período
              </h2>
              <p className="text-sm text-hk-muted">
                Análise estratégica curta com base nos totais carregados (serviço
                de IA existente).
              </p>
            </div>
            <InsightTriggerButton
              label="Analisar período com IA"
              variant="default"
              loading={insightLoadingKey === "period"}
              disabled={overviewLoading}
              onClick={onPeriodAnalyze}
            />
          </div>
          <InsightPanel
            title="Insight geral"
            text={periodInsight}
            loading={insightLoadingKey === "period"}
          />

          <MetricSection
            id="reach"
            title="Alcance"
            description="Distribuição do alcance por origem. Compare canais onde a métrica é homogênea."
            block={snapshot.reach}
            queryLoading={queryReach.isPending}
            queryError={queryReach.error}
            onRetry={() => queryReach.refetch()}
            insightText={blockInsights.reach ?? null}
            insightLoading={insightLoadingKey === "reach"}
            onInsight={() =>
              makeBlockHandler("reach", "Alcance", snapshot.reach)
            }
          />

          <MetricSection
            id="impressions"
            title="Impressões e visualizações"
            description="Exposição agregada. Útil para entender volume de contato com a audiência."
            block={snapshot.impressions}
            queryLoading={qImp.isPending}
            queryError={qImp.error}
            onRetry={() => qImp.refetch()}
            insightText={blockInsights.impressions ?? null}
            insightLoading={insightLoadingKey === "impressions"}
            onInsight={() =>
              makeBlockHandler(
                "impressions",
                "Impressões / visualizações",
                snapshot.impressions,
              )
            }
          />

          <MetricSection
            id="followers"
            title="Seguidores e audiência"
            description="Base e variação por canal, conforme retorno da API de followers."
            block={snapshot.followers}
            queryLoading={qFol.isPending}
            queryError={qFol.error}
            onRetry={() => qFol.refetch()}
            insightText={blockInsights.followers ?? null}
            insightLoading={insightLoadingKey === "followers"}
            onInsight={() =>
              makeBlockHandler(
                "followers",
                "Seguidores / audiência",
                snapshot.followers,
              )
            }
            footer={followersExtra}
          />

          <section
            id="traffic"
            className="space-y-4 rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-hk-deep">
                  Tráfego do site
                </h2>
                <p className="text-sm text-hk-muted">
                  Sessões e origens conforme Google Analytics conectado.
                </p>
              </div>
              <InsightTriggerButton
                label="Insight de tráfego"
                loading={insightLoadingKey === "traffic"}
                disabled={qTra.isPending}
                onClick={() =>
                  makeBlockHandler("traffic", "Tráfego do site", snapshot.traffic)
                }
              />
            </div>
            <ChartCard
              title="Distribuição reportada"
              data={trafficBlock.series}
              loading={qTra.isPending}
            />
            <InsightPanel
              title="Leitura — tráfego"
              text={blockInsights.traffic ?? null}
              loading={insightLoadingKey === "traffic"}
            />
          </section>

          <section
            id="search"
            className="space-y-4 rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-hk-deep">
                  Busca e orgânico
                </h2>
                <p className="text-sm text-hk-muted">
                  Volume de busca e sinais orgânicos consolidados no período.
                </p>
              </div>
              <InsightTriggerButton
                label="Insight de busca"
                loading={insightLoadingKey === "search"}
                disabled={qSea.isPending}
                onClick={() =>
                  makeBlockHandler(
                    "search",
                    "Volume de busca / orgânico",
                    snapshot.search,
                  )
                }
              />
            </div>
            <ChartCard
              title="Volume por fonte"
              data={searchBlock.series}
              loading={qSea.isPending}
            />
            <InsightPanel
              title="Leitura — busca"
              text={blockInsights.search ?? null}
              loading={insightLoadingKey === "search"}
            />
          </section>

          <TopPostsPanel
            posts={pickTopPosts(snapshot.posts, 3)}
            loading={queryPosts.isPending}
          />

          <PostsPerformanceTable
            posts={snapshot.posts}
            loading={queryPosts.isPending}
          />
        </>
      )}
    </div>
  );
}

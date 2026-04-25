"use client";

import {
  buildBlockInsightPayload,
  buildPeriodInsightPayload,
} from "@/features/dashboard/api/insight-adapter";
import { ComparisonMetricSection } from "@/features/dashboard/components/comparison-metric-section";
import { ContentsSummaryStrip } from "@/features/dashboard/components/contents-summary-strip";
import { DashboardGlobalLoading } from "@/features/dashboard/components/dashboard-global-loading";
import { DashboardPageHeader } from "@/features/dashboard/components/dashboard-page-header";
import { DashboardPeriodToolbar } from "@/features/dashboard/components/dashboard-period-toolbar";
import { DataPanel } from "@/components/data-display/data-panel";
import { SectionHeader } from "@/components/data-display/section-header";
import {
  DashboardErrorState,
  DashboardNoCustomerState,
  DashboardNoDataState,
  DashboardNoIntegrationsState,
} from "@/features/dashboard/components/dashboard-states";
import { InsightPanel } from "@/features/dashboard/components/insight-panel";
import { InsightTriggerButton } from "@/features/dashboard/components/insight-trigger-button";
import { IntegrationStatusCard } from "@/features/dashboard/components/integration-status-card";
import { FollowersSnapshotSection } from "@/features/dashboard/components/followers-snapshot-section";
import { MetricOverviewCard } from "@/features/dashboard/components/metric-overview-card";
import { PostsPerformanceTable } from "@/features/dashboard/components/posts-performance-table";
import { SearchOrganicSection } from "@/features/dashboard/components/search-organic-section";
import { TrafficSplitSection } from "@/features/dashboard/components/traffic-split-section";
import { TopPostsPanel } from "@/features/dashboard/components/top-posts-panel";
import {
  impressionsComparisonLines,
  reachComparisonLines,
} from "@/features/dashboard/config/line-chart-presets";
import { useDashboardPeriodQueries } from "@/features/dashboard/hooks/use-dashboard-period-queries";
import { useIntegrationDashboardCards } from "@/features/dashboard/hooks/use-integration-status";
import type {
  DashboardPeriodRange,
  MetricBlockModel,
} from "@/features/dashboard/types";
import { extractInsightText } from "@/features/dashboard/utils/insight-text";
import {
  blockHasNumericData,
  computePlatformPeriodCoverage,
  pickTopPosts,
} from "@/features/dashboard/utils/normalize";
import { isUnauthorized } from "@/lib/api/errors";
import { useDashboardPrint } from "@/hooks/use-dashboard-print";
import { useAnalyzeMutation } from "@/hooks/api/use-analyze-mutations";
import { useCurrentCustomerContext } from "@/hooks/use-current-customer-context";
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
  const summary = s.postsMeta.summary;
  const contentsSignal =
    (summary?.amountContents ?? 0) > 0 ||
    (summary?.totalEngagement ?? 0) > 0 ||
    s.posts.length > 0;
  return (
    blockHasNumericData(s.reach) ||
    blockHasNumericData(s.impressions) ||
    blockHasNumericData(s.followers) ||
    blockHasNumericData(s.traffic) ||
    blockHasNumericData(s.search) ||
    contentsSignal
  );
}

export function DashboardView() {
  const { selected, customerId, isReady: customerReady } =
    useCurrentCustomerContext();

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
    allQueriesFailed,
    someQueriesFailed,
    errors,
    snapshot,
    refetchAll,
    queryReach,
    queryPosts,
  } = useDashboardPeriodQueries(customerId, appliedRange);

  const hasData = snapshotHasData(snapshot);

  const platformCoverage = useMemo(() => {
    if (!appliedRange || !snapshot || isPending) return null;
    return computePlatformPeriodCoverage(snapshot);
  }, [appliedRange, snapshot, isPending]);

  const { cards: integrationCards, isLoading: intLoading } =
    useIntegrationDashboardCards(
      customerId,
      selected,
      platformCoverage,
      appliedRange !== null,
    );

  const connectedCount = integrationCards.filter(
    (c) => c.operational === "connected",
  ).length;

  const printPeriod = useDashboardPrint({
    documentTitle: "Dashboard ho.ko",
    customerName: selected?.name ?? null,
    period: appliedRange,
  });

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
        postsCount:
          snapshot.postsMeta.summary?.amountContents ?? snapshot.posts.length,
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
  const authError = errors.find(isUnauthorized) ?? null;

  /** Com range null as queries estão disabled; no TanStack v5 isPending fica true sem fetch — não usar isPending no toolbar sem este guard. */
  const overviewLoading = appliedRange !== null && isPending;

  const qImp = queries[1];
  const qFol = queries[2];
  const qTra = queries[3];
  const qSea = queries[4];

  const impressionLineDefs = useMemo(() => {
    const rows = snapshot?.impressions.comparison?.rows ?? [];
    const hasGoogle = rows.some((r) => Number(r.google) > 0);
    const hasLinkedin = rows.some((r) => Number(r.linkedin) > 0);
    return impressionsComparisonLines(hasGoogle, hasLinkedin);
  }, [snapshot?.impressions.comparison?.rows]);

  if (!customerReady) {
    return (
      <div className="hk-page space-y-7 py-6 lg:py-7">
        <DashboardPageHeader printEnabled={false} />
        <div className="hk-skeleton h-32 rounded-xl" />
      </div>
    );
  }

  if (!customerId) {
    return (
      <div className="hk-page space-y-7 py-6 lg:py-7">
        <DashboardPageHeader printEnabled={false} />
        <DashboardNoCustomerState />
      </div>
    );
  }

  return (
    <div className="hk-page space-y-7 pb-16 pt-3 lg:space-y-8 lg:pt-4">
      <DashboardGlobalLoading active={isFetching} />
      <DashboardPageHeader
        printEnabled={!!appliedRange}
        onPrintPeriod={printPeriod}
      />

      {appliedRange && selected ? (
        <div className="hidden border-b border-hk-border pb-3 print:block">
          <p className="text-base font-semibold text-hk-deep">
            Resumo para impressão
          </p>
          <p className="mt-1 text-sm text-hk-muted">
            <span className="font-medium text-hk-ink">{selected.name}</span>
            {" · "}
            <span className="tabular-nums">
              {appliedRange.start} — {appliedRange.end}
            </span>
          </p>
        </div>
      ) : null}

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
        isLoading={overviewLoading}
        disabled={!customerId}
      />

      <DataPanel className="space-y-3">
        <SectionHeader
          compact
          title="Conectividade e prontidão"
          description="Estado operacional das fontes conectadas para o período selecionado."
        />
        <div className="flex flex-wrap gap-2.5">
          {intLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="hk-skeleton h-[88px] min-w-[150px] flex-1 rounded-xl"
                />
              ))
            : integrationCards.map((c) => (
                <IntegrationStatusCard key={c.surface} card={c} />
              ))}
        </div>
      </DataPanel>

      {appliedRange && !intLoading && connectedCount === 0 && (
        <DashboardNoIntegrationsState />
      )}

      {appliedRange && authError && (
        <DashboardErrorState error={authError} onRetry={() => refetchAll()} />
      )}

      {appliedRange && !authError && allQueriesFailed && firstError && (
        <DashboardErrorState error={firstError} onRetry={() => refetchAll()} />
      )}

      {appliedRange && someQueriesFailed && !authError && !allQueriesFailed && (
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
          <span className="font-medium">Carregamento parcial.</span>{" "}
          Alguns indicadores falharam; cada bloco abaixo mostra o erro
          específico. 403 não significa integração desconectada — verifique
          permissão com o administrador.
        </div>
      )}

      {appliedRange &&
        !isPending &&
        !authError &&
        !allQueriesFailed &&
        snapshot &&
        !hasData &&
        !someQueriesFailed && <DashboardNoDataState />}

      {appliedRange &&
        !isPending &&
        !authError &&
        !allQueriesFailed &&
        snapshot &&
        !hasData &&
        someQueriesFailed && (
          <div className="rounded-xl border border-hk-border bg-hk-surface px-4 py-3 text-sm text-hk-muted shadow-hk-sm">
            Não foi possível carregar todos os blocos; com os erros pendentes,
            não é possível afirmar com segurança que o período está vazio.
            Corrija os blocos com falha ou tente novamente.
          </div>
        )}

      {appliedRange && snapshot && !authError && !allQueriesFailed && (
        <>
          <DataPanel className="space-y-3">
            <SectionHeader
              compact
              title="Visão geral do período"
              description="KPIs consolidados para leitura executiva rápida."
            />
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
                value={
                  snapshot.postsMeta.summary?.amountContents ??
                  snapshot.posts.length
                }
                loading={overviewLoading}
              />
            </div>
          </DataPanel>

          <DataPanel className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-hk-deep">
                Leitura assistida do período
              </h2>
              <p className="text-sm text-hk-muted">
                Análise estratégica curta com base nos totais carregados (serviço
                de IA existente).
              </p>
            </div>
            <div className="hk-print-hide">
              <InsightTriggerButton
                label="Analisar período com IA"
                variant="default"
                loading={insightLoadingKey === "period"}
                disabled={overviewLoading}
                onClick={onPeriodAnalyze}
              />
            </div>
          </DataPanel>
          <InsightPanel
            title="Insight geral"
            text={periodInsight}
            loading={insightLoadingKey === "period"}
          />

          <ComparisonMetricSection
            id="reach"
            title="Alcance"
            description="Comparação temporal entre redes: cada linha é uma plataforma no mesmo eixo de datas."
            comparison={snapshot.reach.comparison}
            lines={reachComparisonLines()}
            byPlatform={snapshot.reach.byPlatform}
            total={snapshot.reach.total}
            queryLoading={queryReach.isPending}
            queryError={queryReach.error}
            onRetry={() => queryReach.refetch()}
            insightText={blockInsights.reach ?? null}
            insightLoading={insightLoadingKey === "reach"}
            onInsight={() =>
              makeBlockHandler("reach", "Alcance", snapshot.reach)
            }
          />

          <ComparisonMetricSection
            id="impressions"
            title="Impressões e visualizações"
            description="Volume de exposição ao longo do tempo, por plataforma disponível na resposta."
            comparison={snapshot.impressions.comparison}
            lines={impressionLineDefs}
            byPlatform={snapshot.impressions.byPlatform}
            total={snapshot.impressions.total}
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

          <FollowersSnapshotSection
            id="followers"
            title="Seguidores e audiência"
            description="Snapshot por plataforma no período — leitura principal nos cartões abaixo."
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
          />

          <TrafficSplitSection
            id="traffic"
            title="Tráfego do site"
            description="Sessões ao longo do tempo e distribuição por canal de aquisição."
            block={snapshot.traffic}
            queryLoading={qTra.isPending}
            queryError={qTra.error}
            onRetry={() => qTra.refetch()}
            insightText={blockInsights.traffic ?? null}
            insightLoading={insightLoadingKey === "traffic"}
            onInsight={() =>
              makeBlockHandler("traffic", "Tráfego do site", snapshot.traffic)
            }
          />

          <SearchOrganicSection
            id="search"
            title="Busca e orgânico"
            description="Sessões orgânicas na série principal; totais e leads complementam a leitura."
            block={snapshot.search}
            queryLoading={qSea.isPending}
            queryError={qSea.error}
            onRetry={() => qSea.refetch()}
            insightText={blockInsights.search ?? null}
            insightLoading={insightLoadingKey === "search"}
            onInsight={() =>
              makeBlockHandler(
                "search",
                "Volume de busca / orgânico",
                snapshot.search,
              )
            }
          />

          <DataPanel id="contents" className="space-y-4">
            <SectionHeader
              compact
              title="Conteúdos do período"
              description="Totais reportados pela API e lista unificada de publicações em Facebook e Instagram."
            />
            <ContentsSummaryStrip
              summary={snapshot.postsMeta.summary}
              loading={queryPosts.isPending}
            />
          </DataPanel>

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

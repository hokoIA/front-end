"use client";

import { AnalysisConfigPanel } from "@/features/analises/components/analysis-config-panel";
import { AnalysisGenerateButton } from "@/features/analises/components/analysis-generate-button";
import { AnalysisGenerationProgress } from "@/features/analises/components/analysis-generation-progress";
import { AnalysisMarkdownViewer } from "@/features/analises/components/analysis-markdown-viewer";
import { AnalysisPageHeader } from "@/features/analises/components/analysis-page-header";
import { AnalysisResultActions } from "@/features/analises/components/analysis-result-actions";
import { AnalysisResultHeader } from "@/features/analises/components/analysis-result-header";
import {
  AnalysisErrorState,
  AnalysisLowCoverageBanner,
  AnalysisNoCustomerState,
  AnalysisNoDataState,
  AnalysisNoIntegrationsState,
} from "@/features/analises/components/analysis-states";
import { useStrategicAnalyzeMutation } from "@/features/analises/hooks/use-strategic-analyze-mutation";
import type {
  AnalysisFormState,
  AnalysisPlatformValue,
  AnalysisResultMeta,
  MetaAdsPipelineDiagnostics,
} from "@/features/analises/types";
import { buildStrategicAnalyzePayload } from "@/features/analises/utils/build-analyze-payload";
import { createDefaultAnalysisForm } from "@/features/analises/utils/default-form";
import { PLATFORM_LABELS } from "@/features/analises/utils/labels";
import { fetchMetaAdsAnalysisExternalData } from "@/features/analises/utils/meta-ads-api-analysis";
import { parseAnalyzeResult } from "@/features/analises/utils/parse-analyze-result";
import { useIntegrationDashboardCards } from "@/features/dashboard/hooks/use-integration-status";
import { useCurrentCustomerContext } from "@/hooks/use-current-customer-context";
import { getAnalyzeBaseUrl } from "@/lib/api/http-client";
import { getErrorKind } from "@/lib/api/errors";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

function safeExportBaseName(
  customerName: string,
  start: string,
  end: string,
): string {
  const base = `analise ${customerName} ${start} ${end}`;
  const s = base
    .replace(/[^\w\-àáâãéêíóôõúç\s]/gi, "")
    .trim()
    .slice(0, 80);
  return s || "analise";
}

function datesValid(start: string, end: string): boolean {
  if (!start || !end) return false;
  const a = new Date(start + "T12:00:00");
  const b = new Date(end + "T12:00:00");
  return !Number.isNaN(a.getTime()) && !Number.isNaN(b.getTime()) && a <= b;
}

function formatPipelineDuration(ms?: number): string {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return "-";
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}

export function AnalisesView() {
  const {
    authed,
    selected,
    customerId,
    agencyId,
    isReady,
    isLoadingCustomers,
    profileLoading,
  } = useCurrentCustomerContext();

  const [form, setForm] = useState<AnalysisFormState>(createDefaultAnalysisForm);
  const [resultMarkdown, setResultMarkdown] = useState("");
  const [resultMeta, setResultMeta] = useState<AnalysisResultMeta | null>(null);
  const [genError, setGenError] = useState<unknown>(null);

  const exportRootRef = useRef<HTMLDivElement>(null);
  const configAnchorRef = useRef<HTMLDivElement>(null);

  const { cards: integrationCards, isLoading: integrationsLoading } =
    useIntegrationDashboardCards(customerId, selected, null, false);

  const anyIntegrationConnected = useMemo(
    () => integrationCards.some((c) => c.operational === "connected"),
    [integrationCards],
  );

  const availablePlatforms = useMemo<AnalysisPlatformValue[]>(() => {
    return integrationCards
      .filter((card) => card.operational === "connected")
      .map((card) => card.surface)
      .filter((surface): surface is AnalysisPlatformValue =>
        [
          "facebook",
          "instagram",
          "meta_ads",
          "google_analytics",
          "linkedin",
          "youtube",
        ].includes(surface),
      );
  }, [integrationCards]);

  const showPendingIntegrationsState = Boolean(selected) && !integrationsLoading && !anyIntegrationConnected;
  const canRenderAnalysis = Boolean(selected) && !integrationsLoading && anyIntegrationConnected;

  useEffect(() => {
    if (integrationsLoading) return;

    const timeout = window.setTimeout(() => setForm((current) => {
      const nextPlatforms = current.platforms.filter((platform) =>
        availablePlatforms.includes(platform),
      );

      const unchanged =
        nextPlatforms.length === current.platforms.length &&
        nextPlatforms.every((platform, index) => platform === current.platforms[index]);

      if (unchanged) return current;

      return {
        ...current,
        platforms: nextPlatforms,
      };
    }), 0);

    return () => window.clearTimeout(timeout);
  }, [availablePlatforms, integrationsLoading]);

  const disconnectedSelectedLabels = useMemo(() => {
    return form.platforms
      .filter((p: AnalysisPlatformValue) => {
        const card = integrationCards.find((c) => c.surface === p);
        if (!card) return true;
        return card.operational !== "connected";
      })
      .map((p) => PLATFORM_LABELS[p]);
  }, [form.platforms, integrationCards]);

  const analyzeMutation = useStrategicAnalyzeMutation();

  const scrollToConfig = useCallback(() => {
    configAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const runGenerate = useCallback(async () => {
    if (!selected) {
      toast.error("Selecione um cliente.");
      return;
    }
    if (!anyIntegrationConnected) {
      toast.error("Conecte ao menos uma integração antes de gerar a análise.");
      return;
    }
    if (!datesValid(form.dateStart, form.dateEnd)) {
      toast.error("Informe um período válido (data inicial ≤ final).");
      return;
    }
    if (form.platforms.length === 0) {
      toast.error("Selecione ao menos uma plataforma.");
      return;
    }
    if (!agencyId) {
      toast.error(
        "Não foi possível identificar o usuário autenticado para gerar a análise.",
      );
      return;
    }
    const useMock = process.env.NEXT_PUBLIC_ANALYZE_USE_MOCK === "true";
    if (!useMock && !getAnalyzeBaseUrl()) {
      toast.error(
        "Serviço de análise não configurado (NEXT_PUBLIC_ANALYZE_API_BASE_URL).",
      );
      return;
    }

    setGenError(null);
    const needsMetaAdsApi = form.platforms.includes("meta_ads");
    const totalStartedAt = Date.now();
    let stage: "meta_ads_api" | "analyze" = "analyze";
    let metaAdsPipeline: MetaAdsPipelineDiagnostics | undefined;
    let payload = buildStrategicAnalyzePayload(
      form,
      agencyId,
      selected.id_customer,
    );

    try {
      if (needsMetaAdsApi) {
        stage = "meta_ads_api";
        const metaAdsExternal = await fetchMetaAdsAnalysisExternalData({
          idCustomer: selected.id_customer,
          startDate: form.dateStart,
          endDate: form.dateEnd,
        });
        metaAdsPipeline = metaAdsExternal.diagnostics;
        payload = {
          ...payload,
          source_mode: "api_direct_experiment",
          external_data: metaAdsExternal.externalData,
        };
      }

      stage = "analyze";
      const analyzeStartedAt = Date.now();
      const res = await analyzeMutation.mutateAsync(payload);
      const analyzeMs = Date.now() - analyzeStartedAt;
      const totalMs = Date.now() - totalStartedAt;
      if (metaAdsPipeline) {
        metaAdsPipeline = {
          ...metaAdsPipeline,
          analyzeMs,
          totalMs,
        };
      }
      const text = parseAnalyzeResult(res);
      const meta: AnalysisResultMeta = {
        customerName: selected.name,
        clientId: selected.id_customer,
        dateStart: form.dateStart,
        dateEnd: form.dateEnd,
        strategicFocus: form.strategicFocus,
        analysisType: form.analysisType,
        platforms: [...form.platforms],
        generatedAt: new Date().toISOString(),
        bias: form.bias.trim() || undefined,
        metaAdsPipeline,
      };
      setResultMeta(meta);
      setResultMarkdown(text);
      if (metaAdsPipeline) {
        toast.success(
          `Meta Ads API: ${formatPipelineDuration(metaAdsPipeline.metaAdsApiMs)}. Total: ${formatPipelineDuration(metaAdsPipeline.totalMs)}.`,
        );
      }
      if (!text.trim()) {
        toast.message("A API respondeu sem texto de análise.");
      }
    } catch (e) {
      setGenError(e);
      const kind = getErrorKind(e);
      if (stage === "meta_ads_api") {
        toast.error("Falha ao consumir Meta Ads via API para a analise.");
      } else if (kind === "unauthorized") {
        toast.error("Sessão expirada. Faça login novamente.");
      } else if (kind === "forbidden") {
        toast.error("Sem permissão para gerar esta análise.");
      } else {
        toast.error("Falha ao gerar a análise.");
      }
    }
  }, [selected, form, agencyId, analyzeMutation, anyIntegrationConnected]);

  const initialBusy =
    authed &&
    (!isReady || isLoadingCustomers || (authed && profileLoading));

  const integrationWarning = useMemo(() => {
    if (!customerId) return null;
    if (integrationsLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="h-14 w-full" />
        </div>
      );
    }
    if (!anyIntegrationConnected) return null;
    return (
      <AnalysisLowCoverageBanner
        disconnectedLabels={disconnectedSelectedLabels}
      />
    );
  }, [
    customerId,
    integrationsLoading,
    anyIntegrationConnected,
    disconnectedSelectedLabels,
  ]);

  const showEmptyCustomer = isReady && !selected;

  const exportFileName = resultMeta
    ? safeExportBaseName(
      resultMeta.customerName,
      resultMeta.dateStart,
      resultMeta.dateEnd,
    )
    : "analise";

  const kind = genError ? getErrorKind(genError) : null;

  return (
    <div className="hk-page space-y-7 pb-16 pt-3 lg:space-y-8 lg:pt-4">
      <AnalysisPageHeader />

      {initialBusy ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : showEmptyCustomer ? (
        <AnalysisNoCustomerState />
      ) : showPendingIntegrationsState ? (
        <AnalysisNoIntegrationsState />
      ) : canRenderAnalysis && selected ? (
        <>
          <div ref={configAnchorRef} id="analise-config" className="space-y-6">
            <AnalysisConfigPanel
              form={form}
              setForm={setForm}
              disabled={analyzeMutation.isPending}
              integrationWarning={integrationWarning}
              platformOptions={availablePlatforms}
              actions={
                <AnalysisGenerateButton
                  onClick={() => void runGenerate()}
                  loading={analyzeMutation.isPending}
                  disabled={!selected || integrationsLoading || !anyIntegrationConnected}
                />
              }
            />
          </div>

          <AnalysisGenerationProgress active={analyzeMutation.isPending} />

          {genError && (
            <AnalysisErrorState
              error={genError}
              onRetry={() => void runGenerate()}
            />
          )}

          {resultMeta && (
            <section className="overflow-hidden rounded-xl border border-hk-border bg-hk-surface shadow-hk-sm">
              <div ref={exportRootRef} className="bg-white">
                <AnalysisResultHeader meta={resultMeta} />
                {resultMarkdown.trim() ? (
                  <AnalysisMarkdownViewer content={resultMarkdown} />
                ) : (
                  <div className="px-5 py-6 md:px-8">
                    <AnalysisNoDataState />
                  </div>
                )}
              </div>
              <AnalysisResultActions
                markdown={resultMarkdown}
                getExportRoot={() => exportRootRef.current}
                exportFileName={exportFileName}
                onRegenerate={() => void runGenerate()}
                onEditParams={scrollToConfig}
                generateDisabled={analyzeMutation.isPending}
              />
            </section>
          )}

          {kind === "forbidden" && (
            <p className="text-center text-xs text-hk-muted">
              Se o erro persistir, confirme com o administrador da agência se sua
              função permite gerar análises estratégicas.
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}

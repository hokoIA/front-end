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
} from "@/features/analises/types";
import { buildStrategicAnalyzePayload, resolveAgencyId } from "@/features/analises/utils/build-analyze-payload";
import { createDefaultAnalysisForm } from "@/features/analises/utils/default-form";
import { PLATFORM_LABELS } from "@/features/analises/utils/labels";
import { parseAnalyzeResult } from "@/features/analises/utils/parse-analyze-result";
import { useIntegrationDashboardCards } from "@/features/dashboard/hooks/use-integration-status";
import { useAuthStatusQuery, useProfileQuery } from "@/hooks/api/use-auth-queries";
import { useSelectedCustomer } from "@/components/providers/selected-customer-provider";
import { getAnalyzeBaseUrl } from "@/lib/api/http-client";
import { getErrorKind } from "@/lib/api/errors";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
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

export function AnalisesView() {
  const { data: auth } = useAuthStatusQuery();
  const authed = auth?.authenticated === true;
  const { data: profile, isPending: profileLoading } = useProfileQuery(authed);
  const { selected, isReady, isLoadingCustomers } = useSelectedCustomer();

  const [form, setForm] = useState<AnalysisFormState>(createDefaultAnalysisForm);
  const [resultMarkdown, setResultMarkdown] = useState("");
  const [resultMeta, setResultMeta] = useState<AnalysisResultMeta | null>(null);
  const [genError, setGenError] = useState<unknown>(null);

  const exportRootRef = useRef<HTMLDivElement>(null);
  const configAnchorRef = useRef<HTMLDivElement>(null);

  const customerId = selected?.id_customer ?? null;
  const { cards: integrationCards, isLoading: integrationsLoading } =
    useIntegrationDashboardCards(customerId, selected, null, false);

  const anyIntegrationConnected = useMemo(
    () => integrationCards.some((c) => c.operational === "connected"),
    [integrationCards],
  );

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

  const agencyId = resolveAgencyId(auth?.user ?? null, profile ?? null);

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
    const payload = buildStrategicAnalyzePayload(
      form,
      agencyId,
      selected.id_customer,
    );

    try {
      const res = await analyzeMutation.mutateAsync(payload);
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
      };
      setResultMeta(meta);
      setResultMarkdown(text);
      if (!text.trim()) {
        toast.message("A API respondeu sem texto de análise.");
      }
    } catch (e) {
      setGenError(e);
      const kind = getErrorKind(e);
      if (kind === "unauthorized") {
        toast.error("Sessão expirada. Faça login novamente.");
      } else if (kind === "forbidden") {
        toast.error("Sem permissão para gerar esta análise.");
      } else {
        toast.error("Falha ao gerar a análise.");
      }
    }
  }, [selected, form, agencyId, analyzeMutation]);

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
    if (!anyIntegrationConnected) {
      return <AnalysisNoIntegrationsState />;
    }
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
    <div className="hk-page hk-page--mid space-y-8 pb-16 pt-6 lg:pt-8">
      <AnalysisPageHeader />

      {initialBusy ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : showEmptyCustomer ? (
        <AnalysisNoCustomerState />
      ) : selected ? (
        <>
          <Card className="border-hk-border-subtle bg-hk-surface/90 p-4 shadow-none">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-hk-canvas text-hk-action">
                <Building2 className="size-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-hk-muted">
                  Análise para
                </p>
                <p className="text-base font-semibold text-hk-deep">
                  {selected.name}
                </p>
                <p className="text-xs text-hk-muted">
                  Toda a leitura abaixo usa este cliente como referência única.
                </p>
              </div>
            </div>
          </Card>

          <div ref={configAnchorRef} id="analise-config" className="space-y-6">
            <AnalysisConfigPanel
              form={form}
              setForm={setForm}
              disabled={analyzeMutation.isPending}
              integrationWarning={integrationWarning}
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-xs leading-relaxed text-hk-muted">
                Ao gerar, a plataforma estrutura uma narrativa executiva — não uma
                conversa. O resultado combina período, foco, tipo de análise e
                plataformas escolhidas.
              </p>
              <AnalysisGenerateButton
                onClick={() => void runGenerate()}
                loading={analyzeMutation.isPending}
                disabled={!selected}
              />
            </div>
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

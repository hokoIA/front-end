"use client";

import { GoalAnalysisHistory } from "@/features/goals/components/goal-analysis-history";
import { GoalAnalysisViewer } from "@/features/goals/components/goal-analysis-viewer";
import { GoalExportPdfButton } from "@/features/goals/components/goal-export-pdf-button";
import { GoalGenerateFinalAnalysisButton } from "@/features/goals/components/goal-generate-final-analysis-button";
import { GoalGeneratePartialAnalysisButton } from "@/features/goals/components/goal-generate-partial-analysis-button";
import { GoalPriorityBadge, GoalStatusBadge } from "@/features/goals/components/goal-badges";
import type { GoalAnalysisUi } from "@/features/goals/types/ui";
import type { GoalOrigin } from "@/features/goals/types/ui";
import type { GoalUiModel } from "@/features/goals/types/ui";
import { normalizeGoal } from "@/features/goals/utils/normalize-goal";
import { platformLabel } from "@/features/goals/utils/platform-labels";
import { useGoalQuery } from "@/hooks/api/use-goals-queries";
import type { Goal } from "@/lib/types/goals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";

const originLabel: Record<GoalOrigin, string> = {
  manual: "Manual",
  ai: "Sugerida por IA",
  meeting: "Reunião",
  prior_analysis: "Análise anterior",
  unknown: "—",
};

export function GoalDetailView({
  goal,
  open,
  onOpenChange,
}: {
  goal: GoalUiModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const idForDetail = open && goal ? goal.id : null;
  const detail = useGoalQuery(idForDetail, open);
  const [activeAnalysis, setActiveAnalysis] = useState<GoalAnalysisUi | null>(
    null,
  );

  const merged: GoalUiModel | null = useMemo(() => {
    if (!goal && !detail.data) return null;
    if (detail.data) return normalizeGoal(detail.data as Goal, 0);
    return goal;
  }, [goal, detail.data]);

  const hasFinal = merged?.analyses.some((a) => a.type === "final");
  const hasPartialAnalysis = merged?.analyses.some((a) => a.type === "partial");
  const inFlight =
    merged?.status === "active" ||
    merged?.status === "monitoring" ||
    merged?.status === "attention";
  const ended =
    merged?.status === "completed" ||
    merged?.status === "closed" ||
    merged?.status === "archived";
  const thinData =
    inFlight && (merged?.kpis.length ?? 0) === 0;

  if (!merged) return null;

  const analysisContent =
    activeAnalysis?.content ??
    "Selecione uma análise no histórico ou gere uma nova a partir dos dados do período.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92vh,920px)] w-[min(96vw,44rem)] max-w-none overflow-y-auto border-hk-border p-0 gap-0">
        <div className="border-b border-hk-border bg-gradient-to-r from-hk-lime/15 to-hk-cyan/10 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-xl text-hk-deep">
              {merged.title}
            </DialogTitle>
            <DialogDescription className="text-hk-muted">
              Meta = plano estratégico. Análises = leitura crítica da execução
              (descritiva, preditiva, prescritiva).
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <GoalStatusBadge status={merged.status} />
            <GoalPriorityBadge priority={merged.priority} />
            <span className="text-xs text-hk-muted">
              {merged.customerName ?? merged.customerId ?? "Cliente —"} ·{" "}
              {platformLabel(merged.platform)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-hk-muted">
            <span>
              Período: {merged.startDate ?? "—"} → {merged.endDate ?? "—"}
            </span>
            <span>Origem: {originLabel[merged.origin]}</span>
            <span>Responsável: {merged.responsible ?? "—"}</span>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          {thinData ? (
            <div
              role="status"
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
            >
              Poucos dados estruturados para análise automática. Complete KPIs e
              períodos antes de gerar leituras confiáveis.
            </div>
          ) : null}

          {ended && !hasFinal ? (
            <div
              role="status"
              className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-950"
            >
              Meta encerrada sem análise final. Gere a análise final para
              documentar resultado e próximos passos.
            </div>
          ) : null}

          {inFlight && hasPartialAnalysis ? (
            <p className="text-xs text-emerald-800">
              Análise parcial disponível — use para reuniões de acompanhamento.
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <GoalGeneratePartialAnalysisButton
              idGoal={merged.id}
              disabled={!inFlight || detail.isFetching}
            />
            <GoalGenerateFinalAnalysisButton
              idGoal={merged.id}
              disabled={detail.isFetching}
            />
            <GoalExportPdfButton printAreaId="goal-analysis-print-area" />
          </div>

          <Tabs defaultValue="def">
            <TabsList className="flex w-full flex-wrap justify-start gap-1">
              <TabsTrigger value="def">Definição</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
              <TabsTrigger value="hist">Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="def" className="mt-4 space-y-3 text-sm">
              <Section label="Descrição" text={merged.description} />
              <Section label="SMART" text={merged.smart} />
              <Section label="Justificativa" text={merged.rationale} />
              <Section label="Hipótese" text={merged.hypothesis} />
              <Section label="Impacto esperado" text={merged.expectedImpact} />
              <Section label="Observações internas" text={merged.internalNotes} />
            </TabsContent>
            <TabsContent value="kpis" className="mt-4 space-y-3">
              {merged.kpis.length === 0 ? (
                <p className="text-sm text-hk-muted">Nenhum KPI cadastrado.</p>
              ) : (
                merged.kpis.map((k) => (
                  <div
                    key={k.id}
                    className="rounded-lg border border-hk-border-subtle bg-hk-canvas/50 p-3 text-sm"
                  >
                    <p className="font-medium text-hk-deep">{k.name}</p>
                    <p className="text-xs text-hk-muted">
                      Baseline: {k.baseline ?? "—"} → Alvo: {k.target ?? "—"}{" "}
                      {k.unit ? `(${k.unit})` : ""}
                    </p>
                    {k.progressPct !== undefined ? (
                      <p className="mt-1 text-xs font-medium text-hk-action">
                        Progresso: {Math.round(k.progressPct)}%
                      </p>
                    ) : null}
                    {k.note ? (
                      <p className="mt-1 text-xs text-hk-muted">{k.note}</p>
                    ) : null}
                  </div>
                ))
              )}
            </TabsContent>
            <TabsContent value="hist" className="mt-4 space-y-4">
              <GoalAnalysisHistory
                analyses={merged.analyses}
                onOpen={(a) => setActiveAnalysis(a)}
              />
              <Separator />
              <div id="goal-analysis-print-area">
                <p className="text-xs font-medium uppercase tracking-wide text-hk-muted">
                  Leitura selecionada
                </p>
                <GoalAnalysisViewer
                  title={activeAnalysis?.title}
                  content={analysisContent}
                  className="mt-2"
                />
              </div>
            </TabsContent>
          </Tabs>

          {detail.isError ? (
            <p className="text-sm text-rose-700">
              Não foi possível atualizar o detalhe pelo servidor — exibindo
              dados da lista local.
            </p>
          ) : null}

          <div className="flex justify-end border-t border-hk-border-subtle pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ label, text }: { label: string; text?: string }) {
  if (!text?.trim()) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-hk-muted">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-hk-ink">{text}</p>
    </div>
  );
}

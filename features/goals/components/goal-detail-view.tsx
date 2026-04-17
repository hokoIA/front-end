"use client";

import { GoalAnalysisHistory } from "@/features/goals/components/goal-analysis-history";
import { GoalAnalysisViewer } from "@/features/goals/components/goal-analysis-viewer";
import { GoalExportPdfButton } from "@/features/goals/components/goal-export-pdf-button";
import { GoalGenerateFinalAnalysisButton } from "@/features/goals/components/goal-generate-final-analysis-button";
import { GoalStatusBadge } from "@/features/goals/components/goal-badges";
import type { GoalAnalysisUi, GoalUiModel } from "@/features/goals/types/ui";
import { normalizeGoal } from "@/features/goals/utils/normalize-goal";
import { platformLabel } from "@/features/goals/utils/platform-labels";
import { useAuthStatusQuery } from "@/hooks/api/use-auth-queries";
import { useCustomersQuery } from "@/hooks/api/use-customers-queries";
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
import { useEffect, useMemo, useState } from "react";

function hydrateCustomerName(
  model: GoalUiModel,
  customers: { id_customer: string; name: string }[],
): GoalUiModel {
  if (model.customerName?.trim()) return model;
  const cid = model.customerId;
  if (!cid) return model;
  const hit = customers.find((c) => String(c.id_customer) === String(cid));
  if (!hit) return model;
  return { ...model, customerName: hit.name };
}

export function GoalDetailView({
  goal,
  open,
  onOpenChange,
}: {
  goal: GoalUiModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: auth } = useAuthStatusQuery();
  const authed = auth?.authenticated === true;
  const { data: customers = [] } = useCustomersQuery(open && authed);

  const idForDetail = open && goal ? goal.id : null;
  const detail = useGoalQuery(idForDetail, open);
  const [activeAnalysis, setActiveAnalysis] = useState<GoalAnalysisUi | null>(
    null,
  );

  const merged: GoalUiModel | null = useMemo(() => {
    if (!goal && !detail.data) return null;
    const base = detail.data
      ? normalizeGoal(detail.data as Goal, 0)
      : goal!;
    return hydrateCustomerName(base, customers);
  }, [goal, detail.data, customers]);

  const hasFinal = (merged?.analyses.length ?? 0) > 0;
  const inFlight = merged?.status === "active";
  const ended = ["completed", "closed", "archived"].includes(
    merged?.status ?? "",
  );
  const thinData = inFlight && (merged?.kpis.length ?? 0) === 0;

  useEffect(() => {
    if (!merged) return;
    if (merged.analyses.length === 1) {
      setActiveAnalysis(merged.analyses[0]!);
    }
  }, [merged]);

  if (!merged) return null;

  const analysisContent =
    activeAnalysis?.content ??
    (hasFinal
      ? "Selecione a análise acima para visualizar o texto completo."
      : "Ainda não há análise. Gere após o fim do período, conforme o backend.");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(92vh,920px)] w-[min(96vw,44rem)] max-w-none overflow-y-auto border-hk-border p-0 gap-0">
        <div className="border-b border-hk-border bg-gradient-to-r from-hk-lime/15 to-hk-cyan/10 px-6 py-4">
          <DialogHeader>
            <DialogTitle className="text-xl text-hk-deep">
              {merged.title}
            </DialogTitle>
            <DialogDescription className="text-hk-muted">
              Dados da meta conforme retornados pela API (campos reais do
              backend).
            </DialogDescription>
          </DialogHeader>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <GoalStatusBadge status={merged.status} />
            <span className="text-xs text-hk-muted">
              {merged.customerName ?? merged.customerId ?? "Cliente —"} ·{" "}
              {platformLabel(merged.platform)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-hk-muted">
            <span>
              Período: {merged.startDate ?? "—"} → {merged.endDate ?? "—"}
            </span>
            {merged.goalType ? (
              <span>Tipo de meta: {merged.goalType}</span>
            ) : null}
            {merged.achieved !== undefined && merged.achieved !== null ? (
              <span>Resultado (achieved): {merged.achieved ? "Sim" : "Não"}</span>
            ) : null}
            {merged.achievedScore !== undefined ? (
              <span>Score: {merged.achievedScore}</span>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          {thinData ? (
            <div
              role="status"
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950"
            >
              Esta meta ainda não possui KPIs cadastrados.
            </div>
          ) : null}

          {ended && !hasFinal ? (
            <div
              role="status"
              className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-950"
            >
              Meta encerrada sem análise persistida. Gere a análise do período
              se o backend permitir (após a data de fim).
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <GoalGenerateFinalAnalysisButton
              idGoal={merged.id}
              periodEndDate={merged.endDate}
              hasAnalysis={hasFinal}
              disabled={detail.isFetching}
            />
            {hasFinal ? (
              <GoalExportPdfButton printAreaId="goal-analysis-print-area" />
            ) : null}
          </div>

          <Tabs defaultValue="def">
            <TabsList className="flex w-full flex-wrap justify-start gap-1">
              <TabsTrigger value="def">Definição</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
              <TabsTrigger value="hist">Análise</TabsTrigger>
            </TabsList>
            <TabsContent value="def" className="mt-4 space-y-3 text-sm">
              <Section label="Descrição (descricao)" text={merged.description} />
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
                    <p className="text-xs text-hk-muted">Identificador kpi: {k.kpi}</p>
                    <p className="mt-1 text-xs text-hk-muted">
                      Baseline: {k.baseline ?? "—"} → Alvo: {k.target ?? "—"}{" "}
                      {k.unit ? `(${k.unit})` : ""}
                    </p>
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
                  Texto da análise
                </p>
                <GoalAnalysisViewer
                  title={activeAnalysis?.title}
                  content={analysisContent}
                  className="mt-2"
                />
              </div>
            </TabsContent>
          </Tabs>

          {inFlight ? (
            <p className="text-xs text-hk-muted">
              Progresso agregado da meta não está disponível no backend atual.
            </p>
          ) : null}

          {detail.isError ? (
            <p className="text-sm text-rose-700">
              Não foi possível atualizar o detalhe pelo servidor — exibindo
              dados da lista local.
            </p>
          ) : null}

          <div className="flex justify-end border-t border-hk-border-subtle pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
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

"use client";

import { GoalCreateFlow } from "@/features/goals/components/goal-create-flow";
import { GoalDetailView } from "@/features/goals/components/goal-detail-view";
import { GoalSuggestionFlow } from "@/features/goals/components/goal-suggestion-flow";
import { GoalsEmptyState } from "@/features/goals/components/goals-empty-state";
import { GoalsErrorState } from "@/features/goals/components/goals-error-state";
import { GoalsFiltersToolbar } from "@/features/goals/components/goals-filters-toolbar";
import { GoalsList } from "@/features/goals/components/goals-list";
import { GoalsNoCustomerState } from "@/features/goals/components/goals-no-customer-state";
import { GoalsOverviewBar } from "@/features/goals/components/goals-overview-bar";
import { GoalsPageHeader } from "@/features/goals/components/goals-page-header";
import { defaultPlanningFilters } from "@/features/goals/types/filters";
import type { GoalSuggestion } from "@/features/goals/types/suggestions";
import type { GoalUiModel } from "@/features/goals/types/ui";
import { computePlanningOverview } from "@/features/goals/utils/compute-planning-overview";
import { filterPlanningGoals } from "@/features/goals/utils/filter-goals";
import { normalizeGoal } from "@/features/goals/utils/normalize-goal";
import { useAuthStatusQuery } from "@/hooks/api/use-auth-queries";
import { useCustomersQuery } from "@/hooks/api/use-customers-queries";
import { useGoalsQuery } from "@/hooks/api/use-goals-queries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb, Target } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "hk.planningCustomerScope";

function readScope(): "all" | string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && raw !== "all") return raw;
  } catch {
    /* ignore */
  }
  return "all";
}

export function PlanningHubView() {
  const { data: auth } = useAuthStatusQuery();
  const authed = auth?.authenticated === true;

  const { data: customers = [] } = useCustomersQuery(authed);
  const {
    data: goalsRaw = [],
    isPending: goalsLoading,
    isError: goalsError,
    error: goalsErr,
    refetch,
  } = useGoalsQuery(authed);

  const [contextCustomer, setContextCustomer] = useState<"all" | string>("all");

  useEffect(() => {
    setContextCustomer(readScope());
  }, []);

  const persistScope = (v: "all" | string) => {
    setContextCustomer(v);
    try {
      if (v === "all") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
  };

  const [filters, setFilters] = useState(defaultPlanningFilters);
  const [createOpen, setCreateOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [detailGoal, setDetailGoal] = useState<GoalUiModel | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [suggestionSeed, setSuggestionSeed] = useState<GoalSuggestion | null>(
    null,
  );

  const normalized = useMemo(
    () => goalsRaw.map((g, i) => normalizeGoal(g, i)),
    [goalsRaw],
  );

  const filtered = useMemo(
    () => filterPlanningGoals(normalized, filters, contextCustomer),
    [normalized, filters, contextCustomer],
  );

  const overview = useMemo(
    () => computePlanningOverview(normalized, contextCustomer),
    [normalized, contextCustomer],
  );

  const requireCustomerId =
    contextCustomer === "all" ? null : contextCustomer;

  const openDetail = (g: GoalUiModel) => {
    setDetailGoal(g);
    setDetailOpen(true);
  };

  if (goalsError) {
    return (
      <div className="hk-page flex flex-col gap-6 py-8">
        <GoalsPageHeader />
        <GoalsErrorState
          error={goalsErr instanceof Error ? goalsErr : null}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="hk-page flex flex-col gap-8 py-8">
      <GoalsPageHeader />

      <section
        aria-label="Contexto global"
        className="rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-sm font-semibold text-hk-deep">
              Contexto do planejamento
            </h2>
            <p className="mt-1 text-sm text-hk-muted">
              Use <strong>Todos</strong> para visão agregada ou filtre por
              cliente para focar metas, KPIs e análises da carteira.
            </p>
          </div>
          <div className="grid w-full gap-2 md:w-80">
            <Label htmlFor="hk-planning-scope">Cliente</Label>
            <Select
              value={contextCustomer}
              onValueChange={(v) => persistScope(v as "all" | string)}
            >
              <SelectTrigger id="hk-planning-scope">
                <SelectValue placeholder="Contexto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os clientes</SelectItem>
                {customers.map((c) => (
                  <SelectItem key={c.id_customer} value={c.id_customer}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {contextCustomer === "all" ? (
          <p className="mt-3 text-xs text-hk-muted">
            Dica: para sugestões da IA com máximo de contexto documental,
            selecione um cliente específico. Ainda assim você pode criar metas
            escolhendo o cliente no formulário.
          </p>
        ) : null}
      </section>

      <GoalsOverviewBar
        active={overview.active}
        completed={overview.completed}
        attention={overview.attention}
        platformsWithActive={overview.platformsWithActive}
        customersWithActivePlanning={overview.customersWithActivePlanning}
        withPartialAnalysis={overview.withPartialAnalysis}
        readyForFinalHint={overview.readyForFinalHint}
        loading={goalsLoading}
      />

      <section aria-label="Ações principais" className="space-y-4">
        <h2 className="text-sm font-semibold text-hk-deep">
          Criação e inteligência
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-xl border border-hk-border bg-gradient-to-br from-hk-surface to-hk-cyan/5 p-5 shadow-hk-sm">
            <Target className="h-8 w-8 text-hk-action" aria-hidden />
            <h3 className="mt-3 font-semibold text-hk-deep">Nova meta</h3>
            <p className="mt-1 flex-1 text-sm text-hk-muted">
              Fluxo em etapas: contexto, definição estratégica, temporalidade,
              KPIs e revisão antes de salvar na API.
            </p>
            <Button
              type="button"
              className="mt-4 w-full bg-hk-deep text-white hover:bg-hk-strong"
              onClick={() => {
                setSuggestionSeed(null);
                setCreateOpen(true);
              }}
            >
              Abrir fluxo de nova meta
            </Button>
          </div>
          <div className="flex flex-col rounded-xl border border-hk-border bg-gradient-to-br from-hk-surface to-hk-lime/10 p-5 shadow-hk-sm">
            <Lightbulb className="h-8 w-8 text-hk-deep" aria-hidden />
            <h3 className="mt-3 font-semibold text-hk-deep">
              Pedir sugestões da IA
            </h3>
            <p className="mt-1 flex-1 text-sm text-hk-muted">
              Envia cliente, plataforma e momento ao endpoint de sugestões.
              Compare propostas e transforme em meta com revisão completa.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 w-full border-hk-action/40 text-hk-deep hover:bg-hk-cyan/10"
              onClick={() => setSuggestOpen(true)}
            >
              Solicitar sugestões
            </Button>
          </div>
        </div>
      </section>

      {contextCustomer === "all" ? <GoalsNoCustomerState /> : null}

      <div>
        <h2 className="text-sm font-semibold text-hk-deep">
          Carteira de metas
        </h2>
        <p className="mt-1 text-sm text-hk-muted">
          Acompanhamento vivo: status, KPI principal, progresso e presença de
          análises parciais ou finais.
        </p>
      </div>

      <GoalsFiltersToolbar value={filters} onChange={setFilters} />

      {filtered.length === 0 && !goalsLoading ? (
        <GoalsEmptyState
          onCreate={() => {
            setSuggestionSeed(null);
            setCreateOpen(true);
          }}
          onSuggest={() => setSuggestOpen(true)}
        />
      ) : (
        <GoalsList
          goals={filtered}
          loading={goalsLoading}
          onOpenGoal={openDetail}
        />
      )}

      <GoalCreateFlow
        key={suggestionSeed?.id ?? "goal-create-manual"}
        open={createOpen}
        onOpenChange={(o) => {
          setCreateOpen(o);
          if (!o) setSuggestionSeed(null);
        }}
        customers={customers}
        requireCustomerId={requireCustomerId}
        initialFromSuggestion={suggestionSeed}
      />

      <GoalSuggestionFlow
        open={suggestOpen}
        onOpenChange={setSuggestOpen}
        customers={customers}
        requireCustomerId={requireCustomerId}
        onTransformToGoal={(s) => {
          setSuggestionSeed(s);
          setCreateOpen(true);
        }}
      />

      <GoalDetailView
        goal={detailGoal}
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o);
          if (!o) setDetailGoal(null);
        }}
      />
    </div>
  );
}

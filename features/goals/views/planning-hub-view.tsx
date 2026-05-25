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
import { Lightbulb, Target } from "lucide-react";
import { useMemo, useState } from "react";

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

  const [contextCustomer, setContextCustomer] = useState<"all" | string>(
    readScope,
  );

  const listParams =
    contextCustomer === "all" ? null : { id_customer: contextCustomer };

  const {
    data: goalsRaw = [],
    isPending: goalsLoading,
    isError: goalsError,
    error: goalsErr,
    refetch,
  } = useGoalsQuery(authed, listParams);

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

  const customersById = useMemo(
    () => new Map(customers.map((c) => [String(c.id_customer), c.name])),
    [customers],
  );

  const normalized = useMemo(
    () =>
      goalsRaw.map((g, i) => {
        const n = normalizeGoal(g, i);
        const cid = n.customerId;
        if (cid && !n.customerName) {
          const nm = customersById.get(String(cid));
          if (nm) return { ...n, customerName: nm };
        }
        return n;
      }),
    [goalsRaw, customersById],
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
      <div className="hk-page flex flex-col gap-6 py-7">
        <GoalsPageHeader />
        <GoalsErrorState
          error={goalsErr instanceof Error ? goalsErr : null}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="hk-page space-y-7 pb-16 pt-3 lg:space-y-8 lg:pt-4">
      <GoalsPageHeader />

      <GoalsOverviewBar
        active={overview.active}
        completed={overview.completed}
        expired={overview.expired}
        cancelled={overview.cancelled}
        platformsWithActive={overview.platformsWithActive}
        customersWithActivePlanning={overview.customersWithActivePlanning}
        withAnalysis={overview.withAnalysis}
        readyForFinalHint={overview.readyForFinalHint}
        loading={goalsLoading}
      />

      <section aria-label="Ações principais" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col rounded-xl border border-hk-border bg-hk-surface p-5 shadow-hk-sm">
            <Target className="h-8 w-8 text-hk-action" aria-hidden />
            <h3 className="mt-3 font-semibold text-hk-deep">Nova meta</h3>
            <p className="mt-1 flex-1 text-sm text-hk-muted">
              Crie uma meta para o cliente e acompanhe em real-time.
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
          <div className="flex flex-col rounded-xl border border-hk-border bg-hk-surface p-5 shadow-hk-sm">
            <Lightbulb className="h-8 w-8 text-hk-deep" aria-hidden />
            <h3 className="mt-3 font-semibold text-hk-deep">
              Pedir sugestões da IA
            </h3>
            <p className="mt-1 flex-1 text-sm text-hk-muted">
              Use o modelo treinado com os dados do cliente para gerar uma meta.
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

      <GoalsFiltersToolbar
        value={filters}
        onChange={setFilters}
        customers={customers}
        customerScope={contextCustomer}
        onCustomerScopeChange={persistScope}
      />

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

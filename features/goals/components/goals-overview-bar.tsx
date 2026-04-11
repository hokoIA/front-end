"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { platformLabel } from "@/features/goals/utils/platform-labels";

function Stat({
  label,
  value,
  hint,
  loading,
}: {
  label: string;
  value: string | number;
  hint?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-lg border border-hk-border-subtle bg-hk-surface px-4 py-3 shadow-hk-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-hk-muted">
        {label}
      </p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-12" />
      ) : (
        <p className="mt-1 text-2xl font-semibold tabular-nums text-hk-deep">
          {value}
        </p>
      )}
      {hint ? (
        <p className="mt-1 line-clamp-2 text-xs text-hk-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function GoalsOverviewBar(props: {
  active: number;
  completed: number;
  attention: number;
  platformsWithActive: string[];
  customersWithActivePlanning: number;
  withPartialAnalysis: number;
  readyForFinalHint: number;
  loading?: boolean;
}) {
  const platHint =
    props.platformsWithActive.length > 0
      ? props.platformsWithActive.map(platformLabel).join(" · ")
      : "Nenhuma plataforma com meta em andamento no filtro atual";

  return (
    <section
      aria-label="Visão geral do planejamento"
      className="rounded-xl border border-hk-border bg-hk-canvas/50 p-4 md:p-5"
    >
      <h2 className="text-sm font-semibold text-hk-deep">
        Visão geral do planejamento
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Stat
          label="Metas ativas"
          value={props.active}
          loading={props.loading}
        />
        <Stat
          label="Concluídas / encerradas"
          value={props.completed}
          loading={props.loading}
        />
        <Stat
          label="Em atenção"
          value={props.attention}
          loading={props.loading}
          hint="Requer revisão ou correção de curso"
        />
        <Stat
          label="Plataformas (em andamento)"
          value={props.platformsWithActive.length}
          hint={platHint}
          loading={props.loading}
        />
        <Stat
          label="Clientes c/ plano ativo"
          value={props.customersWithActivePlanning}
          loading={props.loading}
        />
        <Stat
          label="Com análise parcial"
          value={props.withPartialAnalysis}
          loading={props.loading}
        />
        <Stat
          label="Prontas p/ análise final"
          value={props.readyForFinalHint}
          hint="Prazo vencido ou ciclo fechando"
          loading={props.loading}
        />
      </div>
    </section>
  );
}

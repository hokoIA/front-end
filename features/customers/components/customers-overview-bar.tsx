"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

function Stat({
  label,
  value,
  hint,
  loading,
  muted,
}: {
  label: string;
  value: string | number;
  hint?: string;
  loading?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-hk-border-subtle bg-hk-surface px-4 py-3 shadow-hk-sm",
        muted && "opacity-80",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-hk-muted">
        {label}
      </p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-16" />
      ) : (
        <p className="mt-1 text-2xl font-semibold tabular-nums text-hk-deep">
          {value}
        </p>
      )}
      {hint ? <p className="mt-1 text-xs text-hk-muted">{hint}</p> : null}
    </div>
  );
}

export function CustomersOverviewBar(props: {
  total: number;
  active: number;
  withoutIntegration: number | null;
  pendingIntegration: number | null;
  attentionIntegration: number | null;
  readyForUse: number | null;
  topPlatforms: { label: string; count: number }[];
  loadingIntegrations: boolean;
  batchDisabled: boolean;
  listBatchLimit: number;
}) {
  const dash = "—";
  const top = props.topPlatforms.slice(0, 3).filter((p) => p.count > 0);
  const topLabel =
    top.length > 0
      ? top.map((p) => `${p.label} (${p.count})`).join(" · ")
      : "Nenhuma conexão agregada ainda";

  return (
    <section
      aria-label="Visão geral da carteira e integrações"
      className="rounded-xl border border-hk-border bg-hk-canvas/50 p-4 md:p-5"
    >
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-semibold text-hk-deep">
          Visão geral operacional
        </h2>
        {props.batchDisabled ? (
          <p className="text-xs text-hk-muted">
            Resumo de integrações na lista disponível apenas para os primeiros{" "}
            {props.listBatchLimit} clientes (performance). Abra o hub operacional
            para diagnóstico completo dos demais.
          </p>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <Stat label="Total de clientes" value={props.total} />
        <Stat label="Clientes ativos" value={props.active} />
        <Stat
          label="Sem integração"
          value={props.withoutIntegration ?? dash}
          loading={props.loadingIntegrations && props.withoutIntegration === null}
          muted={props.withoutIntegration === null}
          hint={
            props.withoutIntegration === null && !props.loadingIntegrations
              ? "Abra um cliente para medir"
              : undefined
          }
        />
        <Stat
          label="Integração pendente"
          value={props.pendingIntegration ?? dash}
          loading={props.loadingIntegrations && props.pendingIntegration === null}
          muted={props.pendingIntegration === null}
        />
        <Stat
          label="Em atenção / renovação"
          value={props.attentionIntegration ?? dash}
          loading={
            props.loadingIntegrations && props.attentionIntegration === null
          }
          muted={props.attentionIntegration === null}
        />
        <Stat
          label="Prontos para uso"
          value={props.readyForUse ?? dash}
          loading={props.loadingIntegrations && props.readyForUse === null}
          muted={props.readyForUse === null}
        />
        <Stat
          label="Plataformas mais conectadas"
          value={top.length ? `${top[0]?.count ?? 0}` : "0"}
          hint={topLabel}
          loading={props.loadingIntegrations && props.total > 0 && top.length === 0}
          muted={props.total === 0}
        />
      </div>
    </section>
  );
}

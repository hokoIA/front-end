"use client";

import { Skeleton } from "@/components/ui/skeleton";

function Stat({
  label,
  value,
  loading,
}: {
  label: string;
  value: number;
  loading?: boolean;
}) {
  return (
    <div className="rounded-lg border border-hk-border-subtle bg-hk-surface px-4 py-3 text-center shadow-hk-sm sm:text-left">
      <p className="text-[11px] font-medium uppercase tracking-wide text-hk-muted">
        {label}
      </p>
      {loading ? (
        <Skeleton className="mx-auto mt-2 h-7 w-10 sm:mx-0" />
      ) : (
        <p className="mt-1 text-xl font-semibold tabular-nums text-hk-deep">
          {value}
        </p>
      )}
    </div>
  );
}

export function TeamOverviewBar(props: {
  activeCount: number;
  pendingInvites: number;
  adminCount: number;
  teamCount: number;
  disabledCount: number;
  loading?: boolean;
}) {
  return (
    <section
      aria-label="Resumo da equipe"
      className="grid grid-cols-2 gap-3 md:grid-cols-5"
    >
      <Stat
        label="Membros ativos"
        value={props.activeCount}
        loading={props.loading}
      />
      <Stat
        label="Convites pendentes"
        value={props.pendingInvites}
        loading={props.loading}
      />
      <Stat label="Admins" value={props.adminCount} loading={props.loading} />
      <Stat
        label="Equipe"
        value={props.teamCount}
        loading={props.loading}
      />
      <Stat
        label="Desativados"
        value={props.disabledCount}
        loading={props.loading}
      />
    </section>
  );
}

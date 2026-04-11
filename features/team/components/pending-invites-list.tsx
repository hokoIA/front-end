"use client";

import { PendingInviteRow } from "@/features/team/components/pending-invite-row";
import type { TeamInviteUi } from "@/features/team/types/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { Inbox } from "lucide-react";

export function PendingInvitesList({
  invites,
  loading,
  isAdmin,
  onResend,
  onCancel,
}: {
  invites: TeamInviteUi[];
  loading?: boolean;
  isAdmin: boolean;
  onResend: (i: TeamInviteUi) => void;
  onCancel: (i: TeamInviteUi) => void;
}) {
  const pending = invites.filter((i) => i.status === "pending");

  return (
    <section
      aria-label="Convites pendentes"
      className="rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-hk-lime/25 text-hk-deep">
          <Inbox className="h-4 w-4" aria-hidden />
        </div>
        <div>
          <h2 className="text-base font-semibold text-hk-deep">
            Convites pendentes
          </h2>
          <p className="mt-1 text-sm text-hk-muted">
            Convites aguardando aceite. Reenvie ou cancele quando necessário.
          </p>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : pending.length === 0 ? (
          <p className="py-6 text-center text-sm text-hk-muted">
            Nenhum convite pendente.
          </p>
        ) : (
          pending.map((inv) => (
            <PendingInviteRow
              key={inv.id}
              invite={inv}
              isAdmin={isAdmin}
              onResend={onResend}
              onCancel={onCancel}
            />
          ))
        )}
      </div>
    </section>
  );
}

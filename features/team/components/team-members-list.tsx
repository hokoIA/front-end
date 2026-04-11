"use client";

import { TeamMemberRow } from "@/features/team/components/team-member-row";
import type { TeamMemberUi } from "@/features/team/types/ui";
import { Skeleton } from "@/components/ui/skeleton";

export function TeamMembersList({
  members,
  loading,
  currentUserEmail,
  isAdmin,
  onChangeRole,
  onDisable,
}: {
  members: TeamMemberUi[];
  loading?: boolean;
  currentUserEmail: string | undefined;
  isAdmin: boolean;
  onChangeRole: (m: TeamMemberUi) => void;
  onDisable: (m: TeamMemberUi) => void;
}) {
  return (
    <section
      aria-label="Membros da equipe"
      className="rounded-xl border border-hk-border bg-hk-surface p-4 shadow-hk-sm md:p-5"
    >
      <h2 className="text-base font-semibold text-hk-deep">
        Membros da equipe
      </h2>
      <p className="mt-1 text-sm text-hk-muted">
        Pessoas com acesso ativo ou desativado à conta.
      </p>
      <div className="mt-4 divide-y-0">
        {loading ? (
          <div className="space-y-4 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <p className="mt-6 text-sm text-hk-muted">
            Nenhum membro retornado pela API.
          </p>
        ) : (
          members.map((m) => (
            <TeamMemberRow
              key={m.id}
              member={m}
              currentUserEmail={currentUserEmail}
              isAdmin={isAdmin}
              onChangeRole={onChangeRole}
              onDisable={onDisable}
            />
          ))
        )}
      </div>
    </section>
  );
}

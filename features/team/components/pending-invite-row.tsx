"use client";

import { PendingInviteActionsMenu } from "@/features/team/components/pending-invite-actions-menu";
import { TeamRoleBadge } from "@/features/team/components/team-role-badge";
import { TeamInviteStatusBadge } from "@/features/team/components/team-status-badge";
import type { TeamInviteUi } from "@/features/team/types/ui";

export function PendingInviteRow({
  invite,
  isAdmin,
  onResend,
  onCancel,
}: {
  invite: TeamInviteUi;
  isAdmin: boolean;
  onResend: (i: TeamInviteUi) => void;
  onCancel: (i: TeamInviteUi) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-hk-border-subtle py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-hk-deep">{invite.email}</p>
        <p className="text-xs text-hk-muted">
          Enviado: {invite.sentAt ?? "—"} · Expira: {invite.expiresAt ?? "—"}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <TeamRoleBadge role={invite.role} />
        <TeamInviteStatusBadge status={invite.status} />
        <PendingInviteActionsMenu
          invite={invite}
          isAdmin={isAdmin}
          onResend={onResend}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}

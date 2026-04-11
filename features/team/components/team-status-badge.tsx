"use client";

import type { TeamInviteStatusUi, TeamMemberStatusUi } from "@/features/team/types/ui";
import { cn } from "@/lib/utils/cn";

const memberLabels: Record<TeamMemberStatusUi, string> = {
  active: "Ativo",
  disabled: "Desativado",
};

const inviteLabels: Record<TeamInviteStatusUi, string> = {
  pending: "Pendente",
  accepted: "Aceito",
  expired: "Expirado",
  revoked: "Cancelado",
  unknown: "—",
};

export function TeamMemberStatusBadge({
  status,
}: {
  status: TeamMemberStatusUi;
}) {
  const tone =
    status === "active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : "border-hk-border bg-hk-canvas text-hk-muted";
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
        tone,
      )}
    >
      {memberLabels[status]}
    </span>
  );
}

export function TeamInviteStatusBadge({
  status,
}: {
  status: TeamInviteStatusUi;
}) {
  const tone =
    status === "pending"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : status === "accepted"
        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
        : status === "expired"
          ? "border-hk-border bg-hk-canvas text-hk-muted"
          : "border-hk-border bg-hk-canvas text-hk-muted";
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-0.5 text-xs font-medium",
        tone,
      )}
    >
      {inviteLabels[status]}
    </span>
  );
}

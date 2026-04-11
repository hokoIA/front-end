import type { TeamInviteUi, TeamMemberUi } from "../types/ui";

export function computeTeamOverview(
  members: TeamMemberUi[],
  invites: TeamInviteUi[],
): {
  activeCount: number;
  disabledCount: number;
  adminCount: number;
  teamCount: number;
  pendingInvites: number;
} {
  const active = members.filter((m) => m.status === "active");
  const disabled = members.filter((m) => m.status === "disabled");
  const admins = active.filter((m) => m.role === "admin");
  const teamOnly = active.filter((m) => m.role === "team");
  const pending = invites.filter((i) => i.status === "pending").length;

  return {
    activeCount: active.length,
    disabledCount: disabled.length,
    adminCount: admins.length,
    teamCount: teamOnly.length,
    pendingInvites: pending,
  };
}

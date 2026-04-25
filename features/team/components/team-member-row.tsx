"use client";

import { TeamMemberActionsMenu } from "@/features/team/components/team-member-actions-menu";
import { TeamRoleBadge } from "@/features/team/components/team-role-badge";
import { TeamMemberStatusBadge } from "@/features/team/components/team-status-badge";
import type { TeamMemberUi } from "@/features/team/types/ui";
import {
  canChangeRole,
  canDisableMember,
} from "@/features/team/utils/permissions";

export function TeamMemberRow({
  member,
  currentUserId,
  currentUserEmail,
  canManage,
  onChangeRole,
  onDisable,
}: {
  member: TeamMemberUi;
  currentUserId: string | undefined;
  currentUserEmail: string | undefined;
  canManage: boolean;
  onChangeRole: (m: TeamMemberUi) => void;
  onDisable: (m: TeamMemberUi) => void;
}) {
  const isSelf =
    (currentUserId && member.idUser === currentUserId) ||
    Boolean(currentUserEmail && currentUserEmail.trim().toLowerCase() === member.email.trim().toLowerCase());
  const change = canChangeRole(canManage, currentUserId, currentUserEmail, member);
  const disable = canDisableMember(canManage, currentUserId, currentUserEmail, member);

  return (
    <div className="flex flex-col gap-3 border-b border-hk-border-subtle py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="font-medium text-hk-deep">{member.name}</p>
        <p className="text-sm text-hk-muted">{member.email}</p>
        {member.joinedAt ? (
          <p className="mt-1 text-xs text-hk-muted">
            Desde {member.joinedAt}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <TeamRoleBadge role={member.role} />
        <TeamMemberStatusBadge status={member.status} />
        <TeamMemberActionsMenu
          member={member}
          isSelf={isSelf}
          currentUserEmail={currentUserEmail}
          canChangeRole={change}
          canDisable={disable}
          onChangeRole={() => onChangeRole(member)}
          onDisable={() => onDisable(member)}
        />
      </div>
    </div>
  );
}

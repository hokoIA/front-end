"use client";

import type { TeamMemberUi } from "@/features/team/types/ui";
import { emailsMatch } from "@/features/team/utils/permissions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export function TeamMemberActionsMenu({
  member,
  currentUserEmail,
  canChangeRole,
  canDisable,
  onChangeRole,
  onDisable,
}: {
  member: TeamMemberUi;
  currentUserEmail: string | undefined;
  canChangeRole: boolean;
  canDisable: boolean;
  onChangeRole: () => void;
  onDisable: () => void;
}) {
  if (member.isPrimary) {
    return (
      <span className="text-xs font-medium text-hk-muted">Titular</span>
    );
  }

  if (
    currentUserEmail &&
    emailsMatch(currentUserEmail, member.email)
  ) {
    return <span className="text-xs text-hk-muted">Você</span>;
  }

  if (!canChangeRole && !canDisable) {
    return <span className="text-xs text-hk-muted">—</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-hk-muted"
          aria-label="Ações do membro"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        {canChangeRole ? (
          <DropdownMenuItem onClick={onChangeRole}>
            Alterar nível de acesso
          </DropdownMenuItem>
        ) : null}
        {canDisable ? (
          <DropdownMenuItem
            className="text-rose-700 focus:text-rose-800"
            onClick={onDisable}
          >
            Desativar membro
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

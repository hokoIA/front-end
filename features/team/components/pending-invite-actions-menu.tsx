"use client";

import type { TeamInviteUi } from "@/features/team/types/ui";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export function PendingInviteActionsMenu({
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
  const canAct = invite.status === "pending" || invite.status === "expired";

  if (!canAct) {
    return <span className="text-xs text-hk-muted">—</span>;
  }

  if (!isAdmin) {
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
          aria-label="Ações do convite"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onResend(invite)}>
          Reenviar convite
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-rose-700 focus:text-rose-800"
          onClick={() => onCancel(invite)}
        >
          Cancelar convite
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

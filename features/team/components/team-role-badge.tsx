"use client";

import type { TeamRoleUi } from "@/features/team/types/ui";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const labels: Record<TeamRoleUi, string> = {
  admin: "Admin",
  team: "Equipe",
};

export function TeamRoleBadge({
  role,
  className,
}: {
  role: TeamRoleUi;
  className?: string;
}) {
  return (
    <Badge
      variant={role === "admin" ? "default" : "secondary"}
      className={cn(
        "font-medium",
        role === "admin" && "bg-hk-deep text-white border-transparent",
        className,
      )}
    >
      {labels[role]}
    </Badge>
  );
}

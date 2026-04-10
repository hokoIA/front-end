"use client";

import { Badge } from "@/components/ui/badge";
import type { GovernanceStatusValue } from "../types";
import { governanceStatusLabel } from "../utils/labels";
import { cn } from "@/lib/utils/cn";

const VARIANT: Record<
  GovernanceStatusValue,
  "success" | "info" | "secondary" | "outline" | "default"
> = {
  active: "success",
  in_review: "info",
  draft: "secondary",
  archived: "outline",
  expired: "outline",
  superseded: "outline",
};

export function ContextDocumentStatusBadge({
  status,
  className,
}: {
  status: GovernanceStatusValue;
  className?: string;
}) {
  return (
    <Badge
      variant={VARIANT[status]}
      className={cn(
        status === "expired" && "border-amber-300 bg-amber-50 text-amber-900",
        status === "superseded" && "border-hk-border text-hk-muted",
        className,
      )}
    >
      {governanceStatusLabel(status)}
    </Badge>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { BillingDisplayModel } from "../types/display";

type Props = {
  status: BillingDisplayModel["status"];
  label: string;
  cancelAtPeriodEnd?: boolean;
  className?: string;
};

export function BillingStatusBadge({
  status,
  label,
  cancelAtPeriodEnd,
  className,
}: Props) {
  let variant: "success" | "secondary" | "outline" | "info" = "info";
  if (status === "active" || status === "trialing") variant = "success";
  else if (status === "past_due" || status === "unpaid") variant = "outline";
  else if (
    status === "canceled" ||
    status === "cancelled" ||
    status === "none"
  )
    variant = "secondary";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge
        variant={variant}
        className={cn(
          (status === "past_due" || status === "unpaid") &&
            "border-amber-400 bg-amber-50 text-amber-950",
          className,
        )}
      >
        {label}
      </Badge>
      {cancelAtPeriodEnd && (
        <Badge variant="outline" className="font-normal text-hk-muted">
          Cancelamento ao fim do ciclo
        </Badge>
      )}
    </div>
  );
}

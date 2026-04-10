"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

type InsightTriggerButtonProps = {
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onClick: () => void;
  variant?: "default" | "secondary" | "ghost" | "outline";
};

export function InsightTriggerButton({
  label,
  loading,
  disabled,
  onClick,
  variant = "outline",
}: InsightTriggerButtonProps) {
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      className="h-8 gap-1.5 text-xs"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Sparkles className="size-3.5 text-hk-action" />
      )}
      {label}
    </Button>
  );
}

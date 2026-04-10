"use client";

import { cn } from "@/lib/utils/cn";
import { Sparkles } from "lucide-react";

type InsightPanelProps = {
  title: string;
  text: string | null;
  loading?: boolean;
  className?: string;
};

export function InsightPanel({
  title,
  text,
  loading,
  className,
}: InsightPanelProps) {
  if (!loading && !text) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-hk-cyan/35 bg-hk-canvas/90",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-hk-border-subtle px-4 py-2.5">
        <Sparkles className="size-4 text-hk-action" strokeWidth={1.5} />
        <span className="text-xs font-semibold text-hk-deep">{title}</span>
      </div>
      <div className="px-4 py-3">
        {loading ? (
          <p className="text-sm text-hk-muted">Gerando leitura…</p>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-hk-ink">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}

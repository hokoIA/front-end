"use client";

import { cn } from "@/lib/utils/cn";

export function GoalAnalysisViewer({
  title,
  content,
  className,
}: {
  title?: string;
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-hk-border bg-hk-surface p-4",
        className,
      )}
    >
      {title ? (
        <h4 className="text-sm font-semibold text-hk-deep">{title}</h4>
      ) : null}
      <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-hk-ink">
        {content.trim() ? content : "Conteúdo não disponível para esta análise."}
      </div>
    </div>
  );
}

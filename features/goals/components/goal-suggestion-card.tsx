"use client";

import type { GoalSuggestion } from "@/features/goals/types/suggestions";
import { platformLabel } from "@/features/goals/utils/platform-labels";
import { GoalPriorityBadge } from "@/features/goals/components/goal-badges";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function GoalSuggestionCard({
  suggestion,
  selected,
  onSelect,
  onUse,
}: {
  suggestion: GoalSuggestion;
  selected?: boolean;
  onSelect: () => void;
  onUse: () => void;
}) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border bg-hk-surface p-4 text-left shadow-hk-sm transition-all",
        selected
          ? "border-hk-action ring-2 ring-hk-action/25"
          : "border-hk-border hover:border-hk-action/30",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-hk-deep">
          {suggestion.title}
        </h3>
        <GoalPriorityBadge priority={suggestion.priority} />
      </div>
      <p className="mt-1 text-xs font-medium text-hk-action">
        {platformLabel(suggestion.platform)}
      </p>
      <p className="mt-3 text-sm text-hk-muted">
        <span className="font-medium text-hk-ink">Objetivo:</span>{" "}
        {suggestion.strategicObjective}
      </p>
      <p className="mt-2 text-sm text-hk-muted">
        <span className="font-medium text-hk-ink">Por que agora:</span>{" "}
        {suggestion.rationaleTiming}
      </p>
      <p className="mt-2 text-xs text-hk-muted">
        Horizonte sugerido:{" "}
        <span className="font-medium text-hk-ink">
          {suggestion.horizonLabel}
        </span>
      </p>
      {suggestion.suggestedKpis.length > 0 ? (
        <ul className="mt-3 list-inside list-disc text-xs text-hk-muted">
          {suggestion.suggestedKpis.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onSelect}>
          Comparar / revisar
        </Button>
        <Button
          type="button"
          size="sm"
          className="bg-hk-action text-white hover:bg-hk-strong"
          onClick={onUse}
        >
          Transformar em meta
        </Button>
      </div>
    </article>
  );
}

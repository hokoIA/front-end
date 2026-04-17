"use client";

import type { GoalSuggestion } from "@/features/goals/types/suggestions";
import { platformLabel } from "@/features/goals/utils/platform-labels";
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
      </div>
      <p className="mt-1 text-xs font-medium text-hk-action">
        {platformLabel(suggestion.platform)}
      </p>
      {suggestion.tipoMeta ? (
        <p className="mt-2 text-xs text-hk-muted">
          <span className="font-medium text-hk-ink">Tipo de meta:</span>{" "}
          {suggestion.tipoMeta}
        </p>
      ) : null}
      <p className="mt-3 text-sm text-hk-muted">
        <span className="font-medium text-hk-ink">Descrição:</span>{" "}
        {suggestion.descricao?.trim() ? suggestion.descricao : "—"}
      </p>
      <p className="mt-2 text-sm text-hk-muted">
        <span className="font-medium text-hk-ink">Racional:</span>{" "}
        {suggestion.rationale?.trim() ? suggestion.rationale : "—"}
      </p>
      {suggestion.kpis.length > 0 ? (
        <ul className="mt-3 list-inside list-disc text-xs text-hk-muted">
          {suggestion.kpis.map((k) => (
            <li key={`${k.kpi}-${k.label}`}>
              <span className="font-medium text-hk-ink">{k.label}</span>
              <span className="text-hk-muted"> ({k.kpi})</span>
            </li>
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

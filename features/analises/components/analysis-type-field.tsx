"use client";

import type { AnalysisTypeValue } from "@/features/analises/types";
import { ANALYSIS_TYPE_LABELS } from "@/features/analises/utils/labels";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

const OPTIONS: AnalysisTypeValue[] = [
  "descriptive",
  "predictive",
  "prescriptive",
  "general",
];

type Props = {
  value: AnalysisTypeValue;
  onChange: (v: AnalysisTypeValue) => void;
  disabled?: boolean;
};

export function AnalysisTypeField({ value, onChange, disabled }: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-hk-muted">Tipo de análise</Label>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((key) => (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(key)}
            className={cn(
              "rounded-md border px-3 py-2 text-sm transition-colors",
              value === key
                ? "border-hk-action bg-hk-deep/8 text-hk-deep font-medium"
                : "border-hk-border bg-hk-surface text-hk-muted hover:border-hk-action/40 hover:text-hk-ink",
              disabled && "opacity-50",
            )}
          >
            {ANALYSIS_TYPE_LABELS[key]}
          </button>
        ))}
      </div>
    </div>
  );
}

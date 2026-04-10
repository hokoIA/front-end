"use client";

import type { StrategicFocusValue } from "@/features/analises/types";
import { STRATEGIC_FOCUS_LABELS } from "@/features/analises/utils/labels";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

const OPTIONS: StrategicFocusValue[] = [
  "branding_communication",
  "business_growth",
  "integrated",
];

type Props = {
  value: StrategicFocusValue;
  onChange: (v: StrategicFocusValue) => void;
  disabled?: boolean;
};

export function AnalysisStrategicFocusField({
  value,
  onChange,
  disabled,
}: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-hk-muted">Foco estratégico</Label>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((key) => (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onChange(key)}
            className={cn(
              "rounded-md border px-3 py-2 text-left text-sm transition-colors",
              value === key
                ? "border-hk-action bg-hk-deep/8 text-hk-deep font-medium"
                : "border-hk-border bg-hk-surface text-hk-muted hover:border-hk-action/40 hover:text-hk-ink",
              disabled && "opacity-50",
            )}
          >
            {STRATEGIC_FOCUS_LABELS[key]}
          </button>
        ))}
      </div>
    </div>
  );
}

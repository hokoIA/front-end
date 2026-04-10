"use client";

import type { AnalysisPlatformValue } from "@/features/analises/types";
import { PLATFORM_LABELS } from "@/features/analises/utils/labels";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ALL: AnalysisPlatformValue[] = [
  "facebook",
  "instagram",
  "google_analytics",
  "linkedin",
  "youtube",
];

type Props = {
  value: AnalysisPlatformValue[];
  onChange: (v: AnalysisPlatformValue[]) => void;
  disabled?: boolean;
};

export function AnalysisPlatformsMultiSelect({
  value,
  onChange,
  disabled,
}: Props) {
  function toggle(p: AnalysisPlatformValue) {
    if (value.includes(p)) {
      onChange(value.filter((x) => x !== p));
    } else {
      onChange([...value, p]);
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-hk-muted">Plataformas incluídas</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {ALL.map((p) => (
          <label
            key={p}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-hk-border-subtle bg-hk-canvas/40 px-3 py-2.5 text-sm hover:bg-hk-canvas/70"
          >
            <Checkbox
              checked={value.includes(p)}
              onCheckedChange={() => toggle(p)}
              disabled={disabled}
            />
            <span className="text-hk-ink">{PLATFORM_LABELS[p]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

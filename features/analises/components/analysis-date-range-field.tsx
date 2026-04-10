"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

type Props = {
  start: string;
  end: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  disabled?: boolean;
};

export function AnalysisDateRangeField({
  start,
  end,
  onStartChange,
  onEndChange,
  disabled,
}: Props) {
  const inputClass =
    "flex h-10 w-full rounded-md border border-hk-border bg-hk-canvas/50 px-3 text-sm text-hk-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hk-action/25 disabled:opacity-50";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label className="text-hk-muted">Data inicial</Label>
        <input
          type="date"
          className={cn(inputClass)}
          value={start}
          onChange={(e) => onStartChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-hk-muted">Data final</Label>
        <input
          type="date"
          className={cn(inputClass)}
          value={end}
          onChange={(e) => onEndChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

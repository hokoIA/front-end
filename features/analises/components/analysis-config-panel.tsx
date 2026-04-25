"use client";

import type { AnalysisFormState } from "@/features/analises/types";
import { AnalysisBiasInput } from "@/features/analises/components/analysis-bias-input";
import { AnalysisDateRangeField } from "@/features/analises/components/analysis-date-range-field";
import { AnalysisPlatformsMultiSelect } from "@/features/analises/components/analysis-platforms-multi-select";
import { AnalysisStrategicFocusField } from "@/features/analises/components/analysis-strategic-focus-field";
import { AnalysisTypeField } from "@/features/analises/components/analysis-type-field";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type Props = {
  form: AnalysisFormState;
  setForm: React.Dispatch<React.SetStateAction<AnalysisFormState>>;
  disabled?: boolean;
  integrationWarning?: React.ReactNode;
};

export function AnalysisConfigPanel({
  form,
  setForm,
  disabled,
  integrationWarning,
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-xl border border-hk-border bg-hk-surface shadow-hk-sm">
      <div className="flex items-center justify-between gap-3 border-b border-hk-border-subtle px-4 py-3 md:px-5">
        <div>
          <p className="hk-overline">
            Configuração da análise
          </p>
          <p className="text-sm font-semibold text-hk-deep">
            Período, foco e cobertura de plataformas
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1 text-hk-muted"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? (
            <>
              Recolher <ChevronUp className="size-4" />
            </>
          ) : (
            <>
              Expandir <ChevronDown className="size-4" />
            </>
          )}
        </Button>
      </div>

      {open && (
        <div className="space-y-6 px-4 py-5 md:px-5">
          {integrationWarning}
          <AnalysisDateRangeField
            start={form.dateStart}
            end={form.dateEnd}
            onStartChange={(dateStart) => setForm((f) => ({ ...f, dateStart }))}
            onEndChange={(dateEnd) => setForm((f) => ({ ...f, dateEnd }))}
            disabled={disabled}
          />
          <AnalysisStrategicFocusField
            value={form.strategicFocus}
            onChange={(strategicFocus) =>
              setForm((f) => ({ ...f, strategicFocus }))
            }
            disabled={disabled}
          />
          <AnalysisTypeField
            value={form.analysisType}
            onChange={(analysisType) => setForm((f) => ({ ...f, analysisType }))}
            disabled={disabled}
          />
          <AnalysisPlatformsMultiSelect
            value={form.platforms}
            onChange={(platforms) => setForm((f) => ({ ...f, platforms }))}
            disabled={disabled}
          />
          <AnalysisBiasInput
            value={form.bias}
            onChange={(bias) => setForm((f) => ({ ...f, bias }))}
            disabled={disabled}
          />
        </div>
      )}
    </section>
  );
}

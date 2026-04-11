"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function GoalFormStrategicSection({
  description,
  smart,
  rationale,
  hypothesis,
  expectedImpact,
  internalNotes,
  onChange,
}: {
  description: string;
  smart: string;
  rationale: string;
  hypothesis: string;
  expectedImpact: string;
  internalNotes: string;
  onChange: (patch: Record<string, string>) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-hk-deep">Definição estratégica</p>
      <div className="grid gap-2">
        <Label htmlFor="g-desc">Descrição da meta</Label>
        <Textarea
          id="g-desc"
          rows={3}
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="O que se pretende alcançar neste horizonte."
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="g-smart">SMART (objetivo mensurável)</Label>
        <Textarea
          id="g-smart"
          rows={2}
          value={smart}
          onChange={(e) => onChange({ smart: e.target.value })}
          placeholder="Específico, mensurável, atingível, relevante e temporal."
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="g-rat">Justificativa</Label>
        <Textarea
          id="g-rat"
          rows={2}
          value={rationale}
          onChange={(e) => onChange({ rationale: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="g-hyp">Hipótese estratégica</Label>
        <Textarea
          id="g-hyp"
          rows={2}
          value={hypothesis}
          onChange={(e) => onChange({ hypothesis: e.target.value })}
          placeholder="Se fizermos X, esperamos Y porque…"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="g-imp">Impacto esperado</Label>
        <Textarea
          id="g-imp"
          rows={2}
          value={expectedImpact}
          onChange={(e) => onChange({ expectedImpact: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="g-int">Observações internas</Label>
        <Textarea
          id="g-int"
          rows={2}
          value={internalNotes}
          onChange={(e) => onChange({ internalNotes: e.target.value })}
          placeholder="Uso da agência — não compartilhar com cliente se não aplicável."
        />
      </div>
    </div>
  );
}

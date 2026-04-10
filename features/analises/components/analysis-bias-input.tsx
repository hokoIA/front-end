"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

export function AnalysisBiasInput({ value, onChange, disabled }: Props) {
  return (
    <div className="space-y-2">
      <Label className="text-hk-muted">
        Direcionamento opcional
        <span className="ml-1 font-normal text-hk-muted/80">
          (pergunta, viés ou objetivo da leitura)
        </span>
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        placeholder='Ex.: "Por que o alcance caiu neste período?" ou "Preciso de argumentos para reunião de resultado com o cliente."'
        className="resize-y text-sm"
      />
    </div>
  );
}

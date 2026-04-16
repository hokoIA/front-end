"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
};

export function ContextTextInputPanel({ value, onChange, disabled }: Props) {
  return (
    <div className="space-y-2">
      <Label htmlFor="ctx-body">Conteúdo em texto</Label>
      <Textarea
        id="ctx-body"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Cole briefings, diretrizes, transcrições relevantes ou notas estruturadas. Quanto mais contexto explícito, melhor a recuperação semântica."
        className="min-h-[220px] font-mono text-[13px] leading-relaxed"
      />
      <p className="text-xs text-hk-muted">
        O envio usa o texto exatamente como informado, com apenas limpeza leve de
        espaços e quebras de linha para melhorar a leitura pela IA.
      </p>
    </div>
  );
}

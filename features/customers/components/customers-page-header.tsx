"use client";

import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/data-display/page-header";

export function CustomersPageHeader() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Central de ativação"
        title="Clientes & Integrações"
        description="Cadastre clientes e conecte as fontes que alimentam dashboard, análises e metas. O valor da operação começa aqui."
      />
      <div className="flex items-center gap-2 rounded-xl border border-hk-border-subtle bg-hk-surface px-3.5 py-3 text-sm text-hk-muted shadow-hk-xs">
        <Sparkles className="h-4 w-4 shrink-0 text-hk-action" aria-hidden />
        <span>
          Ative clientes e organize conexões em um único hub operacional.
        </span>
      </div>
    </div>
  );
}

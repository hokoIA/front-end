"use client";

import { UserRoundSearch } from "lucide-react";

export function GoalsNoCustomerState() {
  return (
    <div
      role="status"
      className="flex gap-4 rounded-xl border border-hk-border bg-hk-surface p-5 shadow-hk-sm"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-hk-cyan/20 text-hk-deep">
        <UserRoundSearch className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <h3 className="font-semibold text-hk-deep">Selecione um cliente</h3>
        <p className="mt-1 text-sm text-hk-muted">
          Para criar uma meta ou pedir sugestões da IA, escolha explicitamente o
          cliente no contexto global acima. Isso garante que contexto vetorial,
          plataforma e histórico fiquem alinhados.
        </p>
      </div>
    </div>
  );
}

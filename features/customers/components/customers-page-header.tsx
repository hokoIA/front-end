"use client";

import { Sparkles } from "lucide-react";

export function CustomersPageHeader() {
  return (
    <header className="relative overflow-hidden rounded-xl border border-hk-border bg-gradient-to-br from-hk-surface via-hk-surface to-hk-cyan/10 px-6 py-8 shadow-hk-sm">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-hk-action/10 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-hk-action">
            Central de ativação
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-hk-deep md:text-3xl">
            Clientes & Integrações
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-hk-muted">
            Cadastre clientes e conecte as fontes que alimentam dashboards,
            análises e metas. Sem integrações confiáveis, o restante da
            plataforma perde valor — comece por aqui.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-hk-border-subtle bg-hk-canvas/80 px-3 py-2 text-xs text-hk-muted sm:mt-0">
          <Sparkles className="h-4 w-4 shrink-0 text-hk-action" aria-hidden />
          <span>
            Ative o cliente na plataforma e organize as conexões em um só lugar.
          </span>
        </div>
      </div>
    </header>
  );
}

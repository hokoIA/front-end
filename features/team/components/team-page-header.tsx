"use client";

import { UsersRound } from "lucide-react";

export function TeamPageHeader() {
  return (
    <header className="rounded-xl border border-hk-border bg-hk-surface px-6 py-7 shadow-hk-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-hk-action">
            Governança da conta
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-hk-deep md:text-3xl">
            Equipe
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-hk-muted">
            Gerencie quem acessa esta conta: convites, papéis e membros ativos.
            Área simples, pensada para administradores que precisam de clareza,
            não de um painel de RH.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-hk-border-subtle bg-hk-canvas/80 px-3 py-2 text-xs text-hk-muted sm:max-w-xs">
          <UsersRound className="h-4 w-4 shrink-0 text-hk-action" aria-hidden />
          <span>
            Controle centralizado de acessos internos — sem complexidade de IAM
            corporativo.
          </span>
        </div>
      </div>
    </header>
  );
}

"use client";

import { UserPlus } from "lucide-react";

export function TeamEmptyState({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-hk-border bg-hk-surface px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-hk-cyan/20 text-hk-deep">
        <UserPlus className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="mt-4 text-base font-semibold text-hk-deep">
        Apenas você nesta conta
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-hk-muted">
        {isAdmin
          ? "Convide colegas para colaborar. Você mantém o controle de quem entra e qual nível de acesso cada pessoa tem."
          : "Não há outros membros listados. Administradores podem enviar convites quando necessário."}
      </p>
    </div>
  );
}

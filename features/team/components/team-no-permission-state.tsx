"use client";

import { ShieldOff } from "lucide-react";

export function TeamNoPermissionState() {
  return (
    <div
      role="status"
      className="flex gap-4 rounded-xl border border-hk-border bg-hk-surface p-6 shadow-hk-sm"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-hk-canvas text-hk-muted">
        <ShieldOff className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <h2 className="font-semibold text-hk-deep">Acesso restrito</h2>
        <p className="mt-1 text-sm text-hk-muted">
          Apenas administradores da conta podem convidar pessoas, alterar níveis
          e desativar membros. Se precisar dessas permissões, peça a um admin.
        </p>
      </div>
    </div>
  );
}

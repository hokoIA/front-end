"use client";

import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, PlugZap } from "lucide-react";

export function CustomerEmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hk-border bg-hk-surface px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-hk-action/10 text-hk-action">
        <BriefcaseBusiness className="h-7 w-7" aria-hidden />
      </div>
      <h2 className="mt-6 text-lg font-semibold text-hk-deep">
        Nenhum cliente na carteira ainda
      </h2>
      <p className="mt-2 max-w-md text-sm text-hk-muted">
        Esta é a central de ativação: crie o primeiro cliente e, em seguida,
        conecte Meta, Google Analytics, YouTube e LinkedIn para liberar
        dashboards e metas.
      </p>
      <Button
        type="button"
        className="mt-8 gap-2 bg-hk-action text-white hover:bg-hk-strong"
        onClick={onCreate}
      >
        <PlugZap className="h-4 w-4" aria-hidden />
        Novo cliente
      </Button>
    </div>
  );
}

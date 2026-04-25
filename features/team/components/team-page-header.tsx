"use client";

import { UsersRound } from "lucide-react";
import { PageHeader } from "@/components/data-display/page-header";

export function TeamPageHeader() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Governança de acesso"
        title="Equipe"
        description="Gerencie convites, papéis e membros ativos da conta com clareza operacional."
      />
      <div className="flex items-center gap-2 rounded-xl border border-hk-border-subtle bg-hk-surface px-3.5 py-3 text-sm text-hk-muted shadow-hk-xs sm:max-w-xl">
        <UsersRound className="h-4 w-4 shrink-0 text-hk-action" aria-hidden />
        <span>
          Controle de acesso centralizado sem complexidade de IAM corporativo.
        </span>
      </div>
    </div>
  );
}

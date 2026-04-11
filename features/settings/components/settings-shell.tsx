"use client";

import { SettingsNavigation } from "./settings-navigation";

export function SettingsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="hk-page">
      <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.14em] text-hk-muted">
        Área administrativa · Configurações
      </p>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="shrink-0 lg:w-64">
          <SettingsNavigation />
        </aside>
        <div className="min-w-0 flex-1 space-y-8">{children}</div>
      </div>
    </div>
  );
}

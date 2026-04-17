"use client";

import { SettingsNavigation } from "./settings-navigation";

export function SettingsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="hk-page my-6">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="shrink-0 lg:w-64">
          <SettingsNavigation />
        </aside>
        <div className="min-w-0 flex-1 space-y-8">{children}</div>
      </div>
    </div>
  );
}

"use client";

import { SettingsNavigation } from "./settings-navigation";

export function SettingsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="hk-page my-6 lg:my-7">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:gap-8">
        <aside className="shrink-0 lg:sticky lg:top-[4.5rem] lg:w-64">
          <SettingsNavigation />
        </aside>
        <div className="min-w-0 flex-1 space-y-7 lg:space-y-8">{children}</div>
      </div>
    </div>
  );
}

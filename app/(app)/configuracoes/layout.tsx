"use client";

import { SettingsShell } from "@/features/settings";

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsShell>{children}</SettingsShell>;
}

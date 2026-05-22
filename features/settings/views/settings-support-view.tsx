"use client";

import { SettingsPageHeader } from "../components/settings-page-header";
import {
  HelpFaqList,
  SupportContactCard,
} from "@/features/support";

export function SettingsSupportView() {
  return (
    <div className="space-y-7 lg:space-y-8">
      <SettingsPageHeader
        title="Ajuda & suporte"
        description="Canais oficiais da ho.ko e respostas rápidas sobre cobrança, conta e produto."
        eyebrow="Configurações"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <SupportContactCard />
        <HelpFaqList />
      </div>
    </div>
  );
}

"use client";

import { SettingsPageHeader } from "../components/settings-page-header";
import {
  HelpFaqList,
  SupportCenterPanel,
  SupportContactCard,
} from "@/features/support";

export function SettingsSupportView() {
  return (
    <div className="space-y-8">
      <SettingsPageHeader
        title="Ajuda & suporte"
        description="Canais oficiais da ho.ko e respostas rápidas sobre cobrança, conta e produto. Evolução natural do antigo ‘fale conosco’ isolado."
        eyebrow="Configurações"
      />
      <SupportCenterPanel />
      <div className="grid gap-6 lg:grid-cols-2">
        <SupportContactCard />
        <HelpFaqList />
      </div>
    </div>
  );
}

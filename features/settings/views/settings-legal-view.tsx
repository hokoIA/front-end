"use client";

import { LegalLinksPanel } from "@/features/legal";
import { SettingsPageHeader } from "../components/settings-page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SettingsLegalView() {
  return (
    <div className="space-y-8">
      <SettingsPageHeader
        title="Legal & institucional"
        description="Documentos que regem o uso do SaaS. Mantidos acessíveis dentro do módulo administrativo, sem competir com a navegação operacional do dia a dia."
        eyebrow="Configurações"
      />
      <Card className="border-hk-border bg-hk-canvas/40">
        <CardHeader>
          <CardTitle className="text-base text-hk-deep">
            Transparência
          </CardTitle>
          <CardDescription>
            Os textos completos residem em páginas dedicadas (mesma sessão
            autenticada). Atualize o conteúdo jurídico diretamente nessas rotas
            antes do go-live.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LegalLinksPanel />
        </CardContent>
      </Card>
    </div>
  );
}

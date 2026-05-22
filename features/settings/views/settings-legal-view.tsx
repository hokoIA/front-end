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
    <div className="space-y-7 lg:space-y-8">
      <SettingsPageHeader
        title="Legal & institucional"
        description="Documentos que regem o uso da plataforma."
        eyebrow="Configurações"
      />
      <Card className="border-hk-border bg-hk-canvas/40">
        <CardHeader>
          <CardTitle className="text-base text-hk-deep">
            Transparência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LegalLinksPanel />
        </CardContent>
      </Card>
    </div>
  );
}

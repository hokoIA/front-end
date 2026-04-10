"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronRight, FileText, Shield } from "lucide-react";

export function LegalLinksPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-hk-border shadow-hk-sm transition-colors hover:border-hk-action/25">
        <CardHeader>
          <div className="flex size-10 items-center justify-center rounded-lg bg-hk-canvas text-hk-action">
            <FileText className="size-5" strokeWidth={1.5} />
          </div>
          <CardTitle className="text-lg text-hk-deep">Termos de uso</CardTitle>
          <CardDescription>
            Escopo do serviço, obrigações e limitações aplicáveis ao workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/legal/termos"
            className="inline-flex items-center gap-1 text-sm font-medium text-hk-action hover:underline"
          >
            Abrir termos
            <ChevronRight className="size-4" />
          </Link>
        </CardContent>
      </Card>
      <Card className="border-hk-border shadow-hk-sm transition-colors hover:border-hk-action/25">
        <CardHeader>
          <div className="flex size-10 items-center justify-center rounded-lg bg-hk-canvas text-hk-action">
            <Shield className="size-5" strokeWidth={1.5} />
          </div>
          <CardTitle className="text-lg text-hk-deep">
            Política de privacidade
          </CardTitle>
          <CardDescription>
            Tratamento de dados pessoais e bases legais conforme LGPD.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/legal/privacidade"
            className="inline-flex items-center gap-1 text-sm font-medium text-hk-action hover:underline"
          >
            Abrir política
            <ChevronRight className="size-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

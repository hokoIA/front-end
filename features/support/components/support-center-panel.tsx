"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { BookOpen, LifeBuoy, Scale } from "lucide-react";

export function SupportCenterPanel() {
  return (
    <Card className="border-hk-border bg-gradient-to-br from-hk-canvas/80 to-hk-surface shadow-hk-sm">
      <CardHeader>
        <div className="flex size-11 items-center justify-center rounded-full bg-hk-surface text-hk-action shadow-hk-sm">
          <LifeBuoy className="size-5" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-xl text-hk-deep">Central de ajuda</CardTitle>
        <CardDescription className="text-hk-ink">
          Você está na área oficial de suporte do produto. Priorizamos clareza
          institucional e canais auditáveis — sem depender só de modais soltos no
          restante do app.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          href="/configuracoes/assinatura"
          className="inline-flex items-center gap-2 rounded-lg border border-hk-border bg-hk-surface px-4 py-3 text-sm font-medium text-hk-deep transition-colors hover:border-hk-action/40 hover:text-hk-action"
        >
          <BookOpen className="size-4" />
          Cobrança e plano
        </Link>
        <Link
          href="/configuracoes/legal"
          className="inline-flex items-center gap-2 rounded-lg border border-hk-border bg-hk-surface px-4 py-3 text-sm font-medium text-hk-deep transition-colors hover:border-hk-action/40 hover:text-hk-action"
        >
          <Scale className="size-4" />
          Documentos legais
        </Link>
      </CardContent>
    </Card>
  );
}

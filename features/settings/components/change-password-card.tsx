"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { KeyRound } from "lucide-react";

export function ChangePasswordCard() {
  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <div className="flex size-10 items-center justify-center rounded-lg bg-hk-canvas text-hk-action">
          <KeyRound className="size-5" strokeWidth={1.5} />
        </div>
        <div>
          <CardTitle className="text-base text-hk-deep">Senha de acesso</CardTitle>
          <CardDescription>
            A autenticação usa cookie seguro após o login. Para redefinir a
            senha, use o fluxo oficial de recuperação — ele invalida sessões
            antigas conforme a política do gateway.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button asChild variant="secondary">
          <Link href="/forgot-password">Enviar link de redefinição</Link>
        </Button>
        <Button asChild variant="ghost" className="text-hk-muted">
          <Link href="/configuracoes/seguranca">Ver área de segurança</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

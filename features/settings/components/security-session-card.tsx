"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogoutMutation } from "@/hooks/api/use-auth-queries";
import { Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SecuritySessionCard() {
  const router = useRouter();
  const logout = useLogoutMutation();

  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader>
        <CardTitle className="text-base text-hk-deep">Sessão atual</CardTitle>
        <CardDescription>
          A sessão é mantida por cookie HTTP-only emitido pelo API Gateway. Não
          armazenamos JWT em <code className="text-xs">localStorage</code>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-hk-muted">
          Para encerrar o acesso neste navegador, use sair abaixo. Políticas de
          revogação global dependem do backend.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="gap-2"
          disabled={logout.isPending}
          onClick={() =>
            logout.mutate(undefined, {
              onSuccess: () => router.replace("/login"),
            })
          }
        >
          {logout.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}
          Sair da conta
        </Button>
      </CardContent>
    </Card>
  );
}

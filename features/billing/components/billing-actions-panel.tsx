"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Loader2 } from "lucide-react";

type Props = {
  onManagePortal: () => void;
  onCheckout?: () => void;
  portalLoading: boolean;
  checkoutLoading?: boolean;
  showCheckout?: boolean;
};

export function BillingActionsPanel({
  onManagePortal,
  onCheckout,
  portalLoading,
  checkoutLoading,
  showCheckout,
}: Props) {
  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader>
        <CardTitle className="text-lg text-hk-deep">Ações</CardTitle>
        <CardDescription>
          O portal de cobrança é o lugar seguro para cartão, faturas e cancelamento
          programado — sem expor detalhes técnicos do provedor.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          className="gap-2"
          disabled={portalLoading}
          onClick={onManagePortal}
        >
          {portalLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ExternalLink className="size-4" />
          )}
          Gerenciar assinatura no portal
        </Button>
        {showCheckout && onCheckout && (
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            disabled={checkoutLoading}
            onClick={onCheckout}
          >
            {checkoutLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            Ativar / atualizar plano
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFriendlyErrorMessage, isHttpError } from "@/lib/api/errors";
import { AlertCircle, Inbox } from "lucide-react";

export function SettingsErrorState({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const forbidden = isHttpError(error) && error.kind === "forbidden";
  const unauthorized = isHttpError(error) && error.kind === "unauthorized";

  return (
    <Card className="border-red-200 bg-red-50/40">
      <CardHeader className="pb-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-700">
          <AlertCircle className="size-5" />
        </div>
        <CardTitle className="text-base text-hk-deep">
          {unauthorized
            ? "Sessão expirada"
            : forbidden
              ? "Sem permissão"
              : "Não foi possível carregar"}
        </CardTitle>
        <CardDescription className="text-hk-ink">
          {getFriendlyErrorMessage(error)}
        </CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button type="button" size="sm" variant="secondary" onClick={onRetry}>
            Tentar novamente
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export function SettingsEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed border-hk-border bg-hk-surface/80">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-full bg-hk-canvas text-hk-muted">
          <Inbox className="size-5" strokeWidth={1.5} />
        </div>
        <CardTitle className="text-base text-hk-deep">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

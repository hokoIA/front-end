"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NormalizedRbacMe } from "@/lib/types/rbac";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  rbac: NormalizedRbacMe | null | undefined;
  loading?: boolean;
};

export function AccountRoleCard({ rbac, loading }: Props) {
  const role = typeof rbac?.role === "string" && rbac.role ? rbac.role : null;
  const perms = rbac?.permissions?.length ?? 0;

  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader>
        <CardTitle className="text-base text-hk-deep">Papel e permissões</CardTitle>
        <CardDescription>
          Informações retornadas por <code className="text-xs">GET /api/rbac/me</code>
          , quando disponíveis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <Skeleton className="h-8 w-48" />
        ) : role ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-hk-muted">Papel declarado:</span>
            <Badge variant="secondary">{role}</Badge>
          </div>
        ) : (
          <p className="text-sm text-hk-muted">
            Nenhum papel explícito retornado pela API. O acesso segue as regras do
            gateway.
          </p>
        )}
        {!loading && perms > 0 ? (
          <p className="text-xs text-hk-muted">
            {perms} permissão(ões) mapeadas no perfil técnico.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

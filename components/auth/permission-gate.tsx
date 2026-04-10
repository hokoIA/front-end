"use client";

import { useRbacMeQuery } from "@/hooks/api/use-rbac-queries";
import { rbacAllows } from "@/lib/types/rbac";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReactNode } from "react";

type PermissionGateProps = {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
  /** Enquanto RBAC carrega */
  loading?: ReactNode;
};

export function PermissionGate({
  permission,
  children,
  fallback = null,
  loading,
}: PermissionGateProps) {
  const { data, isPending, isError } = useRbacMeQuery();

  if (isPending) {
    return (
      loading ?? (
        <div className="py-6">
          <Skeleton className="h-6 w-40" />
        </div>
      )
    );
  }

  if (isError || !rbacAllows(data, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

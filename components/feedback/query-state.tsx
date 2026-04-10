"use client";

import { ErrorState } from "@/components/feedback/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { getFriendlyErrorMessage } from "@/lib/api/errors";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";

type QueryStateProps<T> = {
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
  /** Quando dados são lista/objeto vazio */
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  loading?: ReactNode;
};

/**
 * Estratégia única: loading → erro → empty → sucesso.
 * Use com TanStack Query em telas que consomem API.
 */
export function QueryState<T>({
  query,
  children,
  isEmpty,
  empty,
  loading,
}: QueryStateProps<T>) {
  if (query.isPending) {
    return (
      loading ?? (
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
        </div>
      )
    );
  }

  if (query.isError) {
    return (
      <ErrorState
        message={getFriendlyErrorMessage(query.error)}
        onRetry={() => query.refetch()}
      />
    );
  }

  if (query.data === undefined || query.data === null) {
    return empty ?? null;
  }

  if (isEmpty?.(query.data)) {
    return empty ?? null;
  }

  return <>{children(query.data)}</>;
}

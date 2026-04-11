"use client";

import type { CustomerIntegrationSummary } from "@/features/integrations/types/customer-summary";
import { fetchCustomerIntegrationSummary } from "@/features/integrations/api/fetch-customer-integration-summary";
import { queryKeys } from "@/lib/api/query-keys";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

/** Limite de clientes para buscar resumo de integrações em paralelo (evita rajadas enormes). */
export const CUSTOMER_LIST_INTEGRATION_SUMMARY_LIMIT = 25;

export function useCustomersIntegrationSummaries(customerIds: string[]) {
  const overLimit = customerIds.length > CUSTOMER_LIST_INTEGRATION_SUMMARY_LIMIT;
  const cappedIds = overLimit
    ? []
    : customerIds.slice(0, CUSTOMER_LIST_INTEGRATION_SUMMARY_LIMIT);

  const results = useQueries({
    queries: cappedIds.map((id) => ({
      queryKey: queryKeys.integrations.customerSummary(id),
      queryFn: () => fetchCustomerIntegrationSummary(id),
      staleTime: 60_000,
      enabled: cappedIds.length > 0,
    })),
  });

  const byId = useMemo(() => {
    const m = new Map<string, CustomerIntegrationSummary>();
    cappedIds.forEach((id, i) => {
      const r = results[i]?.data;
      if (r) m.set(id, r);
    });
    return m;
  }, [cappedIds, results]);

  const isLoading =
    cappedIds.length > 0 && results.some((r) => r.isPending || r.isFetching);

  return {
    byId,
    isLoading,
    batchDisabled: overLimit,
    cappedCount: cappedIds.length,
  };
}

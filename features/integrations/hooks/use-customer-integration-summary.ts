"use client";

import { fetchCustomerIntegrationSummary } from "@/features/integrations/api/fetch-customer-integration-summary";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useCustomerIntegrationSummary(idCustomer: string | null) {
  return useQuery({
    queryKey: queryKeys.integrations.customerSummary(idCustomer ?? ""),
    queryFn: () => fetchCustomerIntegrationSummary(idCustomer!),
    enabled: Boolean(idCustomer),
    staleTime: 60_000,
  });
}

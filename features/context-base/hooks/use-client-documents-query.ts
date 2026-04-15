"use client";

import { fetchClientDocuments } from "../api/fetch-client-documents";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useClientDocumentsQuery(
  clientId: string | null,
  customerName: string | null,
  agencyId: string | null,
) {
  return useQuery({
    queryKey: queryKeys.contextBase.documents(clientId ?? ""),
    queryFn: () =>
      fetchClientDocuments({
        agency_id: agencyId!,
        scope: "client",
        limit: 100,
        client_id: clientId!,
        customerName: customerName ?? "Cliente",
      }),
    enabled: Boolean(clientId && agencyId),
    staleTime: 30_000,
  });
}

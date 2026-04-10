"use client";

import { fetchClientDocuments } from "../api/fetch-client-documents";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContextDocumentListItem, GovernanceStatusValue } from "../types";

export function useClientDocumentsQuery(
  clientId: string | null,
  customerName: string | null,
) {
  return useQuery({
    queryKey: queryKeys.contextBase.documents(clientId ?? ""),
    queryFn: () =>
      fetchClientDocuments(clientId!, customerName ?? "Cliente"),
    enabled: Boolean(clientId),
    staleTime: 30_000,
  });
}

export function useUpdateMockDocumentStatus(clientId: string | null) {
  const qc = useQueryClient();
  return (docId: string, status: GovernanceStatusValue) => {
    if (!clientId) return;
    qc.setQueryData<ContextDocumentListItem[]>(
      queryKeys.contextBase.documents(clientId),
      (prev) =>
        (prev ?? []).map((d) =>
          d.id === docId
            ? {
                ...d,
                status,
                updatedAt: new Date().toISOString(),
              }
            : d,
        ),
    );
  };
}

export function useRemoveMockDocument(clientId: string | null) {
  const qc = useQueryClient();
  return (docId: string) => {
    if (!clientId) return;
    qc.setQueryData<ContextDocumentListItem[]>(
      queryKeys.contextBase.documents(clientId),
      (prev) => (prev ?? []).filter((d) => d.id !== docId),
    );
  };
}

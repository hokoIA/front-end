import { fetchClientDocuments } from "@/features/context-base/api/fetch-client-documents";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";

type UseDocumentListQueryParams = {
  agencyId: string | null;
  clientId: string | null;
  customerName: string | null;
  limit?: number;
  docType?: string;
};

export function useDocumentListQuery({
  agencyId,
  clientId,
  customerName,
  limit = 100,
  docType,
}: UseDocumentListQueryParams) {
  return useQuery({
    queryKey: [...queryKeys.contextBase.documents(clientId ?? ""), docType ?? "all"],
    queryFn: () =>
      fetchClientDocuments({
        agency_id: agencyId!,
        scope: "client",
        limit,
        client_id: clientId!,
        ...(docType ? { doc_type: docType } : {}),
        customerName: customerName ?? "Cliente",
      }),
    enabled: Boolean(clientId && agencyId),
    staleTime: 30_000,
  });
}

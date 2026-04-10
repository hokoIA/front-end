import {
  createKanbanCard,
  createKanbanColumn,
  createKanbanLabel,
  deleteKanbanCard,
  deleteKanbanColumn,
  deleteKanbanClientProfile,
  deleteKanbanLabel,
  getKanbanBoardData,
  getKanbanCard,
  getKanbanClientPortalLink,
  getKanbanClients,
  getKanbanTeam,
  listKanbanCards,
  listKanbanColumns,
  listKanbanLabels,
  moveKanbanCard,
  putKanbanClientProfile,
  reorderKanbanColumns,
  updateKanbanCard,
  updateKanbanColumn,
  updateKanbanLabel,
} from "@/lib/api/kanban";
import { queryKeys } from "@/lib/api/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useKanbanBoardDataQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.kanban.boardData(),
    queryFn: getKanbanBoardData,
    enabled,
  });
}

export function useKanbanTeamQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.kanban.team(),
    queryFn: getKanbanTeam,
    enabled,
  });
}

export function useKanbanClientsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.kanban.clients(),
    queryFn: getKanbanClients,
    enabled,
  });
}

export function useKanbanLabelsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.kanban.labels(),
    queryFn: listKanbanLabels,
    enabled,
  });
}

export function useKanbanColumnsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.kanban.columns(),
    queryFn: listKanbanColumns,
    enabled,
  });
}

export function useKanbanCardsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.kanban.cards(),
    queryFn: listKanbanCards,
    enabled,
  });
}

export function useKanbanCardQuery(id: string | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.kanban.card(id ?? ""),
    queryFn: () => getKanbanCard(id!),
    enabled: Boolean(id) && enabled,
  });
}

export function useKanbanClientPortalLinkQuery(
  idCustomer: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: [...queryKeys.kanban.clients(), "portal", idCustomer ?? ""],
    queryFn: () => getKanbanClientPortalLink(idCustomer!),
    enabled: Boolean(idCustomer) && enabled,
  });
}

function invalidateKanban(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: queryKeys.kanban.all });
}

export function useKanbanLabelMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: createKanbanLabel,
    onSuccess: () => invalidateKanban(qc),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      updateKanbanLabel(id, body),
    onSuccess: () => invalidateKanban(qc),
  });
  const remove = useMutation({
    mutationFn: deleteKanbanLabel,
    onSuccess: () => invalidateKanban(qc),
  });
  return { create, update, remove };
}

export function useKanbanColumnMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: createKanbanColumn,
    onSuccess: () => invalidateKanban(qc),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      updateKanbanColumn(id, body),
    onSuccess: () => invalidateKanban(qc),
  });
  const remove = useMutation({
    mutationFn: deleteKanbanColumn,
    onSuccess: () => invalidateKanban(qc),
  });
  const reorder = useMutation({
    mutationFn: reorderKanbanColumns,
    onSuccess: () => invalidateKanban(qc),
  });
  return { create, update, remove, reorder };
}

export function useKanbanCardMutations() {
  const qc = useQueryClient();
  const create = useMutation({
    mutationFn: createKanbanCard,
    onSuccess: () => invalidateKanban(qc),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      updateKanbanCard(id, body),
    onSuccess: () => invalidateKanban(qc),
  });
  const remove = useMutation({
    mutationFn: deleteKanbanCard,
    onSuccess: () => invalidateKanban(qc),
  });
  const move = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      moveKanbanCard(id, body),
    onSuccess: () => invalidateKanban(qc),
  });
  return { create, update, remove, move };
}

export function useKanbanClientProfileMutations() {
  const qc = useQueryClient();
  const put = useMutation({
    mutationFn: ({
      idCustomer,
      body,
    }: {
      idCustomer: string;
      body: Record<string, unknown>;
    }) => putKanbanClientProfile(idCustomer, body),
    onSuccess: () => invalidateKanban(qc),
  });
  const remove = useMutation({
    mutationFn: deleteKanbanClientProfile,
    onSuccess: () => invalidateKanban(qc),
  });
  return { put, remove };
}

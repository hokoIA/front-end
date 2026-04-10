import type {
  KanbanBoardData,
  KanbanCard,
  KanbanColumn,
  KanbanLabel,
} from "@/lib/types/kanban";
import { endpoints } from "./endpoints";
import { httpJson } from "./http-client";

export async function getKanbanBoardData(): Promise<KanbanBoardData> {
  return httpJson<KanbanBoardData>(endpoints.kanban.boardData(), {
    method: "GET",
  });
}

export async function getKanbanTeam(): Promise<unknown> {
  return httpJson(endpoints.kanban.team(), { method: "GET" });
}

export async function getKanbanClients(): Promise<unknown> {
  return httpJson(endpoints.kanban.clients(), { method: "GET" });
}

export async function putKanbanClientProfile(
  idCustomer: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.kanban.clientProfile(idCustomer), {
    method: "PUT",
    json: body,
  });
}

export async function deleteKanbanClientProfile(
  idCustomer: string,
): Promise<void> {
  await httpJson(endpoints.kanban.clientProfile(idCustomer), {
    method: "DELETE",
  });
}

export async function getKanbanClientPortalLink(
  idCustomer: string,
): Promise<unknown> {
  return httpJson(endpoints.kanban.clientPortalLink(idCustomer), {
    method: "GET",
  });
}

export async function listKanbanLabels(): Promise<KanbanLabel[]> {
  const data = await httpJson<unknown>(endpoints.kanban.labels(), {
    method: "GET",
  });
  return Array.isArray(data) ? (data as KanbanLabel[]) : [];
}

export async function createKanbanLabel(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.kanban.labels(), { method: "POST", json: body });
}

export async function updateKanbanLabel(
  id: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.kanban.label(id), { method: "PUT", json: body });
}

export async function deleteKanbanLabel(id: string): Promise<void> {
  await httpJson(endpoints.kanban.label(id), { method: "DELETE" });
}

export async function listKanbanColumns(): Promise<KanbanColumn[]> {
  const data = await httpJson<unknown>(endpoints.kanban.columns(), {
    method: "GET",
  });
  return Array.isArray(data) ? (data as KanbanColumn[]) : [];
}

export async function createKanbanColumn(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.kanban.columns(), { method: "POST", json: body });
}

export async function updateKanbanColumn(
  id: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.kanban.column(id), { method: "PUT", json: body });
}

export async function deleteKanbanColumn(id: string): Promise<void> {
  await httpJson(endpoints.kanban.column(id), { method: "DELETE" });
}

export async function reorderKanbanColumns(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.kanban.columnsReorder(), {
    method: "POST",
    json: body,
  });
}

export async function listKanbanCards(): Promise<KanbanCard[]> {
  const data = await httpJson<unknown>(endpoints.kanban.cards(), {
    method: "GET",
  });
  return Array.isArray(data) ? (data as KanbanCard[]) : [];
}

export async function createKanbanCard(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.kanban.cards(), { method: "POST", json: body });
}

export async function getKanbanCard(id: string): Promise<KanbanCard> {
  return httpJson<KanbanCard>(endpoints.kanban.card(id), { method: "GET" });
}

export async function updateKanbanCard(
  id: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.kanban.card(id), { method: "PUT", json: body });
}

export async function deleteKanbanCard(id: string): Promise<void> {
  await httpJson(endpoints.kanban.card(id), { method: "DELETE" });
}

export async function moveKanbanCard(
  id: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.kanban.cardMove(id), { method: "POST", json: body });
}

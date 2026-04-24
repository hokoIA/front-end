import type { KanbanClientRowUi } from "../types/ui";
import { KANBAN_CLIENT_ROLE_KEYS } from "../types/ui";
import { record } from "./record";

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/** Lê atribuições por papel a partir do payload bruto do cliente. */
export function readKanbanClientRoleAssignments(
  client: KanbanClientRowUi,
): Record<string, string> {
  const r = record(client.raw) ?? {};
  const roles = record(r.roles) ?? {};
  const out: Record<string, string> = {};
  for (const role of KANBAN_CLIENT_ROLE_KEYS) {
    out[role.key] = str(roles[role.responseKey] ?? "");
  }
  return out;
}

/** Monta payload compatível com o backend atual (role_*_name). */
export function buildKanbanClientProfileBody(
  selections: Record<string, string>,
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const role of KANBAN_CLIENT_ROLE_KEYS) {
    const name = selections[role.key]?.trim();
    body[role.apiKey] = name || null;
  }
  return body;
}

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
  const nested =
    record(r.kanban_profile) ??
    record(r.kanban_operational_profile) ??
    record(r.profile) ??
    {};
  const flat: Record<string, unknown> = { ...r, ...nested };
  const out: Record<string, string> = {};
  for (const role of KANBAN_CLIENT_ROLE_KEYS) {
    for (const key of role.apiKeys) {
      const v = flat[key];
      if (v !== null && v !== undefined && str(v)) {
        out[role.key] = String(v);
        break;
      }
    }
  }
  return out;
}

/** Monta corpo do PUT com a primeira chave canônica por papel (compatível com vários backends). */
export function buildKanbanClientProfileBody(
  selections: Record<string, string>,
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const role of KANBAN_CLIENT_ROLE_KEYS) {
    const id = selections[role.key]?.trim();
    body[role.apiKeys[0]] = id || null;
  }
  return body;
}

import type {
  KanbanCard,
  KanbanColumn,
  KanbanLabel,
} from "@/lib/types/kanban";
import type {
  KanbanCardUi,
  KanbanClientRowUi,
  KanbanColumnUi,
  KanbanLabelUi,
  KanbanTeamMemberUi,
} from "../types/ui";
import { record } from "./record";

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

const DEFAULT_COL_COLOR = "#192bc2";

export function normalizeKanbanColumn(
  c: KanbanColumn,
  index: number,
): KanbanColumnUi {
  const r = record(c) ?? {};
  const id = str(r.id ?? r.id_column ?? r.column_id) || `col-${index}`;
  return {
    id,
    name: str(r.name ?? r.title ?? r.nome) || "Coluna",
    color: str(r.color ?? r.cor ?? r.hex) || DEFAULT_COL_COLOR,
    order:
      typeof r.order === "number"
        ? r.order
        : typeof r.position === "number"
          ? r.position
          : index,
    raw: r,
  };
}

export function normalizeKanbanLabel(l: KanbanLabel, index: number): KanbanLabelUi {
  const r = record(l) ?? {};
  const id = str(r.id ?? r.id_label) || `label-${index}`;
  return {
    id,
    name: str(r.name ?? r.title ?? r.label) || "Etiqueta",
    color: str(r.color ?? r.cor ?? r.hex) || "#64748b",
    raw: r,
  };
}

function parseIdArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (typeof x === "string" || typeof x === "number") return String(x);
      const o = record(x);
      return str(o?.id ?? o?.user_id ?? o?.id_user);
    })
    .filter(Boolean);
}

function parseLabelIds(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => {
      if (typeof x === "string" || typeof x === "number") return String(x);
      const o = record(x);
      return str(o?.id ?? o?.id_label);
    })
    .filter(Boolean);
}

function assigneeNamesFromRaw(r: Record<string, unknown>): string[] {
  const a = r.assignees ?? r.responsaveis ?? r.members;
  if (!Array.isArray(a)) return [];
  return a
    .map((x) => {
      const o = record(x);
      return str(o?.name ?? o?.nome ?? o?.email);
    })
    .filter(Boolean);
}

export function normalizeKanbanCard(c: KanbanCard, index: number): KanbanCardUi {
  const r = record(c) ?? {};
  const id = str(r.id ?? r.id_card) || `card-${index}`;
  const columnId = str(
    r.column_id ?? r.columnId ?? r.id_column ?? r.column,
  );
  const copy = str(
    r.copy ?? r.description ?? r.descricao ?? r.body ?? r.texto,
  );
  const preview =
    copy.length > 120 ? `${copy.slice(0, 117)}…` : copy || undefined;

  return {
    id,
    title: str(r.title ?? r.titulo ?? r.name) || "Card",
    columnId: columnId || "unassigned",
    week: str(r.week ?? r.semana ?? r.week_label ?? r.week_ref) || undefined,
    dueDate: str(
      r.due_date ?? r.dueDate ?? r.prazo ?? r.deadline,
    ) || undefined,
    copyPreview: preview,
    description: copy || undefined,
    internalNotes: str(r.internal_notes ?? r.observacoes ?? r.notes) || undefined,
    customerId: str(
      r.id_customer ?? r.customer_id ?? r.cliente_id,
    ) || undefined,
    customerName: (() => {
      const cust = record(r.customer);
      return (
        str(r.customer_name ?? r.cliente_nome ?? (cust ? cust.name : "")) ||
        undefined
      );
    })(),
    assigneeIds: parseIdArray(r.assignee_ids ?? r.assignees_ids ?? r.assignees),
    assigneeNames: (() => {
      const n = assigneeNamesFromRaw(r);
      return n.length > 0 ? n : [];
    })(),
    labelIds: parseLabelIds(r.labels ?? r.label_ids ?? r.tags),
    sortOrder:
      typeof r.order === "number"
        ? r.order
        : typeof r.position === "number"
          ? r.position
          : typeof r.sort_order === "number"
            ? r.sort_order
            : index,
    updatedAt: str(r.updated_at ?? r.updatedAt ?? r.modified_at) || undefined,
    raw: r,
  };
}

export function normalizeKanbanTeamMember(
  row: unknown,
  index: number,
): KanbanTeamMemberUi | null {
  const r = record(row);
  if (!r) return null;
  const id = str(r.id ?? r.id_user ?? r.user_id ?? r.id_team_member);
  if (!id) return null;
  const email = str(r.email ?? r.mail);
  const name =
    str(r.name ?? r.nome ?? r.full_name) || email || `Usuário ${index + 1}`;
  return { id, name, email: email || "—", raw: r };
}

export function parseKanbanTeam(data: unknown): KanbanTeamMemberUi[] {
  let rows: unknown[] = [];
  if (Array.isArray(data)) rows = data;
  else {
    const r = record(data);
    const inner = r?.data ?? r?.members ?? r?.team ?? r?.users;
    if (Array.isArray(inner)) rows = inner;
  }
  return rows
    .map((row, i) => normalizeKanbanTeamMember(row, i))
    .filter(Boolean) as KanbanTeamMemberUi[];
}

export function normalizeKanbanClientRow(
  row: unknown,
  index: number,
): KanbanClientRowUi | null {
  const r = record(row);
  if (!r) return null;
  const id = str(
    r.id_customer ?? r.customer_id ?? r.id ?? r.cliente_id,
  );
  if (!id) return null;
  const name =
    str(r.name ?? r.nome ?? r.title ?? r.empresa ?? r.company) ||
    id ||
    "Cliente";
  return { id, name, raw: r };
}

export function parseKanbanClients(data: unknown): KanbanClientRowUi[] {
  let rows: unknown[] = [];
  if (Array.isArray(data)) rows = data;
  else {
    const r = record(data);
    const inner = r?.data ?? r?.clients ?? r?.customers;
    if (Array.isArray(inner)) rows = inner;
  }
  return rows
    .map((row, i) => normalizeKanbanClientRow(row, i))
    .filter(Boolean) as KanbanClientRowUi[];
}

export function extractPortalUrl(data: unknown): string | null {
  if (typeof data === "string" && data.startsWith("http")) return data;
  const r = record(data);
  if (!r) return null;
  const u = str(
    r.url ?? r.link ?? r.portal_url ?? r.href ?? r.portalUrl,
  );
  return u || null;
}

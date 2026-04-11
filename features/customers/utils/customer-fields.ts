import type { Customer } from "@/lib/types/customer";

function str(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

export function getCustomerCompany(c: Customer): string | undefined {
  return str(c.empresa ?? c.company ?? c.business_name);
}

export function getCustomerEmail(c: Customer): string | undefined {
  return str(c.email ?? c.mail);
}

export function getCustomerPhone(c: Customer): string | undefined {
  return str(c.telefone ?? c.phone ?? c.tel);
}

export function getCustomerNotes(c: Customer): string | undefined {
  return str(c.observacoes ?? c.notes ?? c.operational_notes);
}

export function getCustomerCreatedAt(c: Customer): string | undefined {
  return str(
    c.created_at ?? c.createdAt ?? c.data_criacao ?? c.dt_criacao,
  );
}

export function getCustomerUpdatedAt(c: Customer): string | undefined {
  return str(
    c.updated_at ?? c.updatedAt ?? c.data_atualizacao ?? c.dt_update,
  );
}

/** Deriva status de ciclo de vida a partir de campos flexíveis do backend. */
export function getCustomerLifecycleStatus(
  c: Customer,
): import("@/features/customers/types/readiness").CustomerLifecycleStatus {
  const raw = c.status ?? c.situacao ?? c.lifecycle;
  if (raw === undefined || raw === null) return "unknown";
  const s = String(raw).toLowerCase();
  if (["inactive", "inativo", "disabled"].includes(s)) return "inactive";
  if (["archived", "arquivado", "arquivada"].includes(s)) return "archived";
  if (["active", "ativo", "ativa", "enabled"].includes(s)) return "active";
  return "unknown";
}

export function isCustomerActive(c: Customer): boolean {
  const st = getCustomerLifecycleStatus(c);
  return st === "active" || st === "unknown";
}

import { record } from "./record";

function str(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/** Extrai linhas simples de histórico se a API enviar lista em `raw`. */
export function parseKanbanCardActivity(
  raw: Record<string, unknown>,
  max = 8,
): string[] {
  const a = raw.activity ?? raw.history ?? raw.audit ?? raw.timeline;
  if (!Array.isArray(a)) return [];
  return a
    .map((x) => {
      const o = record(x);
      if (!o) return "";
      return str(
        o.message ??
          o.text ??
          o.action ??
          o.description ??
          `${o.at ?? o.created_at ?? ""} ${o.user ?? o.by ?? ""}`.trim(),
      );
    })
    .filter(Boolean)
    .slice(0, max);
}

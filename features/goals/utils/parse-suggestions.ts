import type {
  GoalSuggestion,
  GoalSuggestionKpiRow,
} from "@/features/goals/types/suggestions";
import type { GoalSuggestionApi } from "@/lib/types/goals";
import { record } from "./record";

function str(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function parseKpiRows(raw: unknown): GoalSuggestionKpiRow[] {
  if (!Array.isArray(raw)) return [];
  const out: GoalSuggestionKpiRow[] = [];
  for (const row of raw) {
    const r =
      typeof row === "object" && row ? (row as Record<string, unknown>) : {};
    const kpi = str(r.kpi);
    const label = str(r.label);
    if (kpi && label) out.push({ kpi, label });
  }
  return out;
}

function mapSuggestionRow(row: unknown, index: number): GoalSuggestion {
  const r =
    typeof row === "object" && row ? (row as GoalSuggestionApi) : {};
  const kpis = parseKpiRows(r.kpis);
  return {
    id: str(r.id) ?? `sg-${index}`,
    title: str(r.title) ?? `Sugestão ${index + 1}`,
    tipoMeta: str(r.tipo_meta),
    descricao: str(r.descricao),
    rationale: str(r.rationale),
    platform: "",
    kpis,
    raw: row,
  };
}

export function parseGoalSuggestionsResponse(
  data: unknown,
  fallbackPlatformName?: string,
): GoalSuggestion[] {
  const root = record(data);
  let rows: unknown[] = [];
  if (Array.isArray(data)) rows = data;
  else if (Array.isArray(root?.suggestions)) rows = root.suggestions as unknown[];
  else if (Array.isArray(root?.items)) rows = root.items as unknown[];
  else if (Array.isArray(root?.data)) rows = root.data as unknown[];

  const platform =
    str(root?.platform_name) ?? fallbackPlatformName ?? "";

  return rows.map((row, i) => {
    const s = mapSuggestionRow(row, i);
    return { ...s, platform: s.platform || platform };
  });
}

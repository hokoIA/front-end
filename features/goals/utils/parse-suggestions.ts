import type { GoalSuggestion } from "@/features/goals/types/suggestions";
import { mapPriority } from "@/features/goals/utils/normalize-goal";
import { record } from "./record";

function str(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function stringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x)).filter(Boolean);
}

export function parseGoalSuggestionsResponse(data: unknown): GoalSuggestion[] {
  let rows: unknown[] = [];
  if (Array.isArray(data)) rows = data;
  else {
    const r = record(data);
    const nested =
      r?.suggestions ??
      r?.data ??
      r?.items ??
      r?.proposals ??
      r?.metas_sugeridas;
    if (Array.isArray(nested)) rows = nested;
  }

  return rows.map((row, i) => {
    const r =
      typeof row === "object" && row ? (row as Record<string, unknown>) : {};
    return {
      id: str(r.id) ?? `sg-${i}`,
      title:
        str(r.title ?? r.titulo ?? r.name ?? r.meta_title) ??
        `Sugestão ${i + 1}`,
      strategicObjective:
        str(
          r.strategic_objective ??
            r.objetivo ??
            r.objective ??
            r.objetivo_estrategico,
        ) ?? "",
      platform: str(r.platform ?? r.plataforma ?? r.channel) ?? "—",
      rationaleTiming:
        str(
          r.rationale_timing ??
            r.why_now ??
            r.por_que_agora ??
            r.rationale ??
            r.contexto,
        ) ?? "",
      suggestedKpis: stringArray(
        r.suggested_kpis ?? r.kpis ?? r.indicadores ?? r.kpi_suggestions,
      ),
      horizonLabel:
        str(
          r.horizon ??
            r.horizonte ??
            r.execution_horizon ??
            r.prazo_sugerido,
        ) ?? "—",
      priority: mapPriority(r.priority ?? r.prioridade),
      description: str(r.description ?? r.descricao),
      smart: str(r.smart ?? r.smart_description),
      goalType: str(r.goal_type ?? r.tipo_meta),
      startDate: str(r.start_date ?? r.data_inicio),
      endDate: str(r.end_date ?? r.data_fim),
      raw: row,
    };
  });
}

import type {
  GoalAnalysisUi,
  GoalKpiUi,
  GoalLifecycleStatus,
  GoalUiModel,
} from "@/features/goals/types/ui";
import type { Goal } from "@/lib/types/goals";
import { record } from "./record";

function str(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

export function mapLifecycleStatus(raw: unknown): GoalLifecycleStatus {
  const s = String(raw ?? "").toLowerCase();
  if (["ativo", "active", "ativa"].includes(s)) return "active";
  if (["concluido", "concluído", "completed", "done"].includes(s)) {
    return "completed";
  }
  if (["expirado", "expirada", "closed", "encerrada", "encerrado"].includes(s)) {
    return "closed";
  }
  if (["cancelado", "cancelada", "archived", "arquivada", "arquivado"].includes(s)) {
    return "archived";
  }
  return "unknown";
}

function parseNumForDisplay(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  const s = str(v);
  return s;
}

function parseKpis(raw: unknown): GoalKpiUi[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row, i) => {
    const r =
      typeof row === "object" && row ? (row as Record<string, unknown>) : {};
    const kpiKey = str(r.kpi) ?? "";
    const label = str(r.label ?? r.name ?? r.nome) ?? "";
    return {
      id: str(r.id) ?? `kpi-${i}`,
      kpi: kpiKey || `kpi-${i + 1}`,
      name: label || kpiKey || `KPI ${i + 1}`,
      baseline: parseNumForDisplay(r.baseline ?? r.base),
      target: parseNumForDisplay(r.target ?? r.meta ?? r.alvo),
      unit: str(r.unit ?? r.unidade),
    };
  });
}

function parseFinalAnalysisFromGoal(r: Record<string, unknown>): GoalAnalysisUi[] {
  const text = str(r.analysis_text);
  const at = str(r.analysis_generated_at);
  if (!text) return [];
  return [
    {
      id: "analysis-final",
      generatedAt: at,
      periodLabel: undefined,
      type: "final",
      title: "Análise do período",
      content: text,
      raw: { analysis_text: text, analysis_generated_at: at },
    },
  ];
}

export function goalStableId(g: Goal, index: number): string {
  const id = str(g.id_goal);
  if (id) return id;
  return `goal-idx-${index}`;
}

export function normalizeGoal(g: Goal, index: number): GoalUiModel {
  const r = record(g) ?? {};
  const analyses = parseFinalAnalysisFromGoal(r);

  const kpis = parseKpis(r.kpis);

  return {
    id: goalStableId(g, index),
    customerId: str(r.id_customer),
    customerName: str(
      r.customer_name ?? r.cliente_nome ?? r.nome_cliente,
    ),
    platform: str(r.platform_name ?? r.platform ?? r.plataforma),
    goalType: str(r.tipo_meta ?? r.goal_type),
    title: str(r.title ?? r.name ?? r.titulo) ?? "Meta sem título",
    status: mapLifecycleStatus(r.status),
    description: str(r.descricao ?? r.description),
    startDate: str(r.data_inicio ?? r.start_date),
    endDate: str(r.data_fim ?? r.end_date),
    kpis,
    analyses,
    achieved:
      r.achieved === null
        ? null
        : typeof r.achieved === "boolean"
          ? r.achieved
          : undefined,
    achievedScore:
      typeof r.achieved_score === "number" ? r.achieved_score : undefined,
    raw: g,
  };
}

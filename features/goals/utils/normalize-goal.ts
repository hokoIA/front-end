import type {
  GoalAnalysisUi,
  GoalKpiUi,
  GoalLifecycleStatus,
  GoalOrigin,
  GoalPriority,
  GoalUiModel,
  KpiDirection,
} from "@/features/goals/types/ui";
import type { Goal } from "@/lib/types/goals";
import { record } from "./record";

function str(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

function nestedName(v: unknown): string | undefined {
  const inner = record(v);
  return str(inner?.name ?? inner?.nome);
}

export function mapLifecycleStatus(raw: unknown): GoalLifecycleStatus {
  const s = String(raw ?? "").toLowerCase();
  if (["draft", "rascunho", "draft_goal"].includes(s)) return "draft";
  if (["active", "ativa", "ativo", "em_andamento"].includes(s)) return "active";
  if (["monitoring", "acompanhamento", "em_acompanhamento"].includes(s)) {
    return "monitoring";
  }
  if (["attention", "atencao", "alerta", "risk"].includes(s)) return "attention";
  if (["completed", "concluida", "concluída", "done"].includes(s)) {
    return "completed";
  }
  if (["closed", "encerrada", "encerrado"].includes(s)) return "closed";
  if (["archived", "arquivada", "arquivado"].includes(s)) return "archived";
  return "unknown";
}

export function mapOrigin(raw: unknown): GoalOrigin {
  const s = String(raw ?? "").toLowerCase();
  if (["manual", "user"].includes(s)) return "manual";
  if (["ai", "ia", "suggested", "sugerida"].includes(s)) return "ai";
  if (["meeting", "reuniao", "reunião"].includes(s)) return "meeting";
  if (["prior_analysis", "analise_anterior", "analysis"].includes(s)) {
    return "prior_analysis";
  }
  return "unknown";
}

export function mapPriority(raw: unknown): GoalPriority {
  const s = String(raw ?? "").toLowerCase();
  if (["low", "baixa", "p3"].includes(s)) return "low";
  if (["medium", "media", "média", "p2"].includes(s)) return "medium";
  if (["high", "alta", "p1"].includes(s)) return "high";
  if (["critical", "critica", "crítica", "urgent"].includes(s)) return "critical";
  return "unknown";
}

function mapDirection(raw: unknown): KpiDirection {
  const s = String(raw ?? "").toLowerCase();
  if (["increase", "aumentar", "up", "grow"].includes(s)) return "increase";
  if (["decrease", "reduzir", "down", "reduce"].includes(s)) return "decrease";
  if (["maintain", "manter", "stable"].includes(s)) return "maintain";
  return "unknown";
}

function parseKpis(raw: unknown): GoalKpiUi[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row, i) => {
    const r =
      typeof row === "object" && row ? (row as Record<string, unknown>) : {};
    return {
      id: str(r.id) ?? `kpi-${i}`,
      name: str(r.name ?? r.nome ?? r.title ?? r.indicator) ?? `KPI ${i + 1}`,
      baseline: str(r.baseline ?? r.base ?? r.valor_inicial),
      target: str(r.target ?? r.meta ?? r.goal_value ?? r.alvo),
      unit: str(r.unit ?? r.unidade),
      direction: mapDirection(r.direction ?? r.direcao),
      note: str(r.note ?? r.observacao),
      progressPct:
        typeof r.progress === "number"
          ? r.progress
          : typeof r.progress_pct === "number"
            ? r.progress_pct
            : undefined,
    };
  });
}

function parseAnalyses(raw: unknown): GoalAnalysisUi[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row, i) => {
    const r =
      typeof row === "object" && row ? (row as Record<string, unknown>) : {};
    const typeRaw = String(r.type ?? r.tipo ?? "").toLowerCase();
    const type: GoalAnalysisUi["type"] =
      typeRaw === "final" || typeRaw === "analise_final" ? "final" : "partial";
    return {
      id: str(r.id) ?? `an-${i}`,
      generatedAt: str(
        r.generated_at ?? r.created_at ?? r.data_geracao ?? r.date,
      ),
      periodLabel: str(r.period ?? r.periodo ?? r.period_label),
      type,
      title: str(r.title ?? r.titulo),
      content: str(
        r.content ??
          r.body ??
          r.text ??
          r.markdown ??
          r.summary ??
          r.resumo,
      ),
      raw: row,
    };
  });
}

export function goalStableId(g: Goal, index: number): string {
  const id = str(g.id_goal ?? g.id);
  if (id) return id;
  return `goal-idx-${index}`;
}

export function normalizeGoal(g: Goal, index: number): GoalUiModel {
  const r = record(g) ?? {};
  const analyses =
    parseAnalyses(
      r.analyses ??
        r.analysis_history ??
        r.historico_analises ??
        r.analysis ??
        r.partial_analyses,
    ) || [];

  const kpis = parseKpis(r.kpis ?? r.kpi ?? r.key_results ?? r.resultados_chave);

  const progressRaw =
    typeof r.progress === "number"
      ? r.progress
      : typeof r.progress_pct === "number"
        ? r.progress_pct
        : typeof r.completion === "number"
          ? r.completion
          : undefined;

  return {
    id: goalStableId(g, index),
    customerId: str(
      r.id_customer ?? r.customer_id ?? r.id_cliente ?? r.cliente_id,
    ),
    customerName: str(
      r.customer_name ?? r.cliente_nome ?? r.nome_cliente ?? nestedName(r.customer),
    ),
    platform: str(
      r.platform ?? r.plataforma ?? r.channel ?? r.surface ?? r.rede,
    ),
    goalType: str(r.goal_type ?? r.tipo_meta ?? r.type),
    title: str(r.title ?? r.name ?? r.titulo ?? r.nome) ?? "Meta sem título",
    priority: mapPriority(r.priority ?? r.prioridade),
    origin: mapOrigin(r.origin ?? r.origem ?? r.source),
    status: mapLifecycleStatus(r.status ?? r.situacao),
    responsible: str(r.responsible ?? r.responsavel ?? r.owner),
    campaignLink: str(
      r.campaign_link ?? r.campanha ?? r.plano_vinculo ?? r.vinculo_campanha,
    ),
    description: str(r.description ?? r.descricao),
    smart: str(r.smart ?? r.smart_description ?? r.descricao_smart),
    rationale: str(r.rationale ?? r.justificativa),
    hypothesis: str(r.hypothesis ?? r.hipotese),
    expectedImpact: str(r.expected_impact ?? r.impacto_esperado),
    internalNotes: str(
      r.internal_notes ?? r.observacoes_internas ?? r.notas_internas,
    ),
    startDate: str(
      r.start_date ?? r.data_inicio ?? r.inicio ?? r.start ?? r.dt_inicio,
    ),
    endDate: str(r.end_date ?? r.data_fim ?? r.fim ?? r.end ?? r.dt_fim),
    durationWeeks:
      typeof r.duration_weeks === "number"
        ? r.duration_weeks
        : typeof r.duracao_semanas === "number"
          ? r.duracao_semanas
          : undefined,
    checkpointCadence: str(
      r.checkpoint_cadence ?? r.checkpoint ?? r.frequencia_checkpoint,
    ),
    kpis,
    analyses,
    progressApprox: progressRaw,
    raw: g,
  };
}

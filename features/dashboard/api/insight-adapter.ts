import type { AnalyzeRequestBody } from "@/lib/types/analyze";
import type { DashboardPeriodRange } from "@/features/dashboard/types";
import type { MetricBlockModel } from "@/features/dashboard/types";

/**
 * Monta payload para POST no backend de análise (contrato flexível).
 * O serviço real pode esperar campos adicionais — centralize ajustes aqui.
 */
export function buildPeriodInsightPayload(
  idCustomer: string,
  range: DashboardPeriodRange,
  snapshot: {
    reach: MetricBlockModel;
    impressions: MetricBlockModel;
    followers: MetricBlockModel;
    traffic: MetricBlockModel;
    search: MetricBlockModel;
    postsCount: number;
  },
): AnalyzeRequestBody {
  return {
    context: "dashboard_period_summary",
    id_customer: idCustomer,
    date_start: range.start,
    date_end: range.end,
    summary: {
      reach_total: snapshot.reach.total,
      impressions_total: snapshot.impressions.total,
      followers_total: snapshot.followers.total,
      traffic_total: snapshot.traffic.total,
      search_volume_total: snapshot.search.total,
      posts_in_period: snapshot.postsCount,
    },
    instruction:
      "Gere uma análise executiva curta (máx. 5 frases) em português: tendência do período, riscos, oportunidades e próximo passo sugerido. Tom B2B, sem hype.",
  };
}

export function buildBlockInsightPayload(
  idCustomer: string,
  range: DashboardPeriodRange,
  blockId:
    | "reach"
    | "impressions"
    | "followers"
    | "traffic"
    | "search"
    | "content",
  blockTitle: string,
  block: MetricBlockModel | null,
  hint?: string,
): AnalyzeRequestBody {
  return {
    context: "dashboard_block_insight",
    id_customer: idCustomer,
    date_start: range.start,
    date_end: range.end,
    block_id: blockId,
    block_title: blockTitle,
    series: block?.series ?? [],
    totals_by_platform: block?.byPlatform ?? {},
    total: block?.total,
    user_question:
      hint ??
      "Explique em 2–4 frases o que este bloco sugere sobre performance e o que o gestor deve observar. Português, tom profissional.",
  };
}

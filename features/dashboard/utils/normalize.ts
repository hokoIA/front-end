import type {
  ContentPostRow,
  MetricBlockModel,
  MetricSeriesPoint,
} from "@/features/dashboard/types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
  }
  return 0;
}

/** Extrai lista de pares nome/valor de respostas heterogêneas do backend */
export function extractSeries(data: unknown): MetricSeriesPoint[] {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data
      .map((row) => {
        if (!isRecord(row)) return null;
        const name = String(
          row.name ??
            row.label ??
            row.platform ??
            row.source ??
            row.channel ??
            "—",
        );
        const value = num(
          row.value ?? row.total ?? row.count ?? row.amount ?? row.y,
        );
        return { name, value };
      })
      .filter(Boolean) as MetricSeriesPoint[];
  }
  if (isRecord(data)) {
    if (Array.isArray(data.series)) return extractSeries(data.series);
    if (Array.isArray(data.data)) return extractSeries(data.data);
    if (Array.isArray(data.items)) return extractSeries(data.items);
    if (isRecord(data.by_platform) || isRecord(data.byPlatform)) {
      const bp = (data.by_platform ?? data.byPlatform) as Record<
        string,
        unknown
      >;
      return Object.entries(bp).map(([name, value]) => ({
        name,
        value: num(value),
      }));
    }
    const total = data.total ?? data.sum ?? data.value;
    if (total !== undefined) {
      return [{ name: "Total", value: num(total) }];
    }
  }
  return [];
}

export function extractByPlatform(data: unknown): Record<string, number> {
  const series = extractSeries(data);
  const out: Record<string, number> = {};
  for (const p of series) {
    out[p.name] = (out[p.name] ?? 0) + p.value;
  }
  return out;
}

export function extractTotal(data: unknown, series: MetricSeriesPoint[]): number {
  if (isRecord(data)) {
    const t = data.total ?? data.sum ?? data.grand_total;
    if (t !== undefined) return num(t);
  }
  return series.reduce((a, b) => a + b.value, 0);
}

export function normalizeMetricBlock(data: unknown): MetricBlockModel {
  const series = extractSeries(data);
  const byPlatform = extractByPlatform(data);
  const total = extractTotal(data, series);
  return {
    total,
    series: series.length ? series : Object.entries(byPlatform).map(([name, value]) => ({ name, value })),
    byPlatform,
    raw: data,
  };
}

function str(v: unknown): string {
  return v === undefined || v === null ? "" : String(v);
}

export function normalizePostsList(data: unknown): ContentPostRow[] {
  let list: unknown[] = [];
  if (Array.isArray(data)) list = data;
  else if (isRecord(data)) {
    if (Array.isArray(data.posts)) list = data.posts;
    else if (Array.isArray(data.data)) list = data.data;
    else if (Array.isArray(data.items)) list = data.items;
  }
  return list.map((row, i) => {
    const r = isRecord(row) ? row : {};
    const id = str(r.id ?? r.post_id ?? r.uuid ?? i);
    const date = str(
      r.date ?? r.created_at ?? r.published_at ?? r.timestamp ?? "",
    ).slice(0, 10);
    const title = str(
      r.title ?? r.message ?? r.caption ?? r.text ?? r.name ?? "Sem título",
    ).slice(0, 200);
    const platform = str(
      r.platform ?? r.channel ?? r.source ?? r.network ?? "—",
    );
    const type = str(r.type ?? r.media_type ?? r.format ?? "—");
    return {
      id,
      date,
      title,
      platform,
      type,
      likes: num(r.likes ?? r.like_count ?? r.reactions),
      comments: num(r.comments ?? r.comment_count),
      shares: num(r.shares ?? r.share_count),
      reach: num(r.reach ?? r.impressions ?? r.views),
      raw: isRecord(row) ? row : undefined,
    };
  });
}

export function scorePostEngagement(p: ContentPostRow): number {
  return p.likes + p.comments * 2 + p.shares * 3 + p.reach * 0.001;
}

export function pickTopPosts(posts: ContentPostRow[], n = 3): ContentPostRow[] {
  return [...posts]
    .sort((a, b) => scorePostEngagement(b) - scorePostEngagement(a))
    .slice(0, n);
}

export function blockHasNumericData(block: MetricBlockModel): boolean {
  if (block.total && block.total > 0) return true;
  return block.series.some((s) => s.value > 0);
}

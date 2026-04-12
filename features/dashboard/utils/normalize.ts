import type {
  AudienceSnapshotRow,
  ComparisonChartData,
  ContentPostRow,
  ContentSummaryTotals,
  DashboardMetricQueryFlags,
  DashboardPeriodSnapshot,
  DashboardPostsMeta,
  IntegrationPeriodCoverage,
  IntegrationSurface,
  MetricBlockModel,
  MetricSeriesPoint,
  SearchVisualization,
  TrafficVisualization,
} from "@/features/dashboard/types";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
  }
  return 0;
}

function str(v: unknown): string {
  return v === undefined || v === null ? "" : String(v);
}

function sumArray(arr: unknown[]): number {
  return arr.reduce<number>((acc, x) => acc + num(x), 0);
}

function emptyBlock(): MetricBlockModel {
  return { total: 0, series: [], byPlatform: {}, raw: undefined };
}

function record(data: unknown): Record<string, unknown> | null {
  return isRecord(data) ? data : null;
}

function dig(obj: unknown, path: string[]): unknown {
  let cur: unknown = obj;
  for (const p of path) {
    if (!isRecord(cur)) return undefined;
    cur = cur[p];
  }
  return cur;
}

function buildComparisonRows(
  labels: string[],
  keys: string[],
  arrays: Record<string, unknown[]>,
): Record<string, string | number>[] {
  const n = Math.max(labels.length, ...keys.map((k) => arrays[k]?.length ?? 0));
  const rows: Record<string, string | number>[] = [];
  for (let i = 0; i < n; i++) {
    const rawLabel = labels[i] ? labels[i] : "";
    const row: Record<string, string | number> = { rawLabel };
    for (const k of keys) {
      row[k] = num(arrays[k]?.[i]);
    }
    rows.push(row);
  }
  return rows;
}

/** Alcance: linhas por rede + totais. */
export function normalizeReachResponse(data: unknown): MetricBlockModel {
  const r = record(data);
  if (!r) return emptyBlock();
  const labels = Array.isArray(r.labels) ? r.labels.map((x) => str(x)) : [];
  const fb = Array.isArray(r.facebook) ? r.facebook : [];
  const ig = Array.isArray(r.instagram) ? r.instagram : [];
  const comparison: ComparisonChartData = {
    labels,
    rows: buildComparisonRows(labels, ["facebook", "instagram"], {
      facebook: fb,
      instagram: ig,
    }),
  };
  const n = Math.max(labels.length, fb.length, ig.length);
  const series: MetricSeriesPoint[] = [];
  for (let i = 0; i < n; i++) {
    const label = labels[i] ? labels[i] : `Ponto ${i + 1}`;
    series.push({ name: label, value: num(fb[i]) + num(ig[i]) });
  }
  const fbTotal = sumArray(fb);
  const igTotal = sumArray(ig);
  const byPlatform: Record<string, number> = {
    Facebook: fbTotal,
    Instagram: igTotal,
  };
  return {
    total: fbTotal + igTotal,
    series,
    byPlatform,
    comparison,
    raw: data,
  };
}

/** Impressões: linhas por rede (quando série existir). */
export function normalizeImpressionsResponse(data: unknown): MetricBlockModel {
  const r = record(data);
  if (!r) return emptyBlock();
  const labels = Array.isArray(r.labels) ? r.labels.map((x) => str(x)) : [];
  const keys = ["facebook", "instagram", "google", "linkedin"] as const;
  const arrays: Record<string, unknown[]> = {
    facebook: Array.isArray(r.facebook) ? r.facebook : [],
    instagram: Array.isArray(r.instagram) ? r.instagram : [],
    google: Array.isArray(r.google) ? r.google : [],
    linkedin: Array.isArray(r.linkedin) ? r.linkedin : [],
  };
  const comparison: ComparisonChartData = {
    labels,
    rows: buildComparisonRows(labels, [...keys], arrays),
  };
  const n = Math.max(labels.length, ...keys.map((k) => arrays[k].length));
  const series: MetricSeriesPoint[] = [];
  for (let i = 0; i < n; i++) {
    const label = labels[i] ? labels[i] : `Ponto ${i + 1}`;
    let v = 0;
    for (const k of keys) v += num(arrays[k][i]);
    series.push({ name: label, value: v });
  }
  const byPlatform: Record<string, number> = {
    Facebook: sumArray(arrays.facebook),
    Instagram: sumArray(arrays.instagram),
    "Google Analytics": sumArray(arrays.google),
    LinkedIn: sumArray(arrays.linkedin),
  };
  const total = Object.values(byPlatform).reduce((a, b) => a + b, 0);
  return { total, series, byPlatform, comparison, raw: data };
}

/** Seguidores: snapshot por plataforma (sem série temporal). */
export function normalizeFollowersResponse(data: unknown): MetricBlockModel {
  const r = record(data);
  if (!r) return emptyBlock();
  const byPlatform: Record<string, number> = {
    Facebook: num(r.facebook),
    Instagram: num(r.instagram),
    LinkedIn: num(r.linkedin),
    YouTube: num(r.youtube ?? r.Youtube ?? r.youTube),
  };
  const audienceSnapshot: AudienceSnapshotRow[] = [
    { platformKey: "facebook", label: "Facebook", value: byPlatform.Facebook },
    { platformKey: "instagram", label: "Instagram", value: byPlatform.Instagram },
    { platformKey: "linkedin", label: "LinkedIn", value: byPlatform.LinkedIn },
    { platformKey: "youtube", label: "YouTube", value: byPlatform.YouTube },
  ];
  const series: MetricSeriesPoint[] = audienceSnapshot.map((a) => ({
    name: a.label,
    value: a.value,
  }));
  const total = Object.values(byPlatform).reduce((a, b) => a + b, 0);
  return {
    total,
    series,
    byPlatform,
    audienceSnapshot,
    raw: data,
  };
}

const GA_SOURCE_PT: Record<string, string> = {
  Direct: "Direto",
  "Organic Search": "Busca orgânica",
  "Organic Social": "Social orgânico",
  Unassigned: "Não atribuído",
  Referral: "Referência",
  Email: "E-mail",
  "Paid Search": "Busca paga",
  Display: "Display",
  Social: "Social",
  Affiliates: "Afiliados",
  "Paid Social": "Social pago",
  Audio: "Áudio",
  SMS: "SMS",
};

function translateTrafficSource(key: string): string {
  return GA_SOURCE_PT[key] ?? key;
}

/** Tráfego: sessões (linha) + fontes (donut / lista). */
export function normalizeTrafficResponse(data: unknown): MetricBlockModel {
  const r = record(data);
  if (!r) return emptyBlock();
  const labels = Array.isArray(r.labels) ? r.labels.map((x) => str(x)) : [];
  const sessions = Array.isArray(r.sessions) ? r.sessions : [];
  const series: MetricSeriesPoint[] = [];
  const n = Math.max(labels.length, sessions.length);
  for (let i = 0; i < n; i++) {
    const label = labels[i] ? labels[i] : `Ponto ${i + 1}`;
    series.push({ name: label, value: num(sessions[i]) });
  }
  const sessionsTotal = sumArray(sessions);

  const sourcesRaw = r.sources;
  const sources: { key: string; labelPt: string; value: number }[] = [];
  if (isRecord(sourcesRaw)) {
    for (const [k, v] of Object.entries(sourcesRaw)) {
      if (typeof v === "number" || typeof v === "string") {
        const val = num(v);
        if (val > 0) {
          sources.push({
            key: k,
            labelPt: translateTrafficSource(k),
            value: val,
          });
        }
      }
    }
  }
  sources.sort((a, b) => b.value - a.value);

  const trafficViz: TrafficVisualization = {
    labels,
    sessionValues: sessions.map((x) => num(x)),
    sources,
  };

  const byPlatform: Record<string, number> = {
    "Sessões (site)": sessionsTotal,
  };
  for (const s of sources) {
    byPlatform[s.labelPt] = s.value;
  }

  return {
    total: sessionsTotal,
    series,
    byPlatform,
    trafficViz,
    raw: data,
  };
}

/** Busca / orgânico: série principal + cartões + leads/dia. */
export function normalizeSearchVolumeResponse(data: unknown): MetricBlockModel {
  const r = record(data);
  if (!r) return emptyBlock();
  const labels = Array.isArray(r.labels) ? r.labels.map((x) => str(x)) : [];
  const organic = Array.isArray(r.organicSessions) ? r.organicSessions : [];
  const leadsPerDay = Array.isArray(r.newLeadsPerDay) ? r.newLeadsPerDay : [];
  const n = Math.max(labels.length, organic.length);
  const series: MetricSeriesPoint[] = [];
  for (let i = 0; i < n; i++) {
    const label = labels[i] ? labels[i] : `Ponto ${i + 1}`;
    series.push({ name: label, value: num(organic[i]) });
  }
  const organicSum = sumArray(organic);
  const totalOrganicSearch = num(r.totalOrganicSearch);
  const totalOtherSources = num(r.totalOtherSources);
  const totalNewLeads = num(r.totalNewLeads);
  const days = num(r.days);

  const searchViz: SearchVisualization = {
    labels,
    organicValues: organic.map((x) => num(x)),
    totalOrganicSearch,
    totalOtherSources,
    totalNewLeads,
    days,
    newLeadsPerDay: leadsPerDay.map((x) => num(x)),
  };

  const byPlatform: Record<string, number> = {
    "Sessões orgânicas (série)": organicSum,
    "Total orgânico (busca)": totalOrganicSearch,
    Outras: totalOtherSources,
    "Novos leads": totalNewLeads,
    Dias: days,
  };

  const total =
    totalOrganicSearch > 0 ? totalOrganicSearch : organicSum;

  return {
    total,
    series,
    byPlatform,
    searchViz,
    raw: data,
  };
}

export type NormalizedPostsResult = {
  rows: ContentPostRow[];
  meta: DashboardPostsMeta;
};

function extractPostDate(p: Record<string, unknown>): string {
  const ts = p.created_time ?? p.timestamp;
  if (typeof ts === "number") {
    return new Date(ts > 1e12 ? ts : ts * 1000).toISOString().slice(0, 10);
  }
  const s = str(ts);
  if (/^\d{10,13}$/.test(s)) {
    const n = Number(s);
    return new Date(n > 1e12 ? n : n * 1000).toISOString().slice(0, 10);
  }
  return s.length >= 10 ? s.slice(0, 10) : "";
}

function mapFacebookPost(p: Record<string, unknown>, i: number): ContentPostRow {
  const likes = num(dig(p, ["reactions", "summary", "total_count"]));
  const comments = num(dig(p, ["comments", "summary", "total_count"]));
  const shares = num(dig(p, ["shares", "count"]));
  const date = extractPostDate(p);
  const message = str(p.message ?? "");
  return {
    id: str(p.id ?? `facebook-${i}`),
    date,
    title: message.slice(0, 280) || "(sem texto)",
    platform: "facebook",
    type: "feed",
    likes,
    comments,
    shares,
    reach: 0,
    permalink: str(p.permalink_url ?? "") || null,
    coverImage: str(p.full_picture ?? "") || null,
    engagement: likes + comments + shares,
    raw: p,
  };
}

function mapInstagramPost(p: Record<string, unknown>, i: number): ContentPostRow {
  const likes = num(p.like_count);
  const comments = num(p.comments_count);
  const date = extractPostDate(p);
  const message = str(p.message ?? "");
  const mediaType = str(p.media_type ?? "—");
  return {
    id: str(p.id ?? `instagram-${i}`),
    date,
    title: message.slice(0, 280) || "(sem texto)",
    platform: "instagram",
    type: mediaType.toLowerCase(),
    likes,
    comments,
    shares: 0,
    reach: 0,
    permalink: str(p.permalink_url ?? "") || null,
    coverImage: str(p.full_picture ?? "") || null,
    engagement: likes + comments,
    raw: p,
  };
}

/**
 * Conteúdos: formato real `/api/contents/posts` com totais + facebook[] + instagram[].
 */
export function normalizePostsResponse(data: unknown): NormalizedPostsResult {
  const emptyMeta = (summary: ContentSummaryTotals | null): DashboardPostsMeta => ({
    presentation: "empty",
    note: null,
    summary,
  });

  if (!data) {
    return { rows: [], meta: emptyMeta(null) };
  }

  if (Array.isArray(data)) {
    const rows = data.map((row, i) =>
      mapLegacyRow(isRecord(row) ? row : {}, i),
    );
    const summary: ContentSummaryTotals = {
      amountContents: rows.length,
      totalEngagement: rows.reduce((a, p) => a + (p.engagement ?? 0), 0),
      totalLikes: rows.reduce((a, p) => a + p.likes, 0),
      totalComments: rows.reduce((a, p) => a + p.comments, 0),
    };
    return {
      rows,
      meta: {
        presentation: rows.length ? "rows" : "empty",
        note: null,
        summary,
      },
    };
  }

  const r = record(data);
  if (!r) {
    return { rows: [], meta: emptyMeta(null) };
  }

  const amountContents = num(r.amountContents);
  const totalEngagement = num(r.totalEngagement);
  const totalLikes = num(r.totalLikes);
  const totalComments = num(r.totalComments);

  const summary: ContentSummaryTotals = {
    amountContents,
    totalEngagement,
    totalLikes,
    totalComments,
  };

  const fbArr = Array.isArray(r.facebook) ? r.facebook : [];
  const igArr = Array.isArray(r.instagram) ? r.instagram : [];

  const rows: ContentPostRow[] = [
    ...fbArr.map((item, i) =>
      mapFacebookPost(isRecord(item) ? item : {}, i),
    ),
    ...igArr.map((item, i) =>
      mapInstagramPost(isRecord(item) ? item : {}, i),
    ),
  ];

  const noPosts =
    rows.length === 0 &&
    fbArr.length === 0 &&
    igArr.length === 0 &&
    amountContents === 0;

  return {
    rows,
    meta: {
      presentation: noPosts ? "empty" : "rows",
      note: null,
      summary,
    },
  };
}

function mapLegacyRow(r: Record<string, unknown>, i: number): ContentPostRow {
  const base = rowFromRecord(r, i);
  return {
    ...base,
    engagement:
      base.likes + base.comments * 2 + base.shares * 3 + base.reach * 0.001,
  };
}

function rowFromRecord(r: Record<string, unknown>, i: number): ContentPostRow {
  const id = str(r.id ?? r.post_id ?? r.uuid ?? `row-${i}`);
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
    permalink: str(r.permalink_url ?? r.permalink ?? "") || null,
    coverImage: str(r.full_picture ?? r.coverImage ?? "") || null,
    raw: r,
  };
}

export function blockHasNumericData(block: MetricBlockModel): boolean {
  if (block.total !== undefined && block.total > 0) return true;
  if (block.comparison?.rows.some((row) =>
    Object.entries(row).some(
      ([k, v]) => k !== "rawLabel" && num(v) > 0,
    ),
  )) {
    return true;
  }
  if (block.audienceSnapshot?.some((a) => a.value > 0)) return true;
  if (block.trafficViz?.sessionValues.some((v) => v > 0)) return true;
  if (block.searchViz?.organicValues.some((v) => v > 0)) return true;
  return (
    block.series.some((s) => s.value > 0) ||
    Object.values(block.byPlatform).some((v) => v > 0)
  );
}

function platformLabelMatch(
  byPlatform: Record<string, number>,
  labels: string[],
): boolean {
  return labels.some((label) => (byPlatform[label] ?? 0) > 0);
}

function postMatchesPlatform(row: ContentPostRow, needles: string[]): boolean {
  const p = row.platform.toLowerCase();
  return needles.some(
    (n) => p === n || p.includes(n) || p.replace(/\s/g, "_").includes(n),
  );
}

function surfaceHasPositiveSignal(
  snapshot: DashboardPeriodSnapshot,
  surface: IntegrationSurface,
): boolean {
  const summary = snapshot.postsMeta.summary;
  const hasSummaryContents =
    summary !== null && summary.amountContents > 0;

  switch (surface) {
    case "facebook":
      return (
        platformLabelMatch(snapshot.reach.byPlatform, ["Facebook"]) ||
        platformLabelMatch(snapshot.impressions.byPlatform, ["Facebook"]) ||
        platformLabelMatch(snapshot.followers.byPlatform, ["Facebook"]) ||
        snapshot.posts.some((p) => postMatchesPlatform(p, ["facebook", "fb"])) ||
        (hasSummaryContents && snapshot.posts.some((p) => p.platform === "facebook"))
      );
    case "instagram":
      return (
        platformLabelMatch(snapshot.reach.byPlatform, ["Instagram"]) ||
        platformLabelMatch(snapshot.impressions.byPlatform, ["Instagram"]) ||
        platformLabelMatch(snapshot.followers.byPlatform, ["Instagram"]) ||
        snapshot.posts.some((p) =>
          postMatchesPlatform(p, ["instagram", "ig"]),
        ) ||
        (hasSummaryContents && snapshot.posts.some((p) => p.platform === "instagram"))
      );
    case "google_analytics":
      return (
        platformLabelMatch(snapshot.impressions.byPlatform, [
          "Google Analytics",
        ]) ||
        blockHasNumericData(snapshot.traffic) ||
        blockHasNumericData(snapshot.search) ||
        snapshot.posts.some((p) =>
          postMatchesPlatform(p, ["google", "ga4", "analytics"]),
        )
      );
    case "youtube":
      return (
        platformLabelMatch(snapshot.followers.byPlatform, ["YouTube"]) ||
        platformLabelMatch(snapshot.impressions.byPlatform, ["YouTube"]) ||
        snapshot.posts.some((p) => postMatchesPlatform(p, ["youtube", "yt"]))
      );
    case "linkedin":
      return (
        platformLabelMatch(snapshot.impressions.byPlatform, ["LinkedIn"]) ||
        platformLabelMatch(snapshot.followers.byPlatform, ["LinkedIn"]) ||
        snapshot.posts.some((p) => postMatchesPlatform(p, ["linkedin"]))
      );
    default:
      return false;
  }
}

const RELEVANT_QUERIES: Record<
  IntegrationSurface,
  (keyof DashboardMetricQueryFlags)[]
> = {
  facebook: ["reach", "impressions", "followers", "posts"],
  instagram: ["reach", "impressions", "followers", "posts"],
  google_analytics: ["impressions", "traffic", "search", "posts"],
  youtube: ["followers", "impressions", "posts"],
  linkedin: ["impressions", "followers", "posts"],
};

function coverageForSurface(
  snapshot: DashboardPeriodSnapshot,
  surface: IntegrationSurface,
): IntegrationPeriodCoverage {
  if (surfaceHasPositiveSignal(snapshot, surface)) return "has_data";
  const keys = RELEVANT_QUERIES[surface];
  const qe = snapshot.queryErrors;
  const allFailed = keys.every((k) => qe[k]);
  if (allFailed) return "unknown";
  const anySuccess = keys.some((k) => !qe[k]);
  if (!anySuccess) return "unknown";
  return "no_data";
}

export function computePlatformPeriodCoverage(
  snapshot: DashboardPeriodSnapshot | null,
): Record<IntegrationSurface, IntegrationPeriodCoverage> {
  const surfaces: IntegrationSurface[] = [
    "facebook",
    "instagram",
    "google_analytics",
    "youtube",
    "linkedin",
  ];
  const base = Object.fromEntries(
    surfaces.map((s) => [s, "unknown" as IntegrationPeriodCoverage]),
  ) as Record<IntegrationSurface, IntegrationPeriodCoverage>;

  if (!snapshot) return base;

  for (const s of surfaces) {
    base[s] = coverageForSurface(snapshot, s);
  }

  return base;
}

export function scorePostEngagement(p: ContentPostRow): number {
  if (p.engagement !== undefined && p.engagement > 0) return p.engagement;
  return p.likes + p.comments * 2 + p.shares * 3 + p.reach * 0.001;
}

export function pickTopPosts(posts: ContentPostRow[], n = 3): ContentPostRow[] {
  return [...posts]
    .sort((a, b) => scorePostEngagement(b) - scorePostEngagement(a))
    .slice(0, n);
}

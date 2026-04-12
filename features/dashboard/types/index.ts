/** Período analítico carregado pelo usuário */
export type DashboardPeriodRange = {
  start: string;
  end: string;
};

/** Séries para gráficos (legado / insights) */
export type MetricSeriesPoint = {
  name: string;
  value: number;
};

/** Linhas comparativas (alcance / impressões) — uma linha por plataforma. */
export type ComparisonChartData = {
  labels: string[];
  rows: Record<string, string | number>[];
};

/** Snapshot por plataforma (seguidores — sem série temporal real). */
export type AudienceSnapshotRow = {
  platformKey: string;
  label: string;
  value: number;
};

/** Tráfego: sessões + fontes. */
export type TrafficVisualization = {
  labels: string[];
  sessionValues: number[];
  sources: { key: string; labelPt: string; value: number }[];
};

/** Busca / orgânico: série + cartões + leads. */
export type SearchVisualization = {
  labels: string[];
  organicValues: number[];
  totalOrganicSearch: number;
  totalOtherSources: number;
  totalNewLeads: number;
  days: number;
  newLeadsPerDay: number[];
};

export type MetricBlockModel = {
  total?: number;
  series: MetricSeriesPoint[];
  byPlatform: Record<string, number>;
  raw?: unknown;
  /** Alcance / impressões — linhas multi-série. */
  comparison?: ComparisonChartData;
  /** Seguidores — leitura principal por plataforma. */
  audienceSnapshot?: AudienceSnapshotRow[];
  trafficViz?: TrafficVisualization;
  searchViz?: SearchVisualization;
};

export type ContentPostRow = {
  id: string;
  date: string;
  title: string;
  platform: string;
  type: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  permalink?: string | null;
  coverImage?: string | null;
  engagement?: number;
  raw?: Record<string, unknown>;
};

export type ContentSummaryTotals = {
  amountContents: number;
  totalEngagement: number;
  totalLikes: number;
  totalComments: number;
};

export type IntegrationSurface =
  | "facebook"
  | "instagram"
  | "google_analytics"
  | "youtube"
  | "linkedin";

export type IntegrationOperationalState =
  | "connected"
  | "disconnected"
  | "needs_renewal"
  | "unknown";

export type IntegrationPeriodCoverage = "unknown" | "has_data" | "no_data";

export type IntegrationCardModel = {
  surface: IntegrationSurface;
  label: string;
  operational: IntegrationOperationalState;
  periodCoverage: IntegrationPeriodCoverage;
};

export type DashboardPostsMeta = {
  presentation: "rows" | "empty";
  note: string | null;
  summary: ContentSummaryTotals | null;
};

/** `true` = a query desse indicador falhou (HttpError, etc.). */
export type DashboardMetricQueryFlags = {
  reach: boolean;
  impressions: boolean;
  followers: boolean;
  traffic: boolean;
  search: boolean;
  posts: boolean;
};

export type DashboardPeriodSnapshot = {
  reach: MetricBlockModel;
  impressions: MetricBlockModel;
  followers: MetricBlockModel;
  traffic: MetricBlockModel;
  search: MetricBlockModel;
  posts: ContentPostRow[];
  postsMeta: DashboardPostsMeta;
  queryErrors: DashboardMetricQueryFlags;
  raw: {
    reach: unknown;
    impressions: unknown;
    followers: unknown;
    traffic: unknown;
    search: unknown;
    posts: unknown;
  };
};

/** Período analítico carregado pelo usuário */
export type DashboardPeriodRange = {
  start: string;
  end: string;
};

/** Séries para gráficos (comparação por plataforma / tempo) */
export type MetricSeriesPoint = {
  name: string;
  value: number;
};

export type MetricBlockModel = {
  total?: number;
  series: MetricSeriesPoint[];
  byPlatform: Record<string, number>;
  raw?: unknown;
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
  raw?: Record<string, unknown>;
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

export type DashboardPeriodSnapshot = {
  reach: MetricBlockModel;
  impressions: MetricBlockModel;
  followers: MetricBlockModel;
  traffic: MetricBlockModel;
  search: MetricBlockModel;
  posts: ContentPostRow[];
  raw: {
    reach: unknown;
    impressions: unknown;
    followers: unknown;
    traffic: unknown;
    search: unknown;
    posts: unknown;
  };
};

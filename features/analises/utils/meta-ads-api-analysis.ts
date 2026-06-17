import type { MetaAdsPipelineDiagnostics } from "@/features/analises/types";
import { postMetaAdsInsights } from "@/lib/api/dashboard";

type Params = {
  idCustomer: string;
  startDate: string;
  endDate: string;
};

type MetaAdsExternalDataResult = {
  externalData: Record<string, unknown>;
  diagnostics: MetaAdsPipelineDiagnostics;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function countRows(source: Record<string, unknown>, key: string): number {
  const rows = source[key];
  return Array.isArray(rows) ? rows.length : 0;
}

function getResourceName(source: Record<string, unknown>): string | undefined {
  const resource = asRecord(source.resource);
  const name = resource.name;
  return typeof name === "string" && name.trim() ? name : undefined;
}

function getFetchedAt(source: Record<string, unknown>): string | undefined {
  const fetchedAt = source.fetchedAt;
  return typeof fetchedAt === "string" ? fetchedAt : undefined;
}

export async function fetchMetaAdsAnalysisExternalData({
  idCustomer,
  startDate,
  endDate,
}: Params): Promise<MetaAdsExternalDataResult> {
  const startedAt = Date.now();
  const response = await postMetaAdsInsights({
    id_customer: idCustomer,
    startDate,
    endDate,
  });
  const metaAdsApiMs = Date.now() - startedAt;
  const source = asRecord(response);

  const diagnostics: MetaAdsPipelineDiagnostics = {
    sourceMode: "api_gateway_direct",
    metaAdsApiMs,
    rowCounts: {
      campaign: countRows(source, "campaign"),
      adSet: countRows(source, "adSet"),
      ad: countRows(source, "ad"),
    },
    resourceName: getResourceName(source),
    fetchedAt: getFetchedAt(source),
  };

  return {
    diagnostics,
    externalData: {
      source: "api_gateway",
      source_mode: diagnostics.sourceMode,
      fetched_at: new Date().toISOString(),
      timings_ms: {
        meta_ads_api: metaAdsApiMs,
      },
      meta_ads: response,
    },
  };
}

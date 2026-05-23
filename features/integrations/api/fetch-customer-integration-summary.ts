import type { IntegrationOperationalState } from "@/features/dashboard/types";
import type { IntegrationSurface } from "@/features/dashboard/types";
import type {
  CustomerIntegrationSummary,
  SurfaceOperationalMap,
} from "@/features/integrations/types/customer-summary";
import {
  parseGenericOperational,
  parseLinkedinOperational,
  parseMetaOperational,
} from "@/features/integrations/utils/parse-integration-apis";
import { computeCustomerReadiness } from "@/features/customers/utils/compute-readiness";
import {
  getGoogleAnalyticsStatus,
  getLinkedinOrganizations,
  getMetaStatus,
  getYoutubeStatus,
} from "@/lib/api/customers";

const SURFACES: IntegrationSurface[] = [
  "facebook",
  "instagram",
  "google_analytics",
  "youtube",
  "linkedin",
];

function countBy(
  map: Record<IntegrationSurface, IntegrationOperationalState>,
  pred: (op: IntegrationOperationalState) => boolean,
): number {
  return SURFACES.filter((s) => pred(map[s])).length;
}

function settledValue<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === "fulfilled" ? result.value : null;
}

function record(data: unknown): Record<string, unknown> | null {
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }

  return null;
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function extractMetaResources(meta: unknown) {
  const r = record(meta);

  return {
    facebook: {
      id: stringOrNull(r?.facebookResourceId ?? r?.facebook_resource_id),
      name: stringOrNull(r?.facebookResourceName ?? r?.facebook_resource_name),
    },
    instagram: {
      id: stringOrNull(r?.instagramResourceId ?? r?.instagram_resource_id),
      name: stringOrNull(r?.instagramResourceName ?? r?.instagram_resource_name),
    },
  };
}

/**
 * Cada plataforma precisa ser avaliada de forma independente.
 * Se LinkedIn/GA/YouTube falhar, isso não pode derrubar o status Meta já autorizado.
 */
export async function fetchCustomerIntegrationSummary(
  customerId: string,
): Promise<CustomerIntegrationSummary> {
  const [metaResult, gaResult, ytResult, liResult] = await Promise.allSettled([
    getMetaStatus(customerId),
    getGoogleAnalyticsStatus(customerId),
    getYoutubeStatus(customerId),
    getLinkedinOrganizations(customerId),
  ]);

  const meta = settledValue(metaResult);
  const ga = settledValue(gaResult);
  const yt = settledValue(ytResult);
  const li = settledValue(liResult);
  const linkedinSuccess = liResult.status === "fulfilled";

  const surfaces: SurfaceOperationalMap = {
    facebook: parseMetaOperational(meta, "facebook"),
    instagram: parseMetaOperational(meta, "instagram"),
    google_analytics: parseGenericOperational(ga),
    youtube: parseGenericOperational(yt),
    linkedin: parseLinkedinOperational(li, linkedinSuccess),
  };
  const resources = extractMetaResources(meta);

  const connectedCount = countBy(surfaces, (op) => op === "connected");
  const authorizedCount = countBy(surfaces, (op) => op === "authorized");
  const disconnectedCount = countBy(surfaces, (op) => op === "disconnected");
  const unknownCount = countBy(surfaces, (op) => op === "unknown");
  const renewalCount = countBy(surfaces, (op) => op === "needs_renewal");
  const readiness = computeCustomerReadiness({
    connectedCount,
    renewalCount,
    unknownCount,
  });
  const hasAttention = renewalCount > 0;

  return {
    customerId,
    surfaces,
    resources,
    connectedCount,
    authorizedCount,
    disconnectedCount,
    unknownCount,
    renewalCount,
    readiness,
    hasAttention,
    
  };
}

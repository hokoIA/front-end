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

export async function fetchCustomerIntegrationSummary(
  customerId: string,
): Promise<CustomerIntegrationSummary> {
  const [meta, ga, yt, li] = await Promise.all([
    getMetaStatus(customerId),
    getGoogleAnalyticsStatus(customerId),
    getYoutubeStatus(customerId),
    getLinkedinOrganizations(customerId),
  ]);

  const linkedinSuccess = true;

  const surfaces: SurfaceOperationalMap = {
    facebook: parseMetaOperational(meta, "facebook"),
    instagram: parseMetaOperational(meta, "instagram"),
    google_analytics: parseGenericOperational(ga),
    youtube: parseGenericOperational(yt),
    linkedin: parseLinkedinOperational(li, linkedinSuccess),
  };

  const connectedCount = countBy(surfaces, (op) => op === "connected");
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
    connectedCount,
    disconnectedCount,
    unknownCount,
    renewalCount,
    readiness,
    hasAttention,
  };
}

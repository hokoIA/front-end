import type { IntegrationOperationalState } from "@/features/dashboard/types";

function record(data: unknown): Record<string, unknown> | null {
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
}

export function parseMetaOperational(
  data: unknown,
  surface: "facebook" | "instagram",
): IntegrationOperationalState {
  const r = record(data);
  if (!r) return "unknown";
  const fb =
    r.facebook_connected === true ||
    r.fb_connected === true ||
    (Array.isArray(r.pages) && r.pages.length > 0);
  const ig =
    r.instagram_connected === true ||
    r.ig_connected === true ||
    (Array.isArray(r.instagram_accounts) && r.instagram_accounts.length > 0);
  const renewal =
    r.requires_reauth === true ||
    r.needs_renewal === true ||
    r.token_expired === true;
  if (renewal) return "needs_renewal";
  if (surface === "facebook") return fb ? "connected" : "disconnected";
  return ig ? "connected" : "disconnected";
}

export function linkedinListLen(data: unknown): number {
  if (Array.isArray(data)) return data.length;
  const r = record(data);
  if (r && Array.isArray(r.data)) return r.data.length;
  if (r && Array.isArray(r.organizations)) return r.organizations.length;
  return 0;
}

export function parseLinkedinOperational(
  data: unknown,
  isSuccess: boolean,
): IntegrationOperationalState {
  const n = linkedinListLen(data);
  if (n > 0) return "connected";
  if (isSuccess && n === 0) return "disconnected";
  return parseGenericOperational(data);
}

export function parseGenericOperational(
  data: unknown,
): IntegrationOperationalState {
  const r = record(data);
  if (!r) return "unknown";
  const connected =
    r.connected === true ||
    r.status === "connected" ||
    r.active === true ||
    r.linked === true;
  const disc =
    r.connected === false ||
    r.status === "disconnected" ||
    r.active === false;
  const renewal =
    r.requires_reauth === true ||
    r.needs_renewal === true ||
    r.token_expired === true;
  if (renewal) return "needs_renewal";
  if (connected) return "connected";
  if (disc) return "disconnected";
  return "unknown";
}

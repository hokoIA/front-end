import type { IntegrationOperationalState } from "@/features/dashboard/types";

/** Rótulos de produto para badges (mapeados a partir do estado operacional + cobertura). */
export type PlatformUiStatusKey =
  | "connected"
  | "disconnected"
  | "unauthorized"
  | "awaiting_auth"
  | "expiring"
  | "needs_renewal"
  | "no_data"
  | "error"
  | "unknown";

export function mapOperationalToUiKey(
  op: IntegrationOperationalState,
  periodCoverage?: "unknown" | "has_data" | "no_data",
): PlatformUiStatusKey {
  if (op === "needs_renewal") return "needs_renewal";
  if (op === "connected") {
    if (periodCoverage === "no_data") return "no_data";
    return "connected";
  }
  if (op === "disconnected") return "disconnected";
  return "unknown";
}

import type { CustomerReadiness } from "@/features/customers/types/readiness";

export function computeCustomerReadiness(input: {
  connectedCount: number;
  renewalCount: number;
  unknownCount: number;
  totalCount?: number;
}): CustomerReadiness {
  const { connectedCount, renewalCount, unknownCount, totalCount = 5 } = input;
  if (renewalCount > 0) return "attention";
  if (connectedCount === 0) return "incomplete";
  if (connectedCount === totalCount && unknownCount === 0) return "ready";
  if (connectedCount > 0 && connectedCount < totalCount) return "partial";
  return "partial";
}

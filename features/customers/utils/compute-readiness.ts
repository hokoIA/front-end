import type { CustomerReadiness } from "@/features/customers/types/readiness";

export function computeCustomerReadiness(input: {
  connectedCount: number;
  renewalCount: number;
  unknownCount: number;
}): CustomerReadiness {
  const { connectedCount, renewalCount, unknownCount } = input;
  const total = 5;
  if (renewalCount > 0) return "attention";
  if (connectedCount === 0) return "incomplete";
  if (connectedCount === total && unknownCount === 0) return "ready";
  if (connectedCount > 0 && connectedCount < total) return "partial";
  return "partial";
}

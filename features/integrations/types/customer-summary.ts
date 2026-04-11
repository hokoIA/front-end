import type { IntegrationOperationalState } from "@/features/dashboard/types";
import type { IntegrationSurface } from "@/features/dashboard/types";
import type { CustomerReadiness } from "@/features/customers/types/readiness";

export type SurfaceOperationalMap = Record<
  IntegrationSurface,
  IntegrationOperationalState
>;

/** Resumo agregado por cliente para listagem e overview (sem expor contrato bruto da API). */
export type CustomerIntegrationSummary = {
  customerId: string;
  surfaces: SurfaceOperationalMap;
  connectedCount: number;
  disconnectedCount: number;
  unknownCount: number;
  renewalCount: number;
  readiness: CustomerReadiness;
  hasAttention: boolean;
};

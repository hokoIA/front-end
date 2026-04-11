import type { Customer } from "@/lib/types/customer";
import type { CustomerIntegrationSummary } from "@/features/integrations/types/customer-summary";
import type { CustomerReadiness } from "./readiness";

/** Cliente fictício para testes de UI / story (não misturar em produção). */
export const MOCK_CUSTOMER_ROW: Customer = {
  id_customer: "mock-1",
  name: "Cliente Exemplo",
  empresa: "Marca Demo",
  email: "contato@demo.com",
  telefone: "+55 11 90000-0000",
  status: "active",
};

/** Resumo de integrações fictício alinhado ao tipo de produção. */
export function mockIntegrationSummary(
  customerId: string,
  overrides?: Partial<CustomerIntegrationSummary>,
): CustomerIntegrationSummary {
  const base: CustomerIntegrationSummary = {
    customerId,
    surfaces: {
      facebook: "connected",
      instagram: "disconnected",
      google_analytics: "unknown",
      youtube: "needs_renewal",
      linkedin: "disconnected",
    },
    connectedCount: 2,
    disconnectedCount: 2,
    unknownCount: 1,
    renewalCount: 1,
    readiness: "attention",
    hasAttention: true,
  };
  return { ...base, ...overrides };
}

export const MOCK_READINESS: Record<string, CustomerReadiness> = {
  novo: "incomplete",
  parcial: "partial",
  ok: "ready",
  alerta: "attention",
};

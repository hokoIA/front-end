import type { BillingDisplayModel } from "../types/display";

/** Exemplo tipado para testes ou story — não usado em runtime. */
export const MOCK_BILLING_DISPLAY: BillingDisplayModel = {
  status: "active",
  statusLabel: "Ativa",
  planLabel: "Plano ho.ko — base + clientes",
  usage: {
    activeClients: 5,
    includedSlots: 3,
    excessClients: 2,
    baseMonthlyBrl: 299,
    extrasMonthlyBrl: 100,
    totalMonthlyBrl: 399,
  },
  currentPeriodStart: "2025-04-01T00:00:00.000Z",
  currentPeriodEnd: "2025-05-01T00:00:00.000Z",
  cancelAtPeriodEnd: false,
  paymentSummary: null,
};

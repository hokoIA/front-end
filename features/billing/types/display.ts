import type { BillingSubscriptionStatus } from "@/lib/types/billing";

export type BillingUsageBreakdown = {
  activeClients: number;
  includedSlots: number;
  excessClients: number;
  baseMonthlyBrl: number;
  extrasMonthlyBrl: number;
  totalMonthlyBrl: number;
};

export type BillingDisplayModel = {
  status: BillingSubscriptionStatus | "none" | "unknown";
  statusLabel: string;
  planLabel: string;
  usage: BillingUsageBreakdown;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  /** Resumo textual para histórico / notas da API */
  paymentSummary: string | null;
};

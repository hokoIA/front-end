import type { BillingMeResponse } from "@/lib/types/billing";
import {
  HK_BASE_PLAN_MONTHLY_BRL,
  HK_EXTRA_CLIENT_MONTHLY_BRL,
  HK_INCLUDED_CLIENTS,
} from "../constants/pricing";
import type { BillingDisplayModel } from "../types/display";

function record(data: unknown): Record<string, unknown> | null {
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
}

function num(v: unknown): number | undefined {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v : undefined;
}

function bool(v: unknown): boolean {
  return v === true;
}

/** Extrai contagem de clientes ativos preferindo campos da API, senão lista local. */
export function resolveActiveClientCount(
  billing: BillingMeResponse | undefined,
  listCount: number,
): number {
  const r = record(billing);
  if (!r) return listCount;
  const keys = [
    "active_client_count",
    "active_clients",
    "client_count",
    "clients_count",
    "seats_used",
    "used_seats",
  ];
  for (const k of keys) {
    const n = num(r[k]);
    if (n !== undefined && n >= 0) return Math.floor(n);
  }
  return listCount;
}

export function computeUsageBreakdown(activeClients: number): {
  includedSlots: number;
  excessClients: number;
  baseMonthlyBrl: number;
  extrasMonthlyBrl: number;
  totalMonthlyBrl: number;
} {
  const includedSlots = HK_INCLUDED_CLIENTS;
  const excessClients = Math.max(0, activeClients - includedSlots);
  const baseMonthlyBrl = HK_BASE_PLAN_MONTHLY_BRL;
  const extrasMonthlyBrl = excessClients * HK_EXTRA_CLIENT_MONTHLY_BRL;
  return {
    includedSlots,
    excessClients,
    baseMonthlyBrl,
    extrasMonthlyBrl,
    totalMonthlyBrl: baseMonthlyBrl + extrasMonthlyBrl,
  };
}

const STATUS_LABELS: Record<string, string> = {
  active: "Ativa",
  trialing: "Período de teste",
  past_due: "Pagamento em atraso",
  canceled: "Cancelada",
  cancelled: "Cancelada",
  unpaid: "Não paga",
  incomplete: "Incompleta",
  incomplete_expired: "Incompleta expirada",
  paused: "Pausada",
  none: "Sem assinatura ativa",
  unknown: "Status em análise",
};

export function buildBillingDisplay(
  billing: BillingMeResponse | undefined,
  listCustomerCount: number,
): BillingDisplayModel {
  const r = record(billing);
  const sub = record(r?.subscription);
  const statusRaw =
    str(sub?.status) ??
    str(sub?.subscription_status) ??
    str(r?.status) ??
    "unknown";
  const normalized =
    statusRaw === "none" || !billing
      ? "none"
      : (statusRaw as BillingDisplayModel["status"]);

  const activeClients = resolveActiveClientCount(billing, listCustomerCount);
  const usage = {
    activeClients,
    ...computeUsageBreakdown(activeClients),
  };

  const cancelAtPeriodEnd =
    bool(sub?.cancel_at_period_end) || bool(r?.cancel_at_period_end);

  const currentPeriodStart =
    str(sub?.current_period_start) ??
    str(r?.current_period_start) ??
    str(sub?.currentPeriodStart) ??
    null;
  const currentPeriodEnd =
    str(sub?.current_period_end) ??
    str(r?.current_period_end) ??
    str(sub?.currentPeriodEnd) ??
    str(r?.next_billing_date) ??
    str(r?.renews_at) ??
    null;

  const planLabel =
    str(r?.plan_name) ?? str(sub?.plan_name) ?? "Plano ho.ko — base + clientes";

  const lastPay = str(r?.last_payment_status);
  const paymentSummary =
    str(r?.last_invoice_summary) ??
    str(r?.payment_summary) ??
    (lastPay ? `Último pagamento: ${lastPay}` : null);

  return {
    status: normalized === "none" ? "none" : normalized,
    statusLabel:
      STATUS_LABELS[normalized] ?? STATUS_LABELS.unknown ?? "Em análise",
    planLabel,
    usage: {
      activeClients: usage.activeClients,
      includedSlots: usage.includedSlots,
      excessClients: usage.excessClients,
      baseMonthlyBrl: usage.baseMonthlyBrl,
      extrasMonthlyBrl: usage.extrasMonthlyBrl,
      totalMonthlyBrl: usage.totalMonthlyBrl,
    },
    currentPeriodStart,
    currentPeriodEnd,
    cancelAtPeriodEnd,
    paymentSummary,
  };
}

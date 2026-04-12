import type { DashboardPeriodRange } from "@/features/dashboard/types";
import type { MetricsPayload } from "@/lib/types/dashboard";

/**
 * Corpo enviado aos POST de métricas e conteúdos do dashboard.
 * Contrato do backend: id_customer, startDate, endDate (sem date_start / end_date como principal).
 */
export function buildPeriodPayload(
  idCustomer: string,
  range: DashboardPeriodRange,
): MetricsPayload {
  return {
    id_customer: idCustomer,
    startDate: range.start,
    endDate: range.end,
  };
}

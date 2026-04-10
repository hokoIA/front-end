import type { DashboardPeriodRange } from "@/features/dashboard/types";

/**
 * Corpo enviado aos POST de métricas / conteúdos.
 * Campos alinhados ao padrão mais comum em APIs Express do produto;
 * ajuste se o contrato real usar outros nomes.
 */
export function buildPeriodPayload(
  idCustomer: string,
  range: DashboardPeriodRange,
): Record<string, unknown> {
  return {
    id_customer: idCustomer,
    idCustomer,
    date_start: range.start,
    date_end: range.end,
    start_date: range.start,
    end_date: range.end,
  };
}

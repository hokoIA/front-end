import type { CustomerIntegrationSummary } from "@/features/integrations/types/customer-summary";
import type { IntegrationSurface } from "@/features/dashboard/types";
import type { Customer } from "@/lib/types/customer";
import type { CustomerHubFilterState } from "@/features/customers/types/filters";
import {
  getCustomerCompany,
  getCustomerCreatedAt,
  getCustomerEmail,
  getCustomerLifecycleStatus,
  getCustomerUpdatedAt,
} from "./customer-fields";

function matchesSearch(c: Customer, q: string): boolean {
  if (!q.trim()) return true;
  const n = String(c.name ?? "").toLowerCase();
  const co = (getCustomerCompany(c) ?? "").toLowerCase();
  const em = (getCustomerEmail(c) ?? "").toLowerCase();
  const t = q.trim().toLowerCase();
  return n.includes(t) || co.includes(t) || em.includes(t);
}

function summaryFor(
  summaries: Map<string, CustomerIntegrationSummary>,
  id: string,
): CustomerIntegrationSummary | undefined {
  return summaries.get(id);
}

export function filterAndSortCustomers(
  customers: Customer[],
  filters: CustomerHubFilterState,
  summaries: Map<string, CustomerIntegrationSummary>,
): Customer[] {
  let rows = customers.filter((c) => matchesSearch(c, filters.search));

  if (filters.lifecycle !== "all") {
    rows = rows.filter(
      (c) => getCustomerLifecycleStatus(c) === filters.lifecycle,
    );
  }

  if (filters.integrationScope !== "all") {
    rows = rows.filter((c) => {
      const s = summaryFor(summaries, c.id_customer);
      if (!s) return filters.integrationScope === "all";
      switch (filters.integrationScope) {
        case "with_active":
          return s.connectedCount > 0;
        case "without":
          return s.connectedCount === 0;
        case "with_alert":
          return s.hasAttention;
        case "with_pending":
          return s.unknownCount > 0 && s.connectedCount < 5;
        default:
          return true;
      }
    });
  }

  if (filters.platformConnected !== "all") {
    const plat = filters.platformConnected;
    rows = rows.filter((c) => {
      const s = summaryFor(summaries, c.id_customer);
      if (!s) return false;
      return s.surfaces[plat] === "connected";
    });
  }

  const dir = filters.sortDir === "asc" ? 1 : -1;
  const sorted = [...rows].sort((a, b) => {
    if (filters.sort === "name") {
      return dir * String(a.name).localeCompare(String(b.name), "pt-BR");
    }
    if (filters.sort === "created") {
      const da = getCustomerCreatedAt(a) ?? "";
      const db = getCustomerCreatedAt(b) ?? "";
      return dir * da.localeCompare(db);
    }
    const ua = getCustomerUpdatedAt(a) ?? "";
    const ub = getCustomerUpdatedAt(b) ?? "";
    return dir * ua.localeCompare(ub);
  });

  return sorted;
}

export function computeHubOverview(input: {
  customers: Customer[];
  summaries: Map<string, CustomerIntegrationSummary>;
  /** Quando falso, métricas que dependem de integração retornam null (exceto com lista vazia). */
  summariesReady: boolean;
}): {
  total: number;
  active: number;
  withoutIntegration: number | null;
  pendingIntegration: number | null;
  attentionIntegration: number | null;
  readyForUse: number | null;
  topPlatforms: { surface: IntegrationSurface; label: string; count: number }[];
} {
  const { customers, summaries, summariesReady } = input;
  const total = customers.length;
  let active = 0;

  const platformCounts: Record<IntegrationSurface, number> = {
    facebook: 0,
    instagram: 0,
    google_analytics: 0,
    youtube: 0,
    linkedin: 0,
  };

  let withoutIntegration = 0;
  let pendingIntegration = 0;
  let attentionIntegration = 0;
  let readyForUse = 0;

  for (const c of customers) {
    const st = getCustomerLifecycleStatus(c);
    if (st !== "archived" && st !== "inactive") active += 1;
    const s = summaries.get(c.id_customer);
    if (!summariesReady || !s) continue;
    if (s.connectedCount === 0) withoutIntegration += 1;
    if (s.unknownCount > 0 && s.connectedCount > 0 && s.connectedCount < 5) {
      pendingIntegration += 1;
    }
    if (s.hasAttention) attentionIntegration += 1;
    if (s.readiness === "ready") readyForUse += 1;
    for (const k of Object.keys(platformCounts) as IntegrationSurface[]) {
      if (s.surfaces[k] === "connected") platformCounts[k] += 1;
    }
  }

  const integrationMetricsUnavailable =
    customers.length > 0 && !summariesReady;

  const labels: Record<IntegrationSurface, string> = {
    facebook: "Meta / Facebook",
    instagram: "Meta / Instagram",
    google_analytics: "Google Analytics",
    youtube: "YouTube",
    linkedin: "LinkedIn",
  };

  const topPlatforms = (
    Object.entries(platformCounts) as [IntegrationSurface, number][]
  )
    .map(([surface, count]) => ({
      surface,
      label: labels[surface],
      count,
    }))
    .sort((a, b) => b.count - a.count);

  const nullUnlessReady = (n: number): number | null =>
    customers.length === 0 ? 0 : integrationMetricsUnavailable ? null : n;

  return {
    total,
    active,
    withoutIntegration: nullUnlessReady(withoutIntegration),
    pendingIntegration: nullUnlessReady(pendingIntegration),
    attentionIntegration: nullUnlessReady(attentionIntegration),
    readyForUse: nullUnlessReady(readyForUse),
    topPlatforms,
  };
}

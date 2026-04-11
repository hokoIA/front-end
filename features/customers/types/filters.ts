import type { IntegrationSurface } from "@/features/dashboard/types";
import type { CustomerLifecycleStatus } from "./readiness";

export type CustomerHubSortKey = "name" | "created" | "updated";

export type CustomerHubFilterState = {
  search: string;
  lifecycle: CustomerLifecycleStatus | "all";
  integrationScope:
    | "all"
    | "with_active"
    | "without"
    | "with_alert"
    | "with_pending";
  platformConnected: IntegrationSurface | "all";
  sort: CustomerHubSortKey;
  sortDir: "asc" | "desc";
};

export const defaultCustomerHubFilters: CustomerHubFilterState = {
  search: "",
  lifecycle: "all",
  integrationScope: "all",
  platformConnected: "all",
  sort: "name",
  sortDir: "asc",
};

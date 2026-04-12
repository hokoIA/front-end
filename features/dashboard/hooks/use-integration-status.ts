"use client";

import type {
  IntegrationCardModel,
  IntegrationOperationalState,
  IntegrationPeriodCoverage,
  IntegrationSurface,
} from "@/features/dashboard/types";
import {
  resolveGoogleAnalyticsState,
  resolveLinkedinStateFromCustomer,
  resolveMetaSurfaceState,
  resolveYoutubeState,
} from "@/features/integrations/utils/parse-integration-apis";
import {
  getGoogleAnalyticsStatus,
  getMetaStatus,
  getYoutubeStatus,
} from "@/lib/api/customers";
import type { Customer } from "@/lib/types/customer";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useIntegrationDashboardCards(
  customerId: string | null,
  selectedCustomer: Customer | null,
  platformCoverageBySurface: Record<
    IntegrationSurface,
    IntegrationPeriodCoverage
  > | null,
  periodLoaded: boolean,
): {
  cards: IntegrationCardModel[];
  isLoading: boolean;
} {
  const enabled = Boolean(customerId);

  const meta = useQuery({
    queryKey: queryKeys.integrations.metaStatus(customerId ?? ""),
    queryFn: () => getMetaStatus(customerId!),
    enabled,
    staleTime: 60_000,
  });

  const ga = useQuery({
    queryKey: queryKeys.integrations.gaStatus(customerId ?? ""),
    queryFn: () => getGoogleAnalyticsStatus(customerId!),
    enabled,
    staleTime: 60_000,
  });

  const yt = useQuery({
    queryKey: queryKeys.integrations.youtubeStatus(customerId ?? ""),
    queryFn: () => getYoutubeStatus(customerId!),
    enabled,
    staleTime: 60_000,
  });

  const isLoading =
    enabled && (meta.isPending || ga.isPending || yt.isPending);

  const cards = useMemo((): IntegrationCardModel[] => {
    const periodCoverage = (
      surface: IntegrationSurface,
    ): IntegrationPeriodCoverage => {
      if (!periodLoaded) return "unknown";
      if (!platformCoverageBySurface) return "unknown";
      return platformCoverageBySurface[surface];
    };

    const surfaces: {
      surface: IntegrationSurface;
      label: string;
      operational: IntegrationOperationalState;
    }[] = [
      {
        surface: "facebook",
        label: "Facebook",
        operational: resolveMetaSurfaceState(
          selectedCustomer,
          meta.data,
          "facebook",
        ),
      },
      {
        surface: "instagram",
        label: "Instagram",
        operational: resolveMetaSurfaceState(
          selectedCustomer,
          meta.data,
          "instagram",
        ),
      },
      {
        surface: "google_analytics",
        label: "Google Analytics",
        operational: resolveGoogleAnalyticsState(selectedCustomer, ga.data),
      },
      {
        surface: "youtube",
        label: "YouTube",
        operational: resolveYoutubeState(selectedCustomer, yt.data),
      },
      {
        surface: "linkedin",
        label: "LinkedIn",
        operational: resolveLinkedinStateFromCustomer(selectedCustomer),
      },
    ];

    return surfaces.map((s) => ({
      ...s,
      periodCoverage: periodCoverage(s.surface),
    }));
  }, [
    selectedCustomer,
    meta.data,
    ga.data,
    yt.data,
    periodLoaded,
    platformCoverageBySurface,
  ]);

  return { cards, isLoading: Boolean(isLoading) };
}

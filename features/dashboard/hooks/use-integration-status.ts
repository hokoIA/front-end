"use client";

import type {
  IntegrationCardModel,
  IntegrationOperationalState,
  IntegrationPeriodCoverage,
  IntegrationSurface,
} from "@/features/dashboard/types";
import {
  parseGenericOperational,
  parseLinkedinOperational,
  parseMetaOperational,
} from "@/features/integrations/utils/parse-integration-apis";
import {
  getGoogleAnalyticsStatus,
  getLinkedinOrganizations,
  getMetaStatus,
  getYoutubeStatus,
} from "@/lib/api/customers";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function useIntegrationDashboardCards(
  customerId: string | null,
  periodLoaded: boolean,
  hasAnyMetricData: boolean,
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

  const li = useQuery({
    queryKey: queryKeys.integrations.linkedinOrgs(customerId ?? ""),
    queryFn: () => getLinkedinOrganizations(customerId!),
    enabled,
    staleTime: 60_000,
  });

  const isLoading =
    enabled &&
    (meta.isPending || ga.isPending || yt.isPending || li.isPending);

  const cards = useMemo((): IntegrationCardModel[] => {
    const periodCoverage: IntegrationPeriodCoverage = !periodLoaded
      ? "unknown"
      : hasAnyMetricData
        ? "has_data"
        : "no_data";

    const surfaces: {
      surface: IntegrationSurface;
      label: string;
      operational: IntegrationOperationalState;
    }[] = [
      {
        surface: "facebook",
        label: "Facebook",
        operational: parseMetaOperational(meta.data, "facebook"),
      },
      {
        surface: "instagram",
        label: "Instagram",
        operational: parseMetaOperational(meta.data, "instagram"),
      },
      {
        surface: "google_analytics",
        label: "Google Analytics",
        operational: parseGenericOperational(ga.data),
      },
      {
        surface: "youtube",
        label: "YouTube",
        operational: parseGenericOperational(yt.data),
      },
      {
        surface: "linkedin",
        label: "LinkedIn",
        operational: parseLinkedinOperational(li.data, li.isSuccess),
      },
    ];

    return surfaces.map((s) => ({
      ...s,
      periodCoverage,
    }));
  }, [
    meta.data,
    ga.data,
    yt.data,
    li.data,
    li.isSuccess,
    periodLoaded,
    hasAnyMetricData,
  ]);

  return { cards, isLoading: Boolean(isLoading) };
}

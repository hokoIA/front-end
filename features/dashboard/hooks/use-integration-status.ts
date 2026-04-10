"use client";

import type {
  IntegrationCardModel,
  IntegrationOperationalState,
  IntegrationPeriodCoverage,
  IntegrationSurface,
} from "@/features/dashboard/types";
import {
  getGoogleAnalyticsStatus,
  getLinkedinOrganizations,
  getMetaStatus,
  getYoutubeStatus,
} from "@/lib/api/customers";
import { queryKeys } from "@/lib/api/query-keys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

function record(data: unknown): Record<string, unknown> | null {
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
}

function opFromFlag(
  connected?: boolean,
  needsRenewal?: boolean,
): IntegrationOperationalState {
  if (needsRenewal) return "needs_renewal";
  if (connected === true) return "connected";
  if (connected === false) return "disconnected";
  return "unknown";
}

function parseMeta(
  data: unknown,
  surface: "facebook" | "instagram",
): IntegrationOperationalState {
  const r = record(data);
  if (!r) return "unknown";
  const fb =
    r.facebook_connected === true ||
    r.fb_connected === true ||
    (Array.isArray(r.pages) && r.pages.length > 0);
  const ig =
    r.instagram_connected === true ||
    r.ig_connected === true ||
    (Array.isArray(r.instagram_accounts) && r.instagram_accounts.length > 0);
  const renewal =
    r.requires_reauth === true ||
    r.needs_renewal === true ||
    r.token_expired === true;
  if (renewal) return "needs_renewal";
  if (surface === "facebook") return fb ? "connected" : "disconnected";
  return ig ? "connected" : "disconnected";
}

function linkedinListLen(data: unknown): number {
  if (Array.isArray(data)) return data.length;
  const r = record(data);
  if (r && Array.isArray(r.data)) return r.data.length;
  if (r && Array.isArray(r.organizations)) return r.organizations.length;
  return 0;
}

function linkedinOperational(
  data: unknown,
  isSuccess: boolean,
): IntegrationOperationalState {
  const n = linkedinListLen(data);
  if (n > 0) return "connected";
  if (isSuccess && n === 0) return "disconnected";
  return parseGenericStatus(data);
}

function parseGenericStatus(data: unknown): IntegrationOperationalState {
  const r = record(data);
  if (!r) return "unknown";
  const connected =
    r.connected === true ||
    r.status === "connected" ||
    r.active === true ||
    r.linked === true;
  const disc =
    r.connected === false ||
    r.status === "disconnected" ||
    r.active === false;
  const renewal =
    r.requires_reauth === true ||
    r.needs_renewal === true ||
    r.token_expired === true;
  if (renewal) return "needs_renewal";
  if (connected) return "connected";
  if (disc) return "disconnected";
  return "unknown";
}

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
        operational: parseMeta(meta.data, "facebook"),
      },
      {
        surface: "instagram",
        label: "Instagram",
        operational: parseMeta(meta.data, "instagram"),
      },
      {
        surface: "google_analytics",
        label: "Google Analytics",
        operational: parseGenericStatus(ga.data),
      },
      {
        surface: "youtube",
        label: "YouTube",
        operational: parseGenericStatus(yt.data),
      },
      {
        surface: "linkedin",
        label: "LinkedIn",
        operational: linkedinOperational(li.data, li.isSuccess),
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

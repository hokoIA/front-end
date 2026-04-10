"use client";

import type { DashboardPeriodRange, DashboardPeriodSnapshot } from "@/features/dashboard/types";
import { buildPeriodPayload } from "@/features/dashboard/utils/payloads";
import {
  normalizeMetricBlock,
  normalizePostsList,
} from "@/features/dashboard/utils/normalize";
import {
  postContentsPosts,
  postMetricsFollowers,
  postMetricsImpressions,
  postMetricsReach,
  postMetricsSearchVolume,
  postMetricsTraffic,
} from "@/lib/api/dashboard";
import { queryKeys } from "@/lib/api/query-keys";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

export function useDashboardPeriodQueries(
  customerId: string | null,
  range: DashboardPeriodRange | null,
) {
  const enabled = Boolean(customerId && range);
  const payload = useMemo(() => {
    if (!customerId || !range) return null;
    return buildPeriodPayload(customerId, range);
  }, [customerId, range]);

  const id = customerId ?? "";
  const start = range?.start ?? "";
  const end = range?.end ?? "";

  const queries = useQueries({
    queries: [
      {
        queryKey: queryKeys.dashboard.reach(id, start, end),
        queryFn: () => postMetricsReach(payload!),
        enabled: enabled && !!payload,
        staleTime: Infinity,
      },
      {
        queryKey: queryKeys.dashboard.impressions(id, start, end),
        queryFn: () => postMetricsImpressions(payload!),
        enabled: enabled && !!payload,
        staleTime: Infinity,
      },
      {
        queryKey: queryKeys.dashboard.followers(id, start, end),
        queryFn: () => postMetricsFollowers(payload!),
        enabled: enabled && !!payload,
        staleTime: Infinity,
      },
      {
        queryKey: queryKeys.dashboard.traffic(id, start, end),
        queryFn: () => postMetricsTraffic(payload!),
        enabled: enabled && !!payload,
        staleTime: Infinity,
      },
      {
        queryKey: queryKeys.dashboard.searchVolume(id, start, end),
        queryFn: () => postMetricsSearchVolume(payload!),
        enabled: enabled && !!payload,
        staleTime: Infinity,
      },
      {
        queryKey: queryKeys.dashboard.posts(id, start, end),
        queryFn: () => postContentsPosts(payload!),
        enabled: enabled && !!payload,
        staleTime: Infinity,
      },
    ],
  });

  const [qReach, qImp, qFol, qTra, qSea, qPosts] = queries;

  const isPending = queries.some((q) => q.isPending);
  const isFetching = queries.some((q) => q.isFetching);
  const isError = queries.some((q) => q.isError);
  const errors = queries.map((q) => q.error).filter(Boolean);

  const snapshot: DashboardPeriodSnapshot | null = useMemo(() => {
    if (!enabled || !payload) return null;
    return {
      reach: normalizeMetricBlock(qReach.data),
      impressions: normalizeMetricBlock(qImp.data),
      followers: normalizeMetricBlock(qFol.data),
      traffic: normalizeMetricBlock(qTra.data),
      search: normalizeMetricBlock(qSea.data),
      posts: normalizePostsList(qPosts.data),
      raw: {
        reach: qReach.data,
        impressions: qImp.data,
        followers: qFol.data,
        traffic: qTra.data,
        search: qSea.data,
        posts: qPosts.data,
      },
    };
  }, [
    enabled,
    payload,
    qReach.data,
    qImp.data,
    qFol.data,
    qTra.data,
    qSea.data,
    qPosts.data,
  ]);

  const refetchAll = () => {
    void Promise.all(queries.map((q) => q.refetch()));
  };

  return {
    queries,
    isPending,
    isFetching,
    isError,
    errors,
    snapshot,
    refetchAll,
    queryReach: qReach,
    queryPosts: qPosts,
  };
}

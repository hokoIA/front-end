"use client";

import type { DashboardPeriodRange, DashboardPeriodSnapshot } from "@/features/dashboard/types";
import { buildPeriodPayload } from "@/features/dashboard/utils/payloads";
import {
  normalizeFollowersResponse,
  normalizeImpressionsResponse,
  normalizePostsResponse,
  normalizeReachResponse,
  normalizeSearchVolumeResponse,
  normalizeTrafficResponse,
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
  const allQueriesFailed =
    enabled && queries.length > 0 && queries.every((q) => q.isError);
  const someQueriesFailed =
    enabled && queries.some((q) => q.isError) && !allQueriesFailed;

  const snapshot: DashboardPeriodSnapshot | null = useMemo(() => {
    if (!enabled || !payload) return null;

    const queryErrors = {
      reach: qReach.isError,
      impressions: qImp.isError,
      followers: qFol.isError,
      traffic: qTra.isError,
      search: qSea.isError,
      posts: qPosts.isError,
    };

    const postsNorm = normalizePostsResponse(
      qPosts.isError ? undefined : qPosts.data,
    );

    return {
      reach: qReach.isError
        ? { total: 0, series: [], byPlatform: {}, raw: undefined }
        : normalizeReachResponse(qReach.data),
      impressions: qImp.isError
        ? { total: 0, series: [], byPlatform: {}, raw: undefined }
        : normalizeImpressionsResponse(qImp.data),
      followers: qFol.isError
        ? { total: 0, series: [], byPlatform: {}, raw: undefined }
        : normalizeFollowersResponse(qFol.data),
      traffic: qTra.isError
        ? { total: 0, series: [], byPlatform: {}, raw: undefined }
        : normalizeTrafficResponse(qTra.data),
      search: qSea.isError
        ? { total: 0, series: [], byPlatform: {}, raw: undefined }
        : normalizeSearchVolumeResponse(qSea.data),
      posts: postsNorm.rows,
      postsMeta: postsNorm.meta,
      queryErrors,
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
    qReach.isError,
    qReach.data,
    qImp.isError,
    qImp.data,
    qFol.isError,
    qFol.data,
    qTra.isError,
    qTra.data,
    qSea.isError,
    qSea.data,
    qPosts.isError,
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
    allQueriesFailed,
    someQueriesFailed,
    errors,
    snapshot,
    refetchAll,
    queryReach: qReach,
    queryPosts: qPosts,
  };
}

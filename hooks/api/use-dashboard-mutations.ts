import {
  postContentsPosts,
  postMetricsFollowers,
  postMetricsImpressions,
  postMetricsReach,
  postMetricsSearchVolume,
  postMetricsTraffic,
} from "@/lib/api/dashboard";
import type {
  ContentsPostsPayload,
  MetricsPayload,
} from "@/lib/types/dashboard";
import { useMutation } from "@tanstack/react-query";

export function useMetricsReachMutation() {
  return useMutation({
    mutationFn: (body: MetricsPayload) => postMetricsReach(body),
  });
}

export function useMetricsImpressionsMutation() {
  return useMutation({
    mutationFn: (body: MetricsPayload) => postMetricsImpressions(body),
  });
}

export function useMetricsFollowersMutation() {
  return useMutation({
    mutationFn: (body: MetricsPayload) => postMetricsFollowers(body),
  });
}

export function useMetricsTrafficMutation() {
  return useMutation({
    mutationFn: (body: MetricsPayload) => postMetricsTraffic(body),
  });
}

export function useMetricsSearchVolumeMutation() {
  return useMutation({
    mutationFn: (body: MetricsPayload) => postMetricsSearchVolume(body),
  });
}

export function useContentsPostsMutation() {
  return useMutation({
    mutationFn: (body: ContentsPostsPayload) => postContentsPosts(body),
  });
}

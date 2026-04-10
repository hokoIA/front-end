import type {
  ContentsPostsPayload,
  MetricsPayload,
} from "@/lib/types/dashboard";
import { endpoints } from "./endpoints";
import { httpJson } from "./http-client";

export async function postMetricsReach(body: MetricsPayload): Promise<unknown> {
  return httpJson(endpoints.metrics.reach(), { method: "POST", json: body });
}

export async function postMetricsImpressions(
  body: MetricsPayload,
): Promise<unknown> {
  return httpJson(endpoints.metrics.impressions(), {
    method: "POST",
    json: body,
  });
}

export async function postMetricsFollowers(
  body: MetricsPayload,
): Promise<unknown> {
  return httpJson(endpoints.metrics.followers(), {
    method: "POST",
    json: body,
  });
}

export async function postMetricsTraffic(body: MetricsPayload): Promise<unknown> {
  return httpJson(endpoints.metrics.traffic(), { method: "POST", json: body });
}

export async function postMetricsSearchVolume(
  body: MetricsPayload,
): Promise<unknown> {
  return httpJson(endpoints.metrics.searchVolume(), {
    method: "POST",
    json: body,
  });
}

export async function postContentsPosts(
  body: ContentsPostsPayload,
): Promise<unknown> {
  return httpJson(endpoints.contents.posts(), { method: "POST", json: body });
}

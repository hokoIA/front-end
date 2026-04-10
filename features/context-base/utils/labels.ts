import type { ContentTypeValue, GovernanceStatusValue } from "../types";
import { CONTENT_TYPE_OPTIONS, STATUS_OPTIONS } from "./constants";

const contentMap = Object.fromEntries(
  CONTENT_TYPE_OPTIONS.map((o) => [o.value, o.label]),
) as Record<ContentTypeValue, string>;

const statusMap = Object.fromEntries(
  STATUS_OPTIONS.map((o) => [o.value, o.label]),
) as Record<GovernanceStatusValue, string>;

export function contentTypeLabel(v: ContentTypeValue): string {
  return contentMap[v] ?? v;
}

export function governanceStatusLabel(v: GovernanceStatusValue): string {
  return statusMap[v] ?? v;
}

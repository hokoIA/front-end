import type { IntegrationSurface } from "@/features/dashboard/types";

export type PlatformVisualKey =
  | IntegrationSurface
  | "facebook"
  | "instagram"
  | "google"
  | "meta";

/**
 * Normaliza `IntegrationSurface`, chaves visuais ou strings genéricas para o glifo correto.
 */
export function toPlatformVisualKey(
  platform: IntegrationSurface | PlatformVisualKey | string,
): PlatformVisualKey {
  const p = String(platform);
  if (
    p === "facebook" ||
    p === "instagram" ||
    p === "youtube" ||
    p === "linkedin" ||
    p === "google_analytics"
  ) {
    return p as IntegrationSurface;
  }
  if (p === "meta") return "meta";
  if (p === "google") return "google_analytics";
  return resolvePlatformVisualKey(p);
}

/**
 * Converte rótulos variados (API, UI, chaves de `byPlatform`) para a chave visual do ícone.
 */
export function resolvePlatformVisualKey(key: string): PlatformVisualKey {
  const k = key.toLowerCase().replace(/[\s-]+/g, "_");
  if (k.includes("instagram") || k === "ig") return "instagram";
  if (k.includes("facebook") || k === "fb") return "facebook";
  if (
    k.includes("google") ||
    k === "ga" ||
    k.includes("analytics") ||
    k.includes("googleanalytics")
  ) {
    return "google_analytics";
  }
  if (k.includes("linkedin")) return "linkedin";
  if (k.includes("youtube") || k === "yt") return "youtube";
  return "meta";
}

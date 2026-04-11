/** Extrai URL de redirecionamento OAuth a partir de respostas heterogêneas da API. */
export function extractOAuthRedirectUrl(data: unknown): string | null {
  if (typeof data === "string" && data.startsWith("http")) return data;
  if (typeof data !== "object" || data === null) return null;
  const r = data as Record<string, unknown>;
  const keys = [
    "url",
    "auth_url",
    "redirect",
    "redirect_url",
    "oauth_url",
    "authorization_url",
    "link",
  ] as const;
  for (const k of keys) {
    const v = r[k];
    if (typeof v === "string" && v.startsWith("http")) return v;
  }
  if (r.data && typeof r.data === "object" && r.data !== null) {
    return extractOAuthRedirectUrl(r.data);
  }
  return null;
}

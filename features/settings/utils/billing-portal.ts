/** Extrai URL de redirecionamento de respostas típicas de portal/checkout Stripe-like. */
export function extractCheckoutUrl(body: unknown): string | null {
  const r =
    body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  if (!r) return null;
  const url = r.url ?? r.checkout_url ?? r.sessionUrl;
  return typeof url === "string" && url.startsWith("http") ? url : null;
}

export function extractPortalUrl(body: unknown): string | null {
  const r =
    body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  if (!r) return null;
  const url = r.url ?? r.portal_url ?? r.portalUrl;
  return typeof url === "string" && url.startsWith("http") ? url : null;
}

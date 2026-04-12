import type { Customer } from "@/lib/types/customer";
import type { IntegrationOperationalState } from "@/features/dashboard/types";

function record(data: unknown): Record<string, unknown> | null {
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
}

function normPlatform(p: unknown): string {
  return String(p ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function integrationRows(customer: Customer | null): Record<string, unknown>[] {
  if (!customer) return [];
  const raw = customer.integrations;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (x): x is Record<string, unknown> =>
      typeof x === "object" && x !== null && !Array.isArray(x),
  );
}

function pickIntegrationRow(
  customer: Customer | null,
  aliases: string[],
): Record<string, unknown> | null {
  for (const row of integrationRows(customer)) {
    const p = normPlatform(row.platform ?? row.source);
    for (const a of aliases) {
      const na = a.toLowerCase();
      if (p === na || p.includes(na) || na.includes(p)) {
        return row;
      }
    }
  }
  return null;
}

function expiresNeedsRenewal(row: Record<string, unknown>): boolean {
  const exp = row.expires_at ?? row.expiresAt;
  if (typeof exp !== "string" || !exp) return false;
  const t = Date.parse(exp);
  if (Number.isNaN(t)) return false;
  return t < Date.now();
}

/**
 * Estado operacional a partir de um item `integrations` em GET /customer/list.
 */
export function parseCustomerIntegrationRecord(
  row: Record<string, unknown> | null | undefined,
): IntegrationOperationalState {
  if (!row) return "unknown";
  if (expiresNeedsRenewal(row)) return "needs_renewal";

  const st = String(row.status ?? row.state ?? "")
    .trim()
    .toLowerCase();
  if (
    st === "connected" ||
    st === "active" ||
    st === "ok" ||
    st === "authorized" ||
    st === "linked"
  ) {
    return "connected";
  }
  if (
    st === "disconnected" ||
    st === "inactive" ||
    st === "revoked" ||
    st === "none" ||
    st === "off"
  ) {
    return "disconnected";
  }
  if (
    st === "expired" ||
    st === "needs_reauth" ||
    st === "needs_renewal" ||
    st === "pending_reauth"
  ) {
    return "needs_renewal";
  }

  return "unknown";
}

/**
 * Meta status — backend produção usa camelCase (facebookConnected, needsReauthFacebook, …).
 */
export function parseMetaOperational(
  data: unknown,
  surface: "facebook" | "instagram",
): IntegrationOperationalState {
  const r = record(data);
  if (!r) return "unknown";

  const fbConnected =
    r.facebookConnected === true ||
    r.facebook_connected === true ||
    r.fb_connected === true ||
    (Array.isArray(r.pages) && r.pages.length > 0);

  const igConnected =
    r.instagramConnected === true ||
    r.instagram_connected === true ||
    r.ig_connected === true ||
    (Array.isArray(r.instagram_accounts) && r.instagram_accounts.length > 0) ||
    (Array.isArray(r.instagramAccounts) && r.instagramAccounts.length > 0);

  const needFb =
    r.needsReauthFacebook === true || r.needs_reauth_facebook === true;
  const needIg =
    r.needsReauthInstagram === true || r.needs_reauth_instagram === true;

  const renewalGlobal =
    r.requires_reauth === true ||
    r.needs_renewal === true ||
    r.token_expired === true;

  if (surface === "facebook") {
    if (needFb) return "needs_renewal";
    if (renewalGlobal && fbConnected) return "needs_renewal";
    return fbConnected ? "connected" : "disconnected";
  }
  if (needIg) return "needs_renewal";
  if (renewalGlobal && igConnected) return "needs_renewal";
  return igConnected ? "connected" : "disconnected";
}

function applyMetaRenewalHint(
  base: IntegrationOperationalState,
  metaApi: unknown,
  surface: "facebook" | "instagram",
): IntegrationOperationalState {
  const r = record(metaApi);
  if (!r) return base;
  const needFb =
    r.needsReauthFacebook === true || r.needs_reauth_facebook === true;
  const needIg =
    r.needsReauthInstagram === true || r.needs_reauth_instagram === true;
  const renewalGlobal =
    r.requires_reauth === true ||
    r.needs_renewal === true ||
    r.token_expired === true;

  if (surface === "facebook" && (needFb || renewalGlobal)) {
    if (base === "connected" || base === "unknown") return "needs_renewal";
  }
  if (surface === "instagram" && (needIg || renewalGlobal)) {
    if (base === "connected" || base === "unknown") return "needs_renewal";
  }
  return base;
}

/**
 * Facebook / Instagram: prioriza `integrations` do cliente; Meta status só complementa renovação.
 * Não rebaixa `connected` da lista para `disconnected` só porque a API falhou.
 */
export function resolveMetaSurfaceState(
  customer: Customer | null,
  metaApiData: unknown,
  surface: "facebook" | "instagram",
): IntegrationOperationalState {
  const specific =
    surface === "facebook"
      ? pickIntegrationRow(customer, [
          "facebook",
          "fb",
          "facebook_page",
          "pages",
        ])
      : pickIntegrationRow(customer, [
          "instagram",
          "ig",
          "instagram_business",
        ]);
  const metaRow = pickIntegrationRow(customer, ["meta", "facebook_meta"]);

  let fromList: IntegrationOperationalState | null = null;
  if (specific) fromList = parseCustomerIntegrationRecord(specific);
  else if (metaRow) fromList = parseCustomerIntegrationRecord(metaRow);

  if (
    fromList === "disconnected" ||
    fromList === "needs_renewal"
  ) {
    return applyMetaRenewalHint(fromList, metaApiData, surface);
  }
  if (fromList === "connected") {
    return applyMetaRenewalHint("connected", metaApiData, surface);
  }

  return parseMetaOperational(metaApiData, surface);
}

export function resolveGoogleAnalyticsState(
  customer: Customer | null,
  gaApiData: unknown,
): IntegrationOperationalState {
  const row = pickIntegrationRow(customer, [
    "google_analytics",
    "googleanalytics",
    "google",
    "ga",
    "ga4",
    "analytics",
  ]);
  const fromList = row ? parseCustomerIntegrationRecord(row) : null;
  if (fromList === "disconnected" || fromList === "needs_renewal") {
    return fromList;
  }
  if (fromList === "connected") {
    const g = record(gaApiData);
    if (
      g?.requires_reauth === true ||
      g?.needs_renewal === true ||
      g?.token_expired === true
    ) {
      return "needs_renewal";
    }
    return "connected";
  }
  return parseGenericOperational(gaApiData);
}

export function resolveYoutubeState(
  customer: Customer | null,
  ytApiData: unknown,
): IntegrationOperationalState {
  const row = pickIntegrationRow(customer, ["youtube", "yt"]);
  const fromList = row ? parseCustomerIntegrationRecord(row) : null;
  if (fromList === "disconnected" || fromList === "needs_renewal") {
    return fromList;
  }
  if (fromList === "connected") {
    const y = record(ytApiData);
    if (
      y?.requires_reauth === true ||
      y?.needs_renewal === true ||
      y?.token_expired === true
    ) {
      return "needs_renewal";
    }
    return "connected";
  }
  return parseGenericOperational(ytApiData);
}

/** LinkedIn no dashboard: somente `integrations` do cliente (sem inferir por organizations). */
export function resolveLinkedinStateFromCustomer(
  customer: Customer | null,
): IntegrationOperationalState {
  const row = pickIntegrationRow(customer, ["linkedin"]);
  return parseCustomerIntegrationRecord(row);
}

export function linkedinListLen(data: unknown): number {
  if (Array.isArray(data)) return data.length;
  const r = record(data);
  if (r && Array.isArray(r.data)) return r.data.length;
  if (r && Array.isArray(r.organizations)) return r.organizations.length;
  return 0;
}

/** Fluxos que ainda listam organizações (conexão / settings), não status operacional do dashboard. */
export function parseLinkedinOperational(
  data: unknown,
  isSuccess: boolean,
): IntegrationOperationalState {
  const n = linkedinListLen(data);
  if (n > 0) return "connected";
  if (isSuccess && n === 0) return "disconnected";
  return parseGenericOperational(data);
}

export function parseGenericOperational(
  data: unknown,
): IntegrationOperationalState {
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

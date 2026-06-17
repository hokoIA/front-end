import type { IntegrationResourceOption } from "./types";

function record(data: unknown): Record<string, unknown> | null {
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
}

function idLabelPair(row: Record<string, unknown>): IntegrationResourceOption | null {
  const id = String(
    row.id ??
      row.id_page ??
      row.id_ad_account ??
      row.id_customer_ads ??
      row.account_id ??
      row.page_id ??
      row.id_property ??
      row.property_id ??
      row.id_channel ??
      row.channel_id ??
      row.organization_id ??
      "",
  );
  if (!id) return null;
  const label = String(
    row.name ??
    row.title ??
    row.business_name ??
    row.label ??
    row.page_name ??
    row.property_name ??
    row.display_name ??
    id,
  );
  return { id, label, raw: row };
}

/** Normaliza listas genéricas retornadas pela API em opções de seleção. */
export function integrationResourcesFromUnknown(
  data: unknown,
  platform?: "facebook" | "instagram",
): IntegrationResourceOption[] {
  if (Array.isArray(data)) {
    return data
      .map((row) =>
        typeof row === "object" && row
          ? idLabelPair(row as Record<string, unknown>)
          : null,
      )
      .filter(Boolean) as IntegrationResourceOption[];
  }

  const r = record(data);
  if (!r) return [];

  if (platform === "facebook" && Array.isArray(r.facebook)) {
    return integrationResourcesFromUnknown(r.facebook);
  }

  if (platform === "instagram" && Array.isArray(r.instagram)) {
    return integrationResourcesFromUnknown(r.instagram);
  }

  const candidates = [
    r.data,
    r.pages,
    r.items,
    r.properties,
    r.channels,
    r.organizations,
    r.adAccounts,
    r.ad_accounts,
    r.accounts,
    r.results,
    r.facebook,
    r.instagram,
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) return integrationResourcesFromUnknown(c);
  }

  return [];
}

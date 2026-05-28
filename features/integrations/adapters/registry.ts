import {
  getGoogleAnalyticsProperties,
  getLinkedinOrganizations,
  getMetaAdAccounts,
  getMetaPages,
  getYoutubeChannels,
  postGoogleAnalyticsConnect,
  postLinkedinConnect,
  postMetaAdsConnect,
  postMetaConnect,
  postYoutubeConnect,
} from "@/lib/api/customers";
import type { IntegrationPlatformAdapter } from "./types";

const metaBase = {
  apiKey: "meta" as const,
  listResources: getMetaPages,
  connect: postMetaConnect,
  connectPayloadHints: [
    "id_customer",
    "platform",
    "resource_id",
    "resource_name",
    "resource_access_token",
  ],
  supportsDisconnect: false,
  supportsSwapResource: false,
  supportsResync: false,
};

export const metaFacebookAdapter: IntegrationPlatformAdapter = {
  ...metaBase,
  key: "facebook",
  label: "Meta / Facebook",
  description:
    "Páginas do Facebook vinculadas à conta Meta. A mesma autorização costuma cobrir Instagram.",
  buildConnectPayload: (customerId, resourceId, resource) => {
    const raw = resource?.raw as
      | { name?: string; access_token?: string }
      | undefined;

    return {
      id_customer: customerId,
      platform: "facebook",
      resource_id: resourceId,
      resource_name: raw?.name ?? resource?.label ?? null,
      resource_access_token: raw?.access_token,
    };
  },
};

export const metaInstagramAdapter: IntegrationPlatformAdapter = {
  ...metaBase,
  key: "instagram",
  label: "Meta / Instagram",
  description:
    "Contas comerciais do Instagram. Normalmente autorizadas junto com a conta Meta.",
  buildConnectPayload: (customerId, resourceId, resource) => {
    const raw = resource?.raw as
      | { name?: string; access_token?: string }
      | undefined;

    return {
      id_customer: customerId,
      platform: "instagram",
      resource_id: resourceId,
      resource_name: raw?.name ?? resource?.label ?? null,
      resource_access_token: raw?.access_token,
    };
  },
};

export const metaAdsAdapter: IntegrationPlatformAdapter = {
  apiKey: "meta",
  key: "meta_ads",
  label: "Meta Ads",
  description:
    "Contas de an\u00fancio dispon\u00edveis na conta Meta autorizada.",
  listResources: getMetaAdAccounts,
  connect: postMetaAdsConnect,
  buildConnectPayload: (customerId, resourceId, resource) => {
    const raw = resource?.raw as
      | {
          name?: string;
          currency?: string;
          account_status?: number | string;
          timezone_name?: string;
          business_name?: string;
        }
      | undefined;

    return {
      id_customer: customerId,
      resource_id: resourceId,
      resource_name: raw?.name ?? resource?.label ?? null,
      currency: raw?.currency ?? null,
      account_status: raw?.account_status ?? null,
      timezone_name: raw?.timezone_name ?? null,
      business_name: raw?.business_name ?? null,
    };
  },
  connectPayloadHints: [
    "id_customer",
    "resource_id",
    "resource_name",
    "currency",
  ],
  supportsDisconnect: false,
  supportsSwapResource: false,
  supportsResync: false,
};

export const googleAnalyticsAdapter: IntegrationPlatformAdapter = {
  key: "google_analytics",
  apiKey: "google_analytics",
  label: "Google Analytics",
  description: "Propriedades GA4 disponíveis após autorização Google.",
  listResources: getGoogleAnalyticsProperties,
  connect: postGoogleAnalyticsConnect,
  buildConnectPayload: (customerId: string, resourceId?: string, resource?) =>
    resourceId
      ? { id_customer: customerId, resource_id: resourceId, resource_name: resource?.label }
      : { id_customer: customerId },
  connectPayloadHints: ["id_customer", "resource_id"],
  supportsDisconnect: false,
  supportsSwapResource: false,
  supportsResync: false,
};

export const youtubeAdapter: IntegrationPlatformAdapter = {
  key: "youtube",
  apiKey: "youtube",
  label: "YouTube",
  description: "Canais disponíveis após autorização Google/YouTube.",
  listResources: getYoutubeChannels,
  connect: postYoutubeConnect,
  buildConnectPayload: (customerId: string, resourceId?: string, resource?) =>
    resourceId
      ? { id_customer: customerId, resource_id: resourceId, resource_name: resource?.label }
      : { id_customer: customerId },
  connectPayloadHints: ["id_customer", "resource_id"],
  supportsDisconnect: false,
  supportsSwapResource: false,
  supportsResync: false,
};

export const linkedinAdapter: IntegrationPlatformAdapter = {
  key: "linkedin",
  apiKey: "linkedin",
  label: "LinkedIn",
  description: "Organizações LinkedIn disponíveis após autorização.",
  listResources: getLinkedinOrganizations,
  connect: postLinkedinConnect,
  buildConnectPayload: (customerId: string, resourceId?: string, resource?) =>
    resourceId
      ? { id_customer: customerId, resource_id: resourceId, resource_name: resource?.label }
      : { id_customer: customerId },
  connectPayloadHints: ["id_customer", "resource_id"],
  supportsDisconnect: false,
  supportsSwapResource: false,
  supportsResync: false,
};

export const CUSTOMER_HUB_PLATFORM_ADAPTERS: IntegrationPlatformAdapter[] = [
  metaFacebookAdapter,
  metaInstagramAdapter,
  metaAdsAdapter,
  googleAnalyticsAdapter,
  youtubeAdapter,
  linkedinAdapter,
];

export function getAdapterForSurface(
  surface: IntegrationPlatformAdapter["key"],
): IntegrationPlatformAdapter | undefined {
  return CUSTOMER_HUB_PLATFORM_ADAPTERS.find((a) => a.key === surface);
}

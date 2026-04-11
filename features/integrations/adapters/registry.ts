import {
  getGoogleAnalyticsProperties,
  getLinkedinOrganizations,
  getMetaPages,
  getYoutubeChannels,
  postGoogleAnalyticsConnect,
  postLinkedinConnect,
  postMetaConnect,
  postYoutubeConnect,
} from "@/lib/api/customers";
import type { IntegrationPlatformAdapter } from "./types";

const metaBase = {
  apiKey: "meta" as const,
  listResources: getMetaPages,
  connect: postMetaConnect,
  buildConnectPayload: (customerId: string, resourceId?: string) =>
    resourceId
      ? { id_customer: customerId, page_id: resourceId }
      : { id_customer: customerId },
  connectPayloadHints: ["id_customer", "page_id / recurso Meta"],
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
};

export const metaInstagramAdapter: IntegrationPlatformAdapter = {
  ...metaBase,
  key: "instagram",
  label: "Meta / Instagram",
  description:
    "Contas comerciais do Instagram. Normalmente autorizadas junto com a conta Meta.",
};

export const googleAnalyticsAdapter: IntegrationPlatformAdapter = {
  key: "google_analytics",
  apiKey: "google_analytics",
  label: "Google Analytics",
  description: "Propriedades GA4 disponíveis após autorização Google.",
  listResources: getGoogleAnalyticsProperties,
  connect: postGoogleAnalyticsConnect,
  buildConnectPayload: (customerId: string, resourceId?: string) =>
    resourceId
      ? { id_customer: customerId, property_id: resourceId }
      : { id_customer: customerId },
  connectPayloadHints: ["id_customer", "property / recurso GA"],
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
  buildConnectPayload: (customerId: string, resourceId?: string) =>
    resourceId
      ? { id_customer: customerId, channel_id: resourceId }
      : { id_customer: customerId },
  connectPayloadHints: ["id_customer", "channel / recurso"],
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
  buildConnectPayload: (customerId: string, resourceId?: string) =>
    resourceId
      ? { id_customer: customerId, organization_id: resourceId }
      : { id_customer: customerId },
  connectPayloadHints: ["id_customer", "organization_id"],
  supportsDisconnect: false,
  supportsSwapResource: false,
  supportsResync: false,
};

export const CUSTOMER_HUB_PLATFORM_ADAPTERS: IntegrationPlatformAdapter[] = [
  metaFacebookAdapter,
  metaInstagramAdapter,
  googleAnalyticsAdapter,
  youtubeAdapter,
  linkedinAdapter,
];

export function getAdapterForSurface(
  surface: IntegrationPlatformAdapter["key"],
): IntegrationPlatformAdapter | undefined {
  return CUSTOMER_HUB_PLATFORM_ADAPTERS.find((a) => a.key === surface);
}

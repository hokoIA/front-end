import type { IntegrationSurface } from "@/features/dashboard/types";

export type IntegrationResourceOption = {
  id: string;
  label: string;
  raw?: unknown;
};

/** Contrato mínimo por plataforma: UI chama apenas estes métodos. */
export type IntegrationPlatformAdapter = {
  key: IntegrationSurface;
  /** Chave estável para telemetria / futuras rotas. */
  apiKey: "meta" | "google_analytics" | "youtube" | "linkedin";
  label: string;
  description: string;
  listResources: (customerId: string) => Promise<unknown>;
  connect: (payload: Record<string, unknown>) => Promise<unknown>;
  buildConnectPayload: (
    customerId: string,
    resourceId?: string,
  ) => Record<string, unknown>;
  supportsDisconnect: boolean;
  supportsSwapResource: boolean;
  supportsResync: boolean;
  /** Campos extras típicos no POST de conexão além de id_customer. */
  connectPayloadHints: string[];
};

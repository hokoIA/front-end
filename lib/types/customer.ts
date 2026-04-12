/** Item de `integrations` em GET /customer/list (contrato backend). */
export type CustomerIntegration = {
  platform?: string;
  status?: string;
  expires_at?: string | null;
  resource_id?: string | null;
  resource_name?: string | null;
  [key: string]: unknown;
};

export type Customer = {
  id_customer: string;
  name: string;
  integrations?: CustomerIntegration[];
  /** Campos adicionais conforme contrato real do backend */
  [key: string]: unknown;
};


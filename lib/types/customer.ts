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
  status?: string;
  id_activation?: string | null;
  integrations?: CustomerIntegration[];
  /** Campos adicionais conforme contrato real do backend */
  [key: string]: unknown;
};

export type CustomerActivationDetail = {
  customer: Customer & {
    company?: string | null;
    email?: string | null;
    phone?: string | null;
    created_at?: string | null;
  };
  activation: {
    id_activation: string;
    created_at: string;
  };
};


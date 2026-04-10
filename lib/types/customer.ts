export type Customer = {
  id_customer: string;
  name: string;
  /** Campos adicionais conforme contrato real do backend */
  [key: string]: unknown;
};

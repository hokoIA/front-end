/** Prontidão operacional do cliente na plataforma (visão de produto). */
export type CustomerReadiness =
  | "incomplete"
  | "partial"
  | "ready"
  | "attention";

/** Status comercial / cadastral exibido na UI (mapeado a partir do backend quando existir). */
export type CustomerLifecycleStatus =
  | "active"
  | "inactive"
  | "archived"
  | "unknown";

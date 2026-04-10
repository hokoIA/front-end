/**
 * Tipos mínimos para billing; campos extras preservados via index signature
 * quando o backend retornar mais dados (Stripe, IDs internos, etc.).
 */
export type BillingPlan = Record<string, unknown>;

export type BillingSubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused"
  | string;

export type BillingSubscription = {
  status?: BillingSubscriptionStatus;
  /** Nomes alternativos que alguns backends usam */
  subscription_status?: BillingSubscriptionStatus;
} & Record<string, unknown>;

export type BillingMeResponse = {
  subscription?: BillingSubscription | null;
  /** Alguns backends expõem status no nível raiz */
  status?: BillingSubscriptionStatus;
} & Record<string, unknown>;

/** Heurística alinhada ao fluxo de login (active | trialing → app). */
export function hasActiveOrTrialingSubscription(
  data: BillingMeResponse | null | undefined,
): boolean {
  if (!data || typeof data !== "object") return false;
  const sub = data.subscription;
  const fromSub =
    sub && typeof sub === "object"
      ? (sub.status ?? sub.subscription_status)
      : undefined;
  const top = data.status ?? fromSub;
  return top === "active" || top === "trialing";
}

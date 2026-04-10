import type { BillingMeResponse, BillingPlan } from "@/lib/types/billing";
import { endpoints } from "./endpoints";
import { httpFetch, httpJson } from "./http-client";

export async function getBillingMe(): Promise<BillingMeResponse> {
  return httpJson<BillingMeResponse>(endpoints.billing.me(), { method: "GET" });
}

export async function getBillingPlans(): Promise<BillingPlan[] | unknown> {
  return httpJson(endpoints.billing.plans(), { method: "GET" });
}

export async function postBillingCheckout(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.billing.checkout(), { method: "POST", json: body });
}

export async function postBillingPortal(
  body?: Record<string, unknown>,
): Promise<unknown> {
  if (body && Object.keys(body).length > 0) {
    return httpJson(endpoints.billing.portal(), {
      method: "POST",
      json: body,
    });
  }
  return httpJson(endpoints.billing.portal(), { method: "POST" });
}

/** Para fluxos onde falha não deve quebrar (ex.: pós-login). */
export async function getBillingMeSafe(): Promise<BillingMeResponse | null> {
  try {
    const res = await httpFetch(endpoints.billing.me(), {
      method: "GET",
      skipErrorThrow: true,
    });
    if (!res.ok) return null;
    return (await res.json()) as BillingMeResponse;
  } catch {
    return null;
  }
}

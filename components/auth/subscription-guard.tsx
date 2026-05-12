"use client";

import { useBillingMeQuery } from "@/hooks/api/use-billing-queries";
import { hasActiveOrTrialingSubscription } from "@/lib/types/billing";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const ALLOWED_WITHOUT_SUBSCRIPTION = new Set([
  "/configuracoes/assinatura",
  "/configuracoes/ajuda",
  "/configuracoes/legal",
  "/legal/termos",
  "/legal/privacidade",
]);

function canAccessWithoutSubscription(pathname: string): boolean {
  if (ALLOWED_WITHOUT_SUBSCRIPTION.has(pathname)) return true;
  return pathname.startsWith("/configuracoes/assinatura");
}

export function SubscriptionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const billingQuery = useBillingMeQuery();

  const hasValidSubscription = hasActiveOrTrialingSubscription(billingQuery.data);
  const shouldBlock =
    !billingQuery.isPending &&
    !billingQuery.isError &&
    !hasValidSubscription &&
    !canAccessWithoutSubscription(pathname);

  useEffect(() => {
    if (!shouldBlock) return;
    router.replace("/configuracoes/assinatura");
  }, [router, shouldBlock]);

  if (shouldBlock) return null;

  return <>{children}</>;
}

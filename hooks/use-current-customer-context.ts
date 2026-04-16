"use client";

import { useSelectedCustomer } from "@/components/providers/selected-customer-provider";
import { useAuthStatusQuery, useProfileQuery } from "@/hooks/api/use-auth-queries";
import { resolveCurrentAgencyId } from "@/lib/auth/resolve-current-agency-id";

export function useCurrentCustomerContext() {
  const { data: auth } = useAuthStatusQuery();
  const authed = auth?.authenticated === true;
  const { data: profile, isPending: profileLoading } = useProfileQuery(authed);
  const {
    selected,
    isReady,
    isLoadingCustomers,
    customers,
    selectCustomer,
    refetchCustomers,
  } = useSelectedCustomer();

  const customerId = selected?.id_customer ?? null;
  const customerName = selected?.name ?? "";
  // Legado: aguardar /api/profile para usar o id_user correto como agency_id.
  const agencyId = profileLoading
    ? ""
    : resolveCurrentAgencyId(auth?.user ?? null, profile ?? null);

  return {
    auth,
    authed,
    profile,
    profileLoading,
    selected,
    customerId,
    customerName,
    agencyId,
    customers,
    selectCustomer,
    refetchCustomers,
    isReady,
    isLoadingCustomers,
  };
}

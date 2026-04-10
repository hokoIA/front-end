import {
  getBillingMe,
  getBillingPlans,
  postBillingCheckout,
  postBillingPortal,
} from "@/lib/api/billing";
import { queryKeys } from "@/lib/api/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useBillingMeQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.billing.me(),
    queryFn: getBillingMe,
    enabled,
  });
}

export function useBillingPlansQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.billing.plans(),
    queryFn: getBillingPlans,
    enabled,
  });
}

export function useBillingCheckoutMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postBillingCheckout,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.billing.all });
    },
  });
}

export function useBillingPortalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body?: Record<string, unknown>) => postBillingPortal(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.billing.all });
    },
  });
}

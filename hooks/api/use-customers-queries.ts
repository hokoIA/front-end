import {
  addCustomer,
  deleteCustomer,
  editCustomer,
  getCustomer,
  listCustomers,
  postCustomerCache,
} from "@/lib/api/customers";
import { queryKeys } from "@/lib/api/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCustomersQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.customers.list(),
    queryFn: listCustomers,
    enabled,
  });
}

export function useCustomerQuery(idCustomer: string | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.customers.detail(idCustomer ?? ""),
    queryFn: () => getCustomer(idCustomer!),
    enabled: Boolean(idCustomer) && enabled,
  });
}

export function useAddCustomerMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}

export function useEditCustomerMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      idCustomer,
      body,
    }: {
      idCustomer: string;
      body: Record<string, unknown>;
    }) => editCustomer(idCustomer, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}

export function useDeleteCustomerMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}

export function useCustomerCacheMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: postCustomerCache,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.customers.all });
      qc.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    },
  });
}

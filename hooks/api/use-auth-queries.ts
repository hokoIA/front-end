import {
  getAuthStatus,
  getProfile,
  logoutRequest,
} from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuthStatusQuery() {
  return useQuery({
    queryKey: queryKeys.auth.status(),
    queryFn: getAuthStatus,
    staleTime: 30_000,
  });
}

export function useProfileQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: getProfile,
    enabled,
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: () => {
      queryClient.clear();
    },
  });
}

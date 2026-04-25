import { getRbacMe } from "@/lib/api/rbac";
import { queryKeys } from "@/lib/api/query-keys";
import { normalizeRbacMe } from "@/lib/types/rbac";
import { useAuthStatusQuery } from "@/hooks/api/use-auth-queries";
import { useQuery } from "@tanstack/react-query";

export function useRbacMeQuery() {
  const { data: auth } = useAuthStatusQuery();
  const authed = auth?.authenticated === true;

  return useQuery({
    queryKey: queryKeys.rbac.me(),
    queryFn: async () => normalizeRbacMe(await getRbacMe()),
    enabled: authed,
  });
}

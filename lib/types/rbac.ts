/** Resposta de GET /api/rbac/me — permissões dependem do backend. */
export type RbacMeResponse = {
  permissions?: string[];
  roles?: string[];
  role?: string;
} & Record<string, unknown>;

export function rbacAllows(
  data: RbacMeResponse | null | undefined,
  permission: string,
): boolean {
  if (!data?.permissions?.length) return false;
  return data.permissions.includes(permission);
}

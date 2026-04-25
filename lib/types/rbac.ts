export type RbacPayload = {
  id_user?: string | number;
  id?: string | number;
  email?: string;
  id_account?: string | number;
  id_team_member?: string | number;
  role?: string;
  permissions?: string[];
} & Record<string, unknown>;

export type RbacMeResponse = {
  success?: boolean;
  data?: RbacPayload;
  user?: RbacPayload;
  permissions?: string[];
  role?: string;
  roles?: string[];
} & Record<string, unknown>;

export type NormalizedRbacMe = {
  id_user: string;
  email: string;
  id_account: string;
  id_team_member?: string;
  role: string;
  permissions: string[];
  raw: RbacMeResponse;
};

function asString(v: unknown): string {
  return v == null ? "" : String(v);
}

export function normalizeRbacMe(
  response: RbacMeResponse | null | undefined,
): NormalizedRbacMe | null {
  if (!response || typeof response !== "object") return null;

  const payload =
    response.data && typeof response.data === "object"
      ? response.data
      : response.user && typeof response.user === "object"
        ? response.user
        : (response as RbacPayload);

  const permissionsRaw = Array.isArray(payload.permissions)
    ? payload.permissions
    : Array.isArray(response.permissions)
      ? response.permissions
      : [];

  return {
    id_user: asString(payload.id_user ?? payload.id ?? ""),
    email: asString(payload.email ?? ""),
    id_account: asString(payload.id_account ?? ""),
    id_team_member:
      payload.id_team_member == null
        ? undefined
        : asString(payload.id_team_member),
    role: asString(payload.role ?? response.role ?? ""),
    permissions: permissionsRaw.map(String),
    raw: response,
  };
}

export function isAdminRbac(
  rbac: NormalizedRbacMe | null | undefined,
): boolean {
  return String(rbac?.role ?? "").toLowerCase() === "admin";
}

export function rbacAllows(
  rbac: NormalizedRbacMe | RbacMeResponse | null | undefined,
  permission: string,
): boolean {
  const normalized =
    rbac && "raw" in rbac
      ? (rbac as NormalizedRbacMe)
      : normalizeRbacMe(rbac as RbacMeResponse);

  if (!normalized) return false;
  if (isAdminRbac(normalized)) return true;
  if (normalized.permissions.includes("*")) return true;
  return normalized.permissions.includes(permission);
}

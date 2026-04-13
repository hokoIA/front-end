import { endpoints } from "./endpoints";
import { httpFetch, httpJson } from "./http-client";
import type { AuthStatus, RawUserLike, UserProfile } from "@/lib/types/user";

export type LoginBody = { email: string; password: string };

export type RegisterBody = {
  email: string;
  password: string;
  name?: string;
};

export async function loginRequest(body: LoginBody): Promise<void> {
  await httpFetch(endpoints.auth.login(), { method: "POST", json: body });
}

/** @deprecated Prefira `loginRequest` — mantido para compatibilidade. */
export const login = loginRequest;

export async function registerRequest(body: RegisterBody): Promise<void> {
  await httpFetch(endpoints.auth.register(), { method: "POST", json: body });
}

/** @deprecated Prefira `registerRequest`. */
export const register = registerRequest;

export async function logoutRequest(): Promise<void> {
  await httpFetch(endpoints.auth.logout(), { method: "POST" });
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function normalizeUser(raw: RawUserLike | null | undefined): UserProfile | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const id = asString(raw.id ?? raw.id_user ?? "");
  const email = asString(raw.email ?? "");

  if (!id && !email) return undefined;

  const name = raw.name ? asString(raw.name) : undefined;
  const avatarRaw = raw.avatarUrl ?? raw.foto_perfil ?? null;
  const avatarUrl = avatarRaw == null ? null : asString(avatarRaw);
  const agency_id = raw.agency_id ? asString(raw.agency_id) : undefined;
  const id_account = raw.id_account ? asString(raw.id_account) : undefined;
  const role = raw.role ? asString(raw.role) : undefined;

  return {
    id,
    email,
    name,
    avatarUrl,
    agency_id,
    id_account,
    role,
  };
}

export async function getProfile(): Promise<UserProfile> {
  const res = await httpJson<{
    success?: unknown;
    message?: unknown;
    user?: RawUserLike;
  }>(endpoints.auth.profile());
  const normalized = normalizeUser(res?.user);
  if (!normalized) {
    throw new Error("Profile wrapper inválido: user ausente ou inválido.");
  }
  return normalized;
}

export async function getAuthStatus(): Promise<AuthStatus> {
  try {
    const res = await httpFetch(endpoints.auth.authStatus(), {
      method: "GET",
      skipErrorThrow: true,
    });
    if (!res.ok) {
      return { authenticated: false };
    }
    const body = (await res.json()) as {
      authenticated?: unknown;
      user?: RawUserLike;
    };
    const authenticated = body?.authenticated === true;
    const user = normalizeUser(body?.user);
    return user ? { authenticated, user } : { authenticated };
  } catch {
    return { authenticated: false };
  }
}

export async function updateProfile(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.auth.update(), { method: "PUT", json: body });
}

export async function uploadAvatar(formData: FormData): Promise<unknown> {
  const res = await httpFetch(endpoints.auth.avatar(), {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function deleteAccount(): Promise<void> {
  await httpFetch(endpoints.auth.deleteAccount(), { method: "DELETE" });
}

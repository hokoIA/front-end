import { endpoints } from "./endpoints";
import { httpFetch, httpJson } from "./http-client";
import type { AuthStatus, UserProfile } from "@/lib/types/user";

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

export async function getProfile(): Promise<UserProfile> {
  return httpJson<UserProfile>(endpoints.auth.profile());
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
    return (await res.json()) as AuthStatus;
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

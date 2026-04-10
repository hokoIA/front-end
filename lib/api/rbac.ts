import type { RbacMeResponse } from "@/lib/types/rbac";
import { endpoints } from "./endpoints";
import { httpJson } from "./http-client";

export async function getRbacMe(): Promise<RbacMeResponse> {
  return httpJson<RbacMeResponse>(endpoints.rbac.me(), { method: "GET" });
}

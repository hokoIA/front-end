import type { Goal, GoalInput } from "@/lib/types/goals";
import { endpoints, withQuery } from "./endpoints";
import { httpJson } from "./http-client";

export async function listGoals(params?: {
  id_customer?: string;
}): Promise<Goal[]> {
  const url = params?.id_customer
    ? withQuery(endpoints.goals.list(), { id_customer: params.id_customer })
    : endpoints.goals.list();
  const data = await httpJson<unknown>(url, {
    method: "GET",
  });
  if (Array.isArray(data)) return data as Goal[];
  if (
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
  ) {
    return (data as { data: Goal[] }).data;
  }
  return [];
}

export async function getGoal(idGoal: string): Promise<Goal> {
  return httpJson<Goal>(endpoints.goals.one(idGoal), { method: "GET" });
}

export async function createGoal(body: GoalInput): Promise<unknown> {
  return httpJson(endpoints.goals.list(), { method: "POST", json: body });
}

export async function updateGoal(
  idGoal: string,
  body: GoalInput,
): Promise<unknown> {
  return httpJson(endpoints.goals.one(idGoal), { method: "PUT", json: body });
}

export async function deleteGoal(idGoal: string): Promise<void> {
  await httpJson(endpoints.goals.one(idGoal), { method: "DELETE" });
}

export async function postGoalActionSuggestions(
  body: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.goals.actionsSuggestions(), {
    method: "POST",
    json: body,
  });
}

export async function postGoalGenerateAnalysis(
  idGoal: string,
  body?: Record<string, unknown>,
): Promise<unknown> {
  return httpJson(endpoints.goals.generateAnalysis(idGoal), {
    method: "POST",
    json: body ?? {},
  });
}

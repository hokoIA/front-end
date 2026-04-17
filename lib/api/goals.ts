import type {
  GoalApi,
  GoalCreatePayload,
  GoalDeleteResponse,
  GoalDetailResponse,
  GoalGenerateAnalysisResponse,
  GoalListResponse,
  GoalMutationResponse,
  GoalSuggestionsResponse,
  GoalUpdatePayload,
} from "@/lib/types/goals";
import { endpoints, withQuery } from "./endpoints";
import { httpJson } from "./http-client";

export type ListGoalsParams = {
  id_customer?: number | string;
  platform_name?: string;
  /** Valor bruto do backend (ex.: ativo, concluido). */
  status?: string;
};

function readListPayload(data: unknown): GoalApi[] {
  if (Array.isArray(data)) return data as GoalApi[];
  const obj = data as GoalListResponse | null;
  if (obj && typeof obj === "object" && Array.isArray(obj.items)) {
    return obj.items;
  }
  if (
    obj &&
    typeof obj === "object" &&
    "data" in obj &&
    Array.isArray((obj as { data: unknown }).data)
  ) {
    return (obj as { data: GoalApi[] }).data;
  }
  return [];
}

export async function listGoals(
  params?: ListGoalsParams,
): Promise<GoalApi[]> {
  const q: Record<string, string | number | undefined> = {};
  if (params?.id_customer !== undefined && params.id_customer !== "") {
    q.id_customer = params.id_customer;
  }
  if (params?.platform_name) q.platform_name = params.platform_name;
  if (params?.status) q.status = params.status;

  const url =
    Object.keys(q).length > 0
      ? withQuery(endpoints.goals.list(), q)
      : endpoints.goals.list();
  const data = await httpJson<unknown>(url, { method: "GET" });
  return readListPayload(data);
}

export async function getGoal(idGoal: string): Promise<GoalApi> {
  const data = await httpJson<GoalDetailResponse | GoalApi>(
    endpoints.goals.one(idGoal),
    { method: "GET" },
  );
  if (data && typeof data === "object" && "goal" in data && data.goal) {
    return data.goal;
  }
  return data as GoalApi;
}

export async function createGoal(
  body: GoalCreatePayload,
): Promise<GoalMutationResponse> {
  return httpJson<GoalMutationResponse>(endpoints.goals.list(), {
    method: "POST",
    json: body,
  });
}

export async function updateGoal(
  idGoal: string,
  body: GoalUpdatePayload,
): Promise<GoalMutationResponse> {
  return httpJson<GoalMutationResponse>(endpoints.goals.one(idGoal), {
    method: "PUT",
    json: body,
  });
}

export async function deleteGoal(idGoal: string): Promise<void> {
  await httpJson<GoalDeleteResponse>(endpoints.goals.one(idGoal), {
    method: "DELETE",
  });
}

export async function postGoalActionSuggestions(body: {
  id_customer: number;
  platform_name: string;
  context: string | null;
}): Promise<GoalSuggestionsResponse> {
  return httpJson<GoalSuggestionsResponse>(
    endpoints.goals.actionsSuggestions(),
    {
      method: "POST",
      json: body,
    },
  );
}

export async function postGoalGenerateAnalysis(
  idGoal: string,
): Promise<GoalGenerateAnalysisResponse> {
  return httpJson<GoalGenerateAnalysisResponse>(
    endpoints.goals.generateAnalysis(idGoal),
    {
      method: "POST",
    },
  );
}

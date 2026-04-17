import {
  createGoal,
  deleteGoal,
  getGoal,
  listGoals,
  postGoalActionSuggestions,
  postGoalGenerateAnalysis,
  updateGoal,
} from "@/lib/api/goals";
import type { ListGoalsParams } from "@/lib/api/goals";
import { queryKeys } from "@/lib/api/query-keys";
import type { GoalCreatePayload, GoalUpdatePayload } from "@/lib/types/goals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGoalsQuery(
  enabled = true,
  listParams?: ListGoalsParams | null,
) {
  const scopeKey =
    listParams?.id_customer != null
      ? String(listParams.id_customer)
      : "all";
  return useQuery({
    queryKey: queryKeys.goals.list(scopeKey),
    queryFn: () => listGoals(listParams ?? undefined),
    enabled,
  });
}

export function useGoalQuery(idGoal: string | null, enabled = true) {
  return useQuery({
    queryKey: queryKeys.goals.detail(idGoal ?? ""),
    queryFn: () => getGoal(idGoal!),
    enabled: Boolean(idGoal) && enabled,
  });
}

export function useCreateGoalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: GoalCreatePayload) => createGoal(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useUpdateGoalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: GoalUpdatePayload }) =>
      updateGoal(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useDeleteGoalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useGoalSuggestionsMutation() {
  return useMutation({
    mutationFn: postGoalActionSuggestions,
  });
}

export function useGoalGenerateAnalysisMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idGoal }: { idGoal: string }) =>
      postGoalGenerateAnalysis(idGoal),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.goals.all });
      qc.invalidateQueries({
        queryKey: queryKeys.goals.detail(variables.idGoal),
      });
    },
  });
}

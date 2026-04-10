import {
  createGoal,
  deleteGoal,
  getGoal,
  listGoals,
  postGoalActionSuggestions,
  postGoalGenerateAnalysis,
  updateGoal,
} from "@/lib/api/goals";
import { queryKeys } from "@/lib/api/query-keys";
import type { GoalInput } from "@/lib/types/goals";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGoalsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.goals.list(),
    queryFn: listGoals,
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
    mutationFn: (body: GoalInput) => createGoal(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

export function useUpdateGoalMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: GoalInput }) =>
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
    mutationFn: ({
      idGoal,
      body,
    }: {
      idGoal: string;
      body?: Record<string, unknown>;
    }) => postGoalGenerateAnalysis(idGoal, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.goals.all });
    },
  });
}

"use client";

import {
  deleteAccount,
  updateProfile,
  uploadAvatar,
} from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => updateProfile(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.auth.profile() });
      void qc.invalidateQueries({ queryKey: queryKeys.auth.status() });
    },
  });
}

export function useUploadAvatarMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append("avatar", file);
      return uploadAvatar(fd);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.auth.profile() });
      void qc.invalidateQueries({ queryKey: queryKeys.auth.status() });
    },
  });
}

export function useDeleteAccountMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      qc.clear();
    },
  });
}

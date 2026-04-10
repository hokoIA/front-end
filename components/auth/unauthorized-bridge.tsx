"use client";

import { onUnauthorized } from "@/lib/api/http-client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Registra listener global de 401: limpa cache e volta ao login. */
export function UnauthorizedBridge() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    return onUnauthorized(() => {
      queryClient.clear();
      router.replace("/login");
    });
  }, [queryClient, router]);

  return null;
}

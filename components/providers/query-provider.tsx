"use client";

import { getFriendlyErrorMessage, isHttpError } from "@/lib/api/errors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: (failureCount, error) => {
              if (isHttpError(error)) {
                if (
                  error.status === 401 ||
                  error.status === 403 ||
                  error.status === 404
                ) {
                  return false;
                }
              }
              return failureCount < 1;
            },
            refetchOnWindowFocus: false,
          },
          mutations: {
            onError: (error) => {
              toast.error(getFriendlyErrorMessage(error));
            },
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

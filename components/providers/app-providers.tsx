"use client";

import { UnauthorizedBridge } from "@/components/auth/unauthorized-bridge";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <UnauthorizedBridge />
      <AuthProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </AuthProvider>
    </QueryProvider>
  );
}

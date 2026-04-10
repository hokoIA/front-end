"use client";

import { UnauthorizedBridge } from "@/components/auth/unauthorized-bridge";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { SelectedCustomerProvider } from "./selected-customer-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <UnauthorizedBridge />
      <AuthProvider>
        <SelectedCustomerProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </SelectedCustomerProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

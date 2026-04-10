import { AuthGuard } from "@/components/auth/auth-guard";
import { AppShell } from "@/components/layout/app-shell";
import { SelectedCustomerProvider } from "@/components/providers/selected-customer-provider";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SelectedCustomerProvider>
        <AppShell>{children}</AppShell>
      </SelectedCustomerProvider>
    </AuthGuard>
  );
}

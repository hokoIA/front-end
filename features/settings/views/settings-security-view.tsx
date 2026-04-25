"use client";

import { ChangePasswordCard } from "../components/change-password-card";
import { DeleteAccountDangerZone } from "../components/delete-account-danger-zone";
import { SecuritySessionCard } from "../components/security-session-card";
import { SettingsPageHeader } from "../components/settings-page-header";
import { useDeleteAccountMutation } from "../hooks/use-settings-mutations";
export function SettingsSecurityView() {
  const deleteMut = useDeleteAccountMutation();

  return (
    <div className="space-y-7 lg:space-y-8">
      <SettingsPageHeader
        title="Segurança"
        description="Proteção da conta, sessão com cookie HTTP-only e ações sensíveis com confirmação explícita."
        eyebrow="Configurações"
      />

      <ChangePasswordCard />

      <SecuritySessionCard />

      <DeleteAccountDangerZone onDelete={() => deleteMut.mutateAsync()} />
    </div>
  );
}

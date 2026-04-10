"use client";

import { AccountInfoForm } from "../components/account-info-form";
import { AccountProfileCard } from "../components/account-profile-card";
import { AccountRoleCard } from "../components/account-role-card";
import { AvatarUploadCard } from "../components/avatar-upload-card";
import { ChangePasswordCard } from "../components/change-password-card";
import { SettingsPageHeader } from "../components/settings-page-header";
import { SettingsErrorState } from "../components/settings-states";
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "../hooks/use-settings-mutations";
import { useProfileQuery } from "@/hooks/api/use-auth-queries";
import { useRbacMeQuery } from "@/hooks/api/use-rbac-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorKind } from "@/lib/api/errors";
import { toast } from "sonner";

export function SettingsAccountView() {
  const profileQuery = useProfileQuery();
  const rbacQuery = useRbacMeQuery();
  const updateProfile = useUpdateProfileMutation();
  const uploadAvatar = useUploadAvatarMutation();

  const err = profileQuery.error;
  const forbidden = err && getErrorKind(err) === "forbidden";

  if (profileQuery.isError && err) {
    return (
      <SettingsErrorState
        error={err}
        onRetry={() => void profileQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-8">
      <SettingsPageHeader
        title="Conta"
        description="Identidade do seu usuário na plataforma: perfil visível à equipe, avatar e dados cadastrais alinhados ao API Gateway."
        eyebrow="Configurações"
      />

      {profileQuery.isPending ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <AccountProfileCard
              profile={profileQuery.data}
              loading={profileQuery.isFetching}
            />
            <AvatarUploadCard
              onUpload={async (file) => {
                await uploadAvatar.mutateAsync(file);
                toast.success("Foto do perfil atualizada.");
              }}
              disabled={forbidden || uploadAvatar.isPending}
            />
          </div>
          <AccountInfoForm
            profile={profileQuery.data}
            allowEmailEdit={false}
            onSave={async (body) => {
              await updateProfile.mutateAsync(body);
            }}
          />
          <AccountRoleCard
            rbac={rbacQuery.data}
            loading={rbacQuery.isPending}
          />
          <ChangePasswordCard />
        </>
      )}
    </div>
  );
}

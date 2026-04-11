"use client";

import { InviteMemberForm } from "@/features/team/components/invite-member-form";
import type { TeamRoleUi } from "@/features/team/types/ui";
import { Mail } from "lucide-react";

export function InviteMemberCard({
  email,
  role,
  message,
  onEmailChange,
  onRoleChange,
  onMessageChange,
  onSubmit,
  loading,
  readOnly,
  readOnlyHint,
}: {
  email: string;
  role: TeamRoleUi;
  message: string;
  onEmailChange: (v: string) => void;
  onRoleChange: (v: TeamRoleUi) => void;
  onMessageChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  readOnly?: boolean;
  readOnlyHint?: string;
}) {
  return (
    <section
      aria-label="Convidar novo membro"
      className="rounded-xl border border-hk-border bg-gradient-to-br from-hk-surface via-hk-surface to-hk-cyan/10 p-5 shadow-hk-md md:p-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-hk-action/10 text-hk-action">
          <Mail className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-hk-deep">
            Convidar novo membro
          </h2>
          <p className="mt-1 text-sm text-hk-muted">
            Envie um convite por e-mail. O destinatário receberá o link para
            entrar nesta conta com o nível escolhido.
          </p>
        </div>
      </div>
      <div className="mt-6 border-t border-hk-border-subtle pt-6">
        {readOnly ? (
          <p className="text-sm text-hk-muted">
            {readOnlyHint ??
              "Apenas administradores podem enviar convites."}
          </p>
        ) : (
          <InviteMemberForm
            email={email}
            role={role}
            message={message}
            onEmailChange={onEmailChange}
            onRoleChange={onRoleChange}
            onMessageChange={onMessageChange}
            onSubmit={onSubmit}
            loading={loading}
          />
        )}
      </div>
    </section>
  );
}

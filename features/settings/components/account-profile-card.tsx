"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/lib/types/user";
import { User } from "lucide-react";

type Props = {
  profile: UserProfile | undefined;
  loading?: boolean;
};

export function AccountProfileCard({ profile, loading }: Props) {
  const initial =
    profile?.name?.trim()?.charAt(0)?.toUpperCase() ||
    profile?.email?.charAt(0)?.toUpperCase() ||
    "?";

  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-hk-border bg-hk-canvas text-xl font-semibold text-hk-deep">
          {profile?.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span aria-hidden>{initial}</span>
          )}
        </div>
        <div className="min-w-0">
          <CardTitle className="text-lg text-hk-deep">
            {loading ? "Carregando…" : profile?.name || "Sem nome exibido"}
          </CardTitle>
          <p className="mt-1 truncate text-sm text-hk-muted">
            {profile?.email ?? "—"}
          </p>
        </div>
        <User className="ml-auto hidden size-5 text-hk-border sm:block" />
      </CardHeader>
      <CardContent className="text-xs text-hk-muted">
        O nome e o avatar são exibidos para sua equipe nos fluxos internos da
        plataforma.
      </CardContent>
    </Card>
  );
}

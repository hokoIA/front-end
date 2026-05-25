"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  acceptInviteRequest,
  getAuthStatus,
  validateInviteRequest,
} from "@/lib/api/auth";
import { getHttpErrorMessage } from "@/lib/api/errors";
import { queryKeys } from "@/lib/api/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const token = searchParams.get("token") ?? "";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inviteQ = useQuery({
    queryKey: ["auth", "invite", token],
    queryFn: () => validateInviteRequest(token),
    enabled: Boolean(token),
    retry: false,
  });

  const acceptMut = useMutation({
    mutationFn: () =>
      acceptInviteRequest({
        token,
        name,
        password,
        confirmPassword,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      await queryClient.fetchQuery({
        queryKey: queryKeys.auth.status(),
        queryFn: getAuthStatus,
      });
      toast.success("Convite aceito. Bem-vindo(a).");
      router.replace("/dashboard");
    },
    onError: (error) => {
      toast.error(getHttpErrorMessage(error));
    },
  });

  const invite = inviteQ.data?.invite;
  const canSubmit =
    Boolean(token) &&
    Boolean(invite) &&
    name.trim().length > 1 &&
    password.length >= 6 &&
    password === confirmPassword &&
    !acceptMut.isPending;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Preencha os dados e confirme as senhas.");
      return;
    }
    acceptMut.mutate();
  }

  return (
    <Card className="border-hk-border shadow-hk-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-hk-deep">Aceitar convite</CardTitle>
        <CardDescription>
          Defina sua senha para entrar no workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!token ? (
          <div className="space-y-4 text-sm text-hk-muted">
            <p>Link de convite invalido.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Voltar para login</Link>
            </Button>
          </div>
        ) : inviteQ.isPending ? (
          <div className="flex items-center gap-2 text-sm text-hk-muted">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Validando convite...
          </div>
        ) : inviteQ.isError || !invite ? (
          <div className="space-y-4 text-sm text-hk-muted">
            <p>Convite expirado ou invalido.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Voltar para login</Link>
            </Button>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={submit} noValidate>
            <div className="rounded-lg border border-hk-border bg-hk-canvas px-3 py-2 text-sm text-hk-muted">
              {invite.email}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-hk-muted transition-colors hover:text-hk-deep"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  className="pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-hk-muted transition-colors hover:text-hk-deep"
                  aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {acceptMut.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                "Ativar acesso"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function AcceptInviteFallback() {
  return (
    <Card className="border-hk-border shadow-hk-md">
      <CardContent className="py-12 text-center text-sm text-hk-muted">
        Carregando...
      </CardContent>
    </Card>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<AcceptInviteFallback />}>
      <AcceptInviteForm />
    </Suspense>
  );
}

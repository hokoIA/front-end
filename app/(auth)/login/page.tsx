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
import { loginSchema } from "@/features/auth/schemas";
import { getHttpErrorMessage } from "@/lib/api/errors";
import { getAuthStatus, loginRequest } from "@/lib/api/auth";
import { getBillingMeSafe } from "@/lib/api/billing";
import { queryKeys } from "@/lib/api/query-keys";
import { hasActiveOrTrialingSubscription } from "@/lib/types/billing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const verified = searchParams.get("verified");

  useEffect(() => {
    if (verified === "1") {
      toast.success("E-mail confirmado com sucesso. Faça login para continuar.");
    }
  }, [verified]);

  async function onSubmit(values: FormValues) {
    try {
      await loginRequest(values);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      const auth = await queryClient.fetchQuery({
        queryKey: queryKeys.auth.status(),
        queryFn: getAuthStatus,
      });

      if (!auth?.authenticated) {
        toast.error(
          "Login não confirmado. Verifique as credenciais ou se o cookie de sessão foi definido.",
        );
        return;
      }

      toast.success("Sessão iniciada.");

      const billing = await getBillingMeSafe();
      const nextRaw = searchParams.get("next");
      const next =
        nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
          ? nextRaw
          : null;

      if (hasActiveOrTrialingSubscription(billing)) {
        router.replace(next ?? "/dashboard");
        return;
      }

      if (billing === null) {
        router.replace(next ?? "/dashboard");
        return;
      }

      router.replace("/configuracoes/assinatura");
    } catch (error) {
      toast.error(getHttpErrorMessage(error));
    }
  }

  return (
    <Card className="border-hk-border shadow-hk-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-hk-deep">Entrar</CardTitle>
        <CardDescription>
          Acesse o workspace com o e-mail corporativo cadastrado.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nome@empresa.com.br"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-hk-action hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="pr-10"
                {...form.register("password")}
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
            {form.formState.errors.password && (
              <p className="text-xs text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Entrando…" : "Entrar"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-hk-muted">
          Não possui conta?{" "}
          <Link
            href="/register"
            className="font-medium text-hk-action hover:underline"
          >
            Solicitar acesso
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

function LoginFallback() {
  return (
    <Card className="border-hk-border shadow-hk-md">
      <CardContent className="py-12 text-center text-sm text-hk-muted">
        Carregando…
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

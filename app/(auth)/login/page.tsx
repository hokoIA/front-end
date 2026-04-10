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
import { loginRequest } from "@/lib/api/auth";
import { getBillingMeSafe } from "@/lib/api/billing";
import { queryKeys } from "@/lib/api/query-keys";
import { hasActiveOrTrialingSubscription } from "@/lib/types/billing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    try {
      await loginRequest(values);
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

      const billing = await getBillingMeSafe();
      const nextRaw = searchParams.get("next");
      const next =
        nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
          ? nextRaw
          : null;

      toast.success("Sessão iniciada.");

      if (hasActiveOrTrialingSubscription(billing)) {
        router.replace(next ?? "/dashboard");
      } else {
        router.replace("/configuracoes/assinatura");
      }
    } catch {
      toast.error(
        "Não foi possível entrar. Verifique as credenciais ou a URL da API.",
      );
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
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...form.register("password")}
            />
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

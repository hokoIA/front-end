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
import { registerSchema } from "@/features/auth/schemas";
import { registerRequest } from "@/lib/api/auth";
import { getHttpErrorMessage } from "@/lib/api/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
  });
  const passwordValue =
    useWatch({
      control: form.control,
      name: "password",
      defaultValue: "",
    }) ?? "";
  const passwordChecks = [
    {
      id: "length",
      label: "Mínimo de 8 caracteres",
      ok: passwordValue.length >= 8,
    },
    {
      id: "uppercase",
      label: "Pelo menos 1 letra maiúscula",
      ok: /[A-Z]/.test(passwordValue),
    },
    {
      id: "lowercase",
      label: "Pelo menos 1 letra minúscula",
      ok: /[a-z]/.test(passwordValue),
    },
    {
      id: "number",
      label: "Pelo menos 1 número",
      ok: /[0-9]/.test(passwordValue),
    },
    {
      id: "special",
      label: "Pelo menos 1 caractere especial",
      ok: /[^A-Za-z0-9]/.test(passwordValue),
    },
  ];

  async function onSubmit(values: FormValues) {
    try {
      await registerRequest({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success("Conta criada. Verifique seu e-mail para ativar o acesso.");
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      toast.error(getHttpErrorMessage(error));
    }
  }

  return (
    <Card className="border-hk-border shadow-hk-md">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-xl text-hk-deep">Criar conta</CardTitle>
        <CardDescription>
          Cadastro para equipes e agências. Os dados seguem política corporativa
          de privacidade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" autoComplete="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail corporativo</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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
            <ul className="space-y-1 text-xs text-hk-muted">
              {passwordChecks.map((check) => (
                <li
                  key={check.id}
                  className={
                    check.ok
                      ? "flex items-center gap-2 text-emerald-700"
                      : "flex items-center gap-2"
                  }
                >
                  <Check size={14} className={check.ok ? "opacity-100" : "opacity-40"} />
                  <span>{check.label}</span>
                </li>
              ))}
            </ul>
            {form.formState.errors.password && (
              <p className="text-xs text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmar senha</Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                className="pr-10"
                {...form.register("confirm")}
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
            {form.formState.errors.confirm && (
              <p className="text-xs text-red-600">
                {form.formState.errors.confirm.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Enviando…" : "Criar conta"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-hk-muted">
          Já possui acesso?{" "}
          <Link
            href="/login"
            className="font-medium text-hk-action hover:underline"
          >
            Entrar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

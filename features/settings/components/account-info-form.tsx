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
  accountProfileSchema,
  type AccountProfileForm,
} from "../schemas/account";
import type { UserProfile } from "@/lib/types/user";
import { getFriendlyErrorMessage } from "@/lib/api/errors";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {
  profile: UserProfile | undefined;
  onSave: (body: Record<string, unknown>) => Promise<void>;
  allowEmailEdit?: boolean;
};

export function AccountInfoForm({
  profile,
  onSave,
  allowEmailEdit = false,
}: Props) {
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<AccountProfileForm>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (!profile) return;
    form.reset({
      name: profile.name ?? "",
      email: profile.email ?? "",
    });
  }, [profile, form]);

  async function submit(values: AccountProfileForm) {
    setFormError(null);
    const body: Record<string, unknown> = { name: values.name.trim() };
    if (allowEmailEdit && values.email?.trim()) {
      body.email = values.email.trim();
    }
    try {
      await onSave(body);
      toast.success("Dados da conta atualizados.");
    } catch (e) {
      const msg = getFriendlyErrorMessage(e);
      setFormError(msg);
      toast.error(msg);
    }
  }

  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader>
        <CardTitle className="text-base text-hk-deep">
          Dados cadastrais
        </CardTitle>
        <CardDescription>
          Nome exibido na plataforma. O e-mail é o identificador principal da
          conta
          {allowEmailEdit
            ? " e pode ser alterado quando permitido pela API."
            : " — alterações de e-mail podem exigir validação no backend."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((v) => void submit(v))}
        >
          <div className="space-y-2">
            <Label htmlFor="acc-name">Nome exibido</Label>
            <Input
              id="acc-name"
              autoComplete="name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="acc-email">E-mail principal</Label>
            <Input
              id="acc-email"
              type="email"
              autoComplete="email"
              disabled={!allowEmailEdit}
              {...form.register("email")}
            />
            {!allowEmailEdit && (
              <p className="text-xs text-hk-muted">
                Somente leitura. Se precisar alterar o e-mail corporativo,
                contate o suporte com aprovação da organização.
              </p>
            )}
            {form.formState.errors.email && (
              <p className="text-xs text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          {formError ? (
            <p className="text-sm text-red-600">{formError}</p>
          ) : null}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Salvando…
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

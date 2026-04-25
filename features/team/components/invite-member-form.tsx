"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteMemberForm({
  email,
  onEmailChange,
  onSubmit,
  loading,
  disabled,
}: {
  email: string;
  onEmailChange: (v: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const invalidEmail = Boolean(
    email.trim() && !EMAIL_RE.test(email.trim()),
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="hk-invite-email">E-mail do convidado</Label>
        <Input
          id="hk-invite-email"
          type="email"
          autoComplete="email"
          placeholder="nome@empresa.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={disabled || loading}
          aria-invalid={invalidEmail ? true : undefined}
        />
        {invalidEmail ? (
          <p className="text-xs text-rose-700">Informe um e-mail válido.</p>
        ) : null}
      </div>
      <p className="text-xs text-hk-muted">
        Convites entram como <strong>Equipe</strong>. Depois do aceite, um admin
        pode alterar o nível de acesso.
      </p>
      <Button
        type="button"
        className="w-full gap-2 bg-hk-action text-white hover:bg-hk-strong sm:w-auto"
        disabled={
          disabled || loading || !email.trim() || invalidEmail
        }
        onClick={onSubmit}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Send className="h-4 w-4" aria-hidden />
        )}
        Enviar convite
      </Button>
    </div>
  );
}

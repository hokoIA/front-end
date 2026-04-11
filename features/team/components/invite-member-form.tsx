"use client";

import type { TeamRoleUi } from "@/features/team/types/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InviteMemberForm({
  email,
  role,
  message,
  onEmailChange,
  onRoleChange,
  onMessageChange,
  onSubmit,
  loading,
  disabled,
}: {
  email: string;
  role: TeamRoleUi;
  message: string;
  onEmailChange: (v: string) => void;
  onRoleChange: (v: TeamRoleUi) => void;
  onMessageChange: (v: string) => void;
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
      <div className="grid gap-2">
        <Label>Nível de acesso</Label>
        <Select
          value={role}
          onValueChange={(v) => onRoleChange(v as TeamRoleUi)}
          disabled={disabled || loading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin — gestão completa da conta</SelectItem>
            <SelectItem value="team">Equipe — acesso operacional</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="hk-invite-msg">Mensagem (opcional)</Label>
        <Textarea
          id="hk-invite-msg"
          rows={2}
          placeholder="Uma linha de contexto para quem recebe o convite."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          disabled={disabled || loading}
        />
      </div>
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

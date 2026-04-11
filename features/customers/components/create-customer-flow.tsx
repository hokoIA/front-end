"use client";

import { useAddCustomerMutation } from "@/hooks/api/use-customers-queries";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

function record(data: unknown): Record<string, unknown> | null {
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }
  return null;
}

function parseNewCustomerId(res: unknown): string | undefined {
  const r = record(res);
  if (!r) return undefined;
  const id = r.id_customer ?? r.id;
  return id !== undefined && id !== null ? String(id) : undefined;
}

export function CreateCustomerFlow({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (idCustomer: string | undefined) => void;
}) {
  const [name, setName] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const add = useAddCustomerMutation();

  const reset = useCallback(() => {
    setName("");
    setEmpresa("");
    setEmail("");
    setTelefone("");
  }, []);

  const handleClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        empresa: empresa.trim() || undefined,
        email: email.trim() || undefined,
        telefone: telefone.trim() || undefined,
      };
      const res = await add.mutateAsync(body);
      const id = parseNewCustomerId(res);
      toast.success("Cliente criado. Conecte as plataformas na sequência.");
      handleClose(false);
      onCreated?.(id);
    } catch {
      toast.error("Não foi possível criar o cliente. Tente novamente.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md overflow-hidden border-hk-border p-0 sm:max-w-lg">
        <div className="bg-gradient-to-br from-hk-deep via-hk-strong to-hk-action px-6 pb-8 pt-6 text-white">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-xl text-white">
              Novo cliente
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Cadastro inicial rápido: crie o cliente agora e conecte as
              plataformas em seguida para liberar dados no painel.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div className="grid gap-2">
            <Label htmlFor="hk-new-name">Nome</Label>
            <Input
              id="hk-new-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do cliente ou projeto"
              autoComplete="name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hk-new-empresa">Empresa</Label>
            <Input
              id="hk-new-empresa"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Razão social ou marca"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
            <div className="grid gap-2">
              <Label htmlFor="hk-new-email">E-mail</Label>
              <Input
                id="hk-new-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com"
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hk-new-tel">Telefone</Label>
              <Input
                id="hk-new-tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="+55 …"
                autoComplete="tel"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="border-t border-hk-border-subtle bg-hk-canvas/50 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={add.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="gap-2 bg-hk-action text-white hover:bg-hk-strong"
            onClick={() => void submit()}
            disabled={add.isPending}
          >
            {add.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <UserPlus className="h-4 w-4" aria-hidden />
            )}
            Criar cliente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

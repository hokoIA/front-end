"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { getFriendlyErrorMessage } from "@/lib/api/errors";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  onDelete: () => Promise<void>;
};

const CONFIRM = "EXCLUIR";

export function DeleteAccountDangerZone({ onDelete }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function confirm() {
    if (text.trim() !== CONFIRM) {
      toast.error(`Digite ${CONFIRM} para confirmar.`);
      return;
    }
    setBusy(true);
    try {
      await onDelete();
      toast.success("Conta encerrada. Redirecionando…");
      router.replace("/login");
    } catch (e) {
      toast.error(getFriendlyErrorMessage(e));
    } finally {
      setBusy(false);
      setOpen(false);
      setText("");
    }
  }

  return (
    <>
      <Card className="border-red-200 bg-red-50/30">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="size-5 shrink-0" />
            <CardTitle className="text-base">Zona de risco</CardTitle>
          </div>
          <CardDescription className="text-red-900/80">
            Excluir a conta remove o acesso ao workspace e pode afetar dados
            vinculados conforme contrato e lei aplicável. Esta ação costuma ser
            irreversível no gateway.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            Excluir minha conta
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão da conta</DialogTitle>
            <DialogDescription>
              Para prosseguir, digite <strong>{CONFIRM}</strong> no campo abaixo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="del-confirm">Confirmação</Label>
            <Input
              id="del-confirm"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={CONFIRM}
              autoComplete="off"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={busy || text.trim() !== CONFIRM}
              onClick={() => void confirm()}
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Excluir definitivamente"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

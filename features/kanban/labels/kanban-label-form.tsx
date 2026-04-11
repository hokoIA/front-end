"use client";

import type { KanbanLabelUi } from "@/features/kanban/types/ui";
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
import { useEffect, useState } from "react";

export function KanbanLabelForm({
  open,
  onOpenChange,
  mode,
  label,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: "create" | "edit";
  label: KanbanLabelUi | null;
  onSubmit: (payload: { name: string; color: string }) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#64748b");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && label) {
      setName(label.name);
      setColor(label.color || "#64748b");
    } else {
      setName("");
      setColor("#64748b");
    }
  }, [open, mode, label]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    onSubmit({ name: n, color: color.trim() || "#64748b" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Nova etiqueta" : "Editar etiqueta"}
            </DialogTitle>
            <DialogDescription>
              Etiquetas ajudam a filtrar cards por campanha, prioridade ou
              qualquer convenção da agência.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="hk-label-name">Nome</Label>
              <Input
                id="hk-label-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Aprovação pendente"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hk-label-color">Cor</Label>
              <div className="flex gap-2">
                <Input
                  id="hk-label-color"
                  type="color"
                  className="h-10 w-14 cursor-pointer p-1"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-hk-deep text-white hover:bg-hk-strong"
              disabled={isPending || !name.trim()}
            >
              {isPending ? "Salvando…" : mode === "create" ? "Criar" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

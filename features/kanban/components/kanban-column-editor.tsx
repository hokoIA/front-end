"use client";

import type { KanbanColumnUi } from "@/features/kanban/types/ui";
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

const DEFAULT_COLOR = "#192bc2";

export function KanbanColumnEditor({
  open,
  onOpenChange,
  mode,
  column,
  onSubmit,
  isPending,
  errorMessage,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: "create" | "edit";
  column: KanbanColumnUi | null;
  onSubmit: (payload: { name: string; color: string }) => void;
  isPending: boolean;
  errorMessage?: string | null;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && column) {
      setName(column.name);
      setColor(column.color || DEFAULT_COLOR);
    } else {
      setName("");
      setColor(DEFAULT_COLOR);
    }
  }, [open, mode, column]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    onSubmit({ name: n, color: color.trim() || DEFAULT_COLOR });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Nova coluna" : "Editar coluna"}
            </DialogTitle>
            <DialogDescription>
              Nome e cor ajudam a identificar etapas do fluxo em visões com
              muitos clientes e cards.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="hk-col-name">Nome</Label>
              <Input
                id="hk-col-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Revisão interna"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hk-col-color">Cor</Label>
              <div className="flex gap-2">
                <Input
                  id="hk-col-color"
                  type="color"
                  className="h-10 w-14 cursor-pointer p-1"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#192bc2"
                  className="font-mono text-sm"
                />
              </div>
            </div>
            {errorMessage ? (
              <p className="text-sm text-rose-600" role="alert">
                {errorMessage}
              </p>
            ) : null}
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

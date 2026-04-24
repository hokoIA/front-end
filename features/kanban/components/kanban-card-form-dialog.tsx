"use client";

import type {
  KanbanCardUi,
  KanbanClientRowUi,
  KanbanColumnUi,
  KanbanLabelUi,
  KanbanTeamMemberUi,
} from "@/features/kanban/types/ui";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";

const UNASSIGNED = "unassigned";
const WEEK_OPTIONS = ["S1", "S2", "S3", "S4"] as const;

function buildCardPayload(values: {
  title: string;
  columnId: string;
  week: string;
  dueDate: string;
  customerId: string;
  assigneeIds: string[];
  labelIds: string[];
  description: string;
}): Record<string, unknown> {
  const week = WEEK_OPTIONS.includes(values.week as (typeof WEEK_OPTIONS)[number])
    ? values.week
    : "S1";
  return {
    title: values.title.trim(),
    column_id: values.columnId,
    week,
    due_date: values.dueDate || null,
    id_customer:
      values.customerId && values.customerId !== "none"
        ? Number(values.customerId)
        : null,
    assignee_ids: values.assigneeIds.map(Number),
    label_ids: values.labelIds,
    copy_text: values.description.trim() || null,
  };
}

export function KanbanCardFormDialog({
  open,
  onOpenChange,
  mode,
  initial,
  defaultColumnId,
  columns,
  labels,
  clients,
  team,
  onCreate,
  onUpdate,
  isPending,
  errorMessage,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: "create" | "edit";
  initial: KanbanCardUi | null;
  defaultColumnId?: string;
  columns: KanbanColumnUi[];
  labels: KanbanLabelUi[];
  clients: KanbanClientRowUi[];
  team: KanbanTeamMemberUi[];
  onCreate: (body: Record<string, unknown>) => void;
  onUpdate: (id: string, body: Record<string, unknown>) => void;
  isPending: boolean;
  errorMessage?: string | null;
}) {
  const realColumns = useMemo(
    () => columns.filter((c) => c.id !== UNASSIGNED),
    [columns],
  );

  const firstCol = realColumns[0]?.id ?? "";

  const [title, setTitle] = useState("");
  const [columnId, setColumnId] = useState(firstCol);
  const [week, setWeek] = useState<(typeof WEEK_OPTIONS)[number]>("S1");
  const [dueDate, setDueDate] = useState("");
  const [customerId, setCustomerId] = useState("none");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [labelIds, setLabelIds] = useState<string[]>([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      setTitle(initial.title);
      setColumnId(
        realColumns.some((c) => c.id === initial.columnId)
          ? initial.columnId
          : firstCol,
      );
      const initialWeek = (initial.week ?? "").toUpperCase();
      setWeek(
        WEEK_OPTIONS.includes(initialWeek as (typeof WEEK_OPTIONS)[number])
          ? (initialWeek as (typeof WEEK_OPTIONS)[number])
          : "S1",
      );
      setDueDate(initial.dueDate ? initial.dueDate.slice(0, 10) : "");
      setCustomerId(initial.customerId ?? "none");
      setAssigneeIds([...initial.assigneeIds]);
      setLabelIds([...initial.labelIds]);
      setDescription(initial.description ?? "");
    } else {
      setTitle("");
      setColumnId(defaultColumnId && realColumns.some((c) => c.id === defaultColumnId) ? defaultColumnId : firstCol);
      setWeek("S1");
      setDueDate("");
      setCustomerId("none");
      setAssigneeIds([]);
      setLabelIds([]);
      setDescription("");
    }
  }, [open, mode, initial, defaultColumnId, realColumns, firstCol]);

  const toggleAssignee = (id: string) => {
    setAssigneeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleLabel = (id: string) => {
    setLabelIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const col =
      columnId && realColumns.some((c) => c.id === columnId)
        ? columnId
        : firstCol;
    if (!col) return;
    const body = buildCardPayload({
      title,
      columnId: col,
      week,
      dueDate,
      customerId,
      assigneeIds,
      labelIds,
      description,
    });
    if (mode === "edit" && initial) {
      onUpdate(initial.id, body);
    } else {
      onCreate(body);
    }
  };

  const noColumns = realColumns.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto sm:max-w-xl">
        <form onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? "Novo card" : "Editar card"}
            </DialogTitle>
            <DialogDescription>
              Defina contexto operacional: coluna, cliente, prazo, equipe e
              copy.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {noColumns ? (
              <p className="text-sm text-amber-800">
                Crie pelo menos uma coluna antes de adicionar cards.
              </p>
            ) : null}

            <div className="grid gap-2">
              <Label htmlFor="hk-card-title">Título</Label>
              <Input
                id="hk-card-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Roteiro stories — campanha Q2"
                autoFocus
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-2">
                <Label>Coluna</Label>
                <Select
                  value={columnId || firstCol}
                  onValueChange={setColumnId}
                  disabled={noColumns}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Coluna" />
                  </SelectTrigger>
                  <SelectContent>
                    {realColumns.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hk-card-week">Semana (referência)</Label>
                <Select value={week} onValueChange={(v) => setWeek(v as (typeof WEEK_OPTIONS)[number])}>
                  <SelectTrigger id="hk-card-week">
                    <SelectValue placeholder="Semana" />
                  </SelectTrigger>
                  <SelectContent>
                    {WEEK_OPTIONS.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hk-card-due">Prazo</Label>
                <Input
                  id="hk-card-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Cliente</Label>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Responsáveis</Label>
              <div className="max-h-36 space-y-2 overflow-y-auto rounded-md border border-hk-border p-3">
                {team.length === 0 ? (
                  <p className="text-xs text-hk-muted">
                    Nenhum membro na equipe listado pela API.
                  </p>
                ) : (
                  team.map((m) => (
                    <label
                      key={m.id}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <Checkbox
                        checked={assigneeIds.includes(m.id)}
                        onCheckedChange={() => toggleAssignee(m.id)}
                      />
                      <span>{m.name}</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Etiquetas</Label>
              <div className="flex flex-wrap gap-2">
                {labels.length === 0 ? (
                  <p className="text-xs text-hk-muted">
                    Cadastre etiquetas na aba correspondente.
                  </p>
                ) : (
                  labels.map((l) => (
                    <label
                      key={l.id}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-hk-border px-2 py-1 text-xs"
                      style={{
                        borderColor: `${l.color}55`,
                        backgroundColor: `${l.color}14`,
                      }}
                    >
                      <Checkbox
                        checked={labelIds.includes(l.id)}
                        onCheckedChange={() => toggleLabel(l.id)}
                      />
                      {l.name}
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hk-card-copy">Copy / descrição</Label>
              <Textarea
                id="hk-card-copy"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Texto principal, briefing ou rascunho visível no card."
                rows={4}
              />
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
              disabled={isPending || !title.trim() || noColumns}
            >
              {isPending
                ? "Salvando…"
                : mode === "create"
                  ? "Criar card"
                  : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

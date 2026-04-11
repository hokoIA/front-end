"use client";

import type { KanbanTeamMemberUi } from "@/features/kanban/types/ui";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NONE = "__none__";

export function KanbanRoleAssignmentField({
  id,
  label,
  value,
  team,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  team: KanbanTeamMemberUi[];
  onChange: (memberId: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs text-hk-muted">
        {label}
      </Label>
      <Select
        value={value || NONE}
        onValueChange={(v) => onChange(v === NONE ? "" : v)}
        disabled={disabled}
      >
        <SelectTrigger id={id} className="h-9">
          <SelectValue placeholder="Não definido" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE}>Não definido</SelectItem>
          {team.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.email && m.email !== "—" ? `${m.name} (${m.email})` : m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

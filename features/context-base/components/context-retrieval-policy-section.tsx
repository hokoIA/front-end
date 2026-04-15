"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContextDocumentFormState, ContextRoleValue } from "../types";
import { PRIORITY_OPTIONS } from "../utils/constants";

type Props = {
  form: ContextDocumentFormState;
  setForm: React.Dispatch<React.SetStateAction<ContextDocumentFormState>>;
  disabled?: boolean;
};

export function ContextRetrievalPolicySection({
  form,
  setForm,
  disabled,
}: Props) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-hk-deep">
          Instruções para recuperação na IA
        </h3>
        <p className="mt-1 text-xs text-hk-muted">
          Campos de governança futura ficam salvos apenas na UI por enquanto e
          não fazem parte do payload legado enviado agora.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Prioridade de uso</Label>
          <Select
            value={form.priorityUse}
            onValueChange={(priorityUse) =>
              setForm((f) => ({ ...f, priorityUse }))
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Papel do contexto</Label>
          <Select
            value={form.contextRole}
            onValueChange={(contextRole) =>
              setForm((f) => ({
                ...f,
                contextRole: contextRole as ContextRoleValue,
              }))
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Contexto principal</SelectItem>
              <SelectItem value="complementary">Complementar</SelectItem>
              <SelectItem value="historical">Histórico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctx-rel">Relevância estratégica (notas)</Label>
        <Input
          id="ctx-rel"
          value={form.strategicRelevance}
          onChange={(e) =>
            setForm((f) => ({ ...f, strategicRelevance: e.target.value }))
          }
          placeholder="Ex.: decisório para narrativa trimestral"
          disabled={disabled}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="ctx-ana"
            checked={form.allowAnalysis}
            onCheckedChange={(c) =>
              setForm((f) => ({ ...f, allowAnalysis: c === true }))
            }
            disabled={disabled}
          />
          <Label htmlFor="ctx-ana" className="text-sm font-normal leading-snug">
            Permitir uso em análises
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="ctx-chat"
            checked={form.allowChat}
            onCheckedChange={(c) =>
              setForm((f) => ({ ...f, allowChat: c === true }))
            }
            disabled={disabled}
          />
          <Label htmlFor="ctx-chat" className="text-sm font-normal leading-snug">
            Permitir uso em respostas de chat
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="ctx-off"
            checked={form.isOfficial}
            onCheckedChange={(c) =>
              setForm((f) => ({ ...f, isOfficial: c === true }))
            }
            disabled={disabled}
          />
          <Label htmlFor="ctx-off" className="text-sm font-normal leading-snug">
            Documento oficial (priorizar em leituras)
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="ctx-hist"
            checked={form.isHistorical}
            onCheckedChange={(c) =>
              setForm((f) => ({ ...f, isHistorical: c === true }))
            }
            disabled={disabled}
          />
          <Label htmlFor="ctx-hist" className="text-sm font-normal leading-snug">
            Tratar como referência histórica
          </Label>
        </div>
      </div>
    </section>
  );
}

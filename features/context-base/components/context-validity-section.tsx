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
import type { ContextDocumentFormState, GovernanceStatusValue } from "../types";
import { STATUS_OPTIONS } from "../utils/constants";

type Props = {
  form: ContextDocumentFormState;
  setForm: React.Dispatch<React.SetStateAction<ContextDocumentFormState>>;
  disabled?: boolean;
};

export function ContextValiditySection({ form, setForm, disabled }: Props) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-hk-deep">
          Temporalidade e validade
        </h3>
        <p className="mt-1 text-xs text-hk-muted">
          Documentos vencidos ou substituídos devem ser tratados com clareza para
          não distorcer análises atuais.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="ctx-created">Data de criação (documento)</Label>
          <Input
            id="ctx-created"
            type="date"
            value={form.documentCreatedAt}
            onChange={(e) =>
              setForm((f) => ({ ...f, documentCreatedAt: e.target.value }))
            }
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctx-cstart">Competência inicial</Label>
          <Input
            id="ctx-cstart"
            type="date"
            value={form.competenceStart}
            onChange={(e) =>
              setForm((f) => ({ ...f, competenceStart: e.target.value }))
            }
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctx-cend">Competência final</Label>
          <Input
            id="ctx-cend"
            type="date"
            value={form.competenceEnd}
            onChange={(e) =>
              setForm((f) => ({ ...f, competenceEnd: e.target.value }))
            }
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctx-valid">Válido até</Label>
          <Input
            id="ctx-valid"
            type="date"
            value={form.validUntil}
            onChange={(e) =>
              setForm((f) => ({ ...f, validUntil: e.target.value }))
            }
            disabled={disabled || form.isEvergreen}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="ctx-evergreen"
            checked={form.isEvergreen}
            onCheckedChange={(c) =>
              setForm((f) => ({
                ...f,
                isEvergreen: c === true,
                validUntil: c === true ? "" : f.validUntil,
              }))
            }
            disabled={disabled}
          />
          <Label htmlFor="ctx-evergreen" className="text-sm font-normal">
            Documento perene (sem data de expiração fixa)
          </Label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Status do envio</Label>
          <Select
            value={form.status}
            onValueChange={(status) =>
              setForm((f) => ({
                ...f,
                status: status as GovernanceStatusValue,
              }))
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctx-ver">Versão</Label>
          <Input
            id="ctx-ver"
            value={form.version}
            onChange={(e) =>
              setForm((f) => ({ ...f, version: e.target.value }))
            }
            placeholder="1.0"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-hk-border-subtle bg-hk-canvas/40 p-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="ctx-replace"
            checked={form.replacesAnother}
            onCheckedChange={(c) =>
              setForm((f) => ({
                ...f,
                replacesAnother: c === true,
                replacesDocumentId: c === true ? f.replacesDocumentId : "",
              }))
            }
            disabled={disabled}
          />
          <Label htmlFor="ctx-replace" className="text-sm font-normal">
            Substitui outro documento?
          </Label>
        </div>
        {form.replacesAnother && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="ctx-repid">ID ou título do documento substituído</Label>
            <Input
              id="ctx-repid"
              value={form.replacesDocumentId}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  replacesDocumentId: e.target.value,
                }))
              }
              placeholder="Referência interna no acervo"
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </section>
  );
}

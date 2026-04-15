"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContextDocumentFormState } from "../types";
import { CONTENT_TYPE_OPTIONS, MAIN_CATEGORY_PRESETS } from "../utils/constants";

type Props = {
  form: ContextDocumentFormState;
  setForm: React.Dispatch<React.SetStateAction<ContextDocumentFormState>>;
  disabled?: boolean;
  customerName: string;
};

export function ContextClassificationSection({
  form,
  setForm,
  disabled,
  customerName,
}: Props) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-hk-deep">
          Classificação principal
        </h3>
        <p className="mt-1 text-xs text-hk-muted">
          Define onde e como este contexto será interpretado na base vetorial.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-hk-ink">Escopo</Label>
        <div className="rounded-lg border border-hk-border-subtle bg-hk-canvas/40 p-3">
          <p className="text-sm text-hk-ink">Cliente (fixo nesta fase)</p>
          <p className="mt-1 text-xs text-hk-muted">
            Cliente vinculado:{" "}
            <span className="font-medium text-hk-ink">{customerName}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ctx-doc-type">Tipo de conteúdo</Label>
          <Select
            value={form.contentType}
            onValueChange={(contentType) =>
              setForm((f) => ({
                ...f,
                contentType: contentType as ContextDocumentFormState["contentType"],
              }))
            }
            disabled={disabled}
          >
            <SelectTrigger id="ctx-doc-type">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {CONTENT_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctx-sector">Área / setor relacionado</Label>
          <Input
            id="ctx-sector"
            value={form.sector}
            onChange={(e) =>
              setForm((f) => ({ ...f, sector: e.target.value }))
            }
            placeholder="Ex.: Mídia paga, Brand, CX"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ctx-main-cat">Categoria principal</Label>
          <Select
            value={
              MAIN_CATEGORY_PRESETS.includes(
                form.mainCategory as (typeof MAIN_CATEGORY_PRESETS)[number],
              )
                ? form.mainCategory
                : "__custom__"
            }
            onValueChange={(v) => {
              if (v === "__custom__") {
                setForm((f) => ({ ...f, mainCategory: "" }));
              } else {
                setForm((f) => ({ ...f, mainCategory: v }));
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger id="ctx-main-cat">
              <SelectValue placeholder="Selecione ou personalize abaixo" />
            </SelectTrigger>
            <SelectContent>
              {MAIN_CATEGORY_PRESETS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
              <SelectItem value="__custom__">Personalizado…</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={form.mainCategory}
            onChange={(e) =>
              setForm((f) => ({ ...f, mainCategory: e.target.value }))
            }
            placeholder="Ou digite uma categoria livre"
            disabled={disabled}
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctx-sub">Subcategoria</Label>
          <Input
            id="ctx-sub"
            value={form.subcategory}
            onChange={(e) =>
              setForm((f) => ({ ...f, subcategory: e.target.value }))
            }
            placeholder="Ex.: Campanha institucional Q1"
            disabled={disabled}
          />
        </div>
      </div>
    </section>
  );
}

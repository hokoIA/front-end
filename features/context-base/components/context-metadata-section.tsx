"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContextDocumentFormState } from "../types";
import {
  CONFIDENTIALITY_OPTIONS,
  LANGUAGE_OPTIONS,
  RELIABILITY_OPTIONS,
  VISIBILITY_OPTIONS,
} from "../utils/constants";

type Props = {
  form: ContextDocumentFormState;
  setForm: React.Dispatch<React.SetStateAction<ContextDocumentFormState>>;
  disabled?: boolean;
};

export function ContextMetadataSection({ form, setForm, disabled }: Props) {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-hk-deep">
          Metadados de contexto
        </h3>
        <p className="mt-1 text-xs text-hk-muted">
          Campos que aumentam precisão na recuperação e deixam explícita a
          intenção de uso.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctx-title">
          Título do documento <span className="text-red-600">*</span>
        </Label>
        <Input
          id="ctx-title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Nome claro para identificação no acervo"
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctx-summary">Resumo executivo</Label>
        <Textarea
          id="ctx-summary"
          value={form.executiveSummary}
          onChange={(e) =>
            setForm((f) => ({ ...f, executiveSummary: e.target.value }))
          }
          placeholder="2–5 frases: o que é, por que importa, para que decisões serve"
          disabled={disabled}
          className="min-h-[100px]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ctx-author">
            Autor <span className="text-red-600">*</span>
          </Label>
          <Input
            id="ctx-author"
            value={form.author}
            onChange={(e) =>
              setForm((f) => ({ ...f, author: e.target.value }))
            }
            placeholder="Quem produziu ou validou o conteúdo"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctx-owner">Responsável interno</Label>
          <Input
            id="ctx-owner"
            value={form.internalOwner}
            onChange={(e) =>
              setForm((f) => ({ ...f, internalOwner: e.target.value }))
            }
            placeholder="Ponto focal na agência"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ctx-origin">Origem / fonte</Label>
          <Input
            id="ctx-origin"
            value={form.sourceOrigin}
            onChange={(e) =>
              setForm((f) => ({ ...f, sourceOrigin: e.target.value }))
            }
            placeholder="Ex.: Cliente, pesquisa primária, parceiro"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label>Idioma</Label>
          <Select
            value={form.language}
            onValueChange={(language) =>
              setForm((f) => ({ ...f, language }))
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Confiabilidade</Label>
          <Select
            value={form.reliabilityLevel}
            onValueChange={(reliabilityLevel) =>
              setForm((f) => ({ ...f, reliabilityLevel }))
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RELIABILITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Confidencialidade</Label>
          <Select
            value={form.confidentiality}
            onValueChange={(confidentiality) =>
              setForm((f) => ({ ...f, confidentiality }))
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONFIDENTIALITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Visibilidade</Label>
          <Select
            value={form.visibility}
            onValueChange={(visibility) =>
              setForm((f) => ({ ...f, visibility }))
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISIBILITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctx-tags">
          Tags obrigatórias <span className="text-red-600">*</span>
        </Label>
        <Input
          id="ctx-tags"
          value={form.tagsRequired}
          onChange={(e) =>
            setForm((f) => ({ ...f, tagsRequired: e.target.value }))
          }
          placeholder="Separadas por vírgula: marca, produto_x, campanha_y"
          disabled={disabled}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ctx-kw">Palavras-chave adicionais</Label>
          <Input
            id="ctx-kw"
            value={form.additionalKeywords}
            onChange={(e) =>
              setForm((f) => ({ ...f, additionalKeywords: e.target.value }))
            }
            placeholder="Termos de busca e sinônimos"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctx-entities">Entidades citadas</Label>
          <Input
            id="ctx-entities"
            value={form.citedEntities}
            onChange={(e) =>
              setForm((f) => ({ ...f, citedEntities: e.target.value }))
            }
            placeholder="Marcas, produtos, pessoas-chave"
            disabled={disabled}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ctx-plat">Plataformas relacionadas</Label>
          <Input
            id="ctx-plat"
            value={form.relatedPlatforms}
            onChange={(e) =>
              setForm((f) => ({ ...f, relatedPlatforms: e.target.value }))
            }
            placeholder="Meta, Google, LinkedIn…"
            disabled={disabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ctx-obj">Objetivo de uso na IA</Label>
          <Input
            id="ctx-obj"
            value={form.iaObjective}
            onChange={(e) =>
              setForm((f) => ({ ...f, iaObjective: e.target.value }))
            }
            placeholder="Ex.: sustentar narrativa de resultado mensal"
            disabled={disabled}
          />
        </div>
      </div>
    </section>
  );
}

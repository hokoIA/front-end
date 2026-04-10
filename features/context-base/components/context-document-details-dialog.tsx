"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { ContextDocumentListItem, GovernanceStatusValue } from "../types";
import { contentTypeLabel } from "../utils/labels";
import { ContextDocumentStatusBadge } from "./context-document-status-badge";
import {
  Archive,
  Clock,
  Copy,
  Download,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

function fmt(d: string, withTime?: boolean) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      ...(withTime ? { timeStyle: "short" } : {}),
    }).format(new Date(d));
  } catch {
    return d;
  }
}

type Props = {
  doc: ContextDocumentListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (id: string, status: GovernanceStatusValue) => void;
  onDuplicate: (doc: ContextDocumentListItem) => void;
  onDelete?: (id: string) => void;
};

export function ContextDocumentDetailsDialog({
  doc,
  open,
  onOpenChange,
  onUpdateStatus,
  onDuplicate,
  onDelete,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {doc ? (
      <DialogContent className="max-h-[min(90vh,720px)] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <ContextDocumentStatusBadge status={doc.status} />
            <span className="text-xs text-hk-muted">
              {contentTypeLabel(doc.docType)}
            </span>
          </div>
          <DialogTitle className="text-left text-xl">{doc.title}</DialogTitle>
          <DialogDescription className="text-left text-hk-ink">
            {doc.summary}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-hk-muted">
              Tags
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {doc.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-hk-border-subtle bg-hk-canvas px-2 py-0.5 text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <Separator />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-hk-muted">Cliente</p>
              <p className="font-medium text-hk-deep">{doc.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-hk-muted">Categoria</p>
              <p className="font-medium text-hk-deep">
                {doc.mainCategory} / {doc.subcategory}
              </p>
            </div>
            <div>
              <p className="text-xs text-hk-muted">Autor</p>
              <p>{doc.author}</p>
            </div>
            <div>
              <p className="text-xs text-hk-muted">Origem</p>
              <p>{doc.origin}</p>
            </div>
            <div>
              <p className="text-xs text-hk-muted">Confidencialidade</p>
              <p>{doc.confidentiality}</p>
            </div>
            <div>
              <p className="text-xs text-hk-muted">Escopo</p>
              <p>{doc.documentScope}</p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-hk-muted">Enviado em</p>
              <p>{fmt(doc.submittedAt, true)}</p>
            </div>
            <div>
              <p className="text-xs text-hk-muted">Última atualização</p>
              <p>{fmt(doc.updatedAt, true)}</p>
            </div>
            <div>
              <p className="text-xs text-hk-muted">Competência</p>
              <p>
                {fmt(doc.competenceStart)} — {fmt(doc.competenceEnd)}
              </p>
            </div>
            <div>
              <p className="text-xs text-hk-muted">Validade</p>
              <p>
                {doc.validUntil ? fmt(doc.validUntil) : "Perene / sem data fixa"}
              </p>
            </div>
            <div>
              <p className="text-xs text-hk-muted">Versão</p>
              <p>v{doc.version}</p>
            </div>
            <div>
              <p className="text-xs text-hk-muted">Tipo de upload</p>
              <p>{doc.uploadType === "file" ? "Arquivo" : "Texto"}</p>
            </div>
            {doc.fileName && (
              <div className="sm:col-span-2">
                <p className="text-xs text-hk-muted">Arquivo</p>
                <p>{doc.fileName}</p>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold uppercase text-hk-muted">
              Prévia do conteúdo
            </p>
            <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-hk-border bg-hk-canvas/60 p-3 text-xs leading-relaxed text-hk-ink whitespace-pre-wrap">
              {doc.contentPreview}
            </pre>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col sm:items-stretch">
          <p className="text-left text-xs text-hk-muted">
            Governança: ações abaixo atualizam apenas a visualização local (mock)
            até o endpoint de listagem e mutação existir.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1"
              onClick={() => {
                onUpdateStatus(doc.id, "archived");
                toast.success("Marcado como arquivado (mock).");
                onOpenChange(false);
              }}
            >
              <Archive className="size-3.5" />
              Arquivar
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1"
              onClick={() => {
                onUpdateStatus(doc.id, "expired");
                toast.success("Marcado como vencido (mock).");
                onOpenChange(false);
              }}
            >
              <Clock className="size-3.5" />
              Vencido
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-1"
              onClick={() => {
                onUpdateStatus(doc.id, "superseded");
                toast.success("Marcado como substituído (mock).");
                onOpenChange(false);
              }}
            >
              <RefreshCw className="size-3.5" />
              Substituído
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => {
                onDuplicate(doc);
                toast.message("Metadados copiados para o formulário de envio.");
                onOpenChange(false);
              }}
            >
              <Copy className="size-3.5" />
              Duplicar metadados
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => {
                if (doc.uploadType === "file" && doc.fileName) {
                  toast.message(
                    "Download será habilitado quando o arquivo estiver disponível via API.",
                  );
                } else {
                  void navigator.clipboard.writeText(doc.contentPreview);
                  toast.success("Prévia copiada.");
                }
              }}
            >
              <Download className="size-3.5" />
              {doc.uploadType === "file" ? "Baixar" : "Copiar texto"}
            </Button>
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-red-700"
                onClick={() => {
                  onDelete(doc.id);
                  toast.success("Removido da lista local (mock).");
                  onOpenChange(false);
                }}
              >
                <Trash2 className="size-3.5" />
                Excluir da lista
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
      ) : null}
    </Dialog>
  );
}

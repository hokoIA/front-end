"use client";

import { Button } from "@/components/ui/button";
import type { ContextDocumentListItem } from "../types";
import { contentTypeLabel } from "../utils/labels";
import { ContextDocumentStatusBadge } from "./context-document-status-badge";
import { ChevronRight } from "lucide-react";

function fmt(d: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
      new Date(d),
    );
  } catch {
    return d;
  }
}

type Props = {
  doc: ContextDocumentListItem;
  onOpen: () => void;
};

export function ContextDocumentRow({ doc, onOpen }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-hk-border bg-hk-surface p-4 shadow-hk-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <ContextDocumentStatusBadge status={doc.status} />
          <span className="text-xs text-hk-muted">
            {contentTypeLabel(doc.docType)}
          </span>
        </div>
        <h4 className="font-semibold text-hk-deep">{doc.title}</h4>
        <p className="line-clamp-2 text-xs text-hk-muted">{doc.summary}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-hk-muted">
          <span>
            Competência: {fmt(doc.competenceStart)} — {fmt(doc.competenceEnd)}
          </span>
          {doc.validUntil ? (
            <span>Válido até: {fmt(doc.validUntil)}</span>
          ) : (
            <span>Sem expiração fixa</span>
          )}
          <span>v{doc.version}</span>
          <span>{doc.author}</span>
        </div>
        {doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {doc.tags.slice(0, 6).map((t) => (
              <span
                key={t}
                className="rounded bg-hk-canvas px-1.5 py-0.5 text-[10px] text-hk-muted"
              >
                {t}
              </span>
            ))}
            {doc.tags.length > 6 && (
              <span className="text-[10px] text-hk-muted">
                +{doc.tags.length - 6}
              </span>
            )}
          </div>
        )}
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="shrink-0 gap-1"
        onClick={onOpen}
      >
        Detalhes
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

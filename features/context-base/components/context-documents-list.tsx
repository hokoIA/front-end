"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { ContextDocumentListItem } from "../types";
import { ContextDocumentRow } from "./context-document-row";

type Props = {
  documents: ContextDocumentListItem[];
  loading?: boolean;
  onSelect: (doc: ContextDocumentListItem) => void;
};

export function ContextDocumentsList({
  documents,
  loading,
  onSelect,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <ContextDocumentRow
          key={doc.id}
          doc={doc}
          onOpen={() => onSelect(doc)}
        />
      ))}
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";
import { FileText, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type Props = {
  file: File | null;
  onFileChange: (f: File | null) => void;
  disabled?: boolean;
  error?: string | null;
};

export function ContextFileUploadPanel({
  file,
  onFileChange,
  disabled,
  error,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const onPick = useCallback(
    (list: FileList | null) => {
      const f = list?.[0];
      if (f) onFileChange(f);
    },
    [onFileChange],
  );

  return (
    <div className="space-y-2">
      <Label>Arquivo (prioridade PDF)</Label>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDrag(false);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onPick(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 transition-colors",
          drag
            ? "border-hk-action bg-hk-cyan/15"
            : "border-hk-border bg-hk-canvas/50 hover:border-hk-action/50 hover:bg-hk-canvas/80",
          disabled && "pointer-events-none opacity-50",
        )}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.txt,.csv,application/pdf,text/plain,text/csv"
          disabled={disabled}
          onChange={(e) => onPick(e.target.files)}
        />
        <div className="flex size-12 items-center justify-center rounded-full bg-hk-surface text-hk-action shadow-hk-sm">
          <Upload className="size-5" strokeWidth={1.5} />
        </div>
        <p className="mt-4 text-sm font-medium text-hk-deep">
          Arraste um arquivo ou clique para selecionar
        </p>
        <p className="mt-1 max-w-md text-center text-xs text-hk-muted">
          Recomendado: PDF. Também aceitos TXT e CSV, sempre convertidos em texto
          antes do envio para a base.
        </p>
        {file && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-hk-border bg-hk-surface px-3 py-2 text-sm text-hk-ink">
            <FileText className="size-4 text-hk-action" />
            <span className="font-medium">{file.name}</span>
            <span className="text-hk-muted">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        )}
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3 text-hk-muted"
            onClick={(e) => {
              e.stopPropagation();
              onFileChange(null);
            }}
          >
            Remover arquivo
          </Button>
        )}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

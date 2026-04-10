"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getFriendlyErrorMessage } from "@/lib/api/errors";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

type Props = {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
};

export function AvatarUploadCard({ onUpload, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErr("Envie um arquivo de imagem (PNG, JPG ou WebP).");
      return;
    }
    if (f.size > 4 * 1024 * 1024) {
      setErr("Imagem acima de 4 MB. Escolha um arquivo menor.");
      return;
    }
    setErr(null);
    setBusy(true);
    try {
      await onUpload(f);
    } catch (e) {
      setErr(getFriendlyErrorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="border-hk-border shadow-hk-sm">
      <CardHeader>
        <CardTitle className="text-base text-hk-deep">Foto do perfil</CardTitle>
        <CardDescription>
          Envie uma imagem quadrada ou próxima disso para melhor recorte.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          disabled={disabled || busy}
          onChange={(e) => void onChange(e)}
        />
        <Button
          type="button"
          variant="secondary"
          className="gap-2"
          disabled={disabled || busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          {busy ? "Enviando…" : "Trocar avatar"}
        </Button>
        {err ? <p className="text-sm text-red-600">{err}</p> : null}
      </CardContent>
    </Card>
  );
}

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ContextDocumentFormState } from "../types";
import { ContextFileUploadPanel } from "./context-file-upload-panel";
import { ContextTextInputPanel } from "./context-text-input-panel";

type Props = {
  form: ContextDocumentFormState;
  setForm: React.Dispatch<React.SetStateAction<ContextDocumentFormState>>;
  file: File | null;
  onFileChange: (f: File | null) => void;
  fileError: string | null;
  disabled?: boolean;
};

export function ContextUploadSection({
  form,
  setForm,
  file,
  onFileChange,
  fileError,
  disabled,
}: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-hk-deep">
          Conteúdo do documento
        </h3>
        <p className="mt-1 text-xs text-hk-muted">
          Escolha entre texto estruturado ou arquivo. O backend recebe o conteúdo
          em <span className="font-medium">documentText</span> (texto composto ou
          arquivo em base64).
        </p>
      </div>

      <Tabs
        value={form.uploadMode}
        onValueChange={(uploadMode) =>
          setForm((f) => ({
            ...f,
            uploadMode: uploadMode as "text" | "file",
          }))
        }
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="text" disabled={disabled}>
            Texto
          </TabsTrigger>
          <TabsTrigger value="file" disabled={disabled}>
            Arquivo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text" className="mt-4">
          <ContextTextInputPanel
            value={form.textContent}
            onChange={(textContent) =>
              setForm((f) => ({ ...f, textContent }))
            }
            disabled={disabled}
          />
        </TabsContent>
        <TabsContent value="file" className="mt-4">
          <ContextFileUploadPanel
            file={file}
            onFileChange={onFileChange}
            disabled={disabled}
            error={fileError}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}

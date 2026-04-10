"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ContextDocumentFormState } from "../types";
import { ContextClassificationSection } from "./context-classification-section";
import { ContextMetadataSection } from "./context-metadata-section";
import { ContextRetrievalPolicySection } from "./context-retrieval-policy-section";
import { ContextSubmitBar } from "./context-submit-bar";
import { ContextUploadSection } from "./context-upload-section";
import { ContextValiditySection } from "./context-validity-section";

type Props = {
  form: ContextDocumentFormState;
  setForm: React.Dispatch<React.SetStateAction<ContextDocumentFormState>>;
  customerName: string;
  file: File | null;
  onFileChange: (f: File | null) => void;
  fileError: string | null;
  onSubmit: () => void;
  submitLoading: boolean;
  disabled?: boolean;
};

export function ContextDocumentForm({
  form,
  setForm,
  customerName,
  file,
  onFileChange,
  fileError,
  onSubmit,
  submitLoading,
  disabled,
}: Props) {
  return (
    <Card
      id="context-ingest-form"
      className="overflow-hidden border-hk-border shadow-hk-sm"
    >
      <CardHeader className="border-b border-hk-border-subtle bg-hk-canvas/40 px-4 py-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-hk-action">
          Área A — Intake de contexto
        </p>
        <h2 className="text-lg font-semibold text-hk-deep">
          Cadastro e envio de novo documento
        </h2>
        <p className="text-sm text-hk-muted">
          Preencha a classificação e os metadados com o mesmo rigor que você usaria
          em um repositório interno: a IA herdará essa disciplina na recuperação.
        </p>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        <div className="space-y-8 px-4 py-6 md:px-6">
          <ContextClassificationSection
            form={form}
            setForm={setForm}
            disabled={disabled || submitLoading}
            customerName={customerName}
          />
          <Separator />
          <ContextMetadataSection
            form={form}
            setForm={setForm}
            disabled={disabled || submitLoading}
          />
          <Separator />
          <ContextValiditySection
            form={form}
            setForm={setForm}
            disabled={disabled || submitLoading}
          />
          <Separator />
          <ContextRetrievalPolicySection
            form={form}
            setForm={setForm}
            disabled={disabled || submitLoading}
          />
          <Separator />
          <ContextUploadSection
            form={form}
            setForm={setForm}
            file={file}
            onFileChange={onFileChange}
            fileError={fileError}
            disabled={disabled || submitLoading}
          />
        </div>
        <ContextSubmitBar
          onSubmit={onSubmit}
          loading={submitLoading}
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
}

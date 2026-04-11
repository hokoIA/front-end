"use client";

import { ContextBaseIntroPanel } from "./components/context-base-intro-panel";
import { ContextBasePageHeader } from "./components/context-base-page-header";
import { ContextDocumentDetailsDialog } from "./components/context-document-details-dialog";
import { ContextDocumentForm } from "./components/context-document-form";
import { ContextDocumentsList } from "./components/context-documents-list";
import { ContextDocumentsToolbar } from "./components/context-documents-toolbar";
import {
  ContextEmptyDocumentsState,
  ContextErrorState,
  ContextNoCustomerState,
} from "./components/context-states";
import {
  useClientDocumentsQuery,
  useRemoveMockDocument,
  useUpdateMockDocumentStatus,
} from "./hooks/use-client-documents-query";
import type {
  ContextDocumentFormState,
  ContextDocumentListItem,
  DocumentListFilters,
} from "./types";
import {
  buildDocumentStorePayloadV1,
  buildDocumentTextBody,
  resolveAgencyIdForContext,
} from "./utils/build-document-payload";
import { createDefaultContextDocumentForm } from "./utils/default-form";
import { filterContextDocuments } from "./utils/filter-documents";
import { fileToBase64Data, isPdfFile } from "./utils/file-to-base64";
import { formStateFromListItem } from "./utils/form-from-list-item";
import { useSelectedCustomer } from "@/components/providers/selected-customer-provider";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentStoreMutation } from "@/hooks/api/use-analyze-mutations";
import { useAuthStatusQuery, useProfileQuery } from "@/hooks/api/use-auth-queries";
import { getErrorKind } from "@/lib/api/errors";
import { getAnalyzeBaseUrl } from "@/lib/api/http-client";
import { queryKeys } from "@/lib/api/query-keys";
import type { DocumentStorePayloadV1 } from "@/lib/types/documents";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const MIN_TEXT_LEN = 40;
const MAX_FILE_BYTES = 12 * 1024 * 1024;

const defaultFilters: DocumentListFilters = {
  search: "",
  contentType: "all",
  category: "",
  status: "all",
  validity: "all",
  submittedFrom: "",
  submittedTo: "",
};

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export function ContextBaseView() {
  const { data: auth } = useAuthStatusQuery();
  const authed = auth?.authenticated === true;
  const { data: profile, isPending: profileLoading } = useProfileQuery(authed);
  const { selected, isReady, isLoadingCustomers } = useSelectedCustomer();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<ContextDocumentFormState>(
    createDefaultContextDocumentForm,
  );
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DocumentListFilters>(defaultFilters);
  const [detailDoc, setDetailDoc] = useState<ContextDocumentListItem | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [submitBusy, setSubmitBusy] = useState(false);

  const customerId = selected?.id_customer ?? null;
  const customerName = selected?.name ?? "";

  const {
    data: documents = [],
    isPending: listLoading,
    isError: listError,
    error: listErr,
    refetch: refetchList,
  } = useClientDocumentsQuery(customerId, customerName);

  const updateStatus = useUpdateMockDocumentStatus(customerId);
  const removeDoc = useRemoveMockDocument(customerId);
  const storeMutation = useDocumentStoreMutation();

  const agencyId = resolveAgencyIdForContext(profile ?? null);

  const filteredDocs = useMemo(
    () => filterContextDocuments(documents, filters),
    [documents, filters],
  );

  const initialBusy =
    authed &&
    (!isReady || isLoadingCustomers || (authed && profileLoading));
  const showNoCustomer = isReady && !selected;

  const validateBeforeSubmit = useCallback(() => {
    setSubmitError(null);
    if (!selected) {
      toast.error("Selecione um cliente.");
      return false;
    }
    if (!form.title.trim()) {
      toast.error("Informe o título do documento.");
      return false;
    }
    if (!form.author.trim()) {
      toast.error("Informe o autor.");
      return false;
    }
    const tags = form.tagsRequired
      .split(/[,;\n]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length === 0) {
      toast.error("Inclua ao menos uma tag obrigatória.");
      return false;
    }
    if (form.uploadMode === "text") {
      if (form.textContent.trim().length < MIN_TEXT_LEN) {
        toast.error(
          `Conteúdo em texto muito curto (mínimo ${MIN_TEXT_LEN} caracteres).`,
        );
        return false;
      }
    } else {
      if (!file) {
        toast.error("Selecione um arquivo para envio.");
        return false;
      }
      if (file.size > MAX_FILE_BYTES) {
        toast.error("Arquivo acima de 12 MB. Reduza ou divida o material.");
        return false;
      }
    }
    if (!agencyId) {
      toast.error(
        "Agência não identificada. Verifique o perfil ou NEXT_PUBLIC_DEFAULT_AGENCY_ID.",
      );
      return false;
    }
    const useMock = process.env.NEXT_PUBLIC_CONTEXT_STORE_MOCK === "true";
    if (!useMock && !getAnalyzeBaseUrl()) {
      toast.error(
        "Serviço não configurado (NEXT_PUBLIC_ANALYZE_API_BASE_URL).",
      );
      return false;
    }
    return true;
  }, [selected, form, file, agencyId]);

  const onFileChange = useCallback((f: File | null) => {
    setFileError(null);
    setFile(f);
    if (f && !isPdfFile(f)) {
      toast.message(
        "Formato não é PDF. O envio é permitido, mas PDF é o formato recomendado.",
      );
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateBeforeSubmit() || !selected) return;

    let documentText = "";
    const uploadType: "text" | "file" = form.uploadMode;

    setSubmitBusy(true);
    setSubmitError(null);
    try {
      if (form.uploadMode === "text") {
        documentText = buildDocumentTextBody(form, form.textContent);
      } else if (file) {
        documentText = await fileToBase64Data(file);
      }

      const payload: DocumentStorePayloadV1 = buildDocumentStorePayloadV1(
        form,
        {
          agencyId,
          clientId: selected.id_customer,
          customerName: selected.name,
          documentText,
          uploadType,
        },
      );

      if (process.env.NEXT_PUBLIC_CONTEXT_STORE_MOCK === "true") {
        await delay(1400);
        toast.success("Contexto recebido (simulação).");
      } else {
        await storeMutation.mutateAsync(payload);
        toast.success("Documento enviado para a base de contexto.");
      }

      setForm(createDefaultContextDocumentForm());
      setFile(null);
      setFileError(null);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contextBase.documents(selected.id_customer),
      });
    } catch (e) {
      setSubmitError(e);
      const kind = getErrorKind(e);
      if (kind === "unauthorized") {
        toast.error("Sessão expirada. Faça login novamente.");
      } else if (kind === "forbidden") {
        toast.error("Sem permissão para enviar documentos.");
      } else {
        toast.error("Falha ao enviar o documento.");
      }
    } finally {
      setSubmitBusy(false);
    }
  }, [
    validateBeforeSubmit,
    selected,
    form,
    file,
    agencyId,
    storeMutation,
    queryClient,
  ]);

  const openDuplicate = useCallback((doc: ContextDocumentListItem) => {
    setForm(formStateFromListItem(doc));
    setFile(null);
    setFileError(null);
    requestAnimationFrame(() => {
      document
        .getElementById("context-ingest-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <div className="hk-page hk-page--mid space-y-8 pb-16 pt-6 lg:pt-8">
      <ContextBasePageHeader />
      <ContextBaseIntroPanel />

      {initialBusy ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : showNoCustomer ? (
        <ContextNoCustomerState />
      ) : (
        <>
          <Card className="border-hk-border-subtle bg-hk-surface/90 p-4 shadow-none">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-hk-muted">
              Contexto ativo
            </p>
            <p className="mt-1 text-base font-semibold text-hk-deep">
              {customerName}
            </p>
            <p className="mt-1 text-xs text-hk-muted">
              Documentos e metadados abaixo serão associados a este cliente no
              armazenamento (<span className="font-mono text-[11px]">client_id</span>
              ).
            </p>
          </Card>

          <ContextDocumentForm
            form={form}
            setForm={setForm}
            customerName={customerName}
            file={file}
            onFileChange={onFileChange}
            fileError={fileError}
            onSubmit={() => void handleSubmit()}
            submitLoading={submitBusy || storeMutation.isPending}
            disabled={false}
          />

          {submitError && (
            <ContextErrorState
              error={submitError}
              onRetry={() => void handleSubmit()}
            />
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-hk-deep">
              Área B — Acervo documental
            </h2>
            <ContextDocumentsToolbar filters={filters} onChange={setFilters} />
            {listError ? (
              <ContextErrorState
                error={listErr}
                onRetry={() => void refetchList()}
              />
            ) : documents.length === 0 && !listLoading ? (
              <ContextEmptyDocumentsState />
            ) : filteredDocs.length === 0 && !listLoading ? (
              <Card className="border-dashed border-hk-border bg-hk-surface/80 p-6 text-center text-sm text-hk-muted">
                Nenhum documento corresponde aos filtros. Ajuste a busca ou limpe os
                critérios.
              </Card>
            ) : (
              <ContextDocumentsList
                documents={filteredDocs}
                loading={listLoading}
                onSelect={setDetailDoc}
              />
            )}
          </div>

          <ContextDocumentDetailsDialog
            doc={detailDoc}
            open={detailDoc !== null}
            onOpenChange={(o) => {
              if (!o) setDetailDoc(null);
            }}
            onUpdateStatus={updateStatus}
            onDuplicate={openDuplicate}
            onDelete={removeDoc}
          />
        </>
      )}
    </div>
  );
}

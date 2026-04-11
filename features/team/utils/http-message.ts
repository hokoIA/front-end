import { HttpError } from "@/lib/api/http-client";

export function teamOperationMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError) {
    if (error.kind === "unauthorized") {
      return "Sessão expirada. Faça login novamente.";
    }
    if (error.kind === "forbidden") {
      return "Sem permissão para esta ação na conta.";
    }
    const body = error.body;
    if (
      body &&
      typeof body === "object" &&
      "message" in body &&
      typeof (body as { message: unknown }).message === "string"
    ) {
      return (body as { message: string }).message;
    }
    if (error.status === 409) {
      return "Convite duplicado ou este e-mail já faz parte da equipe.";
    }
    if (error.status === 400) {
      return "Verifique o e-mail e os dados enviados.";
    }
    return error.message || fallback;
  }
  return fallback;
}

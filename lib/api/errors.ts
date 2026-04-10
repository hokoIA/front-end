import { HttpError, type HttpErrorKind } from "./http-client";

export function isHttpError(e: unknown): e is HttpError {
  return e instanceof HttpError;
}

export function getHttpErrorMessage(e: unknown): string {
  if (isHttpError(e)) return e.message;
  if (e instanceof Error) return e.message;
  return "Ocorreu um erro inesperado.";
}

/** Mensagem amigável por tipo de falha HTTP. */
export function getFriendlyErrorMessage(e: unknown): string {
  if (!isHttpError(e)) return getHttpErrorMessage(e);
  switch (e.kind) {
    case "unauthorized":
      return "Sessão expirada ou credenciais inválidas. Faça login novamente.";
    case "forbidden":
      return "Você não tem permissão para esta ação.";
    case "not_found":
      return "Recurso não encontrado.";
    case "server_error":
      return "Serviço temporariamente indisponível. Tente novamente em instantes.";
    case "network":
      return "Não foi possível conectar. Verifique sua rede.";
    default:
      return e.message || "Não foi possível concluir a operação.";
  }
}

export function getErrorKind(e: unknown): HttpErrorKind | null {
  return isHttpError(e) ? e.kind : null;
}

export function isNotFound(e: unknown): boolean {
  return isHttpError(e) && e.kind === "not_found";
}

export function isUnauthorized(e: unknown): boolean {
  return isHttpError(e) && e.kind === "unauthorized";
}

export function isForbidden(e: unknown): boolean {
  return isHttpError(e) && e.kind === "forbidden";
}

/**
 * Cliente HTTP central: cookie HttpOnly `jwt`, sem token em localStorage.
 *
 * Cross-origin (ex.: front em `*.onrender.com` e API em outro host):
 * - Todas as chamadas usam `credentials: "include"` para o browser enviar/receber
 *   cookies no fluxo CORS (o backend deve responder com `Access-Control-Allow-Credentials: true`
 *   e `Access-Control-Allow-Origin` explícito, nunca `*`).
 * - `NEXT_PUBLIC_API_BASE_URL` deve ser a URL **absoluta** do gateway (ex. https://api-gateway-…onrender.com).
 *   Se ficar vazio em produção, `/api/*` vira caminho relativo ao domínio do Next e o cookie da API
 *   nunca participa do pedido.
 *
 * `NEXT_PUBLIC_ANALYZE_API_BASE_URL` — serviço de IA (analyze/documents), também com credentials.
 */

export type HttpBase = "api" | "analyze";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpErrorKind =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "server_error"
  | "client_error"
  | "network"
  | "unknown";

export class HttpError extends Error {
  readonly kind: HttpErrorKind;

  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
    kind?: HttpErrorKind,
  ) {
    super(message);
    this.name = "HttpError";
    this.kind = kind ?? classifyStatus(status);
  }
}

function classifyStatus(status: number): HttpErrorKind {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 404) return "not_found";
  if (status >= 500) return "server_error";
  if (status >= 400) return "client_error";
  return "unknown";
}

function normalizeBase(raw: string | undefined): string {
  return (raw ?? "").replace(/\/$/, "");
}

export function getApiBaseUrl(): string {
  return normalizeBase(process.env.NEXT_PUBLIC_API_BASE_URL);
}

export function getAnalyzeBaseUrl(): string {
  return normalizeBase(process.env.NEXT_PUBLIC_ANALYZE_API_BASE_URL);
}

function getProxyTarget(): string {
  return normalizeBase(process.env.NEXT_PUBLIC_BACKEND_PROXY_TARGET);
}

let warnedEmptyApiBase = false;

function resolveUrl(path: string, base: HttpBase): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const p = path.startsWith("/") ? path : `/${path}`;
  const root = base === "analyze" ? getAnalyzeBaseUrl() : getApiBaseUrl();
  return `${root}${p}`;
}

type Listener = (error: HttpError) => void;

const unauthorizedListeners = new Set<Listener>();

/** Registra callback para 401 (ex.: limpar cache e redirecionar ao login). */
export function onUnauthorized(listener: Listener): () => void {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
}

function notifyUnauthorized(error: HttpError) {
  unauthorizedListeners.forEach((fn) => {
    try {
      fn(error);
    } catch {
      /* ignore */
    }
  });
}

/**
 * `credentials` é sempre `include` no cliente; não expor para evitar `omit` acidental em auth cross-origin.
 */
export type HttpRequestOptions = Omit<RequestInit, "body" | "credentials"> & {
  base?: HttpBase;
  /** Não lançar HttpError em resposta não-OK (útil para auth-status). */
  skipErrorThrow?: boolean;
  /** Corpo já serializado ou FormData/Blob — não passar por JSON.stringify. */
  body?: BodyInit | null;
  /** Objeto serializado como JSON (Content-Type application/json). */
  json?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
};

function buildHeaders(
  headersInit: HeadersInit | undefined,
  hasJsonBody: boolean,
): HeadersInit {
  const h = new Headers(headersInit ?? undefined);
  if (hasJsonBody && !h.has("Content-Type")) {
    h.set("Content-Type", "application/json");
  }
  return h;
}

export async function httpFetch(
  path: string,
  init: HttpRequestOptions = {},
): Promise<Response> {
  const {
    base = "api",
    skipErrorThrow,
    json: jsonBody,
    searchParams,
    body: rawBody,
    method: methodInit,
    headers: headersInit,
    ...rest
  } = init;

  let url = resolveUrl(path, base);
  if (searchParams && Object.keys(searchParams).length > 0) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v === undefined || v === null) continue;
      sp.set(k, String(v));
    }
    const q = sp.toString();
    if (q) url += (url.includes("?") ? "&" : "?") + q;
  }

  const hasJsonBody = jsonBody !== undefined;
  const serializedBody =
    jsonBody !== undefined ? JSON.stringify(jsonBody) : rawBody;

  const method =
    methodInit ??
    (serializedBody !== undefined && serializedBody !== null
      ? "POST"
      : "GET");

  if (
    typeof window !== "undefined" &&
    base === "api" &&
    !getApiBaseUrl() &&
    !getProxyTarget() &&
    !warnedEmptyApiBase
  ) {
    warnedEmptyApiBase = true;
    console.warn(
      "[ho.ko] NEXT_PUBLIC_API_BASE_URL está vazio e nenhum BACKEND_PROXY_TARGET público foi detectado. Configure rewrite/proxy ou URL direta da API.",
    );
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      method,
      mode: "cors",
      credentials: "include",
      headers: buildHeaders(headersInit, hasJsonBody),
      body:
        serializedBody === undefined || serializedBody === null
          ? null
          : serializedBody,
    });
  } catch (e) {
    const err = new HttpError(
      e instanceof Error ? e.message : "Falha de rede",
      0,
      undefined,
      "network",
    );
    if (!skipErrorThrow) throw err;
    return new Response(null, { status: 503, statusText: "Network Error" });
  }

  if (!res.ok && !skipErrorThrow) {
    let parsed: unknown;
    const ct = res.headers.get("content-type");
    try {
      if (ct?.includes("application/json")) {
        parsed = await res.json();
      } else {
        parsed = await res.text();
      }
    } catch {
      parsed = undefined;
    }
    const message =
      typeof parsed === "object" &&
      parsed !== null &&
      "message" in parsed &&
      typeof (parsed as { message: unknown }).message === "string"
        ? (parsed as { message: string }).message
        : res.statusText || "Erro na requisição";
    const httpError = new HttpError(message, res.status, parsed);
    if (res.status === 401) {
      notifyUnauthorized(httpError);
    }
    throw httpError;
  }

  return res;
}

export async function httpJson<T>(
  path: string,
  init?: HttpRequestOptions,
): Promise<T> {
  const res = await httpFetch(path, init);
  if (res.status === 204 || res.status === 205) {
    return undefined as T;
  }
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

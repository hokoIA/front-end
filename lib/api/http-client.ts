/**
 * Cliente HTTP central: cookie HttpOnly `jwt`, sem token em localStorage.
 * `NEXT_PUBLIC_API_BASE_URL` — API principal (vazio = mesma origem / proxy).
 * `NEXT_PUBLIC_ANALYZE_API_BASE_URL` — serviço de IA (obrigatório para analyze/documents).
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

export type HttpRequestOptions = Omit<RequestInit, "body"> & {
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

  let res: Response;
  try {
    res = await fetch(url, {
      ...rest,
      method,
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

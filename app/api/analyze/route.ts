import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;

const DEFAULT_BACKEND_TIMEOUT_MS = 180000;

function normalizeBase(raw: string | undefined): string {
  return (raw ?? "").trim().replace(/\/$/, "");
}

function getBackendBaseUrl(): string {
  return normalizeBase(
    process.env.BACKEND_PROXY_TARGET ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:4000",
  );
}

function getTimeoutMs(): number {
  const parsed = Number(process.env.ANALYZE_FRONT_PROXY_TIMEOUT_MS);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_BACKEND_TIMEOUT_MS;
}

function buildForwardHeaders(request: NextRequest): Headers {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const cookie = request.headers.get("cookie");
  const authorization = request.headers.get("authorization");

  if (contentType) headers.set("content-type", contentType);
  if (cookie) headers.set("cookie", cookie);
  if (authorization) headers.set("authorization", authorization);

  return headers;
}

function jsonError(status: number, code: string, message: string) {
  return Response.json(
    {
      success: false,
      code,
      message,
    },
    { status },
  );
}

export async function POST(request: NextRequest) {
  const controller = new AbortController();
  const timeoutMs = getTimeoutMs();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const targetUrl = `${getBackendBaseUrl()}/api/analyze`;

  try {
    const body = await request.arrayBuffer();
    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers: buildForwardHeaders(request),
      body,
      signal: controller.signal,
    });

    const responseBody = await upstream.text();
    const headers = new Headers();
    const contentType = upstream.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);

    return new Response(responseBody, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return jsonError(
        504,
        "analyze_front_proxy_timeout",
        "A analise demorou para responder. Tente novamente em instantes.",
      );
    }

    console.error("[front-analyze-proxy]", error);
    return jsonError(
      502,
      "analyze_front_proxy_failed",
      "Nao foi possivel comunicar com o servico de analise.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

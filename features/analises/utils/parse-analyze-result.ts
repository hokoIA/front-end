/** Extrai texto markdown/HTML do payload de resposta do analyze. */
export function parseAnalyzeResult(data: unknown): string {
  if (typeof data === "string") return data.trim();
  if (data && typeof data === "object" && !Array.isArray(data)) {
    const o = data as Record<string, unknown>;
    const r = o.result;
    if (typeof r === "string") return r.trim();
    const alt =
      o.content ??
      o.analysis ??
      o.text ??
      o.message ??
      o.answer;
    if (typeof alt === "string") return alt.trim();
  }
  return "";
}

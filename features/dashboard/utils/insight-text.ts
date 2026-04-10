export function extractInsightText(res: unknown): string {
  if (typeof res === "string") return res.trim();
  if (res && typeof res === "object" && !Array.isArray(res)) {
    const o = res as Record<string, unknown>;
    const t =
      o.text ??
      o.answer ??
      o.result ??
      o.message ??
      o.content ??
      o.analysis;
    if (typeof t === "string") return t.trim();
    if (Array.isArray(o.choices) && o.choices[0]) {
      const c = o.choices[0] as Record<string, unknown>;
      if (typeof c.text === "string") return c.text.trim();
    }
  }
  try {
    return JSON.stringify(res);
  } catch {
    return "Resposta recebida em formato não textual.";
  }
}

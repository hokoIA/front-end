function normalizeTextForAi(raw: string): string {
  return raw
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file, "utf-8");
  });
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
  }

  const data = await readFileAsArrayBuffer(file);
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .filter(Boolean)
      .join(" ");

    const normalized = normalizeTextForAi(line);
    if (normalized) {
      pages.push(`Página ${pageNumber}\n${normalized}`);
    }
  }

  return normalizeTextForAi(pages.join("\n\n"));
}

async function extractCsvText(file: File): Promise<string> {
  const raw = await readFileAsText(file);
  const rows = raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean);

  if (rows.length === 0) return "";

  const headers = rows[0].split(",").map((value) => value.trim()).filter(Boolean);
  const body = rows.slice(1);

  const lines = [
    "Tabela em CSV convertida para texto legivel.",
    headers.length > 0 ? `Colunas: ${headers.join(" | ")}` : "",
    ...body.map((row, index) => `Linha ${index + 1}: ${row}`),
  ].filter(Boolean);

  return normalizeTextForAi(lines.join("\n"));
}

export async function extractDocumentText(file: File): Promise<string> {
  if (isPdfFile(file)) {
    return extractPdfText(file);
  }

  const lower = file.name.toLowerCase();
  if (lower.endsWith(".csv")) {
    return extractCsvText(file);
  }

  return normalizeTextForAi(await readFileAsText(file));
}

export function isPdfFile(file: File): boolean {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

export function isSupportedDocumentFile(file: File): boolean {
  return /\.(pdf|txt|csv)$/i.test(file.name);
}

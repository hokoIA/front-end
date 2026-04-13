import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CAPTURE_CLASS = "analysis-pdf-capture-root";

/** Estilos mínimos para html2canvas (não entende bem color-mix/gradientes do tema). */
function injectPdfCaptureNormalize(doc: Document) {
  const style = doc.createElement("style");
  style.setAttribute("data-analysis-pdf-normalize", "true");
  style.textContent = `
    .${CAPTURE_CLASS},
    .${CAPTURE_CLASS} * {
      color: #191716 !important;
      border-color: #dce6f2 !important;
      background-image: none !important;
      box-shadow: none !important;
      text-shadow: none !important;
      filter: none !important;
      backdrop-filter: none !important;
    }
    .${CAPTURE_CLASS} {
      background: #ffffff !important;
    }
    .${CAPTURE_CLASS} table,
    .${CAPTURE_CLASS} th,
    .${CAPTURE_CLASS} td {
      border-color: #dce6f2 !important;
    }
    .${CAPTURE_CLASS} code,
    .${CAPTURE_CLASS} pre {
      background: #f4f6fb !important;
      color: #0e0e52 !important;
    }
    .${CAPTURE_CLASS} blockquote {
      background: #f4f6fb !important;
      border-left-color: #192bc2 !important;
    }
  `;
  doc.head.appendChild(style);
}

function stripMarkdownForPlainPdf(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "\n")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function exportPlainTextPdf(text: string, fileBaseName: string): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxW = pageWidth - margin * 2;
  const lines = doc.splitTextToSize(text, maxW);
  const lineHeight = 6;
  let y = margin;
  const bottom = pageHeight - margin;

  for (const line of lines) {
    if (y > bottom) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }

  const safe =
    fileBaseName.replace(/[^\w\-àáâãéêíóôõúç\s]/gi, "").trim().slice(0, 80) ||
    "analise";
  doc.save(`${safe.replace(/\s+/g, "-")}.pdf`);
}

/**
 * PDF multipágina a partir do DOM (html2canvas + jsPDF).
 * Fallback: texto simples se a captura falhar (CSS moderno, CORS em imagens, etc.).
 */
export async function exportAnalysisElementToPdf(
  element: HTMLElement,
  fileBaseName: string,
  options?: { fallbackPlainText?: string },
): Promise<void> {
  const fallback = options?.fallbackPlainText?.trim();
  const hadClass = element.classList.contains(CAPTURE_CLASS);

  try {
    if (!hadClass) element.classList.add(CAPTURE_CLASS);

    const canvas = await html2canvas(element, {
      scale: 1.75,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        injectPdfCaptureNormalize(clonedDoc);
      },
    });

    if (!canvas.width || !canvas.height) {
      throw new Error("Canvas vazio após captura.");
    }

    let imgData: string;
    try {
      imgData = canvas.toDataURL("image/png");
    } catch {
      throw new Error("Canvas contaminado (CORS) ou inseguro para exportar.");
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const margin = 12;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const innerH = pageHeight - margin * 2;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (!Number.isFinite(imgHeight) || imgHeight <= 0) {
      throw new Error("Dimensões inválidas para o PDF.");
    }

    let heightLeft = imgHeight;
    let y = margin;

    pdf.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
    heightLeft -= innerH;

    while (heightLeft > 0) {
      y = margin - (imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
      heightLeft -= innerH;
    }

    const safe =
      fileBaseName.replace(/[^\w\-àáâãéêíóôõúç\s]/gi, "").trim().slice(0, 80) ||
      "analise";
    pdf.save(`${safe.replace(/\s+/g, "-")}.pdf`);
  } catch (err) {
    if (fallback) {
      exportPlainTextPdf(stripMarkdownForPlainPdf(fallback), fileBaseName);
      return;
    }
    throw err;
  } finally {
    if (!hadClass) element.classList.remove(CAPTURE_CLASS);
  }
}

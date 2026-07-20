import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CAPTURE_CLASS = "analysis-pdf-capture-root";
const PDF_CAPTURE_WIDTH = 960;

function safePdfFileBaseName(fileBaseName: string): string {
  const normalized = fileBaseName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\-\s]/g, "")
    .trim()
    .slice(0, 80);

  return (normalized || "analise").replace(/\s+/g, "-");
}

function injectPdfCaptureStyles(doc: Document): HTMLStyleElement {
  const style = doc.createElement("style");
  style.setAttribute("data-analysis-pdf-style", "true");
  style.textContent = `
    .${CAPTURE_CLASS} {
      position: fixed !important;
      left: -12000px !important;
      top: 0 !important;
      width: ${PDF_CAPTURE_WIDTH}px !important;
      background: #ffffff !important;
      color: #111827 !important;
      font-family: Arial, Helvetica, sans-serif !important;
      font-size: 15px !important;
      line-height: 1.56 !important;
      letter-spacing: 0 !important;
      z-index: -1 !important;
    }
    .${CAPTURE_CLASS},
    .${CAPTURE_CLASS} * {
      box-sizing: border-box !important;
      color: #111827 !important;
      border-color: #d7e1ee !important;
      background-image: none !important;
      box-shadow: none !important;
      text-shadow: none !important;
      filter: none !important;
      backdrop-filter: none !important;
      letter-spacing: 0 !important;
    }
    .${CAPTURE_CLASS} [data-pdf-root="true"] {
      width: ${PDF_CAPTURE_WIDTH}px !important;
      overflow: hidden !important;
      border: 1px solid #cfdced !important;
      border-radius: 14px !important;
      background: #ffffff !important;
    }
    .${CAPTURE_CLASS} [data-pdf-header="true"] {
      padding: 30px 40px 24px !important;
      border-bottom: 1px solid #d7e1ee !important;
      background: #f6f9fd !important;
    }
    .${CAPTURE_CLASS} [data-pdf-header="true"] > div:first-child {
      display: flex !important;
      align-items: flex-start !important;
      justify-content: space-between !important;
      gap: 24px !important;
    }
    .${CAPTURE_CLASS} [data-pdf-header="true"] p {
      margin: 0 !important;
      color: #5b6880 !important;
      font-size: 13px !important;
      line-height: 1.45 !important;
    }
    .${CAPTURE_CLASS} [data-pdf-header="true"] p:first-child {
      margin-bottom: 7px !important;
      color: #33415f !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.08em !important;
    }
    .${CAPTURE_CLASS} [data-pdf-header="true"] h2 {
      margin: 0 0 6px !important;
      color: #090b55 !important;
      font-size: 24px !important;
      line-height: 1.2 !important;
      font-weight: 700 !important;
    }
    .${CAPTURE_CLASS} [data-pdf-header="true"] span,
    .${CAPTURE_CLASS} [data-pdf-header="true"] strong {
      color: #111827 !important;
      font-weight: 700 !important;
    }
    .${CAPTURE_CLASS} [data-pdf-header="true"] [role="separator"],
    .${CAPTURE_CLASS} [data-pdf-header="true"] hr {
      height: 1px !important;
      margin: 18px 0 !important;
      border: 0 !important;
      background: #d7e1ee !important;
    }
    .${CAPTURE_CLASS} [data-pdf-header="true"] > div:last-child > div {
      display: inline-flex !important;
      align-items: center !important;
      margin: 0 8px 8px 0 !important;
      padding: 5px 10px !important;
      border: 1px solid #cbd7e6 !important;
      border-radius: 999px !important;
      background: #ffffff !important;
      color: #33415f !important;
      font-size: 11px !important;
      line-height: 1.2 !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
    }
    .${CAPTURE_CLASS} [data-pdf-markdown="true"] {
      padding: 34px 40px 42px !important;
      background: #ffffff !important;
    }
    .${CAPTURE_CLASS} h1 {
      margin: 0 0 16px !important;
      color: #090b55 !important;
      font-size: 27px !important;
      line-height: 1.18 !important;
      font-weight: 750 !important;
    }
    .${CAPTURE_CLASS} h2 {
      margin: 34px 0 12px !important;
      color: #090b55 !important;
      font-size: 20px !important;
      line-height: 1.25 !important;
      font-weight: 750 !important;
    }
    .${CAPTURE_CLASS} h3 {
      margin: 24px 0 9px !important;
      color: #090b55 !important;
      font-size: 16px !important;
      line-height: 1.35 !important;
      font-weight: 750 !important;
    }
    .${CAPTURE_CLASS} p {
      margin: 0 0 15px !important;
      color: #182033 !important;
      font-size: 14px !important;
      line-height: 1.62 !important;
    }
    .${CAPTURE_CLASS} strong {
      color: #080a4f !important;
      font-weight: 750 !important;
    }
    .${CAPTURE_CLASS} em {
      color: #33415f !important;
      font-style: italic !important;
    }
    .${CAPTURE_CLASS} ul,
    .${CAPTURE_CLASS} ol {
      margin: 0 0 18px 23px !important;
      padding: 0 !important;
      color: #182033 !important;
      font-size: 14px !important;
      line-height: 1.58 !important;
    }
    .${CAPTURE_CLASS} li {
      margin: 0 0 7px !important;
      padding-left: 3px !important;
    }
    .${CAPTURE_CLASS} blockquote {
      margin: 18px 0 !important;
      padding: 14px 18px !important;
      border-left: 4px solid #192bc2 !important;
      border-radius: 8px !important;
      background: #f4f7fb !important;
    }
    .${CAPTURE_CLASS} blockquote p:last-child {
      margin-bottom: 0 !important;
    }
    .${CAPTURE_CLASS} table {
      width: 100% !important;
      margin: 18px 0 24px !important;
      border-collapse: separate !important;
      border-spacing: 0 !important;
      overflow: hidden !important;
      border: 1px solid #cbd7e6 !important;
      border-radius: 10px !important;
      background: #ffffff !important;
      font-size: 12px !important;
    }
    .${CAPTURE_CLASS} thead {
      background: #f4f7fb !important;
    }
    .${CAPTURE_CLASS} th {
      padding: 10px 12px !important;
      color: #51607a !important;
      font-size: 10px !important;
      line-height: 1.3 !important;
      font-weight: 750 !important;
      text-align: left !important;
      text-transform: uppercase !important;
      vertical-align: top !important;
      border-bottom: 1px solid #cbd7e6 !important;
    }
    .${CAPTURE_CLASS} td {
      padding: 10px 12px !important;
      color: #182033 !important;
      font-size: 12px !important;
      line-height: 1.42 !important;
      vertical-align: top !important;
      border-top: 1px solid #e4ebf4 !important;
    }
    .${CAPTURE_CLASS} code,
    .${CAPTURE_CLASS} pre {
      background: #f4f6fb !important;
      color: #0e0e52 !important;
      border-radius: 7px !important;
      font-family: "Courier New", monospace !important;
      font-size: 12px !important;
    }
    .${CAPTURE_CLASS} a {
      color: #192bc2 !important;
      text-decoration: underline !important;
    }
  `;
  doc.head.appendChild(style);
  return style;
}

function markPdfRoles(root: HTMLElement) {
  root.setAttribute("data-pdf-root", "true");

  const firstChild = root.firstElementChild;
  if (firstChild instanceof HTMLElement) {
    firstChild.setAttribute("data-pdf-header", "true");
  }

  const markdown = root.querySelector(".analysis-markdown");
  if (markdown instanceof HTMLElement) {
    markdown.setAttribute("data-pdf-markdown", "true");
  }
}

function stripComplexStyling(root: HTMLElement) {
  root.removeAttribute("class");
  root.removeAttribute("style");
  root.querySelectorAll<HTMLElement>("*").forEach((node) => {
    node.removeAttribute("class");
    node.removeAttribute("style");
  });
}

function mountPdfCaptureClone(element: HTMLElement) {
  const wrapper = document.createElement("div");
  wrapper.className = CAPTURE_CLASS;

  const clone = element.cloneNode(true) as HTMLElement;
  markPdfRoles(clone);
  stripComplexStyling(clone);

  wrapper.appendChild(clone);
  const style = injectPdfCaptureStyles(document);
  document.body.appendChild(wrapper);

  return {
    target: wrapper,
    cleanup: () => {
      wrapper.remove();
      style.remove();
    },
  };
}

async function waitForPdfLayout() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
  await document.fonts?.ready.catch(() => undefined);
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
  const margin = 16;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxW = pageWidth - margin * 2;
  const paragraphs = text.split(/\n{2,}/).filter(Boolean);
  let y = margin;
  const bottom = pageHeight - margin;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(17, 24, 39);
  doc.setFontSize(11);

  for (const paragraph of paragraphs) {
    const lines = doc.splitTextToSize(paragraph, maxW);
    for (const line of lines) {
      if (y > bottom) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 5.4;
    }
    y += 3;
  }

  doc.save(`${safePdfFileBaseName(fileBaseName)}.pdf`);
}

/**
 * Multi-page PDF from a clean DOM clone. The clone avoids Tailwind/theme CSS
 * that html2canvas cannot always parse in production builds.
 */
export async function exportAnalysisElementToPdf(
  element: HTMLElement,
  fileBaseName: string,
  options?: { fallbackPlainText?: string },
): Promise<void> {
  const fallback = options?.fallbackPlainText?.trim();
  let cleanup: (() => void) | null = null;

  try {
    const mounted = mountPdfCaptureClone(element);
    cleanup = mounted.cleanup;
    await waitForPdfLayout();

    const canvas = await html2canvas(mounted.target, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: PDF_CAPTURE_WIDTH,
      windowHeight: mounted.target.scrollHeight,
    });

    if (!canvas.width || !canvas.height) {
      throw new Error("Canvas vazio apos captura.");
    }

    let imgData: string;
    try {
      imgData = canvas.toDataURL("image/png");
    } catch {
      throw new Error("Canvas contaminado por CORS ou inseguro para exportar.");
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const innerH = pageHeight - margin * 2;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (!Number.isFinite(imgHeight) || imgHeight <= 0) {
      throw new Error("Dimensoes invalidas para o PDF.");
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

    pdf.save(`${safePdfFileBaseName(fileBaseName)}.pdf`);
  } catch (err) {
    if (fallback) {
      exportPlainTextPdf(stripMarkdownForPlainPdf(fallback), fileBaseName);
      return;
    }
    throw err;
  } finally {
    cleanup?.();
  }
}

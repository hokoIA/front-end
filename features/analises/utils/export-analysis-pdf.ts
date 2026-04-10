import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

/**
 * PDF multipágina a partir do DOM renderizado (boa legibilidade PT-BR via canvas).
 */
export async function exportAnalysisElementToPdf(
  element: HTMLElement,
  fileBaseName: string,
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imgData = canvas.toDataURL("image/png");
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
}

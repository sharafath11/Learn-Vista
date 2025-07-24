import jsPDF from "jspdf";
import type { ICertificate } from "@/src/types/certificateTypes";

export async function generateCertificatePDF(
  container: HTMLDivElement,
  certificate: ICertificate,
  fileName = "certificate.pdf"
) {
  if (!certificate) throw new Error("Missing certificate data");

  const pdf = new jsPDF("landscape", "pt", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - 2 * margin;
  const contentHeight = pageHeight - 2 * margin;

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const borderColor = certificate.isRevoked ? "#fca5a5" : "#bfdbfe";
  const bgColor = certificate.isRevoked ? "#fef2f2" : "#eff6ff";

  // Background
  pdf.setFillColor(bgColor);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // Border (double)
  const innerMargin = 20;
  const innerX = margin + innerMargin;
  const innerY = margin + innerMargin;
  const innerWidth = contentWidth - 2 * innerMargin;
  const innerHeight = contentHeight - 2 * innerMargin;

  pdf.setDrawColor(borderColor);
  pdf.setLineWidth(4);
  pdf.rect(innerX, innerY, innerWidth, innerHeight, "S");

  pdf.setLineWidth(1);
  pdf.rect(innerX + 6, innerY + 6, innerWidth - 12, innerHeight - 12, "S");

  let currentY = margin + 40;

  // Logo
  const logoImg = await loadImage("/images/logo.png");
  const logoWidth = 140;
  const logoHeight = 70;
  const logoX = (pageWidth - logoWidth) / 2;
  pdf.addImage(logoImg, "PNG", logoX, currentY, logoWidth, logoHeight);
  currentY += logoHeight + 25;

  // Title
  const title = `Certificate of ${certificate.isRevoked ? "Revocation" : "Completion"}`;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28);
  pdf.setTextColor("#374151");
  pdf.text(title, pageWidth / 2, currentY, { align: "center" });
  currentY += 20;

  // Line under title
  pdf.setDrawColor("#4f46e5");
  pdf.setLineWidth(2);
  pdf.line(pageWidth / 2 - 40, currentY, pageWidth / 2 + 40, currentY);
  currentY += 30;

  // Subtitle
  const subtitle = certificate.isRevoked
    ? "This certificate has been officially revoked"
    : "Awarded for outstanding achievement and dedication";
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.text(subtitle, pageWidth / 2, currentY, { align: "center" });
  currentY += 50;

  // Certify text
  pdf.setFontSize(16);
  pdf.text("This is to certify that", pageWidth / 2, currentY, { align: "center" });
  currentY += 30;

  // Name
  pdf.setFont("times", "italic");
  pdf.setFontSize(40);
  pdf.setTextColor("#312e81");
  pdf.text(certificate.userName, pageWidth / 2, currentY, { align: "center" });
  currentY += 45;

  // Completion line
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(16);
  pdf.setTextColor("#374151");
  pdf.text(
    `has ${certificate.isRevoked ? "had their completion of" : "successfully completed"} the course`,
    pageWidth / 2,
    currentY,
    { align: "center" }
  );
  currentY += 25;

  // Course title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text(certificate.courseTitle, pageWidth / 2, currentY, { align: "center" });
  currentY += 70;

  // Metadata
  const detailY = currentY;
  const detailGap = 120;

  pdf.setFontSize(12);
  pdf.setTextColor("#6b7280");
  pdf.text("Issued On", pageWidth / 2 - detailGap, detailY, { align: "center" });
  pdf.text("Certificate ID", pageWidth / 2 + detailGap, detailY, { align: "center" });

  pdf.setFontSize(14);
  pdf.setTextColor("#374151");
  pdf.text(certificate.issuedDateFormatted, pageWidth / 2 - detailGap, detailY + 18, { align: "center" });
  pdf.text(certificate.certificateId, pageWidth / 2 + detailGap, detailY + 18, { align: "center" });

  // Footer
  const footerHeight = 120;
  const footerY = innerY + innerHeight - footerHeight;
  const footerTextYOffset = 15;
  const lineYOffset = 30;
  const boxWidth = 160;
  const boxHeight = 60;

  // Signature (left)
  const sigX = margin + contentWidth / 6;
  pdf.setFontSize(12);
  pdf.setTextColor("#374151");
  pdf.text("Authorized Signature", sigX, footerY + footerTextYOffset, { align: "center" });
  pdf.setDrawColor("#9ca3af");
  pdf.line(
    sigX - boxWidth / 2,
    footerY + lineYOffset + boxHeight / 2,
    sigX + boxWidth / 2,
    footerY + lineYOffset + boxHeight / 2
  );

  // QR code (center)
  if (certificate.qrCodeUrl) {
    const qrImg = await loadImage(certificate.qrCodeUrl);
    const qrSize = 90;
    const qrX = pageWidth / 2 - qrSize / 2;
    pdf.addImage(qrImg, "PNG", qrX, footerY + 5, qrSize, qrSize);
    pdf.setFontSize(10);
    pdf.setTextColor("#6b7280");
    pdf.text("Scan to verify authenticity", pageWidth / 2, footerY + qrSize + 10, { align: "center" });
  }

  // Save PDF
  pdf.save(fileName);
}

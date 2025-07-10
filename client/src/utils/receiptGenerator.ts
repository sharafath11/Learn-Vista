import jsPDF from "jspdf";

export interface ReceiptData {
  organizationName: string;
  organizationAddress: string;
  organizationEmail: string;
  organizationPhone: string;
  taxId: string;
  transactionId: string;
  receiptNumber: string;
  donationDate: string;
  donationTime: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string; // e.g. "INR"
  paymentMethod: string;
  purpose: string;
  isRecurring: boolean;
  notes: string;
}

export const generateReceiptPDF = async (data: ReceiptData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  const gray = "#374151";
  const green = "#059669";
  const lightGray = "#F3F4F6";
  const yellow = "#FEF3C7";

  pdf.setFillColor(green);
  pdf.rect(0, 0, pageWidth, 50, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text(data.organizationName, margin, y);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("DONATION RECEIPT", margin, y + 12);

  pdf.setFontSize(10);
  pdf.text(`Receipt #: ${data.receiptNumber}`, pageWidth - margin, y, { align: "right" });
  pdf.text(`Date: ${data.donationDate}`, pageWidth - margin, y + 10, { align: "right" });
  y = 60;
  pdf.setTextColor(gray);
  pdf.setFontSize(10);
  pdf.text(data.organizationAddress, margin, y);
  y += 6;
  pdf.text(`Email: ${data.organizationEmail}`, margin, y);
  y += 6;
  pdf.text(`Phone: ${data.organizationPhone}`, margin, y);
  y += 6;
  pdf.text(`Tax ID: ${data.taxId}`, margin, y);
  y += 12;
  pdf.setFillColor(lightGray);
  pdf.roundedRect(margin, y, pageWidth - margin * 2, 30, 4, 4, "F");

  pdf.setTextColor(gray);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Donor Information", margin + 5, y + 8);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Name: ${data.donorName}`, margin + 5, y + 18);
  pdf.text(`Email: ${data.donorEmail}`, margin + 5, y + 26);
  y += 42;
  pdf.setFillColor(lightGray);
  pdf.roundedRect(margin, y, pageWidth - margin * 2, 45, 4, 4, "F");

  pdf.setTextColor(gray);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Donation Details", margin + 5, y + 8);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Purpose: ${data.purpose}`, margin + 5, y + 18);
  pdf.text(`Payment Method: ${data.paymentMethod}`, margin + 5, y + 26);
  pdf.text(`Transaction ID: ${data.transactionId}`, margin + 5, y + 34);
  pdf.text(`Date & Time: ${data.donationDate} at ${data.donationTime}`, margin + 5, y + 42);
  y += 60;
  pdf.setFillColor(green);
  pdf.roundedRect(margin, y, pageWidth - margin * 2, 28, 4, 4, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text(`Donation Amount INR ${data.amount} `, margin + 5, y + 10);

  const currencySymbol = data.currency.toUpperCase() === "INR" ? "₹" : data.currency.toUpperCase();
  pdf.setFontSize(22);
  pdf.text(`${data.amount}`, pageWidth - margin - 5, y + 20, {
    align: "right",
  });
  y += 38;
  pdf.setTextColor(gray);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Thank you for your generous donation!", pageWidth / 2, y, { align: "center" });

  y += 8;
  pdf.setFont("helvetica", "normal");
  const wrappedNotes = pdf.splitTextToSize(data.notes, pageWidth - margin * 2);
  pdf.setFontSize(10);
  pdf.text(wrappedNotes, margin, y);
  y += wrappedNotes.length * 5;
  y += 10;
  pdf.setFillColor(yellow);
  pdf.roundedRect(margin, y, pageWidth - margin * 2, 22, 4, 4, "F");

  pdf.setTextColor(gray);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("TAX DEDUCTION NOTICE", margin + 5, y + 6);

  pdf.setFont("helvetica", "normal");
  pdf.text("This receipt serves as proof of your charitable donation for tax purposes.", margin + 5, y + 13);
  pdf.text("Consult your tax advisor for eligibility.", margin + 5, y + 19);
  const footerY = pdf.internal.pageSize.getHeight() - 20;
  pdf.setFontSize(8);
  pdf.setTextColor("#6B7280");
  pdf.text("This is a computer-generated receipt and does not require a signature.", pageWidth / 2, footerY, {
    align: "center",
  });
  pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 6, {
    align: "center",
  });
  pdf.save(`donation-receipt-${data.receiptNumber}.pdf`);
};

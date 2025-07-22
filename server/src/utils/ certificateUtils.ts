import { v4 as uuidv4 } from "uuid"
import QRCode from "qrcode"

export function generateCertificateId(): string {
  return `CERT-${uuidv4()}`
}

export async function generateQRCode(data: string): Promise<string> {
  const certificateURL = `${process.env.CLIENT_URL}/user/certificate/${data}`
  const qrCodeDataURL = await QRCode.toDataURL(certificateURL)
  return qrCodeDataURL
}

export function formatIssuedDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

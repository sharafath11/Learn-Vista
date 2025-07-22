"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { UserAPIMethods } from "@/src/services/APImethods"
import { showInfoToast } from "@/src/utils/Toast"
import { useParams } from "next/navigation"

export default function CertificatePage() {
  const params = useParams();
  const  certificateId =params.certificateId

  const [certificate, setCertificate] = useState<any | null>(null)

  useEffect(() => {
   fetchCertificate()
  }, [certificateId])
  const fetchCertificate = async () => {
    const res = await UserAPIMethods.getCertificate(certificateId as string);
    if (res.ok) setCertificate(res.data);
    else showInfoToast(res.msg)
  }

  if (!certificate) {
    return (
      <div className="flex h-screen items-center justify-center text-lg text-muted-foreground">
        Loading certificate...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6 sm:p-12">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow-2xl sm:p-10">
        <h1 className="text-center text-4xl font-extrabold text-primary-dark sm:text-5xl">
          Certificate of Completion
        </h1>

        <p className="mt-4 text-center text-lg text-gray-600">
          This certifies that <span className="font-semibold text-gray-800">{certificate.userName}</span> has
          successfully completed the course:
        </p>

        <h2 className="mt-6 text-center text-2xl font-bold text-primary">
          {certificate.courseTitle}
        </h2>

        <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
          {certificate.qrCodeUrl && (
            <Image
              src={certificate.qrCodeUrl}
              alt="QR Code"
              width={150}
              height={150}
              className="rounded-lg border"
            />
          )}
          <div>
            <p className="text-gray-700">
              <strong>Certificate ID:</strong> {certificate.certificateId}
            </p>
            <p className="text-gray-700">
              <strong>Issued On:</strong> {certificate.issuedDateFormatted}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong>{" "}
              {certificate.isRevoked ? (
                <Badge variant="destructive">Revoked</Badge>
              ) : (
                <Badge variant="default">Valid</Badge>
              )}
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-primary px-6 py-2 text-white shadow hover:bg-primary-dark"
          >
            Download / Print
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"
import type { ICertificate } from "@/src/types/certificateTypes"
import Image from "next/image"
import { forwardRef } from "react"

interface CertificateViewerProps {
  certificate: ICertificate
}

const CertificateViewer = forwardRef<HTMLDivElement, CertificateViewerProps>(({ certificate }, ref) => {
  const certificateBorderColor = certificate.isRevoked ? "border-red-300" : "border-blue-200"
  return (
    <div
      ref={ref}
      className={`p-10 bg-white relative rounded-xl w-[1120px] h-auto mx-auto ${certificate.isRevoked ? "bg-red-50" : "bg-blue-50"}`}
    >
      {certificate.isRevoked && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-red-100 bg-opacity-70 rounded-xl">
          <span className="text-red-600 text-6xl md:text-8xl font-extrabold rotate-[-20deg] opacity-75 select-none pointer-events-none">
            REVOKED
          </span>
        </div>
      )}
      <div
        className={`relative border-8 border-double p-8 bg-white rounded-xl shadow-xl ${certificateBorderColor} ${certificate.isRevoked ? "filter grayscale opacity-80" : ""}`}
      >
        {/* Header */}
        <div className="text-center mb-10">
  <Image
    src="/images/logo.png"
    width={140}
    height={70}
    alt="Company Logo"
    className="object-contain mx-auto mb-4"
  />
  <h1 className="text-4xl font-bold text-gray-800 font-serif">
    {certificate.isRevoked ? "Certificate of Revocation" : "Certificate of Completion"}
  </h1>
  <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto rounded-full my-3" />
  <p className="text-lg text-gray-600">
    {certificate.isRevoked
      ? "This certificate has been officially revoked"
      : "Awarded for outstanding achievement and dedication"}
  </p>
</div>

        {/* Recipient */}
        <div className="text-center mb-10">
          <p className="text-lg text-gray-700 mb-2">This is to certify that</p>
          <h2 className="text-5xl font-bold text-indigo-800 font-serif italic break-words mb-4">
            {certificate.userName}
          </h2>
          <p className="text-lg text-gray-700">
            has {certificate.isRevoked ? "had their completion of" : "successfully completed"} the course
          </p>
          <h3 className="text-2xl font-semibold text-gray-800 mt-3 break-words">{certificate.courseTitle}</h3>
        </div>
        {/* Details */}
        <div className="flex justify-center gap-16 mb-10">
          <div className="text-center">
            <p className="text-sm text-gray-500">Issued On</p>
            <p className="text-base font-medium text-gray-800">{certificate.issuedDateFormatted}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Certificate ID</p>
            <p className="text-base font-medium text-gray-800 break-words w-[260px]">{certificate.certificateId}</p>
          </div>
        </div>
        {/* Footer: Signature, QR, Seal */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-6 border-t border-gray-200">
          {/* Signature */}
          <div className="text-center flex-1">
            <p className="text-gray-800 font-medium text-sm mb-3">Authorized Signature</p>
            <div className="mt-1 h-14 w-40 mx-auto border-b-2 border-gray-400"></div>
          </div>
          {/* QR Code */}
          {certificate.qrCodeUrl && (
            <div className="text-center flex-1">
              <Image
                src={certificate.qrCodeUrl || "/placeholder.png"}
                width={90}
                height={90}
                alt="Verification QR Code"
                className="mx-auto border border-gray-200 rounded-md p-1 bg-white"
                crossOrigin="anonymous"
              />
              <p className="text-xs text-gray-600 mt-2">Scan to verify authenticity</p>
            </div>
          )}
          {/* Seal */}
          <div className="text-center flex-1">
            <p className="text-gray-800 font-medium text-sm mb-3">Official Seal</p>
            <div className="mt-1 h-14 w-40 mx-auto border-2 border-gray-400 flex items-center justify-center text-gray-500 text-xs">
              OFFICIAL SEAL
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

CertificateViewer.displayName = "CertificateViewer"

export default CertificateViewer

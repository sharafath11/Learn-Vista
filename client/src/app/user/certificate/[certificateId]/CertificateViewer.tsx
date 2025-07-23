"use client";

import Image from "next/image";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { ICertificate } from "@/src/types/certificateTypes";
import { ShieldOff, ShieldCheck } from "lucide-react";
import { forwardRef } from "react";

interface CertificateViewerProps {
  certificate: ICertificate;
}

const CertificateViewer = forwardRef<HTMLDivElement, CertificateViewerProps>(
  ({ certificate }, ref) => {
    const certificateBorderColor = certificate.isRevoked ? "border-red-300" : "border-blue-200";

    return (
      <div
        className={`p-6 md:p-8 lg:p-10 bg-white relative rounded-xl ${certificate.isRevoked ? "bg-red-50" : "bg-blue-50"}`}
        ref={ref}
      >
        {certificate.isRevoked && (
          <div className="revoked-overlay absolute inset-0 flex items-center justify-center z-10 bg-red-100 bg-opacity-70 rounded-2xl">
            <span className="text-red-600 text-6xl md:text-8xl lg:text-9xl font-extrabold rotate-[-20deg] opacity-75 select-none pointer-events-none">
              REVOKED
            </span>
          </div>
        )}

        <div className={`relative border-8 border-double p-5 md:p-6 bg-white bg-opacity-90 rounded-lg ${certificateBorderColor} ${certificate.isRevoked ? 'filter grayscale opacity-80' : ''}`}>
          <div className="text-center mb-6 md:mb-8">
            <div className="flex justify-center mb-3 md:mb-4">
              <Image
                src="/images/logo.png"
                width={140}
                height={70}
                alt="Company Logo"
                className="object-contain h-14 md:h-16"
                priority
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1 md:mb-2 font-serif">
              Certificate of {certificate.isRevoked ? "Revocation" : "Completion"}
            </h1>
            <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto rounded-full mb-3 md:mb-4"></div>
            <p className="text-base md:text-lg text-gray-600">
              {certificate.isRevoked ? 
                "This certificate has been officially revoked" : 
                "Awarded for outstanding achievement and dedication"}
            </p>
          </div>

          <div className="text-center mb-8 md:mb-10">
            <p className="text-lg md:text-xl text-gray-700 mb-4">This is to certify that</p>
            <h2 className="text-4xl md:text-5xl font-bold text-indigo-800 my-4 font-serif italic break-words">
              {certificate.userName}
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-3">
              has {certificate.isRevoked ? "had their completion of" : "successfully completed"} the course
            </p>
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-3 mb-5 break-words">
              {certificate.courseTitle}
            </h3>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Issued On</p>
                <p className="text-base font-medium text-gray-800">{certificate.issuedDateFormatted}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Certificate ID</p>
                <p className="text-base font-medium text-gray-800 break-all">{certificate.certificateId}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-10 pt-5 border-t border-gray-200">
            <div className="text-center flex-1 min-w-[120px]">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-3"></div>
              <p className="text-gray-800 font-medium text-sm">Authorized Signature</p>
              <div className="mt-1 h-14 w-40 mx-auto border-b-2 border-gray-400"></div>
            </div>

            {certificate.qrCodeUrl && (
              <div className="text-center flex-1 min-w-[90px]">
                <Image
                  src={certificate.qrCodeUrl}
                  width={100}
                  height={100}
                  alt="Verification QR Code"
                  className="mx-auto border border-gray-200 rounded-md p-0.5 bg-white"
                />
                <p className="text-xs text-gray-600 mt-1">Scan to verify authenticity</p>
              </div>
            )}

            <div className="text-center flex-1 min-w-[120px]">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-3"></div>
              <p className="text-gray-800 font-medium text-sm">Official Seal</p>
              <div className="mt-1 h-14 w-14 mx-auto rounded-full border-2 border-gray-400 flex items-center justify-center">
                <Image
                  src="/seal.png"
                  width={40}
                  height={40}
                  alt="Official Seal"
                  className="opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CertificateViewer.displayName = "CertificateViewer";
export default CertificateViewer;

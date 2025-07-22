"use client";

import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/src/components/shared/components/ui/button";
import { Loader2, DownloadIcon, ShieldCheck, ShieldOff } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { ICertificate } from "@/src/types/certificateTypes";
import { UserAPIMethods } from "@/src/services/APImethods";
import { showInfoToast } from "@/src/utils/Toast";
import { Badge } from "@/src/components/shared/components/ui/badge";

export default function CertificatePage() {
  const params = useParams();
  const certificateId = params.certificateId as string;
  const certificateRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<ICertificate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await UserAPIMethods.getCertificate(certificateId);
        if (res.ok && res.data) {
          setCertificate(res.data);
        } else {
          const errorMessage = res.msg || "Certificate not found.";
          setError(errorMessage);
          showInfoToast(errorMessage);
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError("An unexpected error occurred.");
        showInfoToast("An unexpected error occurred while fetching the certificate.");
      } finally {
        setLoading(false);
      }
    };

    if (certificateId) {
      fetchCertificate();
    } else {
      setLoading(false);
      setError("No certificate ID provided.");
      showInfoToast("No certificate ID provided in the URL.");
    }
  }, [certificateId]);

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) {
      showInfoToast("Certificate content not ready for download.");
      return;
    }

    try {
      const overlay = certificateRef.current.querySelector('.revoked-overlay') as HTMLElement;
      if (overlay) {
        overlay.style.display = 'none';
      }

      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: null
      });

      if (overlay) {
        overlay.style.display = 'flex';
      }

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`certificate-${certificate?.certificateId || 'download'}.pdf`);
      showInfoToast("Certificate downloaded successfully!");
    } catch (err) {
      console.error("Error generating PDF:", err);
      showInfoToast("Failed to download certificate. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-xl font-medium text-gray-700">Loading your certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 px-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md w-full">
          <ShieldOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Certificate Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "The requested certificate could not be loaded."}
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const certificateBorderColor = certificate.isRevoked ? "border-red-300" : "border-blue-200";
  const certificateBgColor = certificate.isRevoked ? "bg-red-50" : "bg-blue-50";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-inter">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            Certificate Verification
          </h1>
          <Badge 
            variant={certificate.isRevoked ? "destructive" : "default"} 
            className="px-4 py-2 text-sm font-medium rounded-full"
          >
            {certificate.isRevoked ? (
              <span className="flex items-center gap-1">
                <ShieldOff className="h-4 w-4" /> Revoked
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> Valid
              </span>
            )}
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          <div className="bg-white shadow-xl border rounded-2xl overflow-hidden mb-8 max-w-6xl mx-auto">
            <div 
              className={`p-6 md:p-8 lg:p-10 ${certificate.isRevoked ? "bg-gradient-to-r from-red-50 to-pink-50" : "bg-gradient-to-r from-blue-50 to-indigo-50"}`}
              ref={certificateRef}
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
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-6">
            <Button 
              onClick={handleDownloadPdf} 
              className="gap-2 px-8 py-3 text-base rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              disabled={certificate.isRevoked}
            >
              <DownloadIcon className="h-5 w-5" />
              Download Certificate
            </Button>
            {certificate.isRevoked && (
              <div className="text-center text-red-600 font-medium text-sm mt-2 p-2 bg-red-50 rounded-md">
                This certificate has been revoked and cannot be downloaded.
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            <p className="mt-1 text-xs">
              This {certificate.isRevoked ? "revoked " : ""}certificate is {certificate.isRevoked ? "no longer" : ""} valid for verification purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
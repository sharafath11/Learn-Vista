"use client"

import { useRef, useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Loader2, DownloadIcon, ShieldOff, ShieldCheck } from "lucide-react"
import type { ICertificate } from "@/src/types/certificateTypes"
import { showInfoToast } from "@/src/utils/Toast"
import { generateCertificatePDF } from "@/src/utils/certificateUtils"
import { Button } from "@/src/components/shared/components/ui/button"
import { Badge } from "@/src/components/shared/components/ui/badge"
import CertificateViewer from "./CertificateViewer"
import { UserAPIMethods } from "@/src/services/methods/user.api"

export default function CertificatePage() {
  const params = useParams()
  const certificateId = params.certificateId as string
  const certificateRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState<ICertificate | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await UserAPIMethods.getCertificate(certificateId)
        if (res.ok && res.data) {
          setCertificate(res.data)
        } else {
          setError(res.msg || "Certificate not found.")
          showInfoToast(res.msg || "Certificate not found.")
        }
      } catch {
        setError("Unexpected error.")
        showInfoToast("Unexpected error while loading certificate.")
      } finally {
        setLoading(false)
      }
    }
    if (certificateId) fetchCertificate()
    else {
      setError("No certificate ID provided.")
      showInfoToast("No certificate ID in URL.")
      setLoading(false)
    }
  }, [certificateId])

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current || !certificate) {
      return showInfoToast("Certificate content not ready for download.")
    }
    try {
      await generateCertificatePDF(certificateRef.current, certificate)
      showInfoToast("Certificate downloaded successfully!")
    } catch (err) {
      console.warn(err)
      showInfoToast("Failed to download certificate.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!certificate || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white rounded-lg shadow p-6 text-center max-w-md">
          <ShieldOff className="text-red-500 w-10 h-10 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Certificate Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b px-4 py-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            Certificate Verification
          </h1>
          <Badge variant={certificate.isRevoked ? "destructive" : "default"}>
            {certificate.isRevoked ? "Revoked" : "Valid"}
          </Badge>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <CertificateViewer ref={certificateRef} certificate={certificate} />
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <Button
            onClick={handleDownloadCertificate}
            disabled={certificate.isRevoked}
            className="gap-2 px-6 py-3 text-base"
          >
            <DownloadIcon className="w-5 h-5" /> Download Certificate
          </Button>
          {certificate.isRevoked && (
            <div className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-md text-center">
              This certificate has been revoked and cannot be downloaded.
            </div>
          )}
        </div>
      </main>
      <footer className="bg-white border-t py-6 mt-12 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>
    </div>
  )
}

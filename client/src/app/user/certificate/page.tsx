"use client"

import { useEffect, useState } from "react"
import CertificateFilters, { CertificateFilterValues } from "./CertificateFilters"
import CertificateCard from "./CertificateCard"
import { Loader2 } from "lucide-react"
import { ICertificate } from "@/src/types/certificateTypes"
import { UserAPIMethods } from "@/src/services/APImethods"

export default function CertificateListPage() {
  const [certificates, setCertificates] = useState<ICertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CertificateFilterValues>({
    search: "",
    sort: "latest",
    status: "all",
  })

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const queryParams: Record<string, string> = {
        search: filters.search,
        sort: filters.sort,
      }
      if (filters.status !== "all") {
        queryParams.status = filters.status
      }
      const data = await UserAPIMethods.getCertificates(queryParams)
      setCertificates(data.data.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [filters])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">🎓 Your Certificates</h2>
        <CertificateFilters onChange={setFilters} />

        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        ) : certificates.length === 0 ? (
          <p className="text-center mt-16 text-lg text-gray-500">No certificates found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {certificates.map((cert) => (
              <CertificateCard key={cert.id?.toString()} certificate={cert} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

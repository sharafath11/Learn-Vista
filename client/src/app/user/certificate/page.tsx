"use client"

import { useCallback, useEffect, useState } from "react"
import CertificateFilters from "./CertificateFilters"
import CertificateCard from "./CertificateCard"
import { Loader2 } from "lucide-react"
import { ICertificate } from "@/src/types/certificateTypes"
import { UserAPIMethods } from "@/src/services/methods/user.api"
import { ICertificateFilterValues } from "@/src/types/userProps"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"

export default function CertificateListPage() {
  const [certificates, setCertificates] = useState<ICertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ICertificateFilterValues>({
    search: "",
    sort: "latest",
    status: "all",
  })

  const fetchCertificates = useCallback(async () => {
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
    setLoading(false)
  }, [filters])

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <WithTooltip content="View and manage all certificates you’ve earned.">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight cursor-help">
            🎓 Your Certificates
          </h2>
        </WithTooltip>

        <CertificateFilters onChange={setFilters} />

        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <WithTooltip content="Fetching certificates, please wait.">
              <Loader2 className="animate-spin h-8 w-8 text-primary cursor-help" />
            </WithTooltip>
          </div>
        ) : certificates.length === 0 ? (
          <WithTooltip content="Try adjusting filters or check back later.">
            <p className="text-center mt-16 text-lg text-gray-500 cursor-help">
              No certificates found.
            </p>
          </WithTooltip>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {certificates.map((cert) => (
              <CertificateCard key={cert.certificateId} certificate={cert} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

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
    console.log("data", data)
  } catch (error) {
    console.error("Failed to fetch certificates", error)
  } finally {
    setLoading(false)
  }
}


  useEffect(() => {
    fetchCertificates()
  }, [filters])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Certificates</h2>
      <CertificateFilters onChange={setFilters} />

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <Loader2 className="animate-spin h-6 w-6" />
        </div>
      ) : certificates.length === 0 ? (
        <p className="text-muted-foreground text-center mt-10">No certificates found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id?.toString()} certificate={cert} />
          ))}
        </div>
      )}
    </div>
  )
}

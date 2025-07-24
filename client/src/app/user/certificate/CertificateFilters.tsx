"use client"

import { useState, useEffect } from "react"
import { Input } from "@/src/components/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shared/components/ui/select"
import useDebounce from "@/src/hooks/useDebouncing"

export interface CertificateFilterValues {
  search: string
  sort: "latest" | "oldest"
  status: "all" | "revoked" | "valid"
}

interface FiltersProps {
  onChange: (filters: CertificateFilterValues) => void
}

export default function CertificateFilters({ onChange }: FiltersProps) {
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<"latest" | "oldest">("latest")
  const [status, setStatus] = useState<"all" | "revoked" | "valid">("all")
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    onChange({ search: debouncedSearch, sort, status })
  }, [debouncedSearch, sort, status, onChange])

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
      <Input
        placeholder=" Search by course title or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full sm:w-1/3 rounded-lg border border-gray-300 shadow-sm"
      />

      <Select value={sort} onValueChange={(v) => setSort(v as any)}>
        <SelectTrigger className="w-full sm:w-40 rounded-lg border border-gray-300 shadow-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">📅 Latest</SelectItem>
          <SelectItem value="oldest">📂 Oldest</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(v) => setStatus(v as any)}>
        <SelectTrigger className="w-full sm:w-40 rounded-lg border border-gray-300 shadow-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="valid">Valid</SelectItem>
          <SelectItem value="revoked"> Revoked</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

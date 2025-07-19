"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/shared/components/ui/tabs"

import { TransactionChart } from "./transaction-chart"
import { AdminAPIMethods } from "@/src/services/APImethods"
import { showErrorToast } from "@/src/utils/Toast"
import type { IDonation } from "@/src/types/donationTyps"
import { TransactionStats } from "./transaction-stats"
import { TransactionFilters } from "./transaction-filters"
import { TransactionTable } from "./transaction-table"
import { FilterOptions } from "@/src/types/adminTypes"


export default function TransactionDashboard() {
  const [transactions, setTransactions] = useState<IDonation[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { from: null, to: null },
    amountRange: { min: null, max: null },
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  })

  useEffect(() => {
    fetchTransactions()
  }, [filters])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (filters.dateRange.from) {
        params.append("fromDate", filters.dateRange.from.toISOString())
      }
      if (filters.dateRange.to) {
        params.append("toDate", filters.dateRange.to.toISOString())
      }
      
      if (filters.status !== "all") {
        params.append("status", filters.status)
      }
      params.append("sortBy", filters.sortBy)
      params.append("sortOrder", filters.sortOrder)
      params.append("page", filters.page.toString())
      params.append("limit", filters.limit.toString())

      const res = await AdminAPIMethods.getFilteredDonations(params.toString())

      if (res.ok) {
        setTransactions(res.data.transactions || res.data)
        setTotalCount(res.data.totalCount || res.data.length)
      } else {
        showErrorToast(res.msg || "Failed to fetch transactions")
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      showErrorToast("Error fetching transactions")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, 
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transaction Management</h2>
        <p className="text-muted-foreground">
          Comprehensive view of all donations with advanced filtering and analytics
        </p>
      </div>

      {/* Stats Overview */}
      <TransactionStats transactions={transactions} loading={loading} />

      {/* Main Content */}
      <Tabs defaultValue="table" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="table">Transaction Table</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-6">
          {/* Filters */}
          <TransactionFilters filters={filters} onFilterChange={handleFilterChange} loading={loading} />

          {/* Transaction Table */}
          <TransactionTable
            transactions={transactions}
            loading={loading}
            totalCount={totalCount}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Filters */}
          <TransactionFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={loading}
            analyticsMode={true}
          />

          {/* Charts */}
          <TransactionChart transactions={transactions} loading={loading} filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

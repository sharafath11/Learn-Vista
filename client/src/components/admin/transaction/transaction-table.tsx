"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/shared/components/ui/table"
import { Button } from "@/src/components/shared/components/ui/button"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/shared/components/ui/select"
import { ChevronLeft, ChevronRight, Download, } from "lucide-react"
import { Skeleton } from "@/src/components/shared/components/ui/skeleton"
import type { IDonation } from "@/src/types/donationTyps"
import { FilterOptions } from "@/src/types/adminTypes"

interface TransactionTableProps {
  transactions: IDonation[]
  loading: boolean
  totalCount: number
  filters: FilterOptions
  onFilterChange: (filters: Partial<FilterOptions>) => void
}

export function TransactionTable({
  transactions,
  loading,
  totalCount,
  filters,
  onFilterChange,
}: TransactionTableProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: { variant: "default" as const, label: "Success" },
      pending: { variant: "secondary" as const, label: "Pending" },
      failed: { variant: "destructive" as const, label: "Failed" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.succeeded
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const totalPages = Math.ceil(totalCount / filters.limit)
  const startIndex = (filters.page - 1) * filters.limit + 1
  const endIndex = Math.min(filters.page * filters.limit, totalCount)

  const handlePageChange = (page: number) => {
    onFilterChange({ page })
  }

  const handleLimitChange = (limit: string) => {
    onFilterChange({ limit: Number(limit), page: 1 })
  }

  const exportTransactions = () => {
    
    const csvContent = [
      ["Donor Name", "Email", "Amount", "Date", "Status", "Transaction ID"],
      ...transactions.map((t) => [
        t.donorName || "Anonymous",
        t.donorEmail || "",
        t.amount?.toString() || "0",
        formatDate(t.date || ""),
        t.status || "completed",
        t.donorId || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Transactions ({totalCount})</CardTitle>
          <Button onClick={exportTransactions} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={`${transaction.id}-${transaction.donorId}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.donorName || "Anonymous"}</div>
                          <div className="text-sm text-muted-foreground">{transaction.donorEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(transaction.amount || 0)}</TableCell>
                      <TableCell>{formatDate(transaction.date || "")}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status || "succeeded")}</TableCell>
                      
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalCount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex} to {endIndex} of {totalCount} results
                </p>
                <Select value={filters.limit.toString()} onValueChange={handleLimitChange}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">per page</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={filters.page === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  })}
                  {totalPages > 5 && <span className="text-muted-foreground">...</span>}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page >= totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

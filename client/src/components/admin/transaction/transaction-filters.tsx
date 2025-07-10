"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Filter, X, RotateCcw } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/src/utils/cn"
import { FilterOptions } from "@/src/types/adminTypes"

interface TransactionFiltersProps {
  filters: FilterOptions
  onFilterChange: (filters: Partial<FilterOptions>) => void
  loading: boolean
  analyticsMode?: boolean
}

export function TransactionFilters({
  filters,
  onFilterChange,
  loading,
  analyticsMode = false,
}: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const dateRanges = [
    { label: "Today", days: 0 },
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
    { label: "This Year", days: 365 },
  ]

  const handleDateRangeSelect = (days: number) => {
    const to = new Date()
    const from = new Date()

    if (days === 0) {
      from.setHours(0, 0, 0, 0)
      to.setHours(23, 59, 59, 999)
    } else {
      from.setDate(from.getDate() - days)
    }

    onFilterChange({
      dateRange: { from, to },
    })
  }

  const clearFilters = () => {
    onFilterChange({
      dateRange: { from: null, to: null },
      status: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
    })
  }

  const hasActiveFilters =
    filters.dateRange.from || filters.dateRange.to || filters.status !== "all"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {analyticsMode ? "Analytics Filters" : "Transaction Filters"}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters} disabled={loading}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Date Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Quick Date Ranges</Label>
          <div className="flex flex-wrap gap-2">
            {dateRanges.map((range) => (
              <Button
                key={range.label}
                variant="outline"
                size="sm"
                onClick={() => handleDateRangeSelect(range.days)}
                disabled={loading}
                className="h-8"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Custom Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange.from && "text-muted-foreground",
                      )}
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from || undefined}
                      onSelect={(date) =>
                        onFilterChange({
                          dateRange: { ...filters.dateRange, from: date || null },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateRange.to && "text-muted-foreground",
                      )}
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to || undefined}
                      onSelect={(date) =>
                        onFilterChange({
                          dateRange: { ...filters.dateRange, to: date || null },
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Status and Sort */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => onFilterChange({ status: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="succeeded">Succeeded</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => onFilterChange({ sortBy: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                    <SelectItem value="donorName">Donor Name</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Order</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: "asc" | "desc") => onFilterChange({ sortOrder: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.dateRange.from && (
                <Badge variant="secondary" className="gap-1">
                  From: {format(filters.dateRange.from, "MMM dd, yyyy")}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      onFilterChange({
                        dateRange: { ...filters.dateRange, from: null },
                      })
                    }
                  />
                </Badge>
              )}
              {filters.dateRange.to && (
                <Badge variant="secondary" className="gap-1">
                  To: {format(filters.dateRange.to, "MMM dd, yyyy")}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      onFilterChange({
                        dateRange: { ...filters.dateRange, to: null },
                      })
                    }
                  />
                </Badge>
              )}
              {filters.status !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => onFilterChange({ status: "all" })} />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

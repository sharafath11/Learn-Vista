"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { IndianRupee, TrendingUp, Target, Calendar } from "lucide-react"
import { Skeleton } from "@/src/components/shared/components/ui/skeleton"
import type { IDonation } from "@/src/types/donationTyps"

interface TransactionStatsProps {
  transactions: IDonation[]
  loading: boolean
}

export function TransactionStats({ transactions, loading }: TransactionStatsProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
  const totalTransactions = transactions.length
  const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0

  // Today's stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.createdAt || "")
    return transactionDate >= today
  })
  const todayAmount = todayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)

  // This month's stats
  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)
  const monthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.createdAt || "")
    return transactionDate >= thisMonth
  })
  const monthAmount = monthTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)

  const stats = [
    {
      title: "Total Amount",
      value: formatCurrency(totalAmount),
      description: `From ${totalTransactions} transactions`,
      icon: IndianRupee,
      color: "text-green-600",
    },
    {
      title: "Today's Donations",
      value: `${todayTransactions.length}`,
      description: formatCurrency(todayAmount),
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "This Month",
      value: formatCurrency(monthAmount),
      description: `${monthTransactions.length} transactions`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Average Amount",
      value: formatCurrency(averageAmount),
      description: "Per transaction",
      icon: Target,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

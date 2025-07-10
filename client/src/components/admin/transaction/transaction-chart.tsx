"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import type { IDonation } from "@/src/types/donationTyps"
import { FilterOptions } from "@/src/types/adminTypes"


interface TransactionChartProps {
  transactions: IDonation[]
  loading: boolean
  filters: FilterOptions
}

export function TransactionChart({ transactions, loading, filters }: TransactionChartProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Prepare data for charts
  const dailyData = transactions.reduce(
    (acc, transaction) => {
      const date = new Date(transaction.createdAt || "").toLocaleDateString("en-IN")
      if (!acc[date]) {
        acc[date] = { date, amount: 0, count: 0 }
      }
      acc[date].amount += transaction.amount || 0
      acc[date].count += 1
      return acc
    },
    {} as Record<string, { date: string; amount: number; count: number }>,
  )

  const chartData = Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Amount range distribution
  const amountRanges = [
    { name: "Under ₹500", min: 0, max: 500, count: 0, color: "#8884d8" },
    { name: "₹500-₹1K", min: 500, max: 1000, count: 0, color: "#82ca9d" },
    { name: "₹1K-₹5K", min: 1000, max: 5000, count: 0, color: "#ffc658" },
    { name: "₹5K-₹10K", min: 5000, max: 10000, count: 0, color: "#ff7300" },
    { name: "Above ₹10K", min: 10000, max: Number.POSITIVE_INFINITY, count: 0, color: "#8dd1e1" },
  ]

  transactions.forEach((transaction) => {
    const amount = transaction.amount || 0
    const range = amountRanges.find((r) => amount >= r.min && amount < r.max)
    if (range) range.count++
  })

  const pieData = amountRanges.filter((range) => range.count > 0)

  // Status distribution
  const statusData = transactions.reduce(
    (acc, transaction) => {
      const status = transaction.status || "succeeded"
      if (!acc[status]) {
        acc[status] = { status, count: 0, amount: 0 }
      }
      acc[status].count += 1
      acc[status].amount += transaction.amount || 0
      return acc
    },
    {} as Record<string, { status: string; count: number; amount: number }>,
  )

  const statusChartData = Object.values(statusData)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily Trends</TabsTrigger>
          <TabsTrigger value="distribution">Amount Distribution</TabsTrigger>
          <TabsTrigger value="status">Status Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `₹${value}`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Amount"]} />
                    <Bar dataKey="amount" fill="#059669" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Transaction Count</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Amount Range Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, count, percent }) => `${name}: ${count} (${(percent||0 * 100).toFixed(0)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

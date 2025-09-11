"use client"

import { useEffect, useState } from "react"
import type { IDonation } from "@/src/types/donationTyps"
import { showErrorToast } from "@/src/utils/Toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/shared/components/ui/tabs"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { IndianRupee, Users, Clock, TrendingUp } from "lucide-react"
import TransactionDashboard from "@/src/components/admin/transaction/TransactionDashboard"
import { AdminAPIMethods } from "@/src/services/methods/admin.api"

export default function AdminDashboard() {
  const [donations, setDonations] = useState<IDonation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonation()
  }, [])

  const fetchDonation = async () => {
    setLoading(true)
    const res = await AdminAPIMethods.getDonation()
    if (res.ok) {
      setDonations(res.data)
    } else {
      showErrorToast(res.msg)
    }
    setLoading(false)
  }

  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0)
  const totalTransactions = donations.length

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayDonations = donations.filter((d) => {
    const donationDate = new Date(d.date || "")
    return donationDate >= today
  })
  const todayAmount = todayDonations.reduce((sum, d) => sum + (d.amount || 0), 0)
  const todayCount = todayDonations.length

  const latestDonation = donations.length
    ? [...donations].sort((a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime())[0]
    : null

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

  if (loading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading dashboard...</p>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive overview of donations and transaction management</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                  <IndianRupee className="h-4 w-4" />
                  Total Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
                <p className="text-xs text-muted-foreground">From all donations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Today&apos;s Donations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayCount} donations</div>
                <p className="text-xs text-muted-foreground">Total: {formatCurrency(todayAmount)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground">All donations</p>
              </CardContent>
            </Card>
          </div>

          {/* Latest Transaction */}
          {latestDonation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Latest Transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                  <p className="font-medium">{latestDonation.donorName || latestDonation.donorEmail || "Anonymous"}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(latestDonation.date || "")}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(latestDonation.amount || 0)}</p>
                  <Badge variant={latestDonation.status === "succeeded" ? "default" : "secondary"}>
                    {latestDonation.status || "Completed"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionDashboard />
        </TabsContent>
      </Tabs>
    </div>
  )
}

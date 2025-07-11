"use client"

import { useEffect, useState } from "react"
import { AdminAPIMethods } from "@/src/services/APImethods"
import type { IDonation } from "@/src/types/donationTyps"
import { showErrorToast } from "@/src/utils/Toast"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { IndianRupee, Users, Clock, TrendingUp } from "lucide-react"

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
    const donationDate = new Date(d.createdAt || "")
    return donationDate >= today
  })

  const todayAmount = todayDonations.reduce((sum, d) => sum + (d.amount || 0), 0)
  const todayCount = todayDonations.length

  const latestDonation = donations.length
    ? [...donations].sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())[0]
    : null

  const recentDonations = [...donations]
    .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
    .slice(0, 10)

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
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Track donations and user stats</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{formatCurrency(totalAmount)}</div>
            <p className="text-xs text-muted-foreground">From all donations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              Today’s Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{todayCount} donations</div>
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
            <div className="text-xl font-semibold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All donations</p>
          </CardContent>
        </Card>
      </div>

      {/* Latest transaction */}
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
              <p className="text-xs text-muted-foreground">{formatDate(latestDonation.createdAt || "")}</p>
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

      {/* Recent Donations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
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
              {recentDonations.length > 0 ? (
                recentDonations.map((d, i) => (
                  <TableRow key={d.donorId || i}>
                    <TableCell>{d.donorName || d.donorEmail || "Anonymous"}</TableCell>
                    <TableCell>{formatCurrency(d.amount || 0)}</TableCell>
                    <TableCell>{formatDate(d.createdAt || "")}</TableCell>
                    <TableCell>
                      <Badge variant={d.status === "succeeded" ? "default" : "secondary"}>
                        {d.status || "Completed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    No donations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

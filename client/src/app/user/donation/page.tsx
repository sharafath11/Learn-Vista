"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Loader2 } from "lucide-react"
import DonationComponent from "@/src/components/user/donation/Donation"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/shared/components/ui/table"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { Dialog, DialogContent } from "@/src/components/shared/components/ui/dialog"
import { UserAPIMethods } from "@/src/services/APImethods"
import { useUserContext } from "@/src/context/userAuthContext"
import { IDonation } from "@/src/types/donationTyps"
import SuccessView from "../success/SuccessView"

export default function DonationHistoryPage() {
  const { user } = useUserContext()
  const [donations, setDonations] = useState<IDonation[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [totalDonationsAmount, setTotalDonationsAmount] = useState(0)
  const [selectedDonation, setSelectedDonation] = useState<IDonation | null>(null)
  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchDonations = useCallback(
    async (currentPage: number) => {
      if (!user || loading || !hasMore) return
      setLoading(true)
      const res = await UserAPIMethods.getMyDonations(currentPage)
      setDonations((prev) => {
        const newDonations = res.data.data.filter(
          (d: IDonation) => !prev.find((p) => p.id === d.id)
        )
        const updated = [...prev, ...newDonations]
        setTotalDonationsAmount(updated.reduce((sum, d) => sum + d.amount, 0))
        return updated
      })
      setHasMore(res.data.hasMore)
      setPage(currentPage + 1)
      setLoading(false)
    },
    [user, loading, hasMore]
  )

  useEffect(() => {
    if (user) fetchDonations(1)
  }, [user, fetchDonations])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchDonations(page)
        }
      },
      { threshold: 1 }
    )

    const target = observerTarget.current
    if (target) observer.observe(target)
    return () => {
      if (target) observer.unobserve(target)
    }
  }, [hasMore, loading, page, fetchDonations])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-4">Your Donation History 💖</h1>
        <p className="text-gray-600 text-lg md:text-xl mb-6">Thank you for your generosity! Here's a record of your past contributions.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="text-2xl font-semibold text-gray-800">
            Total Donations: <span className="text-purple-600">₹{totalDonationsAmount.toFixed(2)}</span>
          </div>
          <DonationComponent />
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {!loading && donations.length === 0 && (
          <div className="text-center text-gray-500 text-xl py-10">No donations found.</div>
        )}

        {donations.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden lg:table-cell">Message</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.paymentIntentId}>
                  <TableCell className="font-medium">{donation.donorName || "Anonymous"}</TableCell>
                  <TableCell>{donation.amount} {donation.currency}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className={
                        donation.status === "succeeded"
                          ? "bg-green-100 text-green-700"
                          : donation.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : donation.status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {donation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-gray-600">
                    {donation.message || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setSelectedDonation(donation)}
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div ref={observerTarget} className="py-4 text-center">
          {loading && (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading more donations...
            </div>
          )}
          {!hasMore && donations.length > 0 && (
            <p className="text-gray-500">You've reached the end of your donation history.</p>
          )}
        </div>
      </div>

      <footer className="mt-16 text-center text-sm text-gray-400">
        💡 For any discrepancies or questions, please contact support.
      </footer>

      {/* SuccessView modal */}
      {selectedDonation && (
        <Dialog open={!!selectedDonation} onOpenChange={() => setSelectedDonation(null)}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden">
            <SuccessView session={selectedDonation} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

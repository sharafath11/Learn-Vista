"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Download, Loader2 } from "lucide-react"
import DonationComponent from "@/src/components/user/donation/Donation"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/shared/components/ui/table"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { UserAPIMethods } from "@/src/services/methods/user.api"
import { useUserContext } from "@/src/context/userAuthContext"
import { IDonation } from "@/src/types/donationTyps"
import { generateReceiptPDF } from "@/src/utils/receiptGenerator"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"

export default function DonationHistoryPage() {
  const { user } = useUserContext()
  const [donations, setDonations] = useState<IDonation[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [downloadingPDFId, setDownloadingPDFId] = useState<string | null>(null)
  const [totalDonationsAmount, setTotalDonationsAmount] = useState(0)
  const observerTarget = useRef<HTMLDivElement>(null)

  const fetchDonations = useCallback(async (currentPage: number) => {
    if (!user || loading || !hasMore) return
    setLoading(true)

    try {
      const res = await UserAPIMethods.getMyDonations(currentPage)

      if (!res || !res.data) {
        console.error(" Donations API returned no data:", res)
        setHasMore(false)
        return
      }

      console.log(" Donations fetched (page " + currentPage + "):", res.data)

      setDonations(prev => {
        const newDonations = res.data.data.filter(
          (d: IDonation) => !prev.find((p) => p.id === d.id)
        )
        const updated = [...prev, ...newDonations]
        setTotalDonationsAmount(updated.reduce((sum, d) => sum + d.amount, 0))
        return updated
      })

      setHasMore(res.data.hasMore ?? false)
      setPage(currentPage + 1)
    } catch (err) {
      console.error(" Error fetching donations:", err)
    } finally {
      setLoading(false)
    }
  }, [user, loading, hasMore])

  useEffect(() => {
    if (user) fetchDonations(1)
  }, [user, fetchDonations])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchDonations(page)
      }
    }, { threshold: 1 })

    const target = observerTarget.current
    if (target) observer.observe(target)
    return () => {
      if (target) observer.unobserve(target)
    }
  }, [hasMore, loading, page, fetchDonations])

  const handleDownloadCustomReceipt = async (donation: IDonation) => {
    if (!user) return
    setDownloadingPDFId(donation.paymentIntentId)

    try {
      const receiptData = {
        organizationName: "Learn Vista Foundation",
        organizationAddress: "Calicut, Kerala, India 673019",
        organizationEmail: "donations@learnvista.org",
        organizationPhone: "+91 6282560928",
        taxId: "TAX-ID-123456789",
        transactionId: donation.paymentIntentId,
        receiptNumber: `LV-${Date.now()}`,
        donationDate: new Date(donation.createdAt).toLocaleDateString(),
        donationTime: new Date(donation.createdAt).toLocaleTimeString(),
        donorName: donation.donorName || "Anonymous Donor",
        donorEmail: donation.donorEmail || user.email,
        amount: donation.amount,
        currency: donation.currency || "INR",
        paymentMethod: "Credit/Debit Card",
        purpose: "Educational Support & Development",
        isRecurring: false,
        notes: "Thank you for supporting education and making a difference in students' lives."
      }

      console.log(" Generating PDF receipt with data:", receiptData)

      const pdfResult = await generateReceiptPDF(receiptData)

      console.log(" PDF generated successfully:", pdfResult)
    } catch (error) {
      console.error(" Error generating PDF receipt:", error)
    } finally {
      setDownloadingPDFId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <WithTooltip content="This section displays your full donation history and total contributions">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-4">
            Your Donation History 💖
          </h1>
        </WithTooltip>
        <p className="text-gray-600 text-lg md:text-xl mb-6">
          {"Thank you for your generosity! Here's a record of your past contributions."}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
          <WithTooltip content={`Total donations made by you: ₹${totalDonationsAmount.toFixed(2)}`}>
            <div className="text-2xl font-semibold text-gray-800">
              Total Donations: <span className="text-purple-600">₹{totalDonationsAmount.toFixed(2)}</span>
            </div>
          </WithTooltip>
          <DonationComponent />
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
        {!loading && donations.length === 0 && (
          <div className="text-center text-gray-500 text-xl py-10">No donations found.</div>
        )}

        {donations.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right w-[120px]">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.paymentIntentId} className="align-middle">
                  <TableCell>
                    <WithTooltip content={donation.donorName ? `Donor: ${donation.donorName}` : "Anonymous Donor"}>
                      <span className="font-medium">{donation.donorName || "Anonymous"}</span>
                    </WithTooltip>
                  </TableCell>
                  <TableCell>
                    <WithTooltip content={`Amount donated: ₹${donation.amount}`}>
                      <span>{donation.amount} INR</span>
                    </WithTooltip>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <WithTooltip content={`Donation date: ${new Date(donation.createdAt).toLocaleDateString()}`}>
                      <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                    </WithTooltip>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <WithTooltip content={
                      donation.status === "succeeded"
                        ? "Your donation was successful"
                        : donation.status === "failed"
                        ? "Your donation failed"
                        : donation.status === "processing"
                        ? "Your donation is being processed"
                        : "Unknown status"
                    }>
                      <Badge
                        variant="outline"
                        className={`capitalize px-2 py-1 rounded-md`}
                      >
                        {donation.status}
                      </Badge>
                    </WithTooltip>
                  </TableCell>
                  <TableCell className="text-right">
                    <WithTooltip content="Download PDF receipt for this donation">
                      <button 
                        onClick={() => handleDownloadCustomReceipt(donation)}
                        className={`inline-flex items-center gap-1 text-purple-600 hover:underline text-sm ${
                          downloadingPDFId === donation.paymentIntentId ? "cursor-not-allowed opacity-70" : ""
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {downloadingPDFId === donation.paymentIntentId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          Receipt
                        </span>
                      </button>
                    </WithTooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <div ref={observerTarget} className="py-6 text-center">
          {loading && (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading more donations...
            </div>
          )}
          {!hasMore && donations.length > 0 && (
            <p className="text-gray-500">{"You've reached the end of your donation history."}</p>
          )}
        </div>
      </div>

      <footer className="mt-16 text-center text-sm text-gray-400">
        💡 For any discrepancies or questions, please contact support.
      </footer>
    </div>
  )
}
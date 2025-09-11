"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { CheckCircle2, Heart, Mail, ArrowLeft, Download, Loader2 } from "lucide-react"
import { useUserContext } from "@/src/context/userAuthContext"
import { Button } from "@/src/components/shared/components/ui/button"
import { generateReceiptPDF } from "@/src/utils/receiptGenerator"
import { SuccessProps } from "@/src/types/userProps"



export default function SuccessView({ session }: SuccessProps) {
  const router = useRouter()
  const { user } = useUserContext()
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  const handleBack = () => {
    const url = localStorage.getItem("url")
    if (url) router.push(url)
    else router.push("/user")
    localStorage.removeItem("url")
  }

  const handleDownloadCustomReceipt = async () => {
    setDownloadingPDF(true)
    try {
      const receiptData = {
        organizationName: "Learn Vista Foundation",
        organizationAddress: "Calicut, Kerala, India 673019",
        organizationEmail: "donations@learnvista.org",
        organizationPhone: "+91 6282560928",
        taxId: "TAX-ID-123456789",
        transactionId: session.paymentIntentId,
        receiptNumber: `LV-${Date.now()}`,
        donationDate: new Date().toLocaleDateString(),
        donationTime: new Date().toLocaleTimeString(),
        donorName: user?.username || "Anonymous Donor",
        donorEmail: session.donorEmail,
        amount: session.amount,
        currency: "INR",
        paymentMethod: "Credit/Debit Card",
        purpose: "Educational Support & Development",
        isRecurring: false,
        notes: "Thank you for supporting education and making a difference in students' lives."
      }

      await generateReceiptPDF(receiptData)
    } catch (error) {
     console.warn(error)
    } finally {
      setDownloadingPDF(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12"></div>

            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Heart className="h-6 w-6 text-red-400 animate-pulse" fill="currentColor" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Thank You!</h1>
            <p className="text-green-100 text-lg font-medium">Your donation was successful</p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">Your Generosity Makes a Difference</h2>
              <p className="text-gray-600 leading-relaxed">
                Thanks to your kindness and support, we can continue our mission to make a positive impact. Every
                contribution matters, and yours is truly appreciated.
              </p>
            </div>

            {/* Amount Display */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 text-center">
              <p className="text-sm text-gray-500 mb-1">Donation Amount</p>
              <p className="text-4xl font-bold text-gray-800">₹{(session.amount).toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-2">Transaction ID: {session.paymentIntentId}</p>
            </div>

            {/* Email Confirmation */}
            <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-blue-50 rounded-xl">
              <div className="flex-shrink-0">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Confirmation sent to</p>
                <p className="font-semibold text-gray-800 break-all">{session.donorEmail}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Custom Receipt */}
              <Button
                onClick={handleDownloadCustomReceipt}
                disabled={downloadingPDF}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                {downloadingPDF ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Download Receipt
                  </>
                )}
              </Button>

              {/* Continue Button */}
              <button
                onClick={handleBack}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue to Learning
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 text-center border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">{`🌟 You're making the world a better place`}</p>
            <p className="text-xs text-gray-400">
              Keep an eye on your email for updates on how your donation is being used
            </p>
          </div>
        </div>

        {/* Support Contact */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Questions about your donation?{" "}
            <a href="mailto:support@learnvista.org" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

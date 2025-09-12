"use client"
import DonationComponent from "@/src/components/user/donation/Donation"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"
import { XCircle } from "lucide-react"

export default function DonationFailedContent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-4 py-12 text-center">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200 max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <WithTooltip content="Your payment could not be processed. Please try again.">
            <XCircle className="w-12 h-12 text-red-500 cursor-help" />
          </WithTooltip>

          <h1 className="text-2xl font-semibold text-red-600">Payment Failed</h1>
          <p className="text-gray-600 text-sm">
            Oops! Something went wrong with your donation. No amount has been charged.
          </p>
        </div>

        <div className="mt-6">
          <WithTooltip content="Retry your donation securely.">
            <DonationComponent />
          </WithTooltip>
        </div>
      </div>

      <div className="mt-10 text-gray-500 text-sm">
        If you continue to face issues, please{" "}
        <WithTooltip content="This will open your default email app to contact our support team.">
          <a
            href="mailto:support@example.com"
            className="text-blue-600 hover:underline font-medium cursor-help"
          >
            contact support
          </a>
        </WithTooltip>
        .
      </div>
    </div>
  )
}

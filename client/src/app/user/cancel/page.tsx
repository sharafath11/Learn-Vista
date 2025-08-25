import { Suspense } from "react"
import DonationFailedContent from "./DonationFailedContent"

export default function DonationFailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonationFailedContent />
    </Suspense>
  )
}

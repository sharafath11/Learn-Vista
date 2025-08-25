import { Suspense } from "react"
import DonationHistoryPage from "./DonationHistoryPage"
export default function DonationPage() {
  return (
    <Suspense fallback={<div>Loading donation history...</div>}>
          <DonationHistoryPage />
    </Suspense>
  )
}

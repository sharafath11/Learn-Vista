import { Suspense } from "react"
import SuccessContent from "./SuccessContent"

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading donation details...</div>}>
      <SuccessContent />
    </Suspense>
  )
}

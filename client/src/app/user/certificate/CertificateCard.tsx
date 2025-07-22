import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { ICertificate } from "@/src/types/certificateTypes"

export default function CertificateCard({ certificate }: { certificate: ICertificate }) {
  return (
    <Link href={`/user/certificate/${certificate.certificateId}`} className="group">
      <Card className="h-full transform cursor-pointer overflow-hidden rounded-xl border-2 border-transparent bg-white shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:border-accent-dark hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary-light to-primary-dark p-6 text-white">
          <CardTitle className="text-2xl font-bold group-hover:underline">{certificate.courseTitle}</CardTitle>
          <CardDescription className="mt-1 text-primary-light-text">Issued to {certificate.userName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-6">
          <p className="text-base text-gray-600">
            ID: <span className="font-semibold text-gray-800">{certificate.certificateId}</span>
          </p>
          <p className="text-base text-gray-600">
            Issued: <span className="font-semibold text-gray-800">{certificate.issuedDateFormatted}</span>
          </p>
          {certificate.isRevoked && (
            <Badge variant="destructive" className="mt-3 px-4 py-1 text-base font-semibold shadow-sm">Revoked</Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

import Link from "next/link"


import { CalendarIcon, GraduationCapIcon, AwardIcon} from "lucide-react"
import { ICertificate } from "@/src/types/certificateTypes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Badge } from "@/src/components/shared/components/ui/badge"


export default function CertificateCard({ certificate }: { certificate: ICertificate }) {
  return (
    <Link href={`/user/certificate/${certificate.certificateId}`} className="group">
      <Card className="h-full transform cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-2xl">
        <CardHeader className="relative flex flex-col items-start justify-center overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.2' fillRule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative z-10 flex items-center gap-3">
            <AwardIcon className="h-8 w-8 text-white" />
            <CardTitle className="text-2xl font-bold tracking-tight group-hover:underline sm:text-3xl truncate">
              {certificate.courseTitle}
            </CardTitle>
          </div>
          <CardDescription className="relative z-10 mt-2 text-base font-medium text-white/90 opacity-90">
            <GraduationCapIcon className="inline-block h-4 w-4 mr-1 -mt-0.5" />
            Issued to {certificate.userName}
          </CardDescription>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="p-6 space-y-4 text-gray-800">
          <div className="flex items-center justify-between">
            <p className="text-base">
              <span className="font-medium text-gray-500">ID:</span>{" "}
              <span className="font-semibold text-gray-900">{certificate.certificateId}</span>
            </p>
            {certificate.isRevoked && (
              <Badge variant="destructive" className="px-3 py-1 text-sm font-semibold shadow-sm">
                Revoked
              </Badge>
            )}
          </div>
          <p className="flex items-center text-base">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span className="font-medium text-gray-500">Issued:</span>{" "}
            <span className="font-semibold text-gray-900">{certificate.issuedDateFormatted}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

"use client"

import { useState } from "react"
import { ICertificate } from "@/src/types/certificateTypes"
import { IUser } from "@/src/types/userTypes"
import {
  FiCalendar,
  FiMail,
  FiUser,
  FiShield,
  FiAward,
  FiAlertTriangle,
} from "react-icons/fi"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shared/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/shared/components/ui/card"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { Separator } from "@/src/components/shared/components/ui/separator"
import { Button } from "@/src/components/shared/components/ui/button"
import Link from "next/link"
import { CustomAlertDialog } from "../../custom-alert-dialog"
import { AdminAPIMethods } from "@/src/services/methods/admin.api"

interface UserDetailsModalProps {
  user: IUser | null
  certificates: ICertificate[]
  isOpen: boolean
  onClose: () => void
}

export const UserDetailsModal = ({
  user,
  certificates,
  isOpen,
  onClose,
}: UserDetailsModalProps) => {
  const [revokingCertId, setRevokingCertId] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedCert, setSelectedCert] = useState<ICertificate | null>(null);
  
  if (!user) return null

  const handleRevokeCertificate = async () => {
    if (!selectedCert) return
    setRevokingCertId(selectedCert.id)
    await AdminAPIMethods.revokedCertificate(selectedCert.id, !selectedCert.isRevoked)
    setRevokingCertId(null)
    setConfirmOpen(false)
    onClose()
  
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <FiUser className="w-5 h-5" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={user.profilePicture ?? ""}
                    alt={user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-500" />
                      <span className="font-medium">Username:</span>
                      <span>{user.username}</span>
                    </div>
                    <br />
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gray-500" />
                      <span className="font-medium">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <br />
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-500" />
                      <span className="font-medium">Joined:</span>
                      <span>{new Date(user.createdAt ?? "").toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <Badge variant={user.isBlocked ? "destructive" : "default"}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Verification:</span>
                      <Badge variant={user.isVerified ? "default" : "secondary"}>
                        {user.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FiAward className="w-5 h-5" />
                Certificates ({certificates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {certificates.length > 0 ? (
                <div className="space-y-4">
                  {certificates.map((c) => (
                    <div
                      key={c.id}
                      className={`rounded-xl p-4 border transition-all ${
                        c.isRevoked ? "bg-red-50 border-red-300" : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-semibold">{c.courseTitle}</h4>
                            <Badge variant={c.isRevoked ? "destructive" : "default"}>
                              {c.isRevoked ? "Revoked" : "Active"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                            <div><span className="font-medium">Certificate ID:</span> {c.certificateId}</div>
                            <div><span className="font-medium">Issued:</span> {c.issuedDateFormatted}</div>
                            <div><span className="font-medium">Course ID:</span> {c.courseId}</div>
                            {c.qrCodeUrl && (
                              <div>
                                <span className="font-medium">QR:</span>{" "}
                                <Link
                                  href={c.qrCodeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View QR Code
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                        {!c.isRevoked && (
                          <div className="flex items-start">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedCert(c)
                                setConfirmOpen(true)
                              }}
                              disabled={revokingCertId === c.id}
                              className="flex items-center gap-2"
                            >
                              <FiAlertTriangle className="w-4 h-4" />
                              {revokingCertId === c.id ? "Revoking..." : "Revoke"}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiAward className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No certificates found for this user</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>

      {/* Custom Confirmation Dialog */}
      <CustomAlertDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleRevokeCertificate}
        title="Revoke Certificate"
        description="Are you sure you want to revoke this certificate? This action cannot be undone."
        confirmText="Yes, Revoke"
        cancelText="Cancel"
        variant="warning"
      />
    </Dialog>
  )
}

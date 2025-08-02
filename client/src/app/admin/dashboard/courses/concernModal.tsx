"use client"

import { useState } from "react"
import { Button } from "@/src/components/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shared/components/ui/dialog"
import {
  AlertCircle,
  CheckCircle,
  ImageIcon,
  Music,
  FileText
} from "lucide-react"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { AdminAPIMethods } from "@/src/services/APImethods"
import { showSuccessToast, showErrorToast, showInfoToast } from "@/src/utils/Toast"
import { IConcern } from "@/src/types/concernTypes"
import { useAdminContext } from "@/src/context/adminContext"

interface ConcernModalProps {
  concern: IConcern | null
  onClose: () => void
  onStatusChange: () => void
}

export function ConcernModal({ concern, onClose, onStatusChange }: ConcernModalProps) {
  const [resolution, setResolution] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { setAllConcerns } = useAdminContext()

  const getAttachmentIcon = (type: string) => {
    const iconClass = "w-4 h-4"
    switch (type) {
      case "image": return <ImageIcon className={`${iconClass} text-blue-400`} />
      case "audio": return <Music className={`${iconClass} text-purple-400`} />
      default: return <FileText className={`${iconClass} text-gray-400`} />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleStatusUpdate = async (status: 'resolved' | 'in-progress') => {
    if (!concern) return
    setIsProcessing(true)

    const messages = {
      resolved: "Concern resolved successfully",
      'in-progress': "Concern marked as in-progress"
    }

    const res = await AdminAPIMethods.updateConcernStatus(
      concern.id,
      status,
      resolution
    )

    setIsProcessing(false)

    if (!res?.ok) {
      console.error("Status update failed:", res.msg)
      return showInfoToast(res.msg)
    }
    setAllConcerns(prev =>
      prev.map(c =>
        c.id === concern.id ? { ...c, status, resolution } : c
      )
    )

    showSuccessToast(messages[status])
    onStatusChange()
    onClose()
  }

  if (!concern) return null


  return (
    <Dialog open={!!concern} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Concern Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Title</h3>
            <p>{concern.title}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Message</h3>
            <p>{concern.message}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Status</h3>
            <Badge variant={concern.status === "resolved" ? "success" : "destructive"}>
              {concern.status.toUpperCase()}
            </Badge>
          </div>

          {concern.attachments && concern.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Attachments</h3>
              <ul className="space-y-2">
                {concern.attachments.map((att, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between bg-muted p-3 rounded-lg hover:bg-muted/80 transition cursor-pointer"
                    onClick={() => {
              
                      if (!att.url || !att.url.startsWith("http")) {
                        showErrorToast("Invalid or missing attachment URL.")
                        return
                      }
                      window.open(att.url, "_blank")
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {getAttachmentIcon(att.type)}
                      <div>
                        <p className="text-sm font-medium">{att.filename}</p>
                        <p className="text-xs text-gray-500">
                          {att.type} • {formatFileSize(att.size)}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary">Open</Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold">Resolution</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
              placeholder="Enter resolution..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button onClick={onClose} disabled={isProcessing}>Cancel</Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate("in-progress")}
              disabled={isProcessing || concern.status === "in-progress"}
            >
              Mark In-Progress
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleStatusUpdate("resolved")}
              disabled={isProcessing || concern.status === "resolved"}
            >
              Resolve Concern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

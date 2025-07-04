"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  ImageIcon,
  Music,
  FileText
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { AdminAPIMethods, MentorAPIMethods } from "@/src/services/APImethods"
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
  const [isProcessing, setIsProcessing] = useState(false);
  const {setAllConcerns}=useAdminContext()

  const getStatusDisplay = (status: string) => {
    const statusConfig: Record<string, { icon: React.ReactNode; colorClasses: string; label: string }> = {
      resolved: {
        icon: <CheckCircle className="w-4 h-4" />,
        colorClasses: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 shadow-emerald-500/10",
        label: "Resolved"
      },
      open: {
        icon: <AlertCircle className="w-4 h-4" />,
        colorClasses: "bg-amber-500/15 text-amber-400 border-amber-500/25 shadow-amber-500/10",
        label: "Open"
      },
      'in-progress': {
        icon: <AlertCircle className="w-4 h-4" />,
        colorClasses: "bg-blue-500/15 text-blue-400 border-blue-500/25 shadow-blue-500/10",
        label: "In Progress"
      }
    }
    return statusConfig[status] || statusConfig.open
  }

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
  if (!concern) return;

  setIsProcessing(true);

  const messages = {
    resolved: "Concern resolved successfully",
    'in-progress': "Concern marked as in-progress",
  };


  const res = await AdminAPIMethods.updateConcernStatus(concern._id?concern._id:concern.id, status, resolution)

    setIsProcessing(false);


  if (!res?.ok) return showInfoToast(res.msg);
    setAllConcerns((prev) =>
    prev.map((c) =>
      c.id === concern.id ? { ...c, status, resolution } : c
    )
  );
  showSuccessToast(messages[status]);
  onStatusChange();
  onClose();
};


  if (!concern) return null

  const statusDisplay = getStatusDisplay(concern.status)

  return (
    <Dialog open={!!concern} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-50 dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Concern Details
            <Badge className={`${statusDisplay.colorClasses} px-3 py-1 text-xs font-semibold`}>
              {statusDisplay.icon}
              {statusDisplay.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{concern.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{concern.message}</p>
          </div>

          {Array.isArray(concern.attachments) && concern.attachments.length > 0 && (
  <div className="space-y-3">
    <Separator />
    <div>
      <h4 className="text-sm font-medium mb-2">
        Attachments ({concern.attachments.length})
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {concern.attachments.map((att, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-md">
                {getAttachmentIcon(att.type)}
              </div>
              <div>
                <p className="text-sm font-medium">{att.filename}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {att.type} • {formatFileSize(att.size)}
                </p>
              </div>
            </div>
            {att.url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(att.url, "_blank")}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
)}


          <div className="space-y-3">
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Resolution</h4>
              <Textarea
                placeholder="Enter resolution details..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleStatusUpdate("in-progress")}
              disabled={isProcessing || concern.status === 'in-progress'}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Mark In-Progress
            </Button>
            <Button 
              onClick={() => handleStatusUpdate("resolved")}
              disabled={isProcessing || concern.status === 'resolved'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Resolve Concern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

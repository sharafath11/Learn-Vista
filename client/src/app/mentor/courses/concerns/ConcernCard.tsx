"use client"

import React, { useState, useEffect } from "react"
import { IConcern } from "@/src/types/concernTypes"
import {
  Card,
  CardContent,
  CardHeader
} from "@/src/components/shared/components/ui/card"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { Button } from "@/src/components/shared/components/ui/button"
import { Separator } from "@/src/components/shared/components/ui/separator"
import { Dialog, DialogContent } from "@/src/components/shared/components/ui/dialog"
import {
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  ImageIcon,
  Music,
  FileText,
  XCircle,
  Play
} from "lucide-react"
import Image from "next/image"

type ConcernStatus = "open" | "in-progress" | "resolved"

interface ConcernCardProps {
  concern: IConcern
  
}

const ConcernCard: React.FC<ConcernCardProps> = ({ concern }) => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [playingFile, setPlayingFile] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
    }
  }, [currentAudio])

  const getStatusDisplay = (status: ConcernStatus) => {
    const statusConfig = {
      resolved: {
        icon: <CheckCircle className="w-4 h-4" />,
        colorClasses:
          "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 shadow-emerald-500/10",
        label: "Resolved"
      },
      open: {
        icon: <Clock className="w-4 h-4" />,
        colorClasses:
          "bg-amber-500/15 text-amber-400 border-amber-500/25 shadow-amber-500/10",
        label: "Open"
      },
      "in-progress": {
        icon: <Eye className="w-4 h-4" />,
        colorClasses:
          "bg-blue-500/15 text-blue-400 border-blue-500/25 shadow-blue-500/10",
        label: "In Progress"
      }
    }
    return statusConfig[status] || statusConfig.open
  }

  const getAttachmentIcon = (type: string) => {
    const iconClass = "w-4 h-4"
    switch (type) {
      case "image":
        return <ImageIcon className={`${iconClass} text-blue-400`} />
      case "audio":
        return <Music className={`${iconClass} text-purple-400`} />
      default:
        return <FileText className={`${iconClass} text-gray-400`} />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch (error) {
      return "Invalid Date"
    }
  }

  const statusDisplay = getStatusDisplay(concern.status)
  return (
    <>
      <Card className="bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={`${statusDisplay.colorClasses} border px-3 py-1.5 text-xs font-semibold shadow-sm`}
                >
                  <div className="flex items-center gap-1.5">
                    {statusDisplay.icon}
                    {statusDisplay.label}
                  </div>
                </Badge>
                <Badge className="bg-gray-700/50 text-gray-300 border-gray-600/50 px-3 py-1.5 text-xs font-semibold">
                  {concern.courseTitle}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(concern.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <div className="space-y-2">
            <h3 className="text-orange-400 font-semibold text-lg">{concern.title}</h3>
            <p className="text-gray-200 leading-relaxed text-base">{concern.message}</p>
          </div>

          {concern.attachments && concern.attachments.length > 0 && (
            <div className="space-y-3">
              <Separator className="bg-gray-700/50" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-400 text-sm font-medium">
                    Attachments ({concern.attachments.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {concern.attachments.map((att, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between bg-gray-700/50 p-4 rounded-xl border border-gray-600/50 hover:border-gray-500/70 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-gray-600/50 rounded-lg group-hover:bg-gray-600/70 transition-colors">
                          {getAttachmentIcon(att.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-gray-200 text-sm font-medium truncate">
                            {att.filename}
                          </p>
                          
                        </div>
                      </div>

                      {att.url ? (
                        <Button
  variant="ghost"
  size="sm"
  className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 p-2 rounded-lg transition-all"
  onClick={() => {
    if (att.type === "audio") {
      if (playingFile === att.url) {
        currentAudio?.pause()
        if (currentAudio) currentAudio.currentTime = 0
        setCurrentAudio(null)
        setPlayingFile(null)
      } else {
        currentAudio?.pause()
        if (currentAudio) currentAudio.currentTime = 0
        const audio = new Audio(att.url)
        audio.play()
        setCurrentAudio(audio)
        setPlayingFile(att.url || "")

        audio.onended = () => {
          setCurrentAudio(null)
          setPlayingFile(null)
        }
      }
    } else if (att.type === "image") {
      setPreviewImage(att.url||"")
    } else {
      window.open(att.url, "_blank")
    }
  }}
>
  {att.type === "audio" && playingFile === att.url ? (
    <XCircle className="w-4 h-4 text-red-400" />
  ) : (
    <Play className="w-4 h-4" />
  )}
</Button>

                      ) : (
                        <div className="text-red-400 text-xs flex items-center gap-1 px-2">
                          <XCircle className="w-3 h-3" />
                          <span className="hidden sm:inline">Unavailable</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {concern.status !== "open" && concern.resolution && (
            <div className="space-y-3">
              <Separator className="bg-gray-700/50" />
              <div className="bg-emerald-900/20 border border-emerald-600/30 p-4 rounded-xl">
                <h4 className="text-emerald-400 font-semibold text-sm mb-1 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Resolution
                </h4>
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                  {concern.resolution}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="bg-gray-900 border border-gray-700 max-w-xl mx-auto">
          {previewImage && (
            <Image
              src={previewImage}
              alt="Preview"
              className="rounded-lg max-h-[80vh] mx-auto"
            />
          )}
          <Button
            className="mt-4 text-sm bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setPreviewImage(null)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ConcernCard

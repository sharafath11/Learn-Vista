"use client"

import { Calendar, Users, BookOpen, Play, Pause, AlertCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/src/utils/cn"

interface SessionTableRowProps {
  session: any
  index: number
  isExpired: boolean
  joiningSession: string | null
  onJoinCall: (courseId: string) => void
  onViewContent: (courseId: string) => void
}

export const SessionTableRow = ({
  session,
  index,
  isExpired,
  joiningSession,
  onJoinCall,
  onViewContent,
}: SessionTableRowProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      )
    }
    if (session.isStreaming) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Live Now
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
        <Pause className="w-3 h-3 mr-1" />
        Scheduled
      </Badge>
    )
  }

  const getActionButton = () => {
    if (isExpired) {
      return (
        <Button
          onClick={() => onViewContent(session._id)}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            View Content
          </div>
        </Button>
      )
    }

    if (session.isStreaming) {
      return (
        <Button
          onClick={() => onJoinCall(session._id)}
          disabled={joiningSession === session._id}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {joiningSession === session._id ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Joining...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Join Now
            </div>
          )}
        </Button>
      )
    }

    return (
      <Button disabled className="bg-gray-100 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
        <div className="flex items-center gap-2">
          <Pause className="w-4 h-4" />
          Not Started
        </div>
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "px-6 py-5 grid grid-cols-12 gap-4 items-center transition-all duration-200 hover:bg-gray-50",
        index % 2 === 0 ? "bg-white" : "bg-gray-50/50",
        isExpired && "opacity-75",
      )}
    >
      <div className="col-span-4 flex flex-col">
        <h3 className={cn("text-lg font-semibold leading-snug mb-1", isExpired ? "text-gray-600" : "text-gray-900")}>
          {session.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{session.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{session.sessions.length} sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{session.categoryId?.title || "General"}</span>
          </div>
        </div>
      </div>
      <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
        <Calendar className="w-4 h-4 text-gray-500" />
        {formatDate(session.startDate)}
      </div>
      <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
        <Calendar className="w-4 h-4 text-gray-500" />
        {formatDate(session.endDate)}
      </div>
      <div className="col-span-2">{getStatusBadge()}</div>
      <div className="col-span-2 text-center">{getActionButton()}</div>
    </div>
  )
}

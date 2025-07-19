"use client"

import { Calendar, Users, BookOpen, Play, Pause, ChevronRight, AlertCircle, CheckCircle } from "lucide-react"
import { Card } from "@/src/components/shared/components/ui/card"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { Button } from "@/src/components/shared/components/ui/button"
import { cn } from "@/src/utils/cn"

interface SessionCardProps {
  session: any
  isExpired: boolean
  joiningSession: string | null
  onJoinCall: (courseId: string) => void
  onViewContent: (courseId: string) => void
}

export const SessionCard = ({ session, isExpired, joiningSession, onJoinCall, onViewContent }: SessionCardProps) => {
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
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            View Course Content
            <ChevronRight className="w-4 h-4" />
          </div>
        </Button>
      )
    }

    if (session.isStreaming) {
      return (
        <Button
          onClick={() => onJoinCall(session._id)}
          disabled={joiningSession === session._id}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {joiningSession === session._id ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Joining Session...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Join Live Session
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      )
    }

    return (
      <Button
        disabled
        className="w-full bg-gray-100 text-gray-500 font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
      >
        <div className="flex items-center justify-center gap-2">
          <Pause className="w-4 h-4" />
          Session Not Started
        </div>
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "p-4 sm:p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1",
        isExpired && "opacity-75 border-l-4 border-l-red-400",
      )}
    >
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-lg sm:text-xl font-bold leading-tight mb-2",
                isExpired ? "text-gray-600" : "text-gray-900",
              )}
            >
              {session.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 line-clamp-2 mb-3">{session.description}</p>
          </div>
          <div className="ml-4 flex-shrink-0">{getStatusBadge()}</div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Start Date</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(session.startDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isExpired ? "bg-red-100" : "bg-green-100",
              )}
            >
              <Calendar className={cn("w-5 h-5", isExpired ? "text-red-600" : "text-green-600")} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">End Date</p>
              <p className={cn("text-sm font-semibold", isExpired ? "text-red-600" : "text-gray-900")}>
                {formatDate(session.endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Sessions</p>
              <p className="text-sm font-semibold text-gray-900">
                {session.sessions.length} session{session.sessions.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Category</p>
              <p className="text-sm font-semibold text-gray-900">{session.categoryId?.title || "General"}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">{getActionButton()}</div>
      </div>
    </Card>
  )
}

"use client"
import { Calendar, Users, BookOpen, Play, Pause, AlertCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { Button } from "@/src/components/shared/components/ui/button"
import { cn } from "@/src/utils/cn"
import { ISessionTableRowProps } from "@/src/types/userProps"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"

export const SessionTableRow = ({
  session,
  index,
  isExpired,
  joiningSession,
  onJoinCall,
  onViewContent,
}: ISessionTableRowProps) => {
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
        <WithTooltip content="This session has ended">
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        </WithTooltip>
      )
    }
    if (session.isStreaming) {
      return (
        <WithTooltip content="This session is live now">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live Now
          </Badge>
        </WithTooltip>
      )
    }
    return (
      <WithTooltip content="Scheduled session">
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
          <Pause className="w-3 h-3 mr-1" />
          Scheduled
        </Badge>
      </WithTooltip>
    )
  }

  const getActionButton = () => {
    if (isExpired) {
      return (
        <WithTooltip content="View course content for this session">
          <Button
            onClick={() => onViewContent(session.id)}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              View Content
            </div>
          </Button>
        </WithTooltip>
      )
    }

    if (session.isStreaming) {
      return (
        <WithTooltip content={joiningSession === session.id ? "Joining session..." : "Join this live session"}>
          <Button
            onClick={() => onJoinCall(session.id)}
            disabled={joiningSession === session.id}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {joiningSession === session.id ? (
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
        </WithTooltip>
      )
    }

    return (
      <WithTooltip content="Session has not started yet">
        <Button disabled className="bg-gray-100 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed">
          <div className="flex items-center gap-2">
            <Pause className="w-4 h-4" />
            Not Started
          </div>
        </Button>
      </WithTooltip>
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
        <WithTooltip content="Session title">
          <h3 className={cn("text-lg font-semibold leading-snug mb-1", isExpired ? "text-gray-600" : "text-gray-900")}>
            {session.title}
          </h3>
        </WithTooltip>

        <WithTooltip content="Session description">
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{session.description}</p>
        </WithTooltip>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <WithTooltip content="Total sessions">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{session.sessions} sessions</span>
            </div>
          </WithTooltip>

          <WithTooltip content="Session category">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{session.categoryId?.title || "General"}</span>
            </div>
          </WithTooltip>
        </div>
      </div>

      <WithTooltip content="Session start date">
        <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-gray-500" />
          {formatDate(session.startDate)}
        </div>
      </WithTooltip>

      <WithTooltip content="Session end date">
        <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-gray-500" />
          {formatDate(session.endDate)}
        </div>
      </WithTooltip>

      <div className="col-span-2">{getStatusBadge()}</div>
      <div className="col-span-2 text-center">{getActionButton()}</div>
    </div>
  )
}

"use client"

import { format, parseISO } from "date-fns"
import { Calendar, Clock, Users, Play, Radio, CheckCircle, Archive } from "lucide-react"
import { Button } from "@/src/components/shared/components/ui/button"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { IPopulatedCourse } from "@/src/types/courseTypes"
import { IMentorSessionTableProps } from "@/src/types/mentorProps"


export const SessionTable = ({ 
  sessions, 
  isEnded = false, 
  handleStartSession, 
  getSessionStatus 
}: IMentorSessionTableProps) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-xl border border-indigo-500/20 overflow-hidden shadow-lg">
      {/* Table Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800 px-6 py-4 border-b border-indigo-500/30">
        <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-indigo-100 uppercase tracking-wider">
          <div className="col-span-3">Session Details</div>
          <div className="col-span-2">Start Date</div>
          <div className="col-span-2">End Date</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-1">Category</div>
          <div className="col-span-2">{isEnded ? "Status" : "Actions"}</div>
        </div>
      </div>

      {/* Table Body */}
      {sessions.length > 0 ? (
        <div className="divide-y divide-indigo-500/20">
          {sessions.map((session) => {
            const status = getSessionStatus(session)
            return (
              <div
                key={session.id}
                className={`px-6 py-5 grid grid-cols-12 gap-4 items-center transition-all duration-200 hover:bg-indigo-900/20 ${
                  status === "ready" ? "bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-l-4 border-l-emerald-400" : ""
                } ${isEnded ? "opacity-90" : ""}`}
              >
                <SessionRow 
                  session={session} 
                  isEnded={isEnded} 
                  status={status} 
                  handleStartSession={handleStartSession} 
                />
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState isEnded={isEnded} />
      )}
    </div>
  )
}

const SessionRow = ({ session, isEnded, status, handleStartSession }: any) => (
  <>
    {/* Session Details */}
    <div className="col-span-3 flex items-start gap-3">
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center shadow-md ${
        isEnded ? "bg-gradient-to-br from-gray-600 to-gray-700" : "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
      }`}>
        {isEnded ? (
          <CheckCircle className="w-6 h-6 text-indigo-100" />
        ) : (
          <Play className="w-6 h-6 text-white" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className={`font-semibold text-lg mb-1 truncate ${
          isEnded ? "text-indigo-200" : "text-white"
        }`}>
          {session.title}
        </h3>
        <p className="text-indigo-100/80 text-sm mb-2 line-clamp-2">
          {session.description}
        </p>
        <div className="flex items-center gap-2 text-sm text-indigo-200/80">
          <Users className="w-4 h-4 text-indigo-300" />
          <span>{session.sessions?.length || 0} Sessions</span>
        </div>
      </div>
    </div>

    {/* Start Date */}
    <div className="col-span-2 flex items-center gap-2 text-indigo-100">
      <Calendar className="w-4 h-4 text-indigo-300" />
      <span className="font-medium">
        {session.startDate ? format(parseISO(session.startDate), "MMM dd, yyyy") : "N/A"}
      </span>
    </div>

    {/* End Date */}
    <div className="col-span-2 flex items-center gap-2 text-indigo-100">
      <Calendar className="w-4 h-4 text-indigo-300" />
      <span className="font-medium">
        {session.endDate ? format(parseISO(session.endDate), "MMM dd, yyyy") : "N/A"}
      </span>
    </div>

    {/* Time */}
    <div className="col-span-2 flex items-center gap-2 text-indigo-100">
      <Clock className="w-4 h-4 text-indigo-300" />
      <div className="flex flex-col">
        <span className="font-medium">{session.startTime || "N/A"}</span>
        <span className="text-xs text-indigo-300/70">End: {session.endTime || "N/A"}</span>
      </div>
    </div>

    {/* Category */}
    <div className="col-span-1">
      <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-sm">
        {session.categoryId?.title || session.categoryName || "General"}
      </Badge>
    </div>

    {/* Actions/Status */}
    <div className="col-span-2">
      {isEnded ? (
        <Badge className="bg-gradient-to-r from-gray-600 to-gray-700 text-indigo-100 border border-gray-500/30">
          <CheckCircle className="w-4 h-4 mr-2 text-indigo-200" />
          Completed
        </Badge>
      ) : status === "streaming" ? (
        <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-md">
          <Radio className="w-4 h-4 mr-2" />
          Live
        </Button>
      ) : status === "ready" ? (
        <Button 
          onClick={() => handleStartSession(session.id)} 
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Now
        </Button>
      ) : (
        <Button 
          disabled 
          className="w-full bg-gradient-to-r from-indigo-700/50 to-blue-700/50 text-indigo-200 border border-indigo-500/30 cursor-not-allowed"
        >
          <Clock className="w-4 h-4 mr-2 text-indigo-300" />
          Scheduled
        </Button>
      )}
    </div>
  </>
)

const EmptyState = ({ isEnded }: { isEnded?: boolean }) => (
  <div className="p-12 text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-indigo-700/30 to-purple-700/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
      {isEnded ? (
        <Archive className="w-8 h-8 text-indigo-300" />
      ) : (
        <Calendar className="w-8 h-8 text-indigo-300" />
      )}
    </div>
    <h3 className="text-xl font-semibold text-indigo-100 mb-2">
      {isEnded ? "No Completed Sessions" : "No Sessions Scheduled"}
    </h3>
    <p className="text-indigo-200/70">
      {isEnded ? "Your completed sessions will appear here." : "Your upcoming sessions will appear here."}
    </p>
  </div>
)
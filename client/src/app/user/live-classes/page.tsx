"use client"

import React, { useEffect, useState } from "react"
import { Calendar, Clock, Users } from "lucide-react"
import { useUserContext } from "@/src/context/userAuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function UpcomingSessions() {
  const { allCourses } = useUserContext()

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) 

    return () => clearInterval(interval)
  }, [])

  const canStartSession = (sessionDate: string, startTime: string): boolean => {
    if (!sessionDate || !startTime) return false
    const sessionDateTime = new Date(`${sessionDate}T${startTime}`)
    const fifteenMinBefore = new Date(sessionDateTime.getTime() - 15 * 60000)
    return currentTime >= fifteenMinBefore && currentTime <= sessionDateTime
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Upcoming Sessions</h2>

      <div className="border border-gray-200 rounded-lg">
        <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 border-b">
          <div className="col-span-4">Session</div>
          <div className="col-span-2">Starting Date</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Status</div>
        </div>

        <div className="divide-y">
          {allCourses.map((session) => {
            const canStart = canStartSession(session.startDate || "", session.startTime)

            return (
              <div key={session._id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition">
                {/* Session Info */}
                <div className="col-span-4">
                  <div className="text-gray-900 font-medium">{session.title}</div>
                  <p className="text-sm text-gray-500">{session.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Users className="w-3 h-3" />
                    {session.sessions.length} session{session.sessions.length !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Date */}
                <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {session.startDate ? new Date(session.startDate).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  }) : "N/A"}
                </div>

                {/* Time */}
                <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {session.startTime || "N/A"}
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                    {session.categoryId?.title || "General"}
                  </Badge>
                </div>

                {/* Status */}
                <div className="col-span-2 text-center">
                  <Badge
                    className={
                      canStart
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {canStart ? "Start Now" : "Upcoming"}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

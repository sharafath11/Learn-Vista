"use client"

import React, { useState, useEffect } from "react"
import { format, parseISO, differenceInMinutes, addMinutes, startOfDay } from "date-fns"
import { Calendar, Clock, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMentorContext } from "@/src/context/mentorContext"
import { Button } from "@/components/ui/button"

export default function UpcomingSessions() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const { courses } = useMentorContext()
  const approvedCourses=courses.filter((i)=>i.mentorStatus==="approved")
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  

  const getTimeUntilCanStart = (sessionDate: string, startTime: string): string => {
    if (!sessionDate || !startTime) return "N/A"

    const sessionDateTime = parseISO(`${sessionDate}T${startTime}`)
    const fifteenMinutesBefore = addMinutes(sessionDateTime, -15)
    const oneHourAfterStart = addMinutes(sessionDateTime, 60)
    const dayAfterSessionStart = addMinutes(startOfDay(addMinutes(sessionDateTime, 24 * 60)), -currentTime.getTimezoneOffset());

    if (currentTime < fifteenMinutesBefore) {
      const minutesRemaining = differenceInMinutes(fifteenMinutesBefore, currentTime)
      const hours = Math.floor(minutesRemaining / 60)
      const minutes = minutesRemaining % 60
      return hours > 0 ? `${hours}h ${minutes}m until start` : `${minutes}m until start`
    } else if (currentTime >= fifteenMinutesBefore && currentTime <= oneHourAfterStart) {
      return "Start Now"
    } else if (currentTime > oneHourAfterStart && currentTime < dayAfterSessionStart) {
      return "Session Ended"
    } else if (currentTime >= dayAfterSessionStart && currentTime <= parseISO(`${sessionDate}T23:59:59`)) {
      return "Start Now"
    }
    return "Session Ended";
  }

  const handleStartSession = (courseId: string) => {
    router.push(`/mentor/live-class/${courseId}`)
  }

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Upcoming Sessions</h2>

      <div className="rounded-md border border-gray-700">
        <div className="bg-gray-800 px-4 py-3 grid grid-cols-12 gap-4 font-semibold text-gray-300">
          <div className="col-span-4">Session</div>
          <div className="col-span-2">Starting Date</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Actions</div>
        </div>

        {approvedCourses.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {courses.map((session) => {
              const sessionStartDate = session.startDate || "";
              const sessionStartTime = session.startTime || "";
              const sessionEndDate = session.endDate || "";

              const buttonText = getTimeUntilCanStart(sessionStartDate, sessionStartTime);

              return (
                <div
                  key={session._id}
                  className="px-4 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-800 transition"
                >
                  <div className="col-span-4">
                    <div className="font-medium text-white">{session.title}</div>
                    <p className="text-sm text-gray-400">{session.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Users className="w-4 h-4" />
                      {session.sessions?.length || 0} Sessions
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {session.startDate ? format(parseISO(session.startDate), "dd MMM, yyyy") : "N/A"}
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {session.startTime || "N/A"}
                  </div>
                  <div className="col-span-2 text-sm">
                    <span className="bg-gray-700 px-2 py-1 rounded-md text-gray-200">
                      {session.categoryId?.title || "General"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    
                    {session.isStreaming?<Button>Streaming</Button>:<Button onClick={() => handleStartSession(session._id)}>Start Streaming</Button>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-gray-400">No upcoming sessions available.</div>
        )}
      </div>
    </div>
  )
}
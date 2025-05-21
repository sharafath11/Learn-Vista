"use client"

import React, { useState, useEffect } from "react"
import { format, parseISO, differenceInMinutes, addMinutes } from "date-fns"
import { Calendar, Clock, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMentorContext } from "@/src/context/mentorContext"

export default function UpcomingSessions() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const { courses } = useMentorContext()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const canStartSession = (
    sessionStartDateStr: string,
    sessionStartTimeStr: string,
    sessionEndDateStr: string
  ): boolean => {
    if (!sessionStartDateStr || !sessionStartTimeStr || !sessionEndDateStr) {
      console.warn("canStartSession: Missing start date, start time, or end date. Returning false.");
      console.warn({ sessionStartDateStr, sessionStartTimeStr, sessionEndDateStr });
      return false;
    }
    const currentDateTime = new Date();
    const sessionStartDateTime = new Date(`${sessionStartDateStr}T${sessionStartTimeStr}`);  
    const sessionEndDateTime = new Date(`${sessionEndDateStr}T23:59:59`);  
    if (isNaN(sessionStartDateTime.getTime())) {
      console.error(`canStartSession: Invalid sessionStartDateTime created from date: "${sessionStartDateStr}", time: "${sessionStartTimeStr}".`);
      return false;
    }
    if (isNaN(sessionEndDateTime.getTime())) {
      console.error(`canStartSession: Invalid sessionEndDateTime created from date: "${sessionEndDateStr}". Check your endDate format.`);
      return false;
    }
    const fifteenMinBeforeStart = new Date(sessionStartDateTime.getTime() - 15 * 60 * 1000);
    const tenMinAfterStart = new Date(sessionStartDateTime.getTime() + 10 * 60 * 1000);
    const isWithinPreSessionWindow =
      currentDateTime >= fifteenMinBeforeStart && currentDateTime < sessionStartDateTime;
    const isDuringSession =
      currentDateTime >= tenMinAfterStart && currentDateTime <= sessionEndDateTime;
    const canJoin = isWithinPreSessionWindow || isDuringSession;
    return canJoin;
  };

  const getTimeUntilCanStart = (sessionDate: string, startTime: string): string => {
    if (!sessionDate || !startTime) return "No time specified"
    
    const sessionDateTime = parseISO(`${sessionDate}T${startTime}`)
    const fifteenMinutesBefore = addMinutes(sessionDateTime, -15)

    if (currentTime < fifteenMinutesBefore) {
      const minutesRemaining = differenceInMinutes(fifteenMinutesBefore, currentTime)
      const hours = Math.floor(minutesRemaining / 60)
      const minutes = minutesRemaining % 60
      return hours > 0 ? `${hours}h ${minutes}m until start` : `${minutes}m until start`
    }
    return "Ready to start"
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
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Actions</div>
        </div>

        {courses.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {courses.map((session) => {
              const sessionStartDate = session.startDate || "";
              const sessionStartTime = session.startTime || "";
              const sessionEndDate = session.endDate || "";

              const canStart = canStartSession(sessionStartDate, sessionStartTime, sessionEndDate);

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
                    {session.startDate ? format(parseISO(session.startDate), "dd MMM yyyy") : "N/A"}
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
                    <button
                      onClick={() => handleStartSession(session._id)}
                      disabled={!canStart}
                      className={`px-4 py-2 rounded-md text-sm font-medium w-full ${
                        canStart
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-600 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {canStart
                        ? "Start Now"
                        : getTimeUntilCanStart(session.startDate || "", session.startTime || "")}
                    </button>
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
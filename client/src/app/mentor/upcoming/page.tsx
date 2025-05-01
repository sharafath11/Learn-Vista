"use client"

import React, { useState, useEffect } from "react"
import { format, parseISO, differenceInMinutes, addMinutes } from "date-fns"
import { Calendar, Clock, Users, Video } from "lucide-react"
import { useRouter } from "next/navigation"

interface Session {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  category: {
    id: string
    name: string
  }
  participantsCount: number
}

const sampleSessions: Session[] = [
  {
    id: "1",
    title: "Introduction to React Hooks",
    description: "Learn the basics of React Hooks and how to use them in your applications.",
    date: "2025-05-15",
    startTime: "10:00",
    endTime: "11:30",
    category: { id: "1", name: "Programming" },
    participantsCount: 24,
  },
  {
    id: "2",
    title: "Advanced CSS Techniques",
    description: "Master advanced CSS techniques including Grid, Flexbox, and animations.",
    date: "2025-05-16",
    startTime: "14:00",
    endTime: "15:30",
    category: { id: "3", name: "Design" },
    participantsCount: 18,
  },
  {
    id: "3",
    title: "Data Visualization with D3.js",
    description: "Learn how to create interactive data visualizations using D3.js.",
    date: "2025-05-17",
    startTime: "09:00",
    endTime: "11:00",
    category: { id: "2", name: "Data Science" },
    participantsCount: 32,
  },
]

export default function UpcomingSessions() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    setSessions(sampleSessions)
  }, [])

  const canStartSession = (sessionDate: string, startTime: string): boolean => {
    const sessionDateTime = parseISO(`${sessionDate}T${startTime}`)
    const fifteenMinutesBefore = addMinutes(sessionDateTime, -15)
    return currentTime >= fifteenMinutesBefore && currentTime <= sessionDateTime
  }

  const getTimeUntilCanStart = (sessionDate: string, startTime: string): string => {
    const sessionDateTime = parseISO(`${sessionDate}T${startTime}`)
    const fifteenMinutesBefore = addMinutes(sessionDateTime, -15)

    if (currentTime < fifteenMinutesBefore) {
      const minutesRemaining = differenceInMinutes(fifteenMinutesBefore, currentTime)
      const hours = Math.floor(minutesRemaining / 60)
      const minutes = minutesRemaining % 60
      return hours > 0 ? `${hours}h ${minutes}m until you can start` : `${minutes}m until you can start`
    }
    return "You can start now"
  }

  const handleStartSession = (sessionId: string) => {
    console.log("Starting session...")
    setTimeout(() => {
      router.push(`/mentor/live-class/${sessionId}`)
    }, 1000)
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

        {sessions.length > 0 ? (
          <div className="divide-y divide-gray-700">
            {sessions.map((session) => (
              <div key={session.id} className="px-4 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-800 transition">
                <div className="col-span-4">
                  <div className="font-medium text-white">{session.title}</div>
                  <p className="text-sm text-gray-400">{session.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <Users className="w-4 h-4" />
                    {session.participantsCount} participants
                  </div>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {format(parseISO(session.date), "dd MMM yyyy")}
                </div>
                <div className="col-span-2 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {session.startTime} - {session.endTime}
                </div>
                <div className="col-span-2 text-sm">
                  <span className="bg-gray-700 px-2 py-1 rounded-md text-gray-200">{session.category.name}</span>
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => handleStartSession(session.id)}
                    disabled={!canStartSession(session.date, session.startTime)}
                    className={`px-4 py-2 rounded-md text-sm font-medium w-full ${
                      canStartSession(session.date, session.startTime)
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {canStartSession(session.date, session.startTime)
                      ? "Start Now"
                      : getTimeUntilCanStart(session.date, session.startTime)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-gray-400">No upcoming sessions available.</div>
        )}
      </div>
    </div>
  )
}

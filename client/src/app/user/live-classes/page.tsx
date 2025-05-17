"use client"

import React, { useState } from "react"
import { Calendar, Clock, Users } from "lucide-react"

// Sample data user enroll cheytha data only show in here
const sampleCourses = [
  {
    _id: "1",
    title: "Introduction to React",
    description: "Learn React fundamentals",
    startDate: "2023-12-15",
    startTime: "14:00",
    categoryId: { title: "Web Development" },
    sessions: [1, 2, 3]
  },
  {
    _id: "2",
    title: "Advanced JavaScript",
    description: "Deep dive into JS concepts",
    startDate: "2023-12-16",
    startTime: "10:30",
    categoryId: { title: "Programming" },
    sessions: [1, 2]
  },
  {
    _id: "3",
    title: "UI/UX Design Principles",
    description: "Master design fundamentals",
    startDate: "2023-12-17",
    startTime: "16:45",
    categoryId: { title: "Design" },
    sessions: [1]
  }
]

export default function UpcomingSessions() {
  const [currentTime] = useState(new Date("2023-12-15T13:50:00")) // Sample current time

  const canStartSession = (sessionDate: string, startTime: string): boolean => {
    if (!sessionDate || !startTime) return false
    const sessionDateTime = new Date(`${sessionDate}T${startTime}`)
    const fifteenMinutesBefore = new Date(sessionDateTime.getTime() - 15 * 60000)
    return currentTime >= fifteenMinutesBefore && currentTime <= sessionDateTime
  }

  const getTimeUntilCanStart = (sessionDate: string, startTime: string): string => {
    if (!sessionDate || !startTime) return "No time specified"
    
    const sessionDateTime = new Date(`${sessionDate}T${startTime}`)
    const fifteenMinutesBefore = new Date(sessionDateTime.getTime() - 15 * 60000)

    if (currentTime < fifteenMinutesBefore) {
      const minutesRemaining = Math.floor((fifteenMinutesBefore - currentTime) / 60000)
      const hours = Math.floor(minutesRemaining / 60)
      const minutes = minutesRemaining % 60
      return hours > 0 ? `${hours}h ${minutes}m until start` : `${minutes}m until start`
    }
    return "Ready to start"
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upcoming Sessions</h2>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 border-b border-gray-200">
          <div className="col-span-4">Session</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Status</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {sampleCourses.map((session) => (
            <div 
              key={session._id} 
              className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-4">
                <div className="font-medium text-gray-900">{session.title}</div>
                <p className="text-sm text-gray-500 mt-1">{session.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                  <Users className="w-3 h-3" />
                  {session.sessions.length} session{session.sessions.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                {session.startDate ? new Date(session.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
              </div>
              
              <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                {session.startTime || "N/A"}
              </div>
              
              <div className="col-span-2">
                <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-medium">
                  {session.categoryId?.title || "General"}
                </span>
              </div>
              
              <div className="col-span-2">
                <div className={`px-3 py-1.5 rounded-md text-xs font-medium text-center ${
                  canStartSession(session.startDate || "", session.startTime || "")
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {canStartSession(session.startDate || "", session.startTime || "")
                    ? "Start Now"
                    : getTimeUntilCanStart(session.startDate || "", session.startTime || "")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
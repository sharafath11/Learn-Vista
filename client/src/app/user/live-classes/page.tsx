"use client"

import React, { useEffect, useState } from "react"
import { Calendar, Clock, Users, BookOpen } from "lucide-react" // Added BookOpen for category
import { useUserContext } from "@/src/context/userAuthContext"
import { Card } from "@/components/ui/card" // Assuming Card is from shadcn/ui or similar
import { Badge } from "@/components/ui/badge" // Assuming Badge is from shadcn/ui or similar
import { Button } from "@/components/ui/button" // Assuming Button is from shadcn/ui or similar
import { UserAPIMethods } from "@/src/services/APImethods"
import { showSuccessToast } from "@/src/utils/Toast"
import { useRouter } from "next/navigation"

export default function UpcomingSessions() {
  const { allCourses } = useUserContext()
  const route = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const handleJoinCall = async (courseId: string) => {
    let liveId = ""
    const res = await UserAPIMethods.getUserRoomId(courseId);
    if (res.ok) {
      liveId = res.data
      showSuccessToast(res.msg);
      route.push(`/user/live-classes/${liveId}`)
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Upcoming Sessions</h2>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        {/* Table Header */}
        <div className="bg-gray-100 px-6 py-4 grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 border-b border-gray-200">
          <div className="col-span-4">Session Details</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2 text-center">Action</div>
        </div>

        {/* Sessions List */}
        <div className="divide-y divide-gray-100">
          {allCourses.length > 0 ? (
            allCourses.map((session) => (
              <div 
                key={session._id} 
                className="px-6 py-5 grid grid-cols-12 gap-4 items-center bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Session Info */}
                <div className="col-span-4 flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 leading-snug">{session.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{session.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>{session.sessions.length} session{session.sessions.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {session.startDate ? new Date(session.startDate).toLocaleDateString('en-US', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  }) : "N/A"}
                </div>

                {/* Time */}
                <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {session.startTime || "N/A"}
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full text-xs font-medium">
                    <BookOpen className="w-3.5 h-3.5" />
                    {session.categoryId?.title || "General"}
                  </Badge>
                </div>

                {/* Action Button */}
                <div className="col-span-2 text-center">
                  {/* Since canStartSession is removed, we default to Upcoming or a static Join button */}
                  {/* You'll need to re-introduce logic for "Start Now" if that's desired without canStartSession */}
                  <Button
                    onClick={() => handleJoinCall(session._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    // If you want to disable it based on time, you'll need to add back some time logic
                    // For now, it's always enabled if you don't have 'canStartSession'
                  >
                    Join Session
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              <p className="text-lg">No upcoming sessions found.</p>
              <p className="text-sm mt-2">Check back later or explore other courses!</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
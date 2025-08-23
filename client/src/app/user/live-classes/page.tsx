"use client"

import { useEffect, useState } from "react"
import { useUserContext } from "@/src/context/userAuthContext"
import { Card } from "@/src/components/shared/components/ui/card"
import { UserAPIMethods } from "@/src/services/methods/user.api"
import { showSuccessToast } from "@/src/utils/Toast"
import { useRouter } from "next/navigation"
import { cn } from "@/src/utils/cn"
import { EmptyState } from "./empty-state"
import { SessionTableRow } from "./session-table-row"
import { SessionCard } from "./session-card"


export default function UpcomingSessions() {
  const { allCourses, user } = useUserContext()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [joiningSession, setJoiningSession] = useState<string | null>(null)
  const [filter, setFilter] = useState<"active" | "expired">("active")
  const courses = allCourses.filter((course) => course.enrolledUsers?.some((userId) => userId === user?.id))

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const isExpired = (endDate: string) => {
    if (!endDate) return false
    return new Date(endDate) < currentTime
  }

  const handleJoinCall = async (courseId: string) => {
    setJoiningSession(courseId)
    try {
      const res = await UserAPIMethods.getUserRoomId(courseId)
      if (res.ok) {
        showSuccessToast(res.msg)
        router.push(`/user/live-classes/${res.data}`)
      }
    } catch (error) {
      console.warn(error)
    } finally {
      setJoiningSession(null)
    }
  }

  const handleViewContent = (courseId: string) => {
    router.push(`/user/sessions/${courseId}`)
  }

  const activeCourses = courses.filter((course) => !isExpired(course.endDate))
  const expiredCourses = courses.filter((course) => isExpired(course.endDate))
  const filteredCourses = filter === "active" ? activeCourses : expiredCourses

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Sessions</h2>
        <p className="text-gray-600 text-sm sm:text-base">Manage your enrolled courses and track session status</p>
      </div>

      {/* Filter Tabs */}
      {courses.length > 0 && (
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
            <button
              onClick={() => setFilter("active")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                filter === "active" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900",
              )}
            >
              Active ({activeCourses.length})
            </button>
            <button
              onClick={() => setFilter("expired")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                filter === "expired" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900",
              )}
            >
              Expired ({expiredCourses.length})
            </button>
          </div>
        </div>
      )}

      {filteredCourses.length === 0 ? (
        <EmptyState filter={filter} onExplore={() => router.push("/user/courses")} />
      ) : (
        <>
          {/* Desktop Table */}
          <Card className="hidden lg:block overflow-hidden border-0 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                <div className="col-span-4">Session Details</div>
                <div className="col-span-2">Start Date</div>
                <div className="col-span-2">End Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2 text-center">Action</div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredCourses.map((session, index) => (
                <SessionTableRow
                  key={session.id}
                  session={session}
                  index={index}
                  isExpired={isExpired(session.endDate)}
                  joiningSession={joiningSession}
                  onJoinCall={handleJoinCall}
                  onViewContent={handleViewContent}
                />
              ))}
            </div>
          </Card>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {filteredCourses.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isExpired={isExpired(session.endDate)}
                joiningSession={joiningSession}
                onJoinCall={handleJoinCall}
                onViewContent={handleViewContent}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

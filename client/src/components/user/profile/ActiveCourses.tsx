"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Clock, BookOpen, ChevronRight, ChevronDown } from "lucide-react"
import { useUserContext } from "@/src/context/userAuthContext"
import type { ICourse } from "@/src/types/courseTypes"
import { Button } from "@/src/components/shared/components/ui/button"
import { useRouter } from "next/navigation"
import { getCourseProgress } from "@/src/utils/getProgress"
import { WithTooltip } from "@/src/hooks/UseTooltipProps" // ✅ tooltip wrapper

const CourseCard = ({ course }: { course: ICourse }) => {
  const { title, categoryName, mentorId, thumbnail, sessions, startDate, endDate } = course

  const { progresses } = useUserContext()
  const router = useRouter()

  const lessons = sessions || 0
  const progress = getCourseProgress(course.id, progresses) || 0
  const completedLessons = Math.round((lessons as number * progress) / 100)

  const mentorName = typeof mentorId === "object" && "name" in mentorId ? mentorId.name : "Instructor"

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
      {/* Thumbnail + Category */}
      <div className="relative h-40">
        <WithTooltip content={`Category: ${categoryName || "General"}`}>
          <Image
            src={thumbnail || "/placeholder.svg?height=200&width=400"}
            alt={title}
            width={400}
            height={200}
            className="h-full w-full object-cover"
          />
        </WithTooltip>

        <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium shadow-sm border">
          {categoryName || "General"}
        </span>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
          <WithTooltip content={`Instructor: ${mentorName}`}>
            <p className="text-xs text-white/90">{mentorName as string}</p>
          </WithTooltip>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Dates & Lessons */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <WithTooltip
            content={
              startDate && endDate
                ? `Start: ${new Date(startDate).toLocaleDateString()} | End: ${new Date(endDate).toLocaleDateString()}`
                : "Ongoing course"
            }
          >
            <div className="flex items-center cursor-default">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-xs">
                {startDate && endDate
                  ? `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
                  : "Ongoing"}
              </span>
            </div>
          </WithTooltip>

          <WithTooltip content={`${lessons} lessons included`}>
            <div className="flex items-center cursor-default">
              <BookOpen className="h-4 w-4 mr-1" />
              <span className="text-xs">{lessons} lessons</span>
            </div>
          </WithTooltip>
        </div>

        {/* Progress */}
        <WithTooltip content={`Completed ${completedLessons} of ${lessons} lessons`}>
          <div className="mb-4 cursor-default">
            <div className="flex justify-between text-xs mb-2">
              <span className="font-medium text-gray-700">Progress: {progress}%</span>
              <span className="text-gray-500">
                {completedLessons}/{lessons} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </WithTooltip>

        {/* Action button */}
        <WithTooltip
          content={
            progress === 0
              ? "Start the course"
              : progress === 100
              ? "Review completed lessons"
              : "Resume from where you left off"
          }
        >
          <Button
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
            onClick={() => router.push(`/user/sessions/${course.id}`)}
          >
            {progress === 0 ? "Start Learning" : progress === 100 ? "Review Course" : "Continue Learning"}
          </Button>
        </WithTooltip>
      </div>
    </div>
  )
}

export default function ActiveCourses() {
  const { allCourses, user } = useUserContext()
  const [showAll, setShowAll] = useState(false)

  const userEnrolledCourses =
    allCourses?.filter((course) => user?.enrolledCourses?.some((i) => i.courseId === course.id)) || []

  const displayedCourses = showAll ? userEnrolledCourses : userEnrolledCourses.slice(0, 4)
  const hasMoreCourses = userEnrolledCourses.length > 4

  if (userEnrolledCourses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="max-w-md mx-auto">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Courses</h3>
          <p className="text-gray-600 mb-4">
            {`You haven't enrolled in any courses yet. Start your learning journey today!`}
          </p>
          <Link href="/user/courses">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Browse Courses</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Active Courses</h2>
          <p className="text-sm text-gray-600 mt-1">
            {userEnrolledCourses.length} course{userEnrolledCourses.length !== 1 ? "s" : ""} in progress
          </p>
        </div>
        <Link
          href="/user/courses"
          className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center font-medium transition-colors"
        >
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {displayedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {hasMoreCourses && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
          >
            {showAll ? (
              <>
                Show Less <ChevronDown className="h-4 w-4 ml-2 rotate-180" />
              </>
            ) : (
              <>
                View All Courses ({userEnrolledCourses.length - 4} more){" "}
                <ChevronDown className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

"use client"

import { useMemo } from "react"
import { BookOpen, TrendingUp, Award, Target } from "lucide-react"
import { useUserContext } from "@/src/context/userAuthContext"
import { getCourseProgress } from "@/src/utils/getProgress"
import { useRouter } from "next/navigation"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"

export default function StatsCard() {
  const { progresses, allCourses, user } = useUserContext()
  const route = useRouter()

  const overallStats = useMemo(() => {
    if (!progresses || !allCourses || !user?.enrolledCourses) {
      return {
        overallProgress: 0,
        completedCourses: 0,
        totalCourses: 0,
        inProgressCourses: 0,
      }
    }

    const enrolledCourses = allCourses.filter((course) =>
      user.enrolledCourses?.some((enrolled) => enrolled.courseId === course.id),
    )

    let totalProgress = 0
    let completedCourses = 0
    let inProgressCourses = 0

    enrolledCourses.forEach((course) => {
      const progress = getCourseProgress(course.id, progresses)
      totalProgress += progress

      if (progress >= 100) {
        completedCourses++
      } else if (progress > 0) {
        inProgressCourses++
      }
    })

    const overallProgress =
      enrolledCourses.length > 0 ? Math.round(totalProgress / enrolledCourses.length) : 0

    return {
      overallProgress,
      completedCourses,
      totalCourses: enrolledCourses.length,
      inProgressCourses,
    }
  }, [progresses, allCourses, user])

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "from-emerald-500 to-green-600"
    if (progress >= 70) return "from-blue-500 to-indigo-600"
    if (progress >= 50) return "from-indigo-500 to-purple-600"
    if (progress >= 30) return "from-purple-500 to-pink-600"
    return "from-gray-400 to-gray-500"
  }

  const getMotivationalMessage = (progress: number, completed: number) => {
    if (progress >= 90) return "Outstanding! You're almost there! 🎉"
    if (progress >= 70) return "Great progress! Keep up the momentum! 🚀"
    if (progress >= 50) return "You're halfway there! Don't give up! 💪"
    if (progress >= 30) return "Good start! Every step counts! 📚"
    if (completed > 0) return "Congratulations on completing courses! 🏆"
    return "Ready to start your learning journey? 🌟"
  }

  if (overallStats.totalCourses === 0) {
    return (
      <WithTooltip content="No courses yet! Enroll to see your learning stats here.">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-indigo-100">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">Start Your Learning Journey</h3>
            <p className="text-gray-600 text-sm mb-4">
              Enroll in courses to track your progress and achieve your learning goals.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm border border-indigo-200">
              <Target className="h-4 w-4 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-600">Ready to begin?</span>
            </div>
          </div>
        </div>
      </WithTooltip>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900 text-lg">Learning Progress</h3>
        <WithTooltip content="Your overall progress across all enrolled courses.">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
          </div>
        </WithTooltip>
      </div>

      {/* Main Progress Circle */}
      <WithTooltip content="This circle shows your average course completion percentage.">
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${
                  2 * Math.PI * 40 * (1 - overallStats.overallProgress / 100)
                }`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="stop-color-indigo-500" />
                  <stop offset="100%" className="stop-color-purple-600" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">
                {overallStats.overallProgress}%
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3 max-w-xs mx-auto">
            {getMotivationalMessage(overallStats.overallProgress, overallStats.completedCourses)}
          </p>
        </div>
      </WithTooltip>

      {/* Progress Bar */}
      <WithTooltip content="Detailed view of your overall course completion.">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Overall Progress</span>
            <span className="font-semibold text-gray-900">{overallStats.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(
                overallStats.overallProgress,
              )} transition-all duration-1000 ease-out`}
              style={{ width: `${overallStats.overallProgress}%` }}
            />
          </div>
        </div>
      </WithTooltip>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <WithTooltip content="Courses you’ve completed 100%.">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {overallStats.completedCourses}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        </WithTooltip>

        <WithTooltip content="Courses you’ve started but not finished yet.">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {overallStats.inProgressCourses}
            </div>
            <div className="text-xs text-gray-500">In Progress</div>
          </div>
        </WithTooltip>

        <WithTooltip content="The total number of courses you’re enrolled in.">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-lg font-bold text-gray-900">
              {overallStats.totalCourses}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </WithTooltip>
      </div>

      {/* Achievement Message */}
      {overallStats.completedCourses > 0 && (
        <WithTooltip content="Click to view your earned certificates.">
          <div
            className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 cursor-pointer"
            onClick={() => route.push("/user/certificate")}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  🎉 You've completed {overallStats.completedCourses} course
                  {overallStats.completedCourses !== 1 ? "s" : ""}!
                </p>
                <p className="text-xs text-green-600 mt-1">Keep up the excellent work!</p>
              </div>
            </div>
          </div>
        </WithTooltip>
      )}
    </div>
  )
}

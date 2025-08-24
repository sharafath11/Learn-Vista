"use client"

import { useMemo } from "react"
import { BookOpen, TrendingUp, Award, Target } from "lucide-react"
import { useUserContext } from "@/src/context/userAuthContext"
import { getCourseProgress } from "@/src/utils/getProgress"

export default function ProgressOverview() {
  const { progresses, allCourses, user } = useUserContext()
  const progressData = useMemo(() => {
    if (!progresses || !allCourses || !user?.enrolledCourses) {
      return {
        overall: { percentage: 0, completedLessons: 0, totalLessons: 0 },
        categories: [],
      }
    }
    const enrolledCourses = allCourses.filter((course) =>
      user.enrolledCourses?.some((enrolled) => enrolled.courseId === course.id),
    )
    let totalProgress = 0
    let totalLessons = 0
    let completedLessons = 0
    const categoryProgress: Record<string, { total: number; completed: number; courses: number }> = {}

    enrolledCourses.forEach((course) => {
      const progress = getCourseProgress(course.id, progresses)
      const lessons = course.sessions || 0 
      const completed = Math.round((lessons as number * progress) / 100)

      totalProgress += progress
      totalLessons += lessons as number
      completedLessons += completed

      // Group by category
      const category = course.categoryName || "General"
      if (!categoryProgress[category]) {
        categoryProgress[category] = { total: 0, completed: 0, courses: 0 }
      }
      categoryProgress[category].total += lessons as number
      categoryProgress[category].completed += completed
      categoryProgress[category].courses += 1
    })

    const overallPercentage = enrolledCourses.length > 0 ? Math.round(totalProgress / enrolledCourses.length) : 0

    // Convert category progress to array
    const categories = Object.entries(categoryProgress).map(([name, data]) => ({
      name,
      percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      completedLessons: data.completed,
      totalLessons: data.total,
      courses: data.courses,
    }))

    return {
      overall: {
        percentage: overallPercentage,
        completedLessons,
        totalLessons,
      },
      categories: categories.sort((a, b) => b.percentage - a.percentage),
    }
  }, [progresses, allCourses, user])

  const getProgressLevel = (percentage: number) => {
    if (percentage >= 80) return { level: "Advanced", color: "text-green-600" }
    if (percentage >= 50) return { level: "Intermediate", color: "text-blue-600" }
    if (percentage >= 20) return { level: "Beginner", color: "text-indigo-600" }
    return { level: "Getting Started", color: "text-gray-600" }
  }

  const progressLevel = getProgressLevel(progressData.overall.percentage)

  if (progressData.overall.totalLessons === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Start Your Learning Journey</h2>
          <p className="text-gray-600 mb-4">Enroll in courses to see your progress overview here.</p>
          <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
            <Target className="h-4 w-4 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-indigo-600">Ready to begin learning?</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Learning Progress</h2>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <span className={`text-sm font-medium ${progressLevel.color}`}>{progressLevel.level}</span>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 text-lg">Overall Progress</h3>
          <Award className="h-6 w-6 text-indigo-600" />
        </div>

        {/* Large Progress Circle */}
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressData.overall.percentage / 100)}`}
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{progressData.overall.percentage}%</span>
              <span className="text-sm text-gray-600">Complete</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-sm mb-3">
          <span className="font-semibold text-gray-900">
            {progressData.overall.completedLessons} of {progressData.overall.totalLessons} lessons completed
          </span>
        </div>

        <div className="w-full bg-white rounded-full h-3 mb-4 shadow-inner">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
            style={{ width: `${progressData.overall.percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs">
          <span
            className={`font-medium ${progressData.overall.percentage >= 20 ? "text-indigo-600" : "text-gray-400"}`}
          >
            Getting Started
          </span>
          <span className={`font-medium ${progressData.overall.percentage >= 50 ? "text-blue-600" : "text-gray-400"}`}>
            Intermediate
          </span>
          <span className={`font-medium ${progressData.overall.percentage >= 80 ? "text-green-600" : "text-gray-400"}`}>
            Advanced
          </span>
        </div>
      </div>

      {/* Progress by Category */}
      {progressData.categories.length > 0 && (
        <>
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center text-lg">
            <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
            Progress by Category
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {progressData.categories.map((category, index) => (
              <div
                key={category.name}
                className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full mr-3 bg-gradient-to-r ${
                        index === 0
                          ? "from-indigo-500 to-purple-600"
                          : index === 1
                            ? "from-blue-500 to-indigo-600"
                            : index === 2
                              ? "from-green-500 to-blue-600"
                              : index === 3
                                ? "from-purple-500 to-pink-600"
                                : "from-orange-500 to-red-600"
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-gray-900">{category.name}</span>
                      <p className="text-xs text-gray-500">
                        {category.courses} course{category.courses !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{category.percentage}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 bg-gradient-to-r ${
                      index === 0
                        ? "from-indigo-500 to-purple-600"
                        : index === 1
                          ? "from-blue-500 to-indigo-600"
                          : index === 2
                            ? "from-green-500 to-blue-600"
                            : index === 3
                              ? "from-purple-500 to-pink-600"
                              : "from-orange-500 to-red-600"
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{category.completedLessons} completed</span>
                  <span className="text-gray-500">{category.totalLessons} total</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Achievement Summary */}
      {progressData.overall.percentage > 0 && (
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200" >
          <div className="flex items-center">
            <Award className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                { `🎉 You've completed `}{progressData.overall.completedLessons} lessons across{" "}
                {progressData.categories.length} categor{progressData.categories.length !== 1 ? "ies" : "y"}!
              </p>
              <p className="text-xs text-green-600 mt-1">
                {progressData.overall.percentage >= 80
                  ? "Outstanding progress! You're mastering your courses!"
                  : progressData.overall.percentage >= 50
                    ? "Great work! You're halfway through your learning journey!"
                    : "Keep up the momentum - every lesson counts!"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

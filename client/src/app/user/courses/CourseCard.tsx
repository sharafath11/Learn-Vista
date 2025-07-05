// components/CourseCard.tsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, Users, Clock, BookOpen } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { IPopulatedCourse } from "@/src/types/courseTypes"
import { useUserContext } from "@/src/context/userAuthContext"
import { UserAPIMethods } from "@/src/services/APImethods"
import { showSuccessToast, showErrorToast } from "@/src/utils/Toast"
import { useRouter } from "next/navigation"
import { getCourseProgress } from "@/src/utils/getProgress"

interface CourseCardProps {
  course: IPopulatedCourse
  index: number
  onDetailsClick: (course: IPopulatedCourse) => void
}

const CourseCard = ({ course, index, onDetailsClick }: CourseCardProps) => {
  const router = useRouter()
  const { user, setUser, progresses } = useUserContext()

  const handleStartNewCourse = async (id: string) => {
    const res = await UserAPIMethods.updateCourse(id)
    if (res.ok) {
      showSuccessToast(res.msg)
      setUser((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          enrolledCourses: [...(prev.enrolledCourses || []), { courseId: id, allowed: true }],
        }
      })
    } else {
      showErrorToast(res.msg || "Failed to enroll in course.")
    }
  }

  const isEnrolled = user?.enrolledCourses?.some((enrolledCourse) => enrolledCourse.courseId == course._id)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Card className="h-full flex flex-col overflow-hidden rounded-2xl shadow-lg border-0 bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
        {/* Course Image */}
        <div
          className="relative h-48 w-full cursor-pointer overflow-hidden rounded-t-2xl"
          onClick={() => onDetailsClick(course)}
        >
          <Image
            src={course.thumbnail || "/placeholder.svg?height=200&width=400"}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Category Badge */}
          <Badge className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg border-0">
            {course.categoryId?.title || "General"}
          </Badge>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white/95 hover:bg-white text-gray-900 font-semibold rounded-xl shadow-lg transform scale-95 group-hover:scale-100 transition-all duration-300"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </div>
        </div>

        {/* Course Content */}
        <CardHeader className="flex-grow pb-3 px-6 pt-6">
          <CardTitle className="text-xl font-bold line-clamp-2 text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            {course.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-3 text-gray-600 font-medium">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-bold shadow-md">
              {course.mentorId?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-sm">
              By{" "}
              <span className="font-semibold text-gray-700">
                {course.mentorId?.username || "Unknown Instructor"}
              </span>
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="py-2 px-6">
          {/* Course Stats */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">{course.enrolledUsers?.length || 0} Students</span>
            </div>
            <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium tracking-wide w-fit">
              {course.categoryId.title}
            </div>
          </div>

          <div className="flex items-center text-gray-600 text-sm mb-4 bg-gray-50 px-3 py-2 rounded-lg">
            <Clock className="h-4 w-4 mr-2 text-green-500" />
            <span className="font-medium">{course.sessions?.length || 0} Lessons</span>
            <span className="mx-3 text-gray-400">•</span>
            <span className="font-medium">{course.courseLanguage}</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Progress</span>
              <span>{getCourseProgress(course._id, progresses)}%</span>
            </div>
            <Progress
              value={getCourseProgress(course._id, progresses)}
              className="h-2 bg-gray-100 rounded-full overflow-hidden"
            />
          </div>
        </CardContent>

        {/* Action Button */}
        <CardFooter className="flex justify-between items-center border-t border-gray-100 pt-6 px-6 pb-6 mt-auto bg-gray-50/50">
          <div className="w-full">
            {isEnrolled ? (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                onClick={() => router.push(`/user/sessions/${course._id}`)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                onClick={() => handleStartNewCourse(course._id)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enroll Now
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default CourseCard
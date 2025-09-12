"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, Users, Clock, BookOpen } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/src/components/shared/components/ui/card"
import { Button } from "@/src/components/shared/components/ui/button"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { Progress } from "@/src/components/shared/components/ui/progress"
import { useUserContext } from "@/src/context/userAuthContext"
import { UserAPIMethods } from "@/src/services/methods/user.api"
import { showSuccessToast, showErrorToast } from "@/src/utils/Toast"
import { useRouter } from "next/navigation"
import { getCourseProgress } from "@/src/utils/getProgress"
import { IUserCourseCardProps } from "@/src/types/userProps"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"

const CourseCard = ({ course, index, onDetailsClick }: IUserCourseCardProps) => {
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

  const isEnrolled = user?.enrolledCourses?.some((enrolledCourse) => enrolledCourse.courseId == course.id)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Card className="h-full flex flex-col overflow-hidden rounded-2xl shadow-lg border-0 bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02]">
        
        {/* Course Image */}
        <WithTooltip content="Click to view course details.">
          <div
            className="relative h-48 w-full cursor-pointer overflow-hidden rounded-t-2xl"
            onClick={() => onDetailsClick(course)}
          >
            <Image
              src={course?.thumbnail || "/placeholder.svg"}
              alt={course?.title || "Course thumbnail"}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Category Badge */}
            <WithTooltip content="Course category">
              <Badge className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg border-0 cursor-help">
                {course.categoryName || "General"}
              </Badge>
            </WithTooltip>
          </div>
        </WithTooltip>

        {/* Course Content */}
        <CardHeader className="flex-grow pb-3 px-6 pt-6">
          <WithTooltip content={course.title}>
            <CardTitle className="text-xl font-bold line-clamp-2 text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 cursor-help">
              {course.title}
            </CardTitle>
          </WithTooltip>
          <CardDescription className="flex items-center gap-3 text-gray-600 font-medium">
            <WithTooltip content="Course instructor">
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-md cursor-help">
                <Image
                  src={course.mentorPhoto}
                  alt="Instructor"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
            </WithTooltip>
            <span className="text-sm">
              By{" "}
              <span className="font-semibold text-gray-700">
                {course.Mentorusername || "Unknown Instructor"}
              </span>
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="py-2 px-6">
          {/* Course Stats */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <WithTooltip content="Number of students currently enrolled.">
              <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg cursor-help">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                <span className="font-medium">{course.students || 0} Students</span>
              </div>
            </WithTooltip>

            <WithTooltip content="Course category">
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium tracking-wide w-fit cursor-help">
                {course.categoryName}
              </div>
            </WithTooltip>
          </div>

          <WithTooltip content="Total lessons and course language.">
            <div className="flex items-center text-gray-600 text-sm mb-4 bg-gray-50 px-3 py-2 rounded-lg cursor-help">
              <Clock className="h-4 w-4 mr-2 text-green-500" />
              <span className="font-medium">{course.sessions} Lessons</span>
              <span className="mx-3 text-gray-400">•</span>
              <span className="font-medium">{course.courseLanguage}</span>
            </div>
          </WithTooltip>

          {/* Progress Bar */}
          <WithTooltip content="Your progress in this course.">
            <div className="space-y-2 cursor-help">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Progress</span>
                <span>{getCourseProgress(course.id, progresses)}%</span>
              </div>
              <Progress
                value={getCourseProgress(course.id, progresses)}
                className="h-2 bg-gray-100 rounded-full overflow-hidden"
              />
            </div>
          </WithTooltip>
        </CardContent>

        {/* Action Button */}
        <CardFooter className="flex justify-between items-center border-t border-gray-100 pt-6 px-6 pb-6 mt-auto bg-gray-50/50">
          <div className="w-full">
            {isEnrolled ? (
              <WithTooltip content="Resume your learning journey.">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl cursor-help"
                  onClick={() => router.push(`/user/sessions/${course.id}`)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              </WithTooltip>
            ) : (
              <WithTooltip content="Enroll in this course to start learning.">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl cursor-help"
                  onClick={() => handleStartNewCourse(course.id)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enroll Now
                </Button>
              </WithTooltip>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default CourseCard

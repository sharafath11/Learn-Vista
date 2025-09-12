"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Clock, Code, FileText, Info, Play } from "lucide-react"
import { ILessons } from "@/src/types/lessons"
import { IUserLessonProgress } from "@/src/types/userProgressTypes"
import Image from "next/image"
import { UserAPIMethods } from "@/src/services/methods/user.api"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"

export default function LessonList({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [lessons, setLessons] = useState<ILessons[]>([])
  const [lessonProgressMap, setLessonProgressMap] = useState<Map<string, IUserLessonProgress>>(new Map())
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 2
  const [total, setTotal] = useState(0)

  const getData = useCallback(
    async (currentCourseId: string, currentPage: number) => {
      setLoading(true)
      const res = await UserAPIMethods.getLessons(currentCourseId, { page: currentPage, limit })
      const { lessons, progress, total } = res.data

      setLessons(lessons || [])
      setTotal(total || 0)

      const progressMap = new Map<string, IUserLessonProgress>()
      ;(progress || []).forEach((p: IUserLessonProgress) => {
        progressMap.set(p.lessonId.toString(), p)
      })
      setLessonProgressMap(progressMap)
      setLoading(false)
    },
    []
  )

  useEffect(() => {
    getData(courseId, page)
  }, [courseId, page, getData])

  const handleLessonClick = (lessonId: string) => {
    router.push(`/user/sessions/lessons/${lessonId}`)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p>Loading lessons...</p>
      </div>
    )
  }

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-60 text-gray-500 space-y-2 text-center px-4">
        <Info className="w-8 h-8 text-blue-500" />
        <p className="text-lg font-semibold">No lessons available yet</p>
        <p className="text-sm text-gray-400">
          Lessons for this course are not uploaded yet. Please check back later — new content is added regularly.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {lessons.map((lesson) => {
          const lessonProgress = lessonProgressMap.get(lesson.id.toString())
          const progressPercentage = lessonProgress?.overallProgressPercent ?? 0

          return (
            <WithTooltip key={lesson.id} content={lesson.title}>
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleLessonClick(lesson.id.toString())}
              >
                <div className="relative">
                  <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                    <Image
                      src={
                        lesson.thumbnail ||
                        `/placeholder.svg?height=200&width=400&text=Lesson ${lesson.title}`
                      }
                      alt={lesson.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-40 rounded-full p-4 hover:bg-opacity-60 transition-all">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle>{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <WithTooltip content="Duration of this lesson in minutes">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{lesson.duration} min</span>
                      </div>
                    </WithTooltip>

                    <WithTooltip content="Theory part of the lesson">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>Theory</span>
                      </div>
                    </WithTooltip>

                    <WithTooltip content="Coding challenge part of the lesson">
                      <div className="flex items-center gap-1">
                        <Code className="h-4 w-4" />
                        <span>Challenge</span>
                      </div>
                    </WithTooltip>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progress: {progressPercentage.toFixed(0)}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1 dark:bg-gray-700">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </WithTooltip>
          )
        })}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <WithTooltip content="Go to previous page">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
        </WithTooltip>

        <span>
          Page {page} of {Math.ceil(total / limit)}
        </span>

        <WithTooltip content="Go to next page">
          <button
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage(prev => prev + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </WithTooltip>
      </div>
    </>
  )
}

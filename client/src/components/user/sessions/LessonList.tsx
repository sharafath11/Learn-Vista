"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Code, FileText, Play } from "lucide-react"
import { getLessons } from "@/src/lib/lessons"

export default function LessonList() {
  const router = useRouter()
  const [lessons, setLessons] = useState(getLessons())
  const [progress, setProgress] = useState<Record<number, number>>({})

  useEffect(() => {
    // Load progress for each lesson
    const loadedProgress: Record<number, number> = {}

    lessons.forEach((lesson) => {
      const savedProgress = localStorage.getItem(`lesson_${lesson.id}_progress`)
      if (savedProgress) {
        const { videoCompleted, theoryCompleted, practicalCompleted } = JSON.parse(savedProgress)
        let progressValue = 0
        if (videoCompleted) progressValue += 33.33
        if (theoryCompleted) progressValue += 33.33
        if (practicalCompleted) progressValue += 33.34
        loadedProgress[lesson.id] = progressValue
      } else {
        loadedProgress[lesson.id] = 0
      }
    })

    setProgress(loadedProgress)
  }, [lessons])

  const handleLessonClick = (lessonId: number) => {
    router.push(`/user/sessions/lessons/${lessonId}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson) => {
        const progressValue = progress[lesson.id] || 0
        const isCompleted = progressValue >= 99
        const isStarted = progressValue > 0 && !isCompleted

        return (
          <Card
            key={lesson.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleLessonClick(lesson.id)}
          >
            <div className="relative">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                <img
                  src={lesson.thumbnailUrl || `/placeholder.svg?height=200&width=400&text=Lesson ${lesson.id}`}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-40 rounded-full p-4 hover:bg-opacity-60 transition-all">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {isCompleted && <Badge className="absolute top-2 right-2 bg-green-500">Completed</Badge>}

              {isStarted && <Badge className="absolute top-2 right-2 bg-amber-500">In Progress</Badge>}
            </div>

            <CardHeader>
              <CardTitle>
                Lesson {lesson.id}: {lesson.title}
              </CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{lesson.theoryQuestions.length} questions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  <span>1 challenge</span>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${isCompleted ? "bg-green-500" : "bg-blue-500"}`}
                  style={{ width: `${progressValue}%` }}
                ></div>
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

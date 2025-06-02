"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Code, FileText, Play } from "lucide-react"
import { UserAPIMethods } from "@/src/services/APImethods"
import { showErrorToast } from "@/src/utils/Toast"
import { ILessons } from "@/src/types/lessons"
import { useUserContext } from "@/src/context/userAuthContext"

export default function LessonList({ courseId }: { courseId: string }) {
  const {fetchLessons}=useUserContext()
  const router = useRouter()
  const [lessons, setLessons] = useState<ILessons[]>([])
  useEffect(() => {
   getData()
  },[])
  const getData = async () => {
     const data = await fetchLessons(courseId)
    setLessons( data)
  }
 

  const handleLessonClick = (lessonId: string) => {
    router.push(`/user/sessions/lessons/${lessonId}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lessons.map((lesson) => {
      

        return (
          <Card
            key={lesson.id}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleLessonClick(lesson.id)}
          >
            <div className="relative">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                <img
                  src={lesson.thumbnail || `/placeholder.svg?height=200&width=400&text=Lesson ${lesson.id}`}
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-40 rounded-full p-4 hover:bg-opacity-60 transition-all">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

            </div>

            <CardHeader>
              <CardTitle>
                Lesson  {lesson.title}
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
                  <span>{lesson.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  <span>1 challenge</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

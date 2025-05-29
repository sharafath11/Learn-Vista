"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { IQuestions, ILessons } from "@/src/types/lessons"
import VideoPlayer from "@/src/components/user/sessions/video-player"
import TheoryQuestions from "@/src/components/user/sessions/theory-questions"
import CodeChallenge from "@/src/components/user/sessions/CodeChallenge"
import { UserAPIMethods } from "@/src/services/APImethods"
import { showErrorToast } from "@/src/utils/Toast"

export default function LessonPage() {
  const params = useParams()
  const lessonId = params.lessonId
  const router = useRouter()
  const [lesson, setLesson] = useState<ILessons | null>(null)
  const [video, setVideoUrl] = useState<string>("")
  const [questions, setQuestions] = useState<IQuestions[]>([])
  const [videoCompleted, setVideoCompleted] = useState(false)
  const [theoryCompleted, setTheoryCompleted] = useState(false)
  const [practicalCompleted, setPracticalCompleted] = useState(false)
  const [theoryAnswers, setTheoryAnswers] = useState<{ questionId: string; answer: string }[]>([])
  const [practicalAnswers, setPracticalAnswers] = useState<{ questionId: string; answer: string }[]>([])
  const [activeTab, setActiveTab] = useState<"theory" | "practical">("theory")

  useEffect(() => {
    fetchDetils()
  }, [])

  const fetchDetils = async () => {
    const res = await UserAPIMethods.getLessonDetils(lessonId as string)
    if (res.ok) {
      setLesson(res.data.lesson)
      setVideoUrl(res.data.videoUrl)
      setQuestions(res.data.questions)
    } else {
      showErrorToast(res.msg)
    }
  }

  const handleVideoComplete = () => {
    setVideoCompleted(true)
  }

  const handleTheoryComplete = (answers: { questionId: string; answer: string }[]) => {
    setTheoryAnswers(answers)
    setTheoryCompleted(true)
  }

  const handlePracticalComplete = (answers: { questionId: string; answer: string }[]) => {
    setPracticalAnswers(answers)
    setPracticalCompleted(true)
  }

  const calculateProgress = () => {
    let progress = 0
    if (videoCompleted) progress += 33.33
    if (theoryCompleted) progress += 33.33
    if (practicalCompleted) progress += 33.34
    return progress
  }

  if (!lesson) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Lessons
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Lesson {lesson.id}: {lesson.title}
          </h1>
          <div className="w-[120px]"></div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lesson Progress</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(calculateProgress())}%
            </span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <VideoPlayer
              videoUrl={video}
              title={lesson.title}
              onComplete={handleVideoComplete}
              isCompleted={videoCompleted}
            />
          </div>

          {(videoCompleted || theoryCompleted || practicalCompleted) && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("theory")}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === "theory"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Theory Questions {theoryCompleted && "✓"}
                  </button>
                  <button
                    onClick={() => setActiveTab("practical")}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === "practical"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    Coding Challenge {practicalCompleted && "✓"}
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "theory" ? (
                  <TheoryQuestions
                    questions={questions.filter((i) => i.type === "theory")}
                    onComplete={handleTheoryComplete}
                    isCompleted={theoryCompleted}
                  />
                ) : (
                  <CodeChallenge
                    questions={questions.filter((i) => i.type === "practical")}
                    onComplete={handlePracticalComplete}
                    isCompleted={practicalCompleted}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

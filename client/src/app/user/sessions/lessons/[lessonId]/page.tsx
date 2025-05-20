"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Lesson } from "@/src/types/lessons"
import { getLessonById } from "@/src/lib/lessons"
import VideoPlayer from "@/src/components/user/sessions/video-player"
import TheoryQuestions from "@/src/components/user/sessions/theory-questions"
import CodeChallenge from "@/src/components/user/sessions/CodeChallenge"


export default function LessonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [videoCompleted, setVideoCompleted] = useState(false)
  const [theoryCompleted, setTheoryCompleted] = useState(false)
  const [practicalCompleted, setPracticalCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<"theory" | "practical">("theory")

  useEffect(() => {
    // Get lesson data
    const lessonData = getLessonById(Number.parseInt(params.id));
   
    if (lessonData) {
      setLesson(lessonData)
    } else {
      router.push("/")
    }

    // Check if this lesson was previously completed
    const savedProgress = localStorage.getItem(`lesson_${params.id}_progress`)
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setVideoCompleted(progress.videoCompleted || false)
      setTheoryCompleted(progress.theoryCompleted || false)
      setPracticalCompleted(progress.practicalCompleted || false)
    }
  }, [params.id, router])

  // Save progress whenever it changes
  useEffect(() => {
    if (lesson) {
      localStorage.setItem(
        `lesson_${params.id}_progress`,
        JSON.stringify({
          videoCompleted,
          theoryCompleted,
          practicalCompleted,
        }),
      )
    }
  }, [params.id, lesson, videoCompleted, theoryCompleted, practicalCompleted])

  const handleVideoComplete = () => {
    setVideoCompleted(true)
  }

  const handleTheoryComplete = () => {
    setTheoryCompleted(true)
  }

  const handlePracticalComplete = () => {
    setPracticalCompleted(true)
  }

  const navigateToNextLesson = () => {
    if (lesson && lesson.id < lesson.totalLessons) {
      router.push(`/lessons/${lesson.id + 1}`)
    }
  }

  const navigateToPreviousLesson = () => {
    if (lesson && lesson.id > 1) {
      router.push(`/lessons/${lesson.id - 1}`)
    }
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
          <div className="w-[120px]"></div> {/* Spacer for alignment */}
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
          {/* Video Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <VideoPlayer
              videoUrl={lesson.videoUrl}
              title={lesson.title}
              onComplete={handleVideoComplete}
              isCompleted={videoCompleted}
            />
          </div>

          {/* Tabs for Theory and Practical */}
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
                  questions={lesson.theoryQuestions}
                  onComplete={handleTheoryComplete}
                  isCompleted={theoryCompleted}
                />
              ) : (
                <CodeChallenge
                  challenge={lesson.codingChallenge}
                  onComplete={handlePracticalComplete}
                  isCompleted={practicalCompleted}
                />
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={navigateToPreviousLesson}
              disabled={lesson.id <= 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous Lesson
            </Button>

            <Button
              onClick={navigateToNextLesson}
              disabled={lesson.id >= lesson.totalLessons || !(videoCompleted && theoryCompleted && practicalCompleted)}
              className="flex items-center gap-2"
            >
              Next Lesson
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft } from "lucide-react"
import { IQuestions, ILessons, AnswerWithType, IComment, EvaluatedAnswer } from "@/src/types/lessons"
import VideoPlayer from "@/src/components/user/sessions/video-player"
import TheoryQuestions from "@/src/components/user/sessions/theory-questions"
import CodeChallenge from "@/src/components/user/sessions/CodeChallenge"
import { UserAPIMethods } from "@/src/services/APImethods"
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import { Textarea } from "@/components/ui/textarea"
import { format } from 'date-fns'
import ReportModal from "./ReportModal"

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
  const [theoryAnswers, setTheoryAnswers] = useState<AnswerWithType[]>([])
  const [practicalAnswers, setPracticalAnswers] = useState<AnswerWithType[]>([]);
  const [report, setReport] = useState<EvaluatedAnswer | null>(null) 
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState<IComment[]>([])
  const commentsEndRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<"theory" | "practical">("theory")
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  useEffect(() => {
    fetchDetils()
  }, [])

  useEffect(() => {
    if (videoCompleted && theoryCompleted && practicalCompleted && !report) {
      submitLessonReport()
    }
  }, [videoCompleted, theoryCompleted, practicalCompleted, report])

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [comments])

  const fetchDetils = async () => {
    const res = await UserAPIMethods.getLessonDetils(lessonId as string);
    
    if (res.ok) {
      setLesson(res.data.lesson)
      setVideoUrl(res.data.videoUrl)
      setQuestions(res.data.questions)
      if (res.data.comments) {
        setComments(res.data.comments)
      }
      if (res.data.report && typeof res.data.report === 'object' && !Array.isArray(res.data.report)) {
        setReport(res.data.report as EvaluatedAnswer);
        setVideoCompleted(true);
        setTheoryCompleted(true);
        setPracticalCompleted(true);
      }
    } else {
      showErrorToast(res.msg)
    }
  }

  const handleVideoComplete = () => {
    setVideoCompleted(true)
  }

  const handleTheoryComplete = (answers: { question: string; answer: string }[]) => {
    const typedAnswers = answers.map(a => ({ ...a, type: 'theory' as const }))
    setTheoryAnswers(typedAnswers)
    setTheoryCompleted(true)
  }

  const handlePracticalComplete = (answers: { question: string; answer: string }[]) => {
    const typedAnswers: AnswerWithType[] = answers.map(a => ({ ...a, type: 'practical' as const }))
    setPracticalAnswers(typedAnswers)
    setPracticalCompleted(true)
  }

  const handleAddComment = async () => {
    if (comment.trim()) {
      const res = await UserAPIMethods.saveComment(lessonId as string, comment);
      if (res.ok) {
        const newComment: IComment = {
          id: res.data.id,
          lessonId: lessonId as string,
          userName: res.data.userName, 
          comment: comment,
          createdAt: new Date()
        };
        setComments([...comments, newComment]);
        setComment("");
        showSuccessToast(res.msg);
      } else {
        showErrorToast(res.msg);
      }
    }
  }

  const submitLessonReport = async () => {
    const combinedAnswers: AnswerWithType[] = [...theoryAnswers, ...practicalAnswers]
    const res = await UserAPIMethods.getReport(
      lessonId as string,
      combinedAnswers,
    )
    if (res.ok) {
      if (res.data.report && typeof res.data.report === 'object' && !Array.isArray(res.data.report)) {
        setReport(res.data.report as EvaluatedAnswer);
        showSuccessToast(res.msg || "Lesson report submitted successfully!");
        fetchDetils(); 
      } else {
        showErrorToast("Report data format from submission is incorrect.");
      }
    } else {
      showErrorToast(res.msg || "Failed to submit lesson report.");
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
            Lesson {lesson.order}: {lesson.title}
          </h1>
          {(videoCompleted && theoryCompleted && practicalCompleted && report) && (
            <Button onClick={() => setIsReportModalOpen(true)} className="ml-4 bg-blue-600 hover:bg-blue-700 text-white">
              View Report
            </Button>
          )}
           {(!(videoCompleted && theoryCompleted && practicalCompleted && report)) && <div className="w-[120px]"></div>}
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
              thumbnail={lesson.thumbnail||""}
              onComplete={handleVideoComplete}
              isCompleted={videoCompleted}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
            <h3 className="text-xl font-bold mb-4">Discussion</h3>
            
            <div className="max-h-60 overflow-y-auto mb-4 space-y-4 pr-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{comment.userName}</span>
                      <span className="text-xs text-gray-500">
                        {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, h:mm a') : ''}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 text-sm">{comment.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
              )}
              <div ref={commentsEndRef} />
            </div>

            {videoCompleted && (
              <div className="flex gap-2">
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this video..."
                  className="flex-1"
                />
                <Button onClick={handleAddComment} disabled={!comment.trim()}>
                  Post
                </Button>
              </div>
            )}
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

      <ReportModal
        report={report?.report||""}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  )
}
"use client"
import { Button } from "@/src/components/shared/components/ui/button";
import LessonList from "@/src/components/user/sessions/LessonList";
import { WithTooltip } from "@/src/hooks/UseTooltipProps";
import { useParams, useRouter } from "next/navigation";


export default function Home() {
  const params = useParams()
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent mb-4">
            Welcome to Your Learning Journey
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Continue your progress and explore new lessons at your own pace
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
          <WithTooltip content="Return to your course overview" side="bottom">
            <Button
              onClick={() => router.push("/user/courses")}
              className="group inline-flex items-center px-6 py-3 rounded-xl shadow-lg text-sm font-semibold
                         text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                         dark:from-indigo-600 dark:to-indigo-700 dark:hover:from-indigo-700 dark:hover:to-indigo-800 
                         transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.793 4.293a1 1 0 00-1.414 0L5.707 9.586a1 1 0 000 1.414l5.672 5.672a1 1 0 001.414-1.414L8.414 10l4.379-4.379a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to Courses
            </Button>
          </WithTooltip>

          <WithTooltip content="Access your personal notes and annotations" side="bottom">
            <button
              onClick={() => router.push(`/user/note/${params.courseId}`)}
              className="group inline-flex items-center px-6 py-3 rounded-xl shadow-lg text-sm font-semibold
                         text-white bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                         dark:from-emerald-600 dark:to-green-700 dark:hover:from-emerald-700 dark:hover:to-green-800 
                         transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <svg
                className="w-5 h-5 mr-2 transition-transform group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              My Notes
            </button>
          </WithTooltip>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
          <div className="p-6">
            <LessonList courseId={params.courseId as string} />
          </div>
        </div>
      </div>
    </main>
  )
}

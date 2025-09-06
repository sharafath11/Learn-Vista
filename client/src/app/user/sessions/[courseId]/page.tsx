"use client"
import { Button } from "@/src/components/shared/components/ui/button";
import LessonList from "@/src/components/user/sessions/LessonList";
import { useParams, useRouter } from "next/navigation";

export default function Home() {
  const params = useParams();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">

        <div className="mb-6 flex justify-between items-center">
          {/* Back Button */}
          <Button
            onClick={() => router.push("/user/courses")}
            className="inline-flex items-center px-4 py-2 rounded-xl shadow-md text-sm font-medium
                       text-white bg-indigo-600 hover:bg-indigo-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                       dark:bg-indigo-700 dark:hover:bg-indigo-800 transition-all duration-200"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
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

          <button
            onClick={() => router.push(`/user/note/${params.courseId}`)}
            className="inline-flex items-center px-5 py-2 rounded-xl shadow-md text-sm font-medium
                       text-white bg-green-600 hover:bg-green-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                       dark:bg-green-700 dark:hover:bg-green-800 transition-all duration-200"
          >
            <span className="mr-2">📝</span> My Notes
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
         Welcome 
        </h1>
        <LessonList courseId={params.courseId as string} />
      </div>
    </main>
  )
}

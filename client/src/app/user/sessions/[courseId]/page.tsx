"use client"
import LessonList from "@/src/components/user/sessions/LessonList";
import { useParams } from "next/navigation";

export default function Home() {
  const params=useParams()
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Interactive Coding Lessons
        </h1>
        <LessonList courseId={params.courseId as string} />
      </div>
    </main>
  )
}

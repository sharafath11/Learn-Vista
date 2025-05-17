import LessonList from "@/src/components/user/sessions/LessonList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Interactive Coding Lessons
        </h1>
        <LessonList />
      </div>
    </main>
  )
}

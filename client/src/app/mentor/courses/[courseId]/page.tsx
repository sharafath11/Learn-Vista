// src/app/mentor/courses/[courseId]/lessons/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import { ArrowLeft, Pencil, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useMentorContext } from "@/src/context/mentorContext"
import { useParams } from "next/navigation"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { ILessons } from "@/src/types/lessons"
import { ICourse } from "@/src/types/courseTypes"
import { EditLessonModal } from "./EditLessonModal" // New import
import { AddLessonModal } from "./addLessonModal"

export default function CourseLessonsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [lessons, setLessons] = useState<ILessons[]>([])
  const [selectedLesson, setSelectedLesson] = useState<ILessons | null>(null) // Used for editing
  const { courses } = useMentorContext()
  const params = useParams()
  const courseId = params.courseId as string

  const course: ICourse | undefined = courses.find((c) => c._id === courseId)

  useEffect(() => {
    if (courseId) {
      getLessons(courseId)
    }
  }, [courseId])

  const getLessons = async (id: string) => {
    const res = await MentorAPIMethods.getLessons(id)
    if (res.ok) {
      setLessons(res.data)
    } else {
      showErrorToast("Something went wrong while fetching lessons.")
    }
  }

  const handleAddLessonClick = () => {
    setShowAddModal(true)
  }

  const handleEditLessonClick = (lesson: ILessons) => {
    setSelectedLesson(lesson) // Set the lesson to be edited
    setShowEditModal(true)
  }

  const handleLessonActionCompleted = () => {
    // This callback is triggered by both modals after a successful save/update
    setShowAddModal(false) // Close add modal if open
    setShowEditModal(false) // Close edit modal if open
    setSelectedLesson(null) // Clear selected lesson
    getLessons(courseId) // Refresh the list of lessons
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Loading course details or course not found...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Please ensure the course ID is valid and context data is available.
        </p>
      </div>
    )
  }

  const nextLessonOrder = lessons.length > 0 ? Math.max(...lessons.map((l) => l.order || 0)) + 1 : 1

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <p className="text-muted-foreground mt-1">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Lessons</h2>

        {lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-32 h-20 overflow-hidden">
                    <img
                      src={lesson.thumbnail || "/placeholder.svg"}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditLessonClick(lesson)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Link href={`/mentor/courses/${course._id}/lessons/${lesson.id}/questions`}>
                          <Button variant="outline" size="sm">
                            Manage Questions
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <Button className="mt-4" onClick={handleAddLessonClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Lesson
            </Button>

            <AddLessonModal
              open={showAddModal}
              setOpen={setShowAddModal}
              onLessonAdded={handleLessonActionCompleted}
              nextOrder={nextLessonOrder}
              courseId={courseId}
            />

            {selectedLesson && ( // Only render Edit modal if a lesson is selected
              <EditLessonModal
                open={showEditModal}
                setOpen={setShowEditModal}
                selectedLesson={selectedLesson}
                onLessonUpdated={handleLessonActionCompleted}
                courseId={courseId}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
            <p className="text-muted-foreground mb-6">Get started by adding your first lesson</p>

            <Button onClick={handleAddLessonClick}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Lesson
            </Button>
            <AddLessonModal
              open={showAddModal}
              setOpen={setShowAddModal}
              onLessonAdded={handleLessonActionCompleted}
              nextOrder={nextLessonOrder}
              courseId={courseId}
            />
          </div>
        )}
      </div>
    </div>
  )
}
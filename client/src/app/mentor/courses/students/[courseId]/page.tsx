"use client"
import { useEffect, useState } from "react"
import StudentCard from "./studentsCard"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { useParams } from "next/navigation"
import { IUser } from "@/src/types/userTypes"
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import StudentDetailsModal from "./StudentDetailsModal" 

export default function Page() {
  const params = useParams()
  const [students, setStudents] = useState<IUser[]>([])
  const [selectedStudent, setSelectedStudent] = useState<IUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewStudent = (student: IUser) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedStudent(null)
  }

  const handleToggleBlock = async (id: string, shouldBlock: boolean) => {
    const res = await MentorAPIMethods.blockStudentInCourse(
      params.courseId as string,
      id,
      shouldBlock
    )

    if (res.ok) {
      showSuccessToast(res.msg)
      setStudents((prev) =>
        prev.map((student) => {
          if (student.id === id) {
            return {
              ...student,
              enrolledCourses: student?.enrolledCourses?.map((course) =>
                course.courseId === params.courseId
                  ? { ...course, allowed: !shouldBlock }
                  : course
              ),
            }
          }
          return student
        })
      )
      return
    }
    showErrorToast(res.msg)
  }

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const res = await MentorAPIMethods.getCourseStudents(params.courseId as string)
    if (res.ok) {
      setStudents(res.data)
      return
    }
    showErrorToast(res.msg)
  }

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Student Management</h1>
          <p className="text-gray-400">Manage your students and their enrollment status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              courseId={params.courseId as string}
              onView={() => handleViewStudent(student)}
              onToggleBlock={handleToggleBlock}
            />
          ))}
        </div>

        <div className="mt-8 text-center text-gray-500">
          <p>Showing {students.length} students</p>
        </div>

        
        {selectedStudent && (
          <StudentDetailsModal
            student={selectedStudent}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </main>
  )
}
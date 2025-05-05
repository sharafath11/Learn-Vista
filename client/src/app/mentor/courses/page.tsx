"use client"
import { useMentorContext } from '@/src/context/mentorContext'
import { CheckCircle2, XCircle } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { MentorAPIMethods } from '@/src/services/APImethods'
import { showSuccessToast } from '@/src/utils/Toast'
import { ICourse } from '@/src/types/adminTypes'

export default function CoursesPage() {
  const { courses, setCourses } = useMentorContext()

  const changeStatus = async (id: string, status: string) => {
    const res = await MentorAPIMethods.courseStatusChange(id, status)
    if (res.ok) {
      showSuccessToast(`Course ${status}`)
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.id === id ? { ...course, mentorStatus: status } : course
        )
      )
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    }
    return (
      <span className={`${statusStyles[status]} text-xs px-2 py-1 rounded-full`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Course Approvals</h1>
        <div className="text-sm text-gray-500">
          {courses.length} {courses.length === 1 ? 'course' : 'courses'} pending approval
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image src={course.thumbnail || "/placeholder.png"} alt={course.title} fill className="object-cover" />
            </div>

            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{course.title}</h3>
                {getStatusBadge(course.mentorStatus)}
              </div>

              <p className="text-sm text-gray-600">{course.description}</p>

              <div className="text-xs text-gray-700 space-y-1">
                <p><strong>Sessions:</strong> {course.sessions.join(', ') || 'None'}</p>
                <p><strong>Price:</strong> ₹{course.price ?? 'Free'}</p>
                <p><strong>Language:</strong> {course.courseLanguage ?? 'Not specified'}</p>
                <p><strong>Tags:</strong> {course.tags?.join(', ') || 'None'}</p>
                <p><strong>Status:</strong> {course.mentorStatus}</p>
                <p><strong>Starts On:</strong> {course.startDate && course.startTime ? format(new Date(`${course.startDate}T${course.startTime}`), 'PPPp') : 'Not specified'}</p>
                <p><strong>Time:</strong> {course.startDate && course.startTime ? format(new Date(`${course.startDate}T${course.startTime}`), 'ppp') : 'Not specified'}</p>
                <p><strong>Ending Date:</strong> {course.endDate ? format(new Date(course.endDate), 'PPP') : 'Not specified'}</p>
              </div>

              {course.mentorStatus === "pending" && (
                <div className="flex space-x-2 pt-4">
                  <button onClick={() => changeStatus(course.id, "approved")} className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve</span>
                  </button>

                  <button onClick={() => changeStatus(course.id, "rejected")} className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors">
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

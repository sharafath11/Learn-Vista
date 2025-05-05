"use client"
import { useMentorContext } from '@/src/context/mentorContext'
import { CheckCircle2, XCircle } from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { MentorAPIMethods } from '@/src/services/APImethods'
import { showSuccessToast } from '@/src/utils/Toast'

export default function CoursesPage() {
  const { courses, setCourses } = useMentorContext()

  const handleStatusChange = async (id: string, status: "approved" | "rejected" | "pending") => {
    const res = await MentorAPIMethods.courseStatusChange(id, status)
    if (res.ok) {
      showSuccessToast(`Course ${status}`)
      setCourses(prevCourses => prevCourses.map(course => 
        course.id === id ? { ...course, mentorStatus: status } : course
      ))
    }
  }

  const statusBadgeClasses = {
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  }

  const formatCourseDate = (date: string, time?: string) => {
    if (!date) return 'Not specified'
    return time 
      ? format(new Date(`${date}T${time}`), 'PPPp') 
      : format(new Date(date), 'PPP')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Course Approvals</h1>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {courses.length} {courses.length === 1 ? 'course' : 'courses'} pending
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No courses pending approval</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map(course => (
            <article key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
              <div className="relative aspect-video w-full">
                <Image 
                  src={course.thumbnail || "/placeholder.png"} 
                  alt={course.title} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="p-5 space-y-3">
                <header className="flex justify-between items-start gap-2">
                  <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {course.title}
                  </h2>
                  <span className={`${statusBadgeClasses[course.mentorStatus]} text-xs px-2.5 py-1 rounded-full whitespace-nowrap`}>
                    {course.mentorStatus.charAt(0).toUpperCase() + course.mentorStatus.slice(1)}
                  </span>
                </header>

                {course.categoryId?.title && (
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
                    {course.categoryId.title}
                  </span>
                )}

                <p className="text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-700">Sessions:</span>
                    <span className="text-gray-600">
                      {course.sessions?.join(', ') || 'None'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-700">Price:</span>
                    <span className="text-gray-600">
                      {course.price ? `₹${course.price}` : 'Free'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-700">Starts:</span>
                    <span className="text-gray-600">
                      {formatCourseDate(course.startDate||"", course.startTime)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-700">Ending:</span>
                    <span className="text-gray-600">
                      {formatCourseDate(course.endDate||"")}
                    </span>
                  </div>
                </div>

                {course.mentorStatus === "pending" && (
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleStatusChange(course.id, "approved")}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      <CheckCircle2 size={16} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleStatusChange(course.id, "rejected")}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-lg transition-colors"
                    >
                      <XCircle size={16} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
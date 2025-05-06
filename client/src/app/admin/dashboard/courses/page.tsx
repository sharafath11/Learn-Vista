"use client"
import Image from "next/image"
import { Search, Filter, Calendar, Clock, Tag, Globe, CheckCircle, XCircle, Hash } from "lucide-react"
import { useAdminContext } from "@/src/context/adminContext"
import { AdminAPIMethods } from "@/src/services/APImethods"
import { showSuccessToast } from "@/src/utils/Toast"
import Cheader from "./header"

export default function CoursesAdminPage() {
  const { courses, setCourses, cat } = useAdminContext()

  const toggleCourseStatus = async (id: string, status: boolean) => {
    const res = await AdminAPIMethods.blockCours(id, !status)
    if (res.ok) {
      showSuccessToast(res.msg)
      setCourses(courses.map(prev => prev._id === id ? { ...prev, isBlock: !status } : prev))
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Cheader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-lg border border-gray-300 bg-white p-2.5 pl-10 text-gray-900 focus:border-gray-500 focus:ring-gray-500"
              placeholder="Search courses..."
            />
          </div>
          <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course._id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow transition-all hover:shadow-md">
              <div className="relative h-48 w-full">
                <Image
                  src={course.thumbnail || "/placeholder.svg?height=192&width=384"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${course.isBlock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                      {course.isBlock ? "Blocked" : "Active"}
                    </span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {course.courseLanguage}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-1 text-lg font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                <p className="mb-3 text-sm text-gray-600 line-clamp-2">{course.description}</p>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDate(course.startDate || "")} - {formatDate(course.endDate || "")}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Starts at {course.startTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Globe className="mr-2 h-4 w-4" />
                    <span>{course.courseLanguage}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Tag className="mr-2 h-4 w-4" />
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(course.tags) && course.tags.map((tag, index) => (
                        <span key={index} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Hash className="mr-2 h-4 w-4" />
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                      {typeof course.categoryId !== 'string' ? course.categoryId.title || "No Category" : "No Category"}
                    </span>
                  </div>
                </div>

               
                {course.mentorStatus === "rejected" && (
                  <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
                    <strong>Rejection Reason:</strong>
                    <ul className="ml-4 list-disc mt-1">
                      {(Array.isArray(course.mentorId.courseRejectReson) && course.reson.length > 0
                        ? course.reson
                        : [{ message: "Insufficient experience" }, { message: "Profile incomplete" }]
                      ).map((r, i) => (
                        <li key={i}>{r.message}</li>
                      ))}
                    </ul>
                    <button
                      className="mt-3 inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                      onClick={() => {
                        // Placeholder logic
                        alert(`Redirect to change mentor for course: ${course.title}`)
                      }}
                    >
                      Change Mentor
                    </button>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="font-medium">
                    {course.price === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      <span>₹{(course.price ?? 0).toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleCourseStatus(course._id, course.isBlock)}
                    className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium ${
                      course.isBlock ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-red-50 text-red-700 hover:bg-red-100"
                    }`}
                  >
                    {course.isBlock ? (
                      <>
                        <CheckCircle className="mr-1 h-3.5 w-3.5" />
                        Unblock
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 h-3.5 w-3.5" />
                        Block
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

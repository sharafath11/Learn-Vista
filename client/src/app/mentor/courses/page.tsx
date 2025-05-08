"use client"
import { useMentorContext } from "@/src/context/mentorContext"
import { CheckCircle2, XCircle, Calendar, Tag, Layers, Clock } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { showSuccessToast } from "@/src/utils/Toast"
import { useState } from "react"

export default function CoursesPage() {
  const { courses, setCourses } = useMentorContext()

  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleStatusChange = async (id: string, status: "approved" | "rejected", reason?: string) => {
    // alert("f")
    const res = await MentorAPIMethods.courseStatusChange(id, status, reason as string);
   
    if (res.ok) {
      showSuccessToast(`Course ${status}`)
      console.log(courses)
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
         
          course._id === id ? { ...course, mentorStatus: status } : course
        )
      )
    }
  }

  const handleReasonSubmit = async () => {

    if (!selectedCourseId || !rejectionReason.trim()) {
      
      return 
    }
    await handleStatusChange(selectedCourseId, "rejected", rejectionReason)
    setShowReasonModal(false)
    setSelectedCourseId(null)
    setRejectionReason("")
  }

  const statusBadgeClasses = {
    approved: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
    rejected: "bg-gradient-to-r from-rose-600 to-pink-600 text-white",
    pending: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
  }

  const formatCourseDate = (date: string, time?: string) => {
    if (!date) return "Not specified"
    return time ? format(new Date(`${date}T${time}`), "PPPp") : format(new Date(date), "PPP")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-violet-600"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Course Approvals</h1>
          </div>
          <div className="text-sm font-medium text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-lg shadow-black/5">
            {courses.length} {courses.length === 1 ? "course" : "courses"} pending
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
              <Layers className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">No courses pending approval</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="group relative bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 hover:border-gray-600/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={course.thumbnail || "/placeholder.png"}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <span
                      className={`${statusBadgeClasses[course.mentorStatus]} text-xs font-medium px-3 py-1 rounded-full shadow-lg`}
                    >
                      {course.mentorStatus.charAt(0).toUpperCase() + course.mentorStatus.slice(1)}
                    </span>
                    {course.categoryId?.title && (
                      <span className="bg-white/10 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg">
                        {course.categoryId.title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-sm text-gray-300 line-clamp-3">{course.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/50">
                        <Layers className="w-4 h-4 text-purple-400" />
                      </div>
                      <span>{course.sessions?.join(", ") || "No sessions"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/50">
                        <Tag className="w-4 h-4 text-teal-400" />
                      </div>
                      <span>{course.price ? `₹${course.price}` : "Free"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/50">
                        <Calendar className="w-4 h-4 text-pink-400" />
                      </div>
                      <span className="truncate">{formatCourseDate(course.startDate || "").split(",")[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700/50">
                        <Clock className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="truncate">{formatCourseDate(course.endDate || "").split(",")[0]}</span>
                    </div>
                  </div>

                 
                  {course.mentorStatus === "pending" && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleStatusChange(course._id, "approved")}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-emerald-600/20"
                      >
                        <CheckCircle2 size={18} />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCourseId(course._id)
                          setShowReasonModal(true)
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg shadow-rose-600/20"
                      >
                        <XCircle size={18} />
                        <span>Reject</span>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {showReasonModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl w-full max-w-md border border-gray-700/50 animate-fadeIn">
              <div className="p-1">
                <div className="bg-gray-900/50 p-6 rounded-xl">
                  <h2 className="text-xl font-bold mb-4 text-white">Enter Rejection Reason</h2>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full bg-gray-800/70 border border-gray-700/50 rounded-xl p-4 mb-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder:text-gray-500 shadow-inner"
                    rows={4}
                    placeholder="Type reason..."
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowReasonModal(false)
                        setRejectionReason("")
                        setSelectedCourseId(null)
                      }}
                      className="px-5 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReasonSubmit}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-purple-600/20"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

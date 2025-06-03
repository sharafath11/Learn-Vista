"use client"

import { useMentorContext } from "@/src/context/mentorContext"
import { CheckCircle2, XCircle, Calendar, Tag, Layers, Clock, BookText } from "lucide-react" // Import BookText icon
import Image from "next/image"
import Link from "next/link" 
import { format } from "date-fns"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { showSuccessToast, showErrorToast } from "@/src/utils/Toast"
import { useState } from "react"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CoursesPage() {
  const { courses, setCourses } = useMentorContext()
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleStatusChange = async (id: string, status: "approved" | "rejected", reason?: string) => {
    const res = await MentorAPIMethods.courseStatusChange(id, status, reason as string)

    if (res.ok) {
      showSuccessToast(`Course ${status}`)
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === id ? { ...course, mentorStatus: status } : course
        )
      )
    } else {
      showErrorToast("Something went wrong with the status update")
    }
  }

  const handleReasonSubmit = async () => {
    if (!selectedCourseId || !rejectionReason.trim()) {
      showErrorToast("Rejection reason cannot be empty")
      return
    }
    await handleStatusChange(selectedCourseId, "rejected", rejectionReason)
    setShowReasonModal(false)
    setSelectedCourseId(null)
    setRejectionReason("")
  }

  const statusVariants: Record<string, string> = {
    approved: "bg-emerald-500 hover:bg-emerald-600",
    rejected: "bg-rose-500 hover:bg-rose-600",
    pending: "bg-amber-500 hover:bg-amber-600"
  }

  const formatCourseDate = (dateString: string) => {
    if (!dateString) return "Not specified"
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (error) {
      console.error("Error formatting date:", dateString, error)
      return "Invalid date"
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-purple-500 to-violet-600"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Course Approvals</h1>
          </div>
          <Badge variant="secondary" className="text-white bg-white/10 backdrop-blur-md">
            {courses.length} {courses.length === 1 ? "course" : "courses"} pending
          </Badge>
        </div>

        {courses.length === 0 ? (
          <Card className="text-center py-16 px-6 bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-16 h-16 bg-gray-800 mb-4">
                <AvatarFallback className="bg-gray-800">
                  <Layers className="w-8 h-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <p className="text-gray-400 text-lg">No courses pending approval</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="group relative bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:shadow-lg hover:border-gray-600 transition-all"
              >
                <CardHeader className="relative p-0 aspect-video">
                  <Image
                    src={course.thumbnail || "/placeholder.png"}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <Badge className={statusVariants[course.mentorStatus]}>
                      {course.mentorStatus.charAt(0).toUpperCase() + course.mentorStatus.slice(1)}
                    </Badge>
                    {course.categoryId?.title && (
                      <Badge variant="secondary" className="bg-white/10 backdrop-blur-md">
                        {course.categoryId.title}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {course.title}
                  </h2>

                  <p className="text-sm text-gray-300 line-clamp-3">{course.description}</p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Avatar className="w-8 h-8 bg-gray-700/50">
                        <AvatarFallback className="bg-transparent">
                          <Layers className="w-4 h-4 text-purple-400" />
                        </AvatarFallback>
                      </Avatar>
                      <span>{course.sessions.length|| "No sessions"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <Avatar className="w-8 h-8 bg-gray-700/50">
                        <AvatarFallback className="bg-transparent">
                          <Tag className="w-4 h-4 text-teal-400" />
                        </AvatarFallback>
                      </Avatar>
                      <span>{course.price ? `₹${course.price}` : "Free"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <Avatar className="w-8 h-8 bg-gray-700/50">
                        <AvatarFallback className="bg-transparent">
                          <Calendar className="w-4 h-4 text-pink-400" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{formatCourseDate(course.startDate)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300">
                      <Avatar className="w-8 h-8 bg-gray-700/50">
                        <AvatarFallback className="bg-transparent">
                          <Clock className="w-4 h-4 text-yellow-400" />
                        </AvatarFallback>
                      </Avatar>
                      <span><strong>Time :</strong>{course?.startTime || "N/A"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-300 col-span-2">
                      <Avatar className="w-8 h-8 bg-gray-700/50">
                        <AvatarFallback className="bg-transparent">
                          <Clock className="w-4 h-4 text-amber-400" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{formatCourseDate(course.endDate)}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 pt-2">
                  {course.mentorStatus === "pending" && (
                    <div className="flex gap-3 w-full">
                      <Button
                        onClick={() => handleStatusChange(course._id, "approved")}
                        className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-500"
                      >
                        <CheckCircle2 size={18} />
                        <span>Approve</span>
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedCourseId(course._id)
                          setShowReasonModal(true)
                        }}
                        className="flex-1 gap-2"
                      >
                        <XCircle size={18} />
                        <span>Reject</span>
                      </Button>
                    </div>
                  )}
                 {course.mentorStatus === "approved" && (
  <>
    <Link href={`/mentor/courses/${course._id}`} className="w-full">
      <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-500">
        <BookText size={18} />
        <span>Go to Lessons</span>
      </Button>
    </Link>
    <Link href={`/mentor/courses/students/${course._id}`} className="w-full">
      <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-500">
        <BookText size={18} />
        <span>Go to Students</span>
      </Button>
    </Link>
  </>
)}

                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showReasonModal} onOpenChange={setShowReasonModal}>
          <DialogContent className="bg-gray-800 border-gray-700 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white">Enter Rejection Reason</DialogTitle>
            </DialogHeader>
            <Separator className="bg-gray-700" />
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="bg-gray-700/50 border-gray-600 text-gray-200 placeholder:text-gray-500"
              rows={4}
              placeholder="Type reason..."
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReasonModal(false)
                  setRejectionReason("")
                  setSelectedCourseId(null)
                }}
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReasonSubmit}
                className="bg-purple-600 hover:bg-purple-500"
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
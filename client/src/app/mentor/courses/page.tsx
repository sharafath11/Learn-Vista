"use client"

import { useMentorContext } from "@/src/context/mentorContext"
import {
  CheckCircle2,
  XCircle,
  Calendar,
  Tag,
  Layers,
  Clock,
  BookText
} from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function CoursesPage() {
  const { courses, setCourses } = useMentorContext()
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const handleStatusChange = async (id: string, status: "approved" | "rejected", reason?: string) => {
    const res = await MentorAPIMethods.courseStatusChange(id, status, reason || "")
    if (res.ok) {
      showSuccessToast(`Course ${status}`)
      setCourses((prev) =>
        prev.map((course) => course._id === id ? { ...course, mentorStatus: status } : course)
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
    } catch {
      return "Invalid date"
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-6">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Course Approvals</h1>
          <Badge variant="secondary" className="bg-white/10 text-white backdrop-blur-md">
            {courses.length} {courses.length === 1 ? "Course" : "Courses"} Pending
          </Badge>
        </div>

        {courses.length === 0 ? (
          <Card className="text-center py-16 px-6 bg-gray-800/50 border-gray-700">
            <CardContent className="flex flex-col items-center">
              <Avatar className="w-16 h-16 bg-gray-800 mb-4">
                <AvatarFallback>
                  <Layers className="w-8 h-8 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <p className="text-gray-400 text-lg">No courses pending approval</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course._id} className="group relative bg-gray-800/40 border border-gray-700 hover:shadow-xl">
                <CardHeader className="relative p-0 aspect-video overflow-hidden rounded-t-lg">
                  <Image
                    src={course.thumbnail || "/placeholder.png"}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center">
                    <Badge className={statusVariants[course.mentorStatus]}>                      
                      {course.mentorStatus.charAt(0).toUpperCase() + course.mentorStatus.slice(1)}
                    </Badge>
                    {course.categoryId?.title && (
                      <Badge variant="secondary" className="bg-white backdrop-blur-md">
                        {course.categoryId.title}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-3">
                  <h2 className="text-xl font-semibold text-white line-clamp-2">{course.title}</h2>

                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span>{course.sessions.length || "No sessions"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-teal-400" />
                      <span>{course.price ? `₹${course.price}` : "Free"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-pink-400" />
                      <span>{formatCourseDate(course.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <span>{course?.startTime || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>{formatCourseDate(course.endDate)}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3 p-5 pt-0">
                  {course.mentorStatus === "pending" && (
                    <div className="flex gap-3 w-full">
                      <Button
                        onClick={() => handleStatusChange(course._id, "approved")}
                        className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-500"
                      >
                        <CheckCircle2 size={18} /> Approve
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1 gap-2"
                        onClick={() => {
                          setSelectedCourseId(course._id)
                          setShowReasonModal(true)
                        }}
                      >
                        <XCircle size={18} /> Reject
                      </Button>
                    </div>
                  )}

                  {course.mentorStatus === "approved" && (
                    <>
                      <Link href={`/mentor/courses/${course._id}`} className="w-full">
                        <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-500">
                          <BookText size={18} /> Go to Lessons
                        </Button>
                      </Link>
                      <Link href={`/mentor/courses/students/${course._id}`} className="w-full">
                        <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-500">
                          <BookText size={18} /> Go to Students
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
          <DialogContent className="bg-gray-800 border border-gray-700">
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
              <Button onClick={handleReasonSubmit} className="bg-purple-600 hover:bg-purple-500">
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
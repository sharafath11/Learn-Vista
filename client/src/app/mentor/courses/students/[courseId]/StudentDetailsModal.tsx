"use client"

import { IUser } from "@/src/types/userTypes"
import { format } from "date-fns"
import { Mail, CalendarDays, BookMarked, Lock, CheckCircle2, XCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMentorContext } from "@/src/context/mentorContext"

interface StudentDetailsModalProps {
  student: IUser
  isOpen: boolean
  onClose: () => void
}

export default function StudentDetailsModal({ student, isOpen, onClose }: StudentDetailsModalProps) {
  const { courses } = useMentorContext();

  // Combine enrolledCourses with full course details and enrollment status
  const userCourses = student.enrolledCourses?.map((enrolledCourse) => {
    // Find course detail by courseId
    const courseDetail = courses.find(c => c._id === enrolledCourse.courseId);
    if (!courseDetail) return null;

    return {
      ...courseDetail,
      allowed: enrolledCourse.allowed,
    };
  }).filter(Boolean); // remove nulls if any

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary">
                <AvatarImage src={student.profilePicture || undefined} />
                <AvatarFallback>{student.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{student.username}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {student.isVerified ? (
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-red-500 text-red-500">
                      <XCircle className="h-3 w-3 mr-1" /> Unverified
                    </Badge>
                  )}
                  {student.isBlocked && (
                    <Badge variant="outline" className="border-red-500 text-red-500">
                      <Lock className="h-3 w-3 mr-1" /> Blocked
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-muted-foreground h-5 w-5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
              </div>

              {student.createdAt && (
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-muted-foreground h-5 w-5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined At</p>
                    <p className="font-medium">
                      {format(new Date(student.createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {userCourses && userCourses.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <BookMarked className="text-muted-foreground h-5 w-5" />
                    <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  </div>
                  <div className="space-y-2">
                    {userCourses.map((course) => (
                      <div key={course?._id} className="flex justify-between items-center bg-muted/50 p-2 rounded">
                        <span className="font-medium">{course?.title}</span>
                        <Badge variant={course?.allowed ? "default" : "destructive"}>
                          {course?.allowed ? "Allowed" : "Blocked"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

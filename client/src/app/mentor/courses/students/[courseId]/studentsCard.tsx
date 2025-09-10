"use client"

import { Calendar, Mail, User, Eye, Shield, ShieldOff } from "lucide-react"
import { Button } from "@/src/components/shared/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/shared/components/ui/card"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { IMentorStudentCardProps } from "@/src/types/mentorProps"



export default function StudentCard({ student, onView, onToggleBlock, courseId }: IMentorStudentCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const isBlocked = student.enrolledCourses?.some(
    (i) => i.courseId === courseId && !i.allowed
  ) ?? false

  const handleToggleBlock = () => {
    onToggleBlock(student.id, !isBlocked)
  }

  const handleViewProfile = () => {
    onView(student.id)
  }

  return (
    <Card className="w-full max-w-sm bg-gray-900 border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <h3 className="font-semibold text-lg leading-none text-white">{student.username}</h3>
          </div>
          <Badge
            variant={isBlocked ? "destructive" : "secondary"}
            className={`text-xs ${
              isBlocked
                ? "bg-red-900 text-red-200 hover:bg-red-800"
                : "bg-green-900 text-green-200 hover:bg-green-800"
            }`}
          >
            {isBlocked ? "Blocked" : "Allowed"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="truncate">{student.email}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Calendar className="h-4 w-4 text-gray-400" />
         <span>Enrolled {formatDate(student.createdAt as string)}</span>
        </div>
      </CardContent>

      <CardFooter className="flex space-x-2 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewProfile}
          className="flex-1 border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-600"
        >
          <Eye className="h-4 w-4 mr-1" />
          View Profile
        </Button>

        <Button
          variant={isBlocked ? "default" : "destructive"}
          size="sm"
          onClick={handleToggleBlock}
          className={`flex-1 ${
            isBlocked ? "bg-green-700 hover:bg-green-600 text-white" : "bg-red-700 hover:bg-red-600 text-white"
          }`}
        >
          {isBlocked ? (
            <>
              <Shield className="h-4 w-4 mr-1" />
              Unblock
            </>
          ) : (
            <>
              <ShieldOff className="h-4 w-4 mr-1" />
              Block
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"
import { ICourse } from "@/src/types/courseTypes"
import { IComment, IMentorComments } from "@/src/types/lessons"
import { User, Clock, BookOpen } from "lucide-react"

interface CommentCardProps {
  comment: IMentorComments
  course?: string 
  lessonTitle: string
  formatDate: (date: Date | undefined) => string
}

export default function CommentCard({ comment, course, lessonTitle, formatDate }: CommentCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="h-6 w-6 text-white" />
          </div>

          {/* User Info */}
          <div>
            <h3 className="font-semibold text-white text-lg">{comment.userName}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-slate-400">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDate(comment.createdAt || "")}
              </span>
              {course && (
                <span className="flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {course}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Course Badge */}
        {course && (
          <div className="flex flex-col items-end gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {course}
            </span>
            <span className="text-xs text-slate-500">{lessonTitle}</span>
          </div>
        )}
      </div>

      {/* Comment Content */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10 mb-4">
        <p className="text-slate-200 leading-relaxed">{comment.comment}</p>
      </div>

      {/* Footer - Simplified */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center gap-4 text-sm text-slate-400">
          <span>Lesson: {lessonTitle}</span>
          
        </div>
        {/* Removed Reply and Flag buttons */}
      </div>
    </div>
  )
}

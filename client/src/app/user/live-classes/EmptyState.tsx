"use client"

import { BookOpen } from "lucide-react"
import { Card } from "@/src/components/shared/components/ui/card"
import { Button } from "@/src/components/shared/components/ui/button"
import { IEmptyStateProps } from "@/src/types/userProps"

export const EmptyState = ({ filter, onExplore }: IEmptyStateProps) => {
  return (
    <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-gray-50 to-white border-0 shadow-lg">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          {filter === "expired" ? "No expired sessions" : "No active sessions"}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base mb-6">
          {filter === "expired"
            ? "All your sessions are still active"
            : "Enroll in courses to see your active sessions"}
        </p>
        {filter === "active" && (
          <Button
            onClick={onExplore}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-200"
          >
            Explore Courses
          </Button>
        )}
      </div>
    </Card>
  )
}

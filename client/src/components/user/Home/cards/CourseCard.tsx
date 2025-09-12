"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, ChevronRight } from "lucide-react"
import { ICourseCardProps } from "@/src/types/userProps"
import Image from "next/image"
import { WithTooltip } from "@/src/hooks/UseTooltipProps" // ✅ tooltip wrapper

export default function CourseCard({ course }: ICourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow group flex flex-col h-full"
    >
      <Link href={`/user/sessions/${course.id || course.id}`} className="block h-full">
        <div className="flex flex-col items-center text-center h-full">
          {/* Thumbnail / Icon */}
          <WithTooltip content={course.title}>
            <div className="p-4 bg-blue-900 rounded-full group-hover:bg-blue-700 transition-colors">
              {course.thumbnail ? (
                <Image
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="h-12 w-12 object-cover rounded-full"
                  width={48}
                  height={48}
                />
              ) : (
                <BookOpen className="h-8 w-8 text-blue-400" />
              )}
            </div>
          </WithTooltip>

          {/* Title */}
          <WithTooltip content={course.title}>
            <h3 className="mt-4 sm:mt-6 text-lg sm:text-xl font-semibold text-white line-clamp-2">
              {course.title}
            </h3>
          </WithTooltip>

          {/* Description */}
          <WithTooltip content={course.description || "No description available."}>
            <p className="mt-1 text-sm sm:text-base text-gray-300 flex-grow line-clamp-3">
              {course.description || "No description available."}
            </p>
          </WithTooltip>

          {/* CTA Button */}
          <WithTooltip content={`View full course: ${course.title}`}>
            <button
              className="mt-4 sm:mt-6 text-blue-400 font-medium hover:text-blue-300 flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`View ${course.title}`}
            >
              View Course
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </WithTooltip>
        </div>
      </Link>
    </motion.div>
  )
}

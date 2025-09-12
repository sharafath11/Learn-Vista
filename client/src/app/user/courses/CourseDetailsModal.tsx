"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, Users, BookOpen, CheckCircle, Calendar, Tag, Languages } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { format } from "date-fns"
import { IUserCourseDetailsModalProps } from "@/src/types/userProps"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"

const CourseDetailsModal = ({ course, isOpen, onClose }: IUserCourseDetailsModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <WithTooltip content="Close details">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-100 transition-colors cursor-help"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </WithTooltip>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <WithTooltip content="Course category">
                      <Badge variant="secondary" className="cursor-help">
                        {course.categoryName || "General"}
                      </Badge>
                    </WithTooltip>
                    {course.tags?.map((tag, index) => (
                      <WithTooltip key={index} content="Course tag">
                        <Badge variant="outline" className="cursor-help">
                          {tag}
                        </Badge>
                      </WithTooltip>
                    ))}
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-6">{course.description}</p>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <WithTooltip content="Number of students enrolled">
                      <div className="flex items-center text-sm cursor-help">
                        <Users size={16} className="mr-1" />
                        {course.students || 0} students
                      </div>
                    </WithTooltip>

                    {course.courseLanguage && (
                      <WithTooltip content="Course language">
                        <div className="flex items-center text-sm cursor-help">
                          <Languages size={16} className="mr-1" />
                          {course.courseLanguage}
                        </div>
                      </WithTooltip>
                    )}

                    {course.startDate && (
                      <WithTooltip content="Course duration">
                        <div className="flex items-center text-sm cursor-help">
                          <Calendar size={16} className="mr-1" />
                          {format(new Date(course.startDate), "MMM d, yyyy")}
                          {course.endDate && ` - ${format(new Date(course.endDate), "MMM d, yyyy")}`}
                        </div>
                      </WithTooltip>
                    )}

                    {course.startTime && (
                      <WithTooltip content="Course start time">
                        <div className="flex items-center text-sm cursor-help">
                          <Clock size={16} className="mr-1" />
                          {course.startTime}
                        </div>
                      </WithTooltip>
                    )}
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Course Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <WithTooltip content="Number of sessions in this course">
                        <div className="flex items-start cursor-help">
                          <BookOpen className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Sessions</h4>
                            <p className="text-sm text-gray-600">{course.sessions || 0} sessions</p>
                          </div>
                        </div>
                      </WithTooltip>

                      <WithTooltip content="Primary course category">
                        <div className="flex items-start cursor-help">
                          <Tag className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Category</h4>
                            <p className="text-sm text-gray-600">
                              {typeof course.categoryName === "object"
                                ? course.categoryName || "Not specified"
                                : course.categoryName || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </WithTooltip>

                      <WithTooltip content="Course live start date">
                        <div className="flex items-start cursor-help">
                          <Calendar className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Live starting Date</h4>
                            <p className="text-sm text-gray-600">
                              {format(new Date(course.startDate), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                      </WithTooltip>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Mentor Information</h3>
                    <WithTooltip content="Course mentor details">
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg cursor-help">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <div className="w-8 h-8 overflow-hidden shadow-md">
                            <Image
                              src={course.mentorPhoto}
                              alt="Mentor photo"
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{course.Mentorusername || "Mentor"}</h4>
                          <p className="text-sm text-gray-600">{course.mentorEmail || "No contact information"}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Expertise: <span className="capitalize">{course.mentorExpertise}</span>
                          </p>
                        </div>
                      </div>
                    </WithTooltip>
                  </div>
                </div>

                <div className="w-full md:w-80">
                  <div className="sticky top-6 space-y-6">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                      <Image
                        src={course?.thumbnail || "/images/course-placeholder.jpg"}
                        alt={course?.title || "Course thumbnail"}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>

                    <div className="space-y-4">
                      <div className="text-sm text-gray-600 space-y-2">
                        <WithTooltip content="Unlimited access after enrollment">
                          <div className="flex items-center cursor-help">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            <span>Full lifetime access</span>
                          </div>
                        </WithTooltip>

                        <WithTooltip content="Covers both practical and theory">
                          <div className="flex items-center cursor-help">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            <span>Practical and theory questions</span>
                          </div>
                        </WithTooltip>

                        <WithTooltip content="Suitable for beginners">
                          <div className="flex items-center cursor-help">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                            <span>Beginner friendly</span>
                          </div>
                        </WithTooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CourseDetailsModal

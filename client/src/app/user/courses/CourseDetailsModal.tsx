"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X,Clock, Users, BookOpen, CheckCircle, Calendar, Tag, Languages } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { IcourseFromResponse} from "@/src/types/courseTypes"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

interface CourseDetailsModalProps {
  course: IcourseFromResponse
  isOpen: boolean
  onClose: () => void
  onEnroll: () => void
  isEnrolled?: boolean
}

const CourseDetailsModal = ({
  course,
  isOpen,
  onClose,
}: CourseDetailsModalProps) => {
   
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
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">
                      {course.categoryName || "General"}
                    </Badge>
                    {course.tags?.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-6">{course.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    
                    
                    <div className="flex items-center text-sm">
                      <Users size={16} className="mr-1" />
                      {course.students|| 0} students
                    </div>
                    
                    {course.courseLanguage && (
                      <div className="flex items-center text-sm">
                        <Languages size={16} className="mr-1" />
                        {course.courseLanguage}
                      </div>
                    )}
                    
                    {course.startDate && (
                      <div className="flex items-center text-sm">
                        <Calendar size={16} className="mr-1" />
                        {format(new Date(course.startDate), 'MMM d, yyyy')}
                        {course.endDate && ` - ${format(new Date(course.endDate), 'MMM d, yyyy')}`}
                      </div>
                    )}
                    
                    {course.startTime && (
                      <div className="flex items-center text-sm">
                        <Clock size={16} className="mr-1" />
                        {course.startTime}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Course Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <BookOpen className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Sessions</h4>
                          <p className="text-sm text-gray-600">{course.sessions || 0} sessions</p>
                        </div>
                      </div>
                      
                      
                      
                      <div className="flex items-start">
                        <Tag className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Category</h4>
                          <p className="text-sm text-gray-600">{course.categoryName|| "Not specified"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium">Live starting Date</h4>
                          <p className="text-sm text-gray-600">
                            {format(new Date(course.startDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Master the fundamentals of the subject",
                        "Build practical projects for your portfolio",
                        "Learn industry best practices",
                        "Gain confidence in your skills"
                      ].map((item, i) => (
                        <div key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div> */}
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Mentor Information</h3>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-8 h-8 overflow-hidden shadow-md">
  <Image
    src={course.mentorPhoto}
    alt=""
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
                          Experties: <span className="capitalize">{course.mentorExpertise}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-80">
                  <div className="sticky top-6 space-y-6">
                    <div className="relative h-48 w-full rounded-lg overflow-hidden">
                      <Image
                        src={course.thumbnail || "/images/course-placeholder.jpg"}
                        alt={course.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {/* <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute bottom-4 left-4 bg-white text-gray-900 hover:bg-white/90"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Preview
                      </Button> */}
                    </div>
                    
                    <div className="space-y-4">
                      
                      
                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Full lifetime access</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Pratical and thory qustions</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          <span>Beginner friendly</span>
                        </div>
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
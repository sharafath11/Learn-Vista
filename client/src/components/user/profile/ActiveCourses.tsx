import Image from "next/image"
import Link from "next/link"
import { Clock, BookOpen, ChevronRight } from "lucide-react"

const courses = [
  {
    title: "Advanced React Patterns",
    instructor: "Alex Morgan",
    category: "Frontend",
    duration: "8 hours",
    lessons: 24,
    progress: 75,
    image: "/placeholder.svg?height=200&width=400",
  },
  // ... other courses
]

export default function ActiveCourses() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Active Courses</h2>
        <Link href="#" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center">
          View all <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        {courses.map((course, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
            <div className="relative h-40">
              <Image
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                width={400}
                height={200}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 text-xs font-medium shadow-sm">
                {course.category}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <h3 className="text-white font-medium">{course.title}</h3>
                <p className="text-xs text-white/90">{course.instructor}</p>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{course.progress}% Complete</span>
                  <span className="text-gray-500">
                    {Math.round((course.lessons * course.progress) / 100)}/{course.lessons} lessons
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
              <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
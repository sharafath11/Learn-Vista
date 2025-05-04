"use client"

import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function CoursesPage() {

  const courses = [
    {
      id: '1',
      title: 'Introduction to React Hooks',
      description: 'Learn how to use React Hooks to simplify your functional components and manage state effectively.',
      category: 'Web Development',
      level: 'Beginner',
      thumbnail: '/images/course1.jpg',
      status: 'pending',
      student: {
        id: '101',
        name: 'Alex Johnson',
        avatar: '/images/avatar1.jpg'
      }
    },
    {
      id: '2',
      title: 'Advanced Python Programming',
      description: 'Master advanced Python concepts including decorators, generators, and async programming.',
      category: 'Programming',
      level: 'Advanced',
      thumbnail: '/images/course2.jpg',
      status: 'pending',
      student: {
        id: '102',
        name: 'Sarah Williams',
        avatar: '/images/avatar2.jpg'
      }
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the core principles of user interface and user experience design with practical examples.',
      category: 'Design',
      level: 'Intermediate',
      thumbnail: '/images/course3.jpg',
      status: 'pending',
      student: {
        id: '103',
        name: 'Michael Chen',
        avatar: '/images/avatar3.jpg'
      }
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Approved</span>
      case 'rejected':
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Rejected</span>
      default:
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Course Approvals</h1>
        <div className="text-sm text-gray-500">
          {courses.length} {courses.length === 1 ? 'course' : 'courses'} pending approval
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{course.title}</h3>
                {getStatusBadge(course.status)}
              </div>
              
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{course.category}</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{course.level}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
              
              <div className="flex items-center mb-4">
                <div className="relative h-8 w-8 mr-2">
                  <Image
                    src={course.student.avatar}
                    alt={course.student.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="text-sm text-gray-700">{course.student.name}</span>
              </div>

              <div className="flex space-x-2">
                <button
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Approve</span>
                </button>
                
                <button
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { IPopulatedCourse } from '@/src/types/courseTypes'

interface CoursesContentProps {
  courses: IPopulatedCourse[]
}

const ITEMS_PER_PAGE = 4

const CoursesContent: React.FC<CoursesContentProps> = ({ courses }) => {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE)
  const paginatedCourses = courses.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const handlePrev = () => {
    setPage((p) => (p > 1 ? p - 1 : p))
  }
  const handleNext = () => {
    setPage((p) => (p < totalPages ? p + 1 : p))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Courses</h2>
      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses available.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCourses.map((course) => (
              <Card
                key={course._id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>
                    Mentor: {typeof course.mentorId === 'object' ? course.mentorId.username : 'N/A'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt="thumbnail"
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                  )}
                  <p>{course.description || 'No description provided.'}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Language: {course.courseLanguage || 'N/A'} <br />
                    Category: {typeof course.categoryId === 'object' ? course.categoryId.title : course.categoryName || 'N/A'} <br />
                    Start Date: {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'N/A'} <br />
                    End Date: {course.endDate ? new Date(course.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="font-semibold">
                    {course.price && course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                  </span>
                  {/* You can customize this star display if you add ratings */}
                  <span className="text-yellow-500">★ ★ ★ ★ ☆</span>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CoursesContent

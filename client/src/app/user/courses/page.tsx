// Your existing Page.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Users, Award, BookOpen, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card" 
import CourseFilter from "./filtringAndSearch"
import CourseDetailsModal from "./CourseDetailsModal"
import type { IPopulatedCourse } from "@/src/types/courseTypes"
import { useUserContext } from "@/src/context/userAuthContext"
import { UserAPIMethods } from "@/src/services/APImethods"
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import type { ICategory } from "@/src/types/categoryTypes"
import CourseCard from "./CourseCard"
const Page = () => {
  const { user, setUser, progresses } = useUserContext() 
  const [courses, setCourses] = useState<IPopulatedCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "newest",
  })
  const [selectedCourse, setSelectedCourse] = useState<IPopulatedCourse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categories, setCategories] = useState<ICategory[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const res = await UserAPIMethods.getCategories()
    res.ok ? setCategories(res.data) : showErrorToast(res.msg)
  }

  const fetchCourses = async () => {
    setLoading(true)
    let mongoSort: Record<string, 1 | -1> = { createdAt: -1 }
    if (filters.sort === "ASC") {
      mongoSort = { createdAt: -1 }
    } else if (filters.sort === "DESC") {
      mongoSort = { createdAt: 1 }
    }

    const res = await UserAPIMethods.fetchAllCourse({
      page,
      limit: 3,
      search: filters.search || "",
      filters: {
        categoryId: filters.category === "All" ? "" : filters.category,
      },
      sort: mongoSort,
    })

    if (res.ok) {
      const { data: newCourses, total, totalPages } = res.data
      setCourses(newCourses.filter((i: IPopulatedCourse) => !i.isBlock))
      setTotalPages(totalPages)
    } else {
      console.error(res.msg)
      setCourses([])
      setTotalPages(0)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()
  }, [page, filters])

  const handleDetailsClick = (course: IPopulatedCourse) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  const handleFilterChange = (newFilters: { search: string; category: string; sort: string }) => {
    setPage(1)
    setFilters(newFilters)
  }
 
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="relative">
              <Sparkles className="w-8 h-8 text-amber-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
            </div>
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm rounded-full border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 font-semibold shadow-sm"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Top-Rated & Trending Courses
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-6 leading-tight"
          >
            Unlock Your Potential with
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Expert-Led Courses
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Explore a curated selection of premium courses designed to empower your learning journey, advance your
            career, and transform your future with industry-leading expertise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Our Courses
            </Button>
            <div className="flex items-center gap-6 text-sm text-gray-600">
            
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-medium">10k+ Students</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter Section */}
       <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-12"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <CourseFilter categories={categories} onFilter={handleFilterChange} />
      </div>
    </motion.div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
         {courses.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {courses.map((course, index) => (
      <CourseCard
        key={course._id}
        course={course}
        index={index}
        onDetailsClick={handleDetailsClick}
      />
    ))}
  </div>
) : (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="col-span-full text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
  >
    <div className="max-w-md mx-auto">
      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
        <BookOpen className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">No Courses Found</h3>
      <p className="text-gray-600 text-lg leading-relaxed">
        Your search or filter criteria didn't match any courses.
        <br />
        Try broadening your search or selecting a different category.
      </p>
      <Button
        variant="outline"
        className="mt-6 px-6 py-2 rounded-xl border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
        onClick={() => setFilters({ search: "", category: "", sort: "newest" })}
      >
        Clear Filters
      </Button>
    </div>
  </motion.div>
)}

        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center items-center gap-6 mt-16"
        >
          <Button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || loading}
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg font-semibold border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>

          <div className="flex items-center gap-2 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
            <span className="text-lg font-medium text-gray-700">
              Page {page} of {totalPages === 0 ? 1 : totalPages}
            </span>
          </div>

          <Button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages || loading || totalPages === 0}
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg font-semibold border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </motion.div>

        {/* Course Details Modal */}
        {selectedCourse && (
          <CourseDetailsModal
            course={selectedCourse}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onEnroll={async () => {
              const res = await UserAPIMethods.updateCourse(selectedCourse._id)
              if (res.ok) {
                showSuccessToast(res.msg)
                setUser((prev) => {
                  if (!prev) return prev
                  return {
                    ...prev,
                    enrolledCourses: [...(prev.enrolledCourses || []), { courseId: selectedCourse._id, allowed: true }],
                  }
                })
              } else {
                showErrorToast(res.msg || "Failed to enroll in course.")
              }
            }}
            isEnrolled={user?.enrolledCourses?.some((enrolledCourse) => enrolledCourse.courseId === selectedCourse._id)}
          />
        )}
      </div>
    </section>
  )
}

export default Page
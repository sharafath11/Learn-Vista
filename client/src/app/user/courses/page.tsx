"use client"

import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Sparkles, Users, Star, Clock } from "lucide-react"
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import CourseFilter from "./filtringAndSearch"
import CourseDetailsModal from "./CourseDetailsModal"
import { IPopulatedCourse } from "@/src/types/courseTypes"
import { useUserContext } from "@/src/context/userAuthContext"
import { UserAPIMethods } from "@/src/services/APImethods"
import { showSuccessToast, showErrorToast } from "@/src/utils/Toast"
import { useRouter } from "next/navigation"


const Page = () => {
  const route = useRouter()
  const [courses, setCourses] = useState<IPopulatedCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'newest'
  })
  const [selectedCourse, setSelectedCourse] = useState<IPopulatedCourse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user, setUser, fetchLessons } = useUserContext();
 
  const handleStartNewCourse = async (id: string) => {
   
    const res = await UserAPIMethods.updateCourse(id);

    if (res.ok) {
      showSuccessToast(res.msg);

      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          enrolledCourses: [...(prev.enrolledCourses || []), { courseId: id, allowed: true }], 
        };
      });

      // route.push(`/user/sessions/${id}`);
    } else {
      showErrorToast(res.msg || "Failed to enroll in course.");
    }
  };

  const fetchCourses = async () => {
    setLoading(true);

    let mongoSort: Record<string, 1 | -1> = { createdAt: -1 }
    if (filters.sort === "newest") {
      mongoSort = { createdAt: -1 };
    } else if (filters.sort === "oldest") {
      mongoSort = { createdAt: 1 };
    }

    const res = await UserAPIMethods.fetchAllCourse({
      page,
      limit: 1,
      search: filters.search || '',
      filters: {
        category: filters.category === 'All' ? '' : filters.category,
      },
      sort: mongoSort,
    });

    if (res.ok) {
      const { data: newCourses, total, totalPages } = res.data;
      setCourses(newCourses);
      setTotalPages(totalPages);
    } else {
      console.error(res.msg);
      setCourses([]);
      setTotalPages(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [page, filters]);

  const handleDetailsClick = (course: IPopulatedCourse) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleFilterChange = (newFilters: { search: string; category: string; sort: string }) => {
    setPage(1);
    setFilters(newFilters);
  };

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    courses.forEach(c => {
      if (c.categoryId?.title) {
        categories.add(c.categoryId.title);
      }
    });
    return Array.from(categories);
  }, [courses]);
console.log("courseId",user?.enrolledCourses)
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <Badge variant="outline" className="px-3 py-1 text-sm rounded-full border-yellow-300 bg-yellow-100 text-yellow-700 font-medium">
              Top-Rated & Trending
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight"
          >
            Unlock Your Potential with Expert-Led Courses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Explore a curated selection of courses designed to empower your learning journey and advance your career.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10"
          >
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Our Courses
            </Button>
          </motion.div>
        </div>

        <div className="mb-12 w-100">
          <CourseFilter
            categories={availableCategories}
            onFilter={handleFilterChange}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {loading && courses.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">Loading courses...</p>
            </div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="h-full flex flex-col overflow-hidden rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-1">
                  <div className="relative h-52 w-full cursor-pointer group" onClick={() => handleDetailsClick(course)}>
                    <Image
                      src={course.thumbnail || "/images/course-placeholder.jpg"}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
                      priority
                    />
                    <Badge className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      {course.categoryId?.title || "General"}
                    </Badge>
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-0 transition-all duration-300 flex items-center justify-center">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-lg font-semibold"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  <CardHeader className="flex-grow pb-3">
                    <CardTitle className="text-xl font-bold line-clamp-2 text-gray-900 mb-2">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-gray-600 font-medium">
                      <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                        {course.mentorId?.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                      By {course.mentorId?.username || "Unknown Instructor"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="py-2">
                    <div className="flex items-center justify-between mb-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="font-medium">{course.enrolledUsers?.length || 0} Enrolled</span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{course.sessions?.length || 0} Lessons</span>
                      <span className="mx-2 text-gray-400">•</span>
                      <span>Total Duration: 10h 30m</span>
                    </div>

                    <Progress
                      value={(course.sessions?.length || 0) * 10}
                      className="h-2 bg-blue-100 [&>*]:bg-blue-500"
                    />
                  </CardContent>

                  <CardFooter className="flex justify-between items-center border-t border-gray-100 pt-4 px-6 pb-6 mt-auto">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-2xl text-green-700">
                        {course.price === 0 ? "Free" : `₹${course.price}`}
                      </span>
                      {course.price !== 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{Math.round((course.price || 0) * 1.5)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {(() => {
                        const isEnrolled = user?.enrolledCourses?.some((enrolledCourse) => enrolledCourse.courseId ==course._id);
                        console.log(course._id,"assvv")
                        return isEnrolled ? (
                          <Button
                            size="lg"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
                            onClick={() => route.push(`/user/sessions/${course._id}`)}
                          >
                            Continue Learning
                          </Button>
                        ) : (
                          <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                            onClick={() => handleStartNewCourse(course._id)}
                          >
                            Enroll Now
                          </Button>
                        );
                      })()}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-lg shadow-inner">
              <Image
                src="/images/no-results.svg"
                alt="No courses found"
                width={300}
                height={200}
                className="mx-auto mb-6 opacity-80"
              />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Courses Found</h3>
              <p className="text-gray-500 text-lg">
                Your search or filter criteria didn't match any courses.
                <br />Try broadening your search or selecting a different category.
              </p>
            </div>
          )}
        </motion.div>

        <div className="flex justify-center items-center gap-4 mt-16">
          <Button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1 || loading}
            variant="outline"
            className="px-6 py-3 text-lg font-semibold border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all rounded-full shadow-sm"
          >
            Previous
          </Button>
          <span className="text-lg font-medium text-gray-700">Page {page} of {totalPages === 0 ? 1 : totalPages}</span>
          <Button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages || loading || totalPages === 0}
            variant="outline"
            className="px-6 py-3 text-lg font-semibold border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all rounded-full shadow-sm"
          >
            Next
          </Button>
        </div>

        {selectedCourse && (
          <CourseDetailsModal
            course={selectedCourse}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onEnroll={() => handleStartNewCourse(selectedCourse._id)}
            isEnrolled={user?.enrolledCourses?.some((enrolledCourse) => enrolledCourse.courseId === selectedCourse._id)}
          />
        )}
      </div>
    </section>
  )
}

export default Page
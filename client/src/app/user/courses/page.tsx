"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, Users } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { Skeleton } from "@/components/ui/skeleton"
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
import { showSuccessToast } from "@/src/utils/Toast"
import { useRouter } from "next/navigation"

const Page = () => {
  const route=useRouter()
  const [courses, setCourses] = useState<IPopulatedCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState({ 
    search: '', 
    category: '', 
    sort: 'latest' 
  })
  const [selectedCourse, setSelectedCourse] = useState<IPopulatedCourse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [ref, inView] = useInView()
  const { allCourses, user, setUser } = useUserContext();
  console.log(user)
  const handleStartNewCourse = async (id: string) => {
    const res = await UserAPIMethods.updateCourse(id);
  
    if (res.ok) {
      showSuccessToast(res.msg);
  
      setUser((prev) => {
        if (!prev) return prev; 
  
        return {
          ...prev,
          enrolledCourses: [...(prev.enrolledCourses || []), id],
        };
      });
  
      route.push("/user/sessions");
    }
  };
  
  
  console.log("user",user)
  const fetchCourses = async () => {
   
      const res = await UserAPIMethods.fetchAllCourse({
        page,
        limit: 6,
        search: filters.search || '',
        filters: {
          category: filters.category,
        },
        sort: filters.sort === "latest" ? { createdAt: -1 } : {},
      });
  
      if (res.ok) {
        const newCourses = res.data;
        setCourses(prev => (page === 1 ? newCourses : [...prev, ...newCourses]));
        setHasMore(newCourses.length >= 6);
      } else {
        console.error(res.msg);
      }
      setLoading(false);
  };
  
  
  useEffect(() => {
    fetchCourses()
  }, [])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      setPage(prev => prev + 1)
    }
  }, [inView, hasMore, loading])

  const handleDetailsClick = (course: IPopulatedCourse) => {
    setSelectedCourse(course)
    setIsModalOpen(true)
  }

  const handleEnroll = () => {
    console.log("Enrolling in course:", selectedCourse?._id)
    setIsModalOpen(false)
  }

  const handleFilterChange = (newFilters: any) => {
    setPage(1) 
    setFilters(newFilters);

  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-600">
                Popular Courses
              </Badge>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Expand Your Knowledge</h2>
            <p className="text-xl text-gray-600 max-w-lg">
              Handpicked courses from industry experts to boost your skills
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            View All Courses
          </Button>
        </div>
        <CourseFilter 
  categories={Array.from(new Set(courses.map(c => c.categoryId?.title).filter(Boolean)))} 
  onFilter={handleFilterChange} 
/>
        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCourses.map((course) => (
            <Card key={course._id} className="h-full overflow-hidden rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full cursor-pointer" onClick={()=>handleDetailsClick(course)}>
                <Image
                  src={course.thumbnail || "/images/course-placeholder.jpg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                  priority
                />
                <Badge className="absolute top-3 right-3 bg-white text-gray-800">
                  {course.categoryId?.title || "General"}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-lg font-semibold line-clamp-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {course.mentorId?.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                  By {course.mentorId?.username || "Unknown Instructor"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    <span className="text-gray-600 ml-2">(24)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {course.enrolledUsers?.length || 0}
                  </div>
                </div>

                <Progress 
                  value={(course.sessions?.length || 0) * 10} 
                  className="h-2 bg-gray-200" 
                />
              </CardContent>

              <CardFooter className="flex justify-between items-center border-t pt-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{course.price || 0}</span>
                  {course.price !== 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{Math.round(course.price||0 * 1.5)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
  <Button  
    className="cursor-pointer"
    variant="outline" 
    size="sm"
    onClick={() => handleDetailsClick(course)}
  >
    Details
  </Button>

  {(() => {
   
    const isEnrolled = course?.enrolledUsers?.filter((i)=>i===user?.id);

    console.log("Is User Enrolled in This Course?", isEnrolled);

    return isEnrolled ? (
      <Button 
        size="sm" 
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
        onClick={() => route.push("/user/sessions")}
      >
        Continue Learning
      </Button>
    ) : (
      <Button 
        size="sm" 
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
        onClick={() => handleStartNewCourse(course._id)}
      >
        Start Learning
      </Button>
    );
  })()}
</div>


              </CardFooter>
            </Card>
          ))}

         
        </div>

        {/* Infinite scroll trigger */}
        <div ref={ref} className="h-10 w-full"></div>

        {/* No results */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-20">
            <Image
              src="/images/no-results.svg"
              alt="No courses found"
              width={300}
              height={200}
              className="mx-auto mb-6"
            />
            <h3 className="text-xl font-medium mb-2">No courses found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}

        {/* Course Modal */}
        {selectedCourse && (
          <CourseDetailsModal
            course={selectedCourse}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onEnroll={handleEnroll}
          />
        )}
      </div>
    </section>
  )
}

export default Page
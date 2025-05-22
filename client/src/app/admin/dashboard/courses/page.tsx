"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Calendar, Clock, PenSquare, BookOpen } from "lucide-react";
import { useAdminContext } from "@/src/context/adminContext";
import { AdminAPIMethods } from "@/src/services/APImethods";
import { showSuccessToast } from "@/src/utils/Toast";
import Cheader from "./header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SearchAndFilterBar } from "@/src/components/admin/SearchAndFilterBar";
import { useRouter } from "next/navigation";
import { IReson } from "@/src/types/commonTypes";

export default function CoursesAdminPage() {
  const { courses, setCourses } = useAdminContext();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const coursesPerPage = 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchCourses();
  }, [debouncedSearchTerm, statusFilter, sortOrder, currentPage]);

  const fetchCourses = async () => {
    const filters: Record<string, unknown> = {};
  
    if (statusFilter === 'Active') filters.isBlocked = false;
    else if (statusFilter === 'Blocked') filters.isBlocked = true;

    const res = await AdminAPIMethods.getCourses({
      page: currentPage,
      search: debouncedSearchTerm,
      sort: { createdAt: sortOrder === "asc" ? 1 : -1 },
      filters,
    });

    if (res.ok) {
      setCourses(res.data.data);
      setTotalCourses(res.data.total);
    }
  };

  const toggleCourseStatus = async (id: string, status: boolean) => {
    const res = await AdminAPIMethods.blockCours(id, !status);
    if (res.ok) {
      showSuccessToast(res.msg);
      setCourses(courses.map((prev) => (prev._id === id ? { ...prev, isBlock: !status } : prev)));
    }
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/admin/dashboard/courses/edit/${courseId}`);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Cheader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          setSearchTerm={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          setStatusFilter={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          sortOrder={sortOrder}
          setSortOrder={(val) => {
            setSortOrder(val);
            setCurrentPage(1);
          }}
          roleFilter="Course"
        />

        {courses && courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden shadow-md">
                  <div className="relative h-48 w-full">
                    <Image
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant={course.isBlock ? "destructive" : "default"} className="text-xs">
                          {course.isBlock ? "Blocked" : "Active"}
                        </Badge>
                        <span
  className={`
    text-xs
    px-2 py-1
    rounded-full
    font-medium
    ${
      course.mentorStatus === "approved"
        ? "bg-green-100 text-green-800"
        : course.mentorStatus === "rejected"
        ? "bg-red-100 text-red-800"
        : "bg-yellow-100 text-yellow-800"
    }
  `}
>
  {course.mentorStatus}
</span>
                        <Badge variant="outline" className="text-xs bg-amber-50">
                          {course.courseLanguage}
                        </Badge>
                      </div>
                    </div>
                  </div>
                 
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-semibold line-clamp-1">{course.title}</h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{course.description}</p>
                    <strong>category:</strong><span>{course?.categoryName ? course.categoryName : course.categoryId.title}</span> <br />
                    <strong>Mentor:</strong><span>{course?.mentorId.username}</span>
                  
                    {course?.mentorStatus === 'rejected' && course.mentorId?.courseRejectReson && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">Rejection Reason:</p>
                        <p className="text-sm text-red-500 dark:text-red-300">
                          {course.mentorId.courseRejectReson.find((reason: IReson) => reason.courseId == course._id)?.message || 
                          "No specific reason provided"}
                        </p>
                      </div>
                    )}
                    <div className="mb-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>
                          {formatDate(course.startDate || "")} - {formatDate(course.endDate || "")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Starts at {course.startTime}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCourseStatus(course._id, course.isBlock)}
                      >
                        {course.isBlock ? "Unblock" : "Block"}
                      </Button>
                      <Button size="sm" onClick={() => handleEditCourse(course._id)}>
                        <PenSquare className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-100"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Courses Available</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              {debouncedSearchTerm || statusFilter !== 'All'
                ? "No courses match your current filters. Try adjusting your search criteria."
                : "There are currently no courses in the system. Check back later or create a new course."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
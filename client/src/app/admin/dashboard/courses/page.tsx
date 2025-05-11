"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Calendar, Clock, PenSquare } from "lucide-react";
import { useAdminContext } from "@/src/context/adminContext";
import { AdminAPIMethods } from "@/src/services/APImethods";
import { showSuccessToast } from "@/src/utils/Toast";
import Cheader from "./header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SearchAndFilterBar } from "@/src/components/admin/SearchAndFilterBar";
import { useRouter } from "next/navigation";

export default function CoursesAdminPage() {
  const { courses, setCourses } = useAdminContext();
  const router=useRouter()
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Blocked' | 'Approved' | 'Pending' | 'Rejected'>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const coursesPerPage = 10;

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

      console.log(res)
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
    router.push(`/admin/dashboard/courses/edit/${courseId}`)
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
          {courses&&courses?.map((course) => (
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
                    <Badge variant="outline" className="text-xs">
                      {course.courseLanguage}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-1 text-lg font-semibold line-clamp-1">{course.title}</h3>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{course.description}</p>
                <strong>Categori:</strong><span>{course?.categoryName }</span>
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
      </main>
    </div>
  );
}

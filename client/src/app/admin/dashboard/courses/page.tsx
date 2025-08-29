"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Calendar, Clock, PenSquare, BookOpen } from "lucide-react";
import { useAdminContext } from "@/src/context/adminContext";
import { AdminAPIMethods } from "@/src/services/methods/admin.api";
import { showSuccessToast } from "@/src/utils/Toast";
import Cheader from "./header";
import { Button } from "@/src/components/shared/components/ui/button";
import { Card } from "@/src/components/shared/components/ui/card";
import { SearchAndFilterBar } from "@/src/components/admin/SearchAndFilterBar";
import { useRouter } from "next/navigation";
import { ConcernModal } from "./concernModal";
import { CustomAlertDialog } from "@/src/components/custom-alert-dialog";

export default function CoursesAdminPage() {
  const { courses, setCourses, concern } = useAdminContext();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Active" | "Blocked" | "Approved" | "Pending" | "Rejected"
  >("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [, setIsConcernModalOpen] = useState(false);
  const [selectedConcernId, setSelectedConcernId] = useState<string | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourseBlocked, setSelectedCourseBlocked] = useState(false);
  const handleCourseBlockClick = (id: string, isBlocked: boolean) => {
    setSelectedCourseId(id);
    setSelectedCourseBlocked(isBlocked);
    setIsDialogOpen(true);
  };
  const confirmToggleCourseStatus = async () => {
    if (!selectedCourseId) return;

    const res = await AdminAPIMethods.blockCours(
      selectedCourseId,
      !selectedCourseBlocked
    );

    if (res.ok) {
      showSuccessToast(res.msg);
      setCourses(
        courses.map((prev) =>
          prev.id === selectedCourseId
            ? { ...prev, isBlock: !selectedCourseBlocked }
            : prev
        )
      );
    }

    setIsDialogOpen(false);
    setSelectedCourseId(null);
  };
  const coursesPerPage = 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const fetchCourses = useCallback(async () => {
    const filters: Record<string, unknown> = {};

    if (statusFilter === "Active") filters.isBlocked = false;
    else if (statusFilter === "Blocked") filters.isBlocked = true;

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
  }, [statusFilter, currentPage, debouncedSearchTerm, sortOrder, setCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEditCourse = (courseId: string) => {
    router.push(`/admin/dashboard/courses/edit/${courseId}`);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const totalPages = Math.ceil(totalCourses / coursesPerPage);

  const handleConcernClick = (concernId: string) => {
    setSelectedConcernId(concernId);
    setIsConcernModalOpen(true);
  };

  const handleCloseConcernModal = () => {
    setIsConcernModalOpen(false);
    setSelectedConcernId(null);
  };

  const handleConcernStatusChange = () => {
    fetchCourses();
  };

  const selectedConcern = selectedConcernId
    ? concern.find((c) => c.id === selectedConcernId) || null
    : null;

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
    src={course?.thumbnail || "/placeholder.svg"}
    alt={course?.title || "Course thumbnail"}
    fill
    className="object-cover"
    sizes="100vw"
    priority={false} 
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
</div>


                  {(() => {
                    const activeConcern = concern.find(
                      (i) => i.courseId === course.id && i.status !== "resolved"
                    );
                    if (!activeConcern) return null;
                    const isOpen = activeConcern.status === "open";

                    return (
                      <div
                        className="px-4 mt-3 cursor-pointer"
                        onClick={() => handleConcernClick(activeConcern.id)}
                      >
                        <div
                          className={`flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border font-medium text-xs shadow-sm
                          ${
                            isOpen
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-blue-100 text-blue-800 border-blue-300"
                          }
                        `}
                        >
                          <span className="animate-pulse w-2 h-2 rounded-full bg-current" />
                          <span>
                            Concern: {isOpen ? "Open" : "In Progress"}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-semibold line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {course.description}
                    </p>
                    <strong>category:</strong>
                    <span>{course.category}</span> <br />
                    <strong>Mentor:</strong>
                    <span>{course?.mentor}</span>
                    {!course?.isActive && (
                      <div className="mt-2 p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                          This course is currently{" "}
                          <span className="font-semibold">inactive</span>.
                        </p>
                      </div>
                    )}
                    <div className="mb-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>
                          {formatDate(course.startDate || "")} -{" "}
                          {formatDate(course.endDate || "")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Starts at {course.startTime}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          course.isBlock
                            ? "border-green-500 text-green-600 hover:bg-green-50"
                            : "border-red-500 text-red-600 hover:bg-red-50"
                        }
                        onClick={() =>
                          handleCourseBlockClick(course.id, course.isBlock)
                        }
                      >
                        {course.isBlock ? "Unblock" : "Block"}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() =>
                          router.push(
                            `/admin/dashboard/courses/lessons/${course.id}`
                          )
                        }
                      >
                        Lessons
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleEditCourse(course.id)}
                        className="flex items-center"
                      >
                        <PenSquare className="h-4 w-4 mr-1.5" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav
                  className="inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
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
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
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
              {debouncedSearchTerm || statusFilter !== "All"
                ? "No courses match your current filters. Try adjusting your search criteria."
                : "There are currently no courses in the system. Check back later or create a new course."}
            </p>
          </div>
        )}
      </main>

      {/* Concern Modal */}
      <ConcernModal
        concern={selectedConcern}
        onClose={handleCloseConcernModal}
        onStatusChange={handleConcernStatusChange}
      />
      <CustomAlertDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={selectedCourseBlocked ? "Unblock Course" : "Block Course"}
        description={
          selectedCourseBlocked
            ? "Are you sure you want to unblock this course? It will become accessible to students."
            : "Are you sure you want to block this course? It will no longer be accessible to students."
        }
        variant={selectedCourseBlocked ? "info" : "warning"}
        onConfirm={confirmToggleCourseStatus}
        onCancel={() => setIsDialogOpen(false)}
        confirmText={selectedCourseBlocked ? "Yes, Unblock" : "Yes, Block"}
        cancelText="Cancel"
      />
    </div>
  );
}

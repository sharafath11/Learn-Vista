"use client"

import { useEffect, useState } from "react"
import StudentCard from "./studentsCard"
import { useParams } from "next/navigation"
import { IUser } from "@/src/types/userTypes"
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import StudentDetailsModal from "./StudentDetailsModal"
import { Input } from "@/src/components/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shared/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/src/components/shared/components/ui/pagination"
import { MentorAPIMethods } from "@/src/services/methods/mentor.api"
import { CustomAlertDialog } from "@/src/components/custom-alert-dialog"

interface FetchParams {
  page?: number
  limit?: number
  search?: string
  filters?: Record<string, any>
  sort?: Record<string, 1 | -1>
}

export default function Page() {
  const params = useParams()
  const [students, setStudents] = useState<IUser[]>([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [selectedStudent, setSelectedStudent] = useState<IUser | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalPages, setTotelPages] = useState<number>(0)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
const [shouldBlock, setShouldBlock] = useState<boolean>(false);

  const [fetchParams, setFetchParams] = useState<FetchParams>({
    page: 1,
    search: "",
    filters: {},
    limit:2,
    sort: { createdAt: -1 },
  })

  const handleViewStudent = (student: IUser) => {
    setSelectedStudent(student)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedStudent(null)
  }

const handleToggleBlock = (id: string, block: boolean) => {
  setSelectedStudentId(id);
  setShouldBlock(block);
  setIsConfirmOpen(true);
};
const confirmToggleBlock = async () => {
  if (!selectedStudentId) return;

  const res = await MentorAPIMethods.blockStudentInCourse(
    params.courseId as string,
    selectedStudentId,
    shouldBlock
  );

  if (res.ok) {
    showSuccessToast(res.msg);
    fetchStudents();
  } else {
    showErrorToast(res.msg);
  }

  setIsConfirmOpen(false);
  setSelectedStudentId(null);
};

  useEffect(() => {
    fetchStudents()
  }, [fetchParams])

  const fetchStudents = async () => {
    const res = await MentorAPIMethods.getCourseStudents({
      courseId: params.courseId as string,
      ...fetchParams,
    })

    if (res.ok) {
      setStudents(res.data.students || [])
      setTotalStudents(res.data.total || 0)
      setTotelPages(res.data.totalPages)
    } else {
      showErrorToast(res.msg)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFetchParams((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }))
  }

  const handleStatusFilterChange = (value: string) => {
    setFetchParams((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        status: value === "all" ? undefined : value,
      },
      page: 1,
    }))
  }

  const handleSortChange = (value: string) => {
    setFetchParams((prev) => ({
      ...prev,
      sort: { createdAt: value === "desc" ? -1 : 1 },
      page: 1,
    }))
  }

  const handlePageChange = (page: number) => {
    setFetchParams((prev) => ({
      ...prev,
      page,
    }))
  }

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Student Management
          </h1>
          <p className="text-gray-400">
            Manage your students and their enrollment status
          </p>
        </div>

        {/* Search, Filter, Sort Bar */}
        <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
          <Input
            placeholder="Search students by name or email..."
            value={fetchParams.search || ""}
            onChange={handleSearchChange}
            className="bg-gray-900 text-white border-gray-700"
          />
          <Select
            value={fetchParams.filters?.status || "all"}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-[180px] bg-gray-900  text-white border-gray-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-amber-50 border-gray-700">
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="allowed">Allowed Only</SelectItem>
              <SelectItem value="blocked">Blocked Only</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleSortChange}
            defaultValue="desc"
          >
            <SelectTrigger className="w-[180px] bg-gray-900 text-white border-gray-700">
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 text-white border-gray-700">
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Students Grid */}
        {students.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  courseId={params.courseId as string}
                  onView={() => handleViewStudent(student)}
                  onToggleBlock={handleToggleBlock}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (fetchParams.page && fetchParams.page > 1) {
                          handlePageChange(fetchParams.page - 1)
                        }
                      } }
                      className={fetchParams.page === 1
                        ? "pointer-events-none opacity-50"
                        : ""} size={undefined}                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <PaginationItem key={number}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(number)
                          } }
                          isActive={number === fetchParams.page}
                          className={`${number === fetchParams.page
                              ? "bg-white text-black font-semibold"
                              : "bg-gray-800 text-white hover:bg-gray-700"} px-4 py-2 rounded-md transition`} size={undefined}                        >
                          {number}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (fetchParams.page &&
                          fetchParams.page < totalPages) {
                          handlePageChange(fetchParams.page + 1)
                        }
                      } }
                      className={fetchParams.page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""} size={undefined}                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No students found matching your criteria
            </p>
          </div>
        )}

        <div className="mt-4 text-center text-gray-500">
          <p>
            Showing {students.length} of {totalStudents} students
          </p>
        </div>

        {selectedStudent && (
          <StudentDetailsModal
            student={selectedStudent}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
      <CustomAlertDialog
  isOpen={isConfirmOpen}
  onClose={() => setIsConfirmOpen(false)}
  title={shouldBlock ? "Block Student" : "Unblock Student"}
  description={
    shouldBlock
      ? "Are you sure you want to block this student from the course?"
      : "Are you sure you want to unblock this student and allow access?"
  }
  onConfirm={confirmToggleBlock}
  onCancel={() => setIsConfirmOpen(false)}
  confirmText={shouldBlock ? "Block" : "Unblock"}
  cancelText="Cancel"
  variant={shouldBlock ? "warning" : "info"}
/>

    </main>
  )
}

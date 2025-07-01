"use client"

import { useEffect, useState } from "react"
import { AdminAPIMethods } from "@/src/services/APImethods"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, AlertCircle, Search, ChevronDown, Layers } from "lucide-react"
import { ConcernModal } from "../courses/concernModal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ICourse } from "@/src/types/courseTypes"
import { IConcern } from "@/src/types/concernTypes"
import { useAdminContext } from "@/src/context/adminContext"
import { showErrorToast } from "@/src/utils/Toast"
import { IMentor } from "@/src/types/mentorTypes"

export default function ConcernsPage() {
  const [concerns, setConcerns] = useState<IConcern[]>([])
  const [courses, setCourses] = useState<ICourse[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | "open" | "in-progress" | "resolved">("All")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedCourseId, setSelectedCourseId] = useState<string | "All">("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalConcerns, setTotalConcerns] = useState(0)
  const [selectedConcernId, setSelectedConcernId] = useState<string | null>(null)
  const [mentors,setMentors]=useState<IMentor[]>([])
  const concernsPerPage = 2
  const totalPages = Math.ceil(totalConcerns / concernsPerPage)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    fetchConcerns()
  }, [debouncedSearchTerm, statusFilter, sortOrder, currentPage, selectedCourseId])
  useEffect(() => {
    fetchAllMentors()
  },[])
  const fetchAllMentors = async () => {
      const res = await AdminAPIMethods.getAllMentor();
      if (res.ok) setMentors(res.data)
      
      else showErrorToast(res.msg)
    }
  const fetchConcerns = async () => {
    const filters: Record<string, any> = {}
    if (statusFilter !== "All") filters.status = statusFilter
    if (selectedCourseId !== "All") filters.courseId = selectedCourseId

    const res = await AdminAPIMethods.getAllConcernsWithpagenation({
      page: currentPage,
      limit: concernsPerPage,
      search: debouncedSearchTerm,
      sort: { createdAt: sortOrder === "asc" ? 1 : -1 },
      filters
    })

    if (res.ok && res.data?.data) {
      const { concerns, courses } = res.data.data
      setConcerns(concerns)
      setCourses(courses)
      setTotalConcerns(res.data.total)
    }
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })

  const selectedConcern = selectedConcernId
    ? concerns.find((c) => c._id === selectedConcernId) || null
    : null

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Mentor Concerns</h1>

      <div className="flex flex-col md:flex-row flex-wrap gap-3 mb-6 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-9 w-full"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-between gap-2">
              <span>{statusFilter === "All" ? "Status" : statusFilter}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {["All", "open", "in-progress", "resolved"].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => {
                  setStatusFilter(status as any)
                  setCurrentPage(1)
                }}
                className={cn(statusFilter === status && "bg-accent")}
              >
                {status === "All" ? "All Status" : status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-between gap-2">
              <Layers className="w-4 h-4" />
              <span>
                {selectedCourseId === "All"
                  ? "All Courses"
                  : courses.find((c) => c.id === selectedCourseId)?.title || "Unknown"}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[250px] max-h-64 overflow-auto">
            <DropdownMenuItem
              onClick={() => {
                setSelectedCourseId("All")
                setCurrentPage(1)
              }}
              className={cn(selectedCourseId === "All" && "bg-accent")}
            >
              All Courses
            </DropdownMenuItem>
            {courses.map((course) => (
              <DropdownMenuItem
                key={course.id}
                onClick={() => {
                  setSelectedCourseId(course.id)
                  setCurrentPage(1)
                }}
                className={cn(selectedCourseId === course.id && "bg-accent")}
              >
                {course.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-between gap-2">
              <span>{sortOrder === "asc" ? "Oldest First" : "Newest First"}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuItem
              onClick={() => {
                setSortOrder("asc")
                setCurrentPage(1)
              }}
              className={cn(sortOrder === "asc" && "bg-accent")}
            >
              Oldest First
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSortOrder("desc")
                setCurrentPage(1)
              }}
              className={cn(sortOrder === "desc" && "bg-accent")}
            >
              Newest First
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {concerns.length === 0 ? (
        <div className="w-full text-center mt-24 text-muted-foreground text-sm">
          🚫 No concerns found for the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {concerns.map((c) => {
            const course = courses.find((course) => course.id === c.courseId)
            const mentor = mentors.find((m) => m.id === c.mentorId)

            return (
              <Card
                key={c._id}
                className="p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer"
                onClick={() => setSelectedConcernId(c._id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    className={cn(
                      "text-xs px-3 py-1 rounded-full capitalize",
                      c.status === "open" && "bg-yellow-100 text-yellow-800",
                      c.status === "in-progress" && "bg-blue-100 text-blue-800",
                      c.status === "resolved" && "bg-green-100 text-green-800"
                    )}
                  >
                    {c.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(c.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-800 dark:text-white">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  {c.title}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {c.message}
                </p>

                <div className="text-xs text-gray-500 space-y-1">
                  <div>
                    <strong>Mentor:</strong> {mentor?.username || "Unknown"}
                  </div>
                  <div>
                    <strong>Course:</strong> {course?.title || "Unknown"}
                  </div>
                  <div>
                    <strong>Reselution:</strong> {c?.resolution || "No Reselution"}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded border text-sm font-medium ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <ConcernModal
        concern={selectedConcern}
        onClose={() => setSelectedConcernId(null)}
        onStatusChange={fetchConcerns}
      />
    </div>
  )
}
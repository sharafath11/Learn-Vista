"use client"

import { useEffect, useState } from "react"
import { AdminAPIMethods } from "@/src/services/methods/admin.api"

import { Calendar, AlertCircle, Search, ChevronDown, Layers, ImageIcon, FileIcon } from "lucide-react"
import { ConcernModal } from "../courses/concernModal"

import { cn } from "@/lib/utils"
import { ICourse } from "@/src/types/courseTypes"
import { IConcern, IConcernFilters } from "@/src/types/concernTypes"
import { showErrorToast } from "@/src/utils/Toast"
import { IMentor } from "@/src/types/mentorTypes"
import { Input } from "@/src/components/shared/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/shared/components/ui/dropdown-menu"
import { Button } from "@/src/components/shared/components/ui/button"
import { Card } from "@/src/components/shared/components/ui/card"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { MediaModal } from "@/src/components/MediaModal"

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
  const totalPages = Math.ceil(totalConcerns / concernsPerPage);
  const [open, setOpen] = useState(false);
const [mediaUrl, setMediaUrl] = useState("");
const [mediaType, setMediaType] = useState<"image" | "video" | "audio" | "pdf" | "other">("image");


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
    const filters:IConcernFilters = {}
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
    ? concerns.find((c) => c.id === selectedConcernId) || null
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
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">
      No concerns found
    </h3>
    <p className="text-sm text-muted-foreground mt-2">
      Try adjusting your search or filter criteria
    </p>
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {concerns.map((concern) => {
      const course = courses.find((c) => c.id === concern.courseId);
      const mentor = mentors.find((m) => m.id === concern.mentorId);

      return (
        <Card
          key={concern.id}
          className="p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer group"
          onClick={() => setSelectedConcernId(concern.id)}
        >
          {/* Header with status and date */}
          <div className="flex items-center justify-between mb-3">
  <Badge
    variant={
      concern.status === "resolved" ? "success" :
      concern.status === "in-progress" ? "default" :
      "destructive"
    }
    className="capitalize"
  >
    {concern.status}
  </Badge>
  <div className="flex items-center gap-1 text-xs text-muted-foreground">
    <Calendar className="w-3 h-3" />
    {formatDate(concern.createdAt)}
  </div>
</div>

          {/* Title with icon */}
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2">
              {concern.title}
            </h3>
          </div>

          {/* Message preview */}
          <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
            {concern.message}
          </p>

          {/* Attachments */}
          {concern.attachments&&concern.attachments?.length > 0 && (
            <div className="mb-3 space-y-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                📎 Attachments ({concern.attachments.length})
              </p>
              <div className="flex flex-wrap gap-2">
  {concern.attachments.map((attachment, idx) => (
    <div key={attachment.filename || idx} className="flex-shrink-0">
      {attachment.type === "image" ? (
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setMediaUrl(attachment.url||"");
            setMediaType("image");
            setOpen(true);
          }}
        >
          <ImageIcon className="w-3 h-3" />
          Image
        </Button>
      ) : attachment.type === "audio" ? (
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setMediaUrl(attachment.url||"");
            setMediaType("audio");
            setOpen(true);
          }}
        >
          <FileIcon className="w-3 h-3" />
          Audio
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation();
            setMediaUrl(attachment.url||"");
            if (attachment.type === "audio") {
              setMediaType("audio");
            } else {
              setMediaType("image");
            }
            setOpen(true);
          }}
        >
          <FileIcon className="w-3 h-3" />
          File
        </Button>
      )}
    </div>
  ))}

  {/* Global modal for preview */}
  <MediaModal open={open} onClose={() => setOpen(false)} url={mediaUrl} type={mediaType} />
</div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
            <div className="flex items-start gap-1">
              <span className="font-medium">Mentor:</span>
              <span>{mentor?.username || "Unknown"}</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-medium">Course:</span>
              <span>{course?.title || "Unknown"}</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="font-medium">Resolution:</span>
              <span className={!concern.resolution ? "text-gray-400 italic" : ""}>
                {concern.resolution || "No resolution"}
              </span>
            </div>
          </div>
        </Card>
      );
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
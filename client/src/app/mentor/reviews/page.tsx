"use client"

import { useEffect, useMemo, useState } from "react"
import { MessageSquare, Search } from "lucide-react"
import { useMentorContext } from "@/src/context/mentorContext"
import { IComment, IMentorComments } from "@/src/types/lessons"
import { ICourse } from "@/src/types/courseTypes"
import CommentCard from "./comment-card"
import useDebounce from "@/src/hooks/useDebouncing"
import { MentorAPIMethods } from "@/src/services/methods/mentor.api"

type SortOption = "newest" | "oldest"
type FilterOption = "all" | string

const LIMIT = 2

export default function ReviewsComponent() {
  const [comments, setComments] = useState<IMentorComments[]>([])
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [filterByCourse, setFilterByCourse] = useState<FilterOption>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const debouncedSearch = useDebounce(searchTerm, 500)
  const { courses } = useMentorContext()



  const formatDate = (date: Date | undefined) => {
    if (!date) return "Unknown date"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await MentorAPIMethods.getAllComments({
          sortBy,
          search: debouncedSearch,
          page,
          limit: LIMIT,
          courseId: filterByCourse !== "all" ? filterByCourse : undefined,
        })
        setComments(res.data.comments)
        setTotalPages(res.data.pagination.totalPages)
      } catch (err) {
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [sortBy, filterByCourse, debouncedSearch, page]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Student Reviews & Comments
          </h1>
          <p className="text-lg text-slate-300">Manage all student feedback across your courses</p>
        </header>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-5 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Course Filter */}
            <div className="w-full">
              <label className="block text-sm text-slate-300 mb-1">Filter by Course</label>
              <select
                value={filterByCourse}
                onChange={(e) => {
                  setPage(1)
                  setFilterByCourse(e.target.value)
                }}
                className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option className="text-black" key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="w-full relative">
              <label className="block text-sm text-slate-300 mb-1">Search Comments</label>
              <Search className="absolute left-3 top-9 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setPage(1)
                  setSearchTerm(e.target.value)
                }}
                placeholder="Type to search..."
                className="pl-10 pr-4 py-2 w-full bg-white/10 text-white border border-white/20 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>

            {/* Sort Options */}
            <div className="w-full">
              <label className="block text-sm text-slate-300 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setPage(1)
                  setSortBy(e.target.value as SortOption)
                }}
                className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="newest" className="text-black">Newest First</option>
                <option value="oldest" className="text-black">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center text-white">Loading...</div>
          ) : comments?.length > 0 ? (
            comments?.map((comment) => (
              <CommentCard
                key={comment.comment}
                comment={comment}
                course={comment.courseTitle}
                formatDate={formatDate}
                lessonTitle={comment.lessonTitle}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No comments found</h3>
              <p className="text-slate-400">Try adjusting your filters or search</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded-lg border border-white/20 ${
                  page === p ? "bg-white/20 text-white" : "text-slate-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

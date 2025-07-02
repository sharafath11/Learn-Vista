"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MentorAPIMethods } from "@/src/services/APImethods"
import { useMentorContext } from "@/src/context/mentorContext"
import { IConcern } from "@/src/types/concernTypes"
import ConcernsToolbar from "./ConcernsToolbar"
import ConcernCard from "./ConcernCard"

type ConcernStatus = 'open' | 'in-progress' | 'resolved'

export default function ConcernsPage() {
  const { courses } = useMentorContext()
  const [concerns, setConcerns] = useState<IConcern[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ConcernStatus | "all">("all")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 2,
    total: 0
  })

  const fetchConcernsData = async () => {
    setIsLoading(true)
    try {
      const params = {
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined,
        courseId: courseFilter !== "all" ? courseFilter : undefined,
        sortBy,
        sortOrder,
        page: pagination.page,
        pageSize: pagination.pageSize
      }

      const res = await MentorAPIMethods.getConcern(params)
      if (res.ok) {
        setConcerns(res.data.data)
        setPagination(prev => ({
          ...prev,
          total: res.data.total
        }))
      }
    } catch (error) {
      console.error("Error fetching concerns:", error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [searchTerm, statusFilter, courseFilter, sortBy, sortOrder])
  useEffect(() => {
    fetchConcernsData()
  }, [pagination.page, searchTerm, statusFilter, courseFilter, sortBy, sortOrder])

  const statusCounts = {
    all: pagination.total,
    open: concerns?.filter(c => c.status === "open").length || 0,
    resolved: concerns?.filter(c => c.status === "resolved").length || 0,
    'in-progress': concerns?.filter(c => c.status === "in-progress").length || 0,
  }

  const renderEmptyState = () => (
    <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="p-4 bg-gray-700/30 rounded-full mb-6">
          <AlertCircle className="w-12 h-12 text-gray-500" />
        </div>
        <h3 className="text-gray-300 text-xl font-semibold mb-2">
          {searchTerm || statusFilter !== "all" || courseFilter !== "all"
            ? "No matching concerns found"
            : "No concerns raised yet"
          }
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          {searchTerm || statusFilter !== "all" || courseFilter !== "all"
            ? "Try adjusting your search or filter criteria to find what you're looking for."
            : "When concerns are submitted, they will appear here for tracking and resolution."
          }
        </p>
        {(searchTerm || statusFilter !== "all" || courseFilter !== "all") && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setStatusFilter("all")
              setCourseFilter("all")
            }}
            className="mt-4 border-gray-600 text-gray-400 hover:bg-gray-700/50"
          >
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-orange-400 text-2xl sm:text-3xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-orange-500/20 rounded-xl">
                      <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <span>Course Concerns</span>
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 ml-3 px-2 py-1">
                        {pagination.total} Total
                      </Badge>
                    </div>
                  </h1>
                  <p className="text-gray-400 text-base mt-2">
                    Track, manage, and resolve all concerns raised for your courses
                  </p>
                </div>
              </div>

              <ConcernsToolbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                courseFilter={courseFilter}
                setCourseFilter={setCourseFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                courses={courses || []}
                statusCounts={statusCounts}
              />
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
              ) : concerns.length === 0 ? (
                renderEmptyState()
              ) : (
                <div className="grid gap-4">
                  {concerns.map(concern => (
                    <ConcernCard key={concern._id} concern={concern} courses={courses || []} />
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-800 mt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  Showing {concerns.length} of {pagination.total} concerns
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1 || isLoading}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={concerns.length < pagination.pageSize || isLoading || (pagination.page * pagination.pageSize >= pagination.total)}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

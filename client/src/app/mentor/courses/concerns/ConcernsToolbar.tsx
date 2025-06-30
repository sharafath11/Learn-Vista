// components/ConcernsToolbar.tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, ChevronDown, ArrowUpDown, Clock, CheckCircle, Eye } from 'lucide-react'
import React from "react"
import { ICourse } from "@/src/types/courseTypes"

type ConcernStatus = 'open' | 'in-progress' | 'resolved'

interface SortOption {
  value: string
  label: string
  defaultOrder?: 'asc' | 'desc'
}

interface FilterOption<T = string> {
  value: T
  label: string
  count?: number
  icon?: React.ReactNode
}

// Define a type for the course, assuming it has an 'id' and 'title'
interface Course {
  id: string;
  title: string;
}

interface ConcernsToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: ConcernStatus | "all";
  setStatusFilter: (status: ConcernStatus | "all") => void;
  courseFilter: string;
  setCourseFilter: (courseId: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  courses: ICourse[]; // Pass courses for the course filter dropdown
  statusCounts: {
    all: number;
    open: number;
    resolved: number;
    'in-progress': number;
  };
}

const ConcernsToolbar: React.FC<ConcernsToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  courseFilter,
  setCourseFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  courses,
  statusCounts,
}) => {

  const statusFilterOptions: FilterOption<ConcernStatus | 'all'>[] = [
    { value: 'all', label: 'All Statuses', count: statusCounts.all },
    {
      value: 'open',
      label: 'Open',
      count: statusCounts.open,
      icon: <Clock className="w-4 h-4 text-amber-400" />
    },
    {
      value: 'resolved',
      label: 'Resolved',
      count: statusCounts.resolved,
      icon: <CheckCircle className="w-4 h-4 text-emerald-400" />
    },
    {
      value: 'in-progress',
      label: 'In Progress',
      count: statusCounts['in-progress'],
      icon: <Eye className="w-4 h-4 text-blue-400" />
    }
  ]

  const courseFilterOptions: FilterOption[] = [
    { value: 'all', label: 'All Courses' },
    ...(courses?.map(course => ({
      value: course._id,
      label: course.title
    })) || [])
  ]

  const sortOptions: SortOption[] = [
    { value: 'createdAt', label: 'Newest First', defaultOrder: 'desc' },
    { value: 'createdAt', label: 'Oldest First', defaultOrder: 'asc' }
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search concerns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-orange-500/50 focus:ring-orange-500/20"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50">
            <Filter className="w-4 h-4 mr-2" />
            {statusFilter === "all" ? "Status" : statusFilter.replace("-", " ")}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700">
          {statusFilterOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setStatusFilter(option.value as ConcernStatus | "all")}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                {option.icon && <span className="w-4 h-4">{option.icon}</span>}
                <span>{option.label}</span>
              </div>
              {option.count !== undefined && (
                <span className="text-gray-400 text-xs ml-2">
                  {option.count}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50">
            <Filter className="w-4 h-4 mr-2" />
            {courseFilter === "all" ? "Course" : courses?.find(c => c._id === courseFilter)?.title || "Course"}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700">
          {courseFilterOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setCourseFilter(option.value)}
              className="flex justify-between items-center"
            >
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-800 border-gray-700">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.label}
              onClick={() => {
                setSortBy(option.value)
                setSortOrder(option.defaultOrder || 'asc')
              }}
              className={`flex justify-between items-center ${sortOrder === option.defaultOrder ? 'bg-gray-700' : ''}`}
            >
              <span>{option.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ConcernsToolbar
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Filter, SortAsc } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useDebounce from "@/src/hooks/useDebouncing"
import type { ICategory } from "@/src/types/categoryTypes"

interface CourseFilterProps {
  categories: ICategory[]
  onFilter: (filters: { search: string; category: string; sort: string }) => void
}

const CourseFilter: React.FC<CourseFilterProps> = ({ categories, onFilter }) => {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState("ASC")

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    onFilter({ search: debouncedSearch, category, sort })
  }, [debouncedSearch, category, sort])

  return (
    <div className="w-full">
      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 sm:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 text-base border-gray-200 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              Sort By
            </label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-12 text-base border-gray-200 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Latest First</SelectItem>
                <SelectItem value="DESC">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:items-center sm:gap-6">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 text-base border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 block">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48 h-12 text-base border-gray-200 rounded-xl shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 block">Sort By</label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-40 h-12 text-base border-gray-200 rounded-xl shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Latest First</SelectItem>
                <SelectItem value="DESC">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseFilter

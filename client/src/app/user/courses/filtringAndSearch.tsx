'use client'

import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useDebounce from '@/src/hooks/useDebouncing'

interface CourseFilterProps {
  categories: string[]
  onFilter: (filters: { search: string; category: string; sort: string }) => void
}

const CourseFilter: React.FC<CourseFilterProps> = ({ categories, onFilter }) => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All') // default to All
  const [sort, setSort] = useState('ASC') // default to Latest

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    onFilter({ search: debouncedSearch, category, sort })
  }, [debouncedSearch, category, sort])

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-3 text-sm">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[30%] h-9 px-3 text-sm border border-gray-300 rounded-md"
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[20%] h-9 text-sm px-3 border border-gray-300 rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full md:w-[20%] h-9 text-sm px-3 border border-gray-300 rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ASC">Latest</SelectItem>
            <SelectItem value="DESC">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default CourseFilter

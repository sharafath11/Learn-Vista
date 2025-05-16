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
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('latest')

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    onFilter({ search: debouncedSearch, category, sort })
  }, [debouncedSearch, category, sort])

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-6 text-sm">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-[30%] h-9 px-3 text-sm"
      />

      <Select onValueChange={setCategory}>
        <SelectTrigger className="w-full md:w-[20%] h-9 text-sm px-3">
          <SelectValue placeholder="Category" />
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
        <SelectTrigger className="w-full md:w-[20%] h-9 text-sm px-3">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default CourseFilter

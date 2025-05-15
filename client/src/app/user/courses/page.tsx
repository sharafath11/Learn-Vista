'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useUserContext } from '@/src/context/userAuthContext'
import CoursesHero from '@/src/components/user/courses/courses-hero'
import CoursesFilterSidebar from '@/src/components/user/courses/courses-filter-sidebar'
import CoursesContent from '@/src/components/user/courses/courses-content'


export default function CoursesPage() {
  const { allCourses } = useUserContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    level: '',
    duration: '',
    rating: 0,
    price: '',
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const clearFilters = () => {
    setFilters({
      category: '',
      level: '',
      duration: '',
      rating: 0,
      price: '',
    })
    setSearchTerm('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CoursesHero />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          <CoursesFilterSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            setFilters={setFilters}
           
          
            clearFilters={clearFilters}
            courses={allCourses}
          />

<CoursesContent
  courses={allCourses}
  

/>

        </div>
      </div>
    </div>
  )
}
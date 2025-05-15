import { Search, Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function CoursesFilterSidebar({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  clearFilters,
  courses
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filters: any
  setFilters: (filters: any) => void
  clearFilters: () => void
  courses: any[]
}) {
  const categories = [...new Set(courses.map(course => course.category))]
  const levels = ['Beginner', 'Intermediate', 'Advanced']
  
  return (
    <aside className="hidden md:block w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow p-6 sticky top-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700"
          >
            Clear all
          </Button>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters({ ...filters, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Level</h3>
            <Select
              value={filters.level}
              onValueChange={(value) => setFilters({ ...filters, level: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="d">All levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFilters({ ...filters, rating: star })}
                  className={`p-1 rounded-full ${
                    filters.rating >= star ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  <Star className="h-5 w-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Duration</h3>
            <Select
              value={filters.duration}
              onValueChange={(value) => setFilters({ ...filters, duration: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any duration</SelectItem>
                <SelectItem value="short">Short (0-5 hours)</SelectItem>
                <SelectItem value="medium">Medium (5-15 hours)</SelectItem>
                <SelectItem value="long">Long (15+ hours)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Price</h3>
            <Select
              value={filters.price}
              onValueChange={(value) => setFilters({ ...filters, price: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All prices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All prices</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="discounted">Discounted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </aside>
  )
}
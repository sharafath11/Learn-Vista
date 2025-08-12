"use client"

import type React from "react"
import Link from "next/link"
import { useMentorContext } from "@/src/context/mentorContext"
import {
  BookOpen,
  Settings,
  Users,
  Film,
  GraduationCap,
  PlusCircle,
  PlayCircle,
  TrendingUp,
} from "lucide-react"
import { ICourse } from "@/src/types/courseTypes"

export default function MentorDashboard() {
  const { courses } = useMentorContext()

  let totalStudent = 0
  let totalLessons = 0
  let completedLessons = 0
console.log("from mentor",courses)
  courses.forEach((course) => {
    totalStudent += course.totelStudent as number
    totalLessons += course?.sessions as number
    completedLessons += course?.isActive? 1:0
  })
  let totalCourses = courses.length
let publishedCourses = courses.filter((course) => course.isActive).length
 
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Course Dashboard
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl">
                Manage your courses, track student progress, and create impactful learning experiences.
              </p>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-blue-400" />
            Your Teaching Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Students */}
            <MetricCard
              title="Total Students"
              value={totalStudent.toString()}
              subtitle="Across all courses"
              icon={GraduationCap}
              gradient="from-blue-500 to-cyan-500"
              bgGradient="from-blue-500/10 to-cyan-500/10"
              href="/mentor/courses"
              
            />

            {/* Active Courses */}
            <MetricCard
  title="Published Courses"
  value={publishedCourses.toString()}
  subtitle="Visible to students"
  icon={BookOpen}
  gradient="from-green-500 to-teal-500"
  bgGradient="from-green-500/10 to-teal-500/10"
  href="/mentor/courses"
/>


            {/* Total Lessons */}
            <MetricCard
              title="Total Lessons"
              value={totalLessons.toString()}
              subtitle="Content created"
              icon={PlayCircle}
              gradient="from-purple-500 to-pink-500"
              bgGradient="from-purple-500/10 to-pink-500/10"
              href="/mentor/courses"
            />

            {/* Total Courses */}
<MetricCard
  title="Total Courses"
  value={totalCourses.toString()}
  subtitle="Courses you've created"
  icon={BookOpen}
  gradient="from-indigo-500 to-purple-500"
  bgGradient="from-indigo-500/10 to-purple-500/10"
  href="/mentor/courses"
/>

{/* Published Courses */}

          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Quick Actions */}
          <section className="xl:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/10">
                <h2 className="font-bold text-2xl text-white flex items-center">
                  <Settings className="h-6 w-6 mr-3 text-blue-400" />
                  Quick Actions
                </h2>
                <p className="text-sm text-slate-300 mt-2">Essential course management tools</p>
              </div>
              <div className="p-6 space-y-4">
                <ActionCard
                  icon={Film}
                  title="Start Live Session"
                  description="Begin interactive teaching"
                  color="text-red-400"
                  bgColor="bg-red-500/10"
                  hoverColor="hover:bg-red-500/20"
                  href="/mentor/upcoming"
                />
                <ActionCard
                  icon={PlusCircle}
                  title="Add New Lesson"
                  description="Create course content"
                  color="text-green-400"
                  bgColor="bg-green-500/10"
                  hoverColor="hover:bg-green-500/20"
                  href="/mentor/courses"
                />
               
               
              </div>
            </div>
          </section>

          {/* My Courses */}
          <section className="xl:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-2xl text-white flex items-center">
                      <BookOpen className="h-6 w-6 mr-3 text-green-400" />
                      Your Courses
                    </h2>
                    <p className="text-sm text-slate-300 mt-2">Manage and monitor your course portfolio</p>
                  </div>
                  <div className="flex gap-3">
                    
                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600">
                     <Link href={"/mentor/courses"}>View all</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {courses.length > 0 ? (
                  <div className="space-y-6">
                    {courses.slice(0, 3).map((course, index) => (
                      <CourseCard
                        key={course.id || index}
                        course={course}
                        title={course.title || `Course ${index + 1}`}
                        description={course.description || "No description available"}
                        progress={Math.floor(Math.random() * 100)}
                        status={index === 0 ? "Active" : index === 1 ? "New" : "Draft"}
                        students={course.enrolledUsers?.length || 0}
                        lessons={course.sessions as number || 0}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
                    <p className="text-slate-400 mb-6">Create your first course to get started</p>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <PlusCircle className="h-5 w-5 mr-2" />
                      Create Your First Course
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        
      </div>
    </div>
  )
}

// Helper Components
interface MetricCardProps {
  title: string
  value: string
  subtitle: string
  icon: React.ElementType
  gradient: string
  bgGradient: string
  href:string
}

function MetricCard({ title, value, subtitle, icon: Icon, gradient, bgGradient,href }: MetricCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${bgGradient} backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
    >
      <Link href={href}>
    
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{value}</div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-white text-lg">{title}</h3>
        <p className="text-sm text-slate-300">{subtitle}</p>
        </div>
        </Link>
    </div>
      
  )
}

interface ActionCardProps {
  icon: React.ElementType
  title: string
  description: string
  color: string
  bgColor: string
  hoverColor: string
  href: string 
}
function ActionCard({ icon: Icon, title, description, color, bgColor, hoverColor, href }: ActionCardProps) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${bgColor} ${hoverColor} hover:scale-105 border border-white/5`}
      >
        <div className={`p-3 rounded-lg ${bgColor} flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-300">{description}</p>
        </div>
      </div>
    </Link>
  )
}

interface CourseCardProps {
  course: ICourse
  title: string
  description: string
  progress: number
  status: string
  students: number
  lessons: number
}

function CourseCard({ course, title, description, progress, status, students, lessons }: CourseCardProps) {
  const statusColors: { [key: string]: string } = {
    Active: "bg-green-500/20 text-green-300 border-green-500/30",
    New: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Draft: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-xl text-white mb-2">{title}</h3>
          <p className="text-slate-300 text-sm line-clamp-2">{description}</p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]} ml-4`}
        >
          {status}
        </span>
      </div>



      <div className="flex justify-between items-center text-sm text-slate-400 mb-6">
        <span className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {students} Students
        </span>
        <span className="flex items-center">
          <PlayCircle className="h-4 w-4 mr-1" />
          {lessons} Lessons
        </span>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <Link href={`/mentor/courses/${course.id}`}>manage Lessons</Link>
        </Button>
        <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
          <Link href={`/mentor/courses/students/${course.id}`}>manage Students</Link>
        </Button>
      </div>
    </div>
  )
}

interface ActivityCardProps {
  type: string
  title: string
  time: string
  icon: React.ElementType
  color: string
}

function ActivityCard({ type, title, time, icon: Icon, color }: ActivityCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-white/10 flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{type}</span>
            <span className="text-xs text-slate-500">{time}</span>
          </div>
          <p className="text-sm text-white font-medium">{title}</p>
        </div>
      </div>
    </div>
  )
}
function Button({ children, className = "", variant = "default", size = "default", onClick, ...props }: any) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
  let variantClasses = ""
  let sizeClasses = ""

  switch (variant) {
    case "default":
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
      break
    case "outline":
      variantClasses = "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/30"
      break
  }

  switch (size) {
    case "default":
      sizeClasses = "px-4 py-2"
      break
    case "sm":
      sizeClasses = "px-3 py-1.5 text-sm"
      break
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}

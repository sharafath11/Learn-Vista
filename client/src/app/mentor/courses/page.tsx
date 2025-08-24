"use client";

import { useEffect, useState } from "react";
import { CourseFilters } from "./CourseFilters";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { Badge } from "@/src/components/shared/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/src/components/shared/components/ui/avatar";
import { RaiseConcernDialog } from "./ConcernDialog";
import {
  Layers,
  Calendar,
  Clock,
  BookText,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ICourse } from "@/src/types/courseTypes";
import { ICategory } from "@/src/types/categoryTypes";
import { MentorAPIMethods } from "@/src/services/methods/mentor.api";

export default function CoursesPage() {
  const [filters, setFilters] = useState({
    search: "",
    sort: "latest" as "latest" | "oldest",
    category: "",
  });
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<ICategory[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const params = {
        page,
        limit: 2,
        search: filters.search || undefined,
        filters: filters.category
          ? { categoryId: filters.category }
          : undefined,
        sort: {
          createdAt: filters.sort === "latest" ? -1 : (1 as 1 | -1),
        },
      };
      const res = await MentorAPIMethods.getCourseWithFilter(params);
      setCourses(res?.data?.data || []);
      setTotalPages(res?.data?.totalPages || 1);
      setCategories(res.data.categories || []);
      setLoading(false);
    };
    fetchCourses();
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-gray-200 p-6">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Your Courses
          </h1>
          <Link
            href="/mentor/courses/concerns"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 text-amber-400 rounded-full transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">View All Concerns</span>
          </Link>
        </div>

        <CourseFilters categories={categories} onChange={setFilters} />

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-lg">
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <Card className="text-center py-16 px-6 bg-gray-800/50 border-gray-700 shadow-xl rounded-xl">
            <CardContent className="flex flex-col items-center justify-center h-full">
              <Avatar className="w-20 h-20 bg-gradient-to-br from-purple-700/30 to-pink-700/30 mb-6">
                <AvatarFallback>
                  <Layers className="w-10 h-10 text-pink-300" />
                </AvatarFallback>
              </Avatar>
              <p className="text-gray-300 text-xl font-semibold mb-2">
                No Courses Found
              </p>
              <p className="text-gray-400 text-lg">
                Try changing filters or add new courses.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="group relative bg-gradient-to-br from-gray-800/40 via-gray-800/30 to-gray-800/40 border border-gray-700 hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-1"
                >
                  <CardHeader className="relative p-0 aspect-video overflow-hidden rounded-t-xl">
                    <Image
                      src={course.thumbnail || "/placeholder.png"}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300 group-hover:brightness-100"
                    />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center gap-2">
                      {typeof course.categoryId === "object" &&
                        course.categoryId?.title && (
                          <Badge
                            variant="secondary"
                            className="bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 text-sm font-semibold rounded-full"
                          >
                            {course.categoryId.title}
                          </Badge>
                        )}

                      <Badge
                        variant={course.isActive ? "default" : "secondary"}
                        className={`flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-full ${
                          course.isActive
                            ? "bg-green-600/80 text-white"
                            : "bg-red-600/80 text-white"
                        }`}
                      >
                        {course.isActive ? (
                          <CheckCircle size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}
                        {course.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <h2 className="text-xl font-bold text-white line-clamp-2">
                      {course.title}
                    </h2>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {course.description}
                    </p>

                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-300 pt-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-400" />
                        <span>{course.sessions || "0"} Lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span>{course.startDate}</span>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span>{course.startDate}</span>
                      </div> */}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span>{course.startTime || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Clock className="w-4 h-4 text-amber-400" />
                        <span>{course.endDate}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-3 p-4 pt-0">
                    <>
                      <Link
                        href={`/mentor/courses/${course.id}`}
                        className="w-full"
                      >
                        <Button className="w-full gap-2 h-10 text-base bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-md rounded-lg">
                          <BookText size={18} /> Manage Course
                        </Button>
                      </Link>
                      <Link
                        href={`/mentor/courses/students/${course.id}`}
                        className="w-full"
                      >
                        <Button className="w-full gap-2 h-10 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md rounded-lg">
                          <Users size={18} /> View Students
                        </Button>
                      </Link>
                      <div className="w-full flex justify-start mt-2">
                        <RaiseConcernDialog courseId={course.id} />
                      </div>
                    </>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="text-black"
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="text-black"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

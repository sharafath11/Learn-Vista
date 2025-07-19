"use client";

import Image from "next/image";
import { useUserContext } from "@/src/context/userAuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { Progress } from "@/src/components/shared/components/ui/progress";

const Courses = () => {
  const { allCourses } = useUserContext();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600">Handpicked courses to get you started</p>
          </div>
          <Button variant="outline">View All Courses</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allCourses?.slice(0, 3).map((course) => (
            <Card key={course._id} className="h-full overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-48 w-full">
                <Image
                  src={course.thumbnail || "/images/course-placeholder.jpg"}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  {course.categoryId?.title && (
                    <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                      {course.categoryId.title}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm">
                  By {course.mentorId?.username || "Unknown Instructor"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <div className="flex items-center text-yellow-600">
                    <span className="mr-1">★</span>
                    <span>4.5</span>
                  </div>
                  <span className="text-gray-600">
                    {course.enrolledUsers?.length || 0} students
                  </span>
                </div>
                <Progress value={(course.sessions?.length || 0) * 10} className="h-2" />
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">₹
{course.price || 0}</span>
                  {course.price !== 0 && (
                    <span className="text-sm text-gray-400 line-through">Free</span>
                  )}
                </div>
                <Button size="sm">Enroll Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;

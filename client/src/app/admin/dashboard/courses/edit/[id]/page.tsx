"use client";
import { use } from "react";
import { CourseFormDesign } from "./CourseForm";
import { IAdminEditCoursePageProps } from "@/src/types/courseTypes";

export default function EditCoursePage({ params }: IAdminEditCoursePageProps) {
  const resolvedParams = use(params);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      {resolvedParams?.id ? <CourseFormDesign courseId={resolvedParams.id} /> : "Loading..."}
    </div>
  );
}

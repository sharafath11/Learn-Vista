import { CourseForm } from "./course-form";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <CourseForm courseId={params.id} />
    </div>
  )
}

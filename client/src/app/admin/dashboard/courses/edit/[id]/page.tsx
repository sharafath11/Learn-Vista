import { CourseFormDesign } from "./course-form";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  console.log(params)
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <CourseFormDesign courseId={params.id as string} />
    </div>
  )
}

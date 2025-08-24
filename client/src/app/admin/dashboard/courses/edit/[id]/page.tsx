import { CourseFormDesign } from "./course-form";

interface EditCoursePageProps {
  params: {
    id: string;
  };
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <CourseFormDesign courseId={params.id} />
    </div>
  );
}

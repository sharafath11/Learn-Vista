// src/app/admin/dashboard/courses/edit/[id]/page.tsx

"use client"; // This must be at the very top of the file.

// The 'use' hook is imported to unwrap the Promise from the 'params' object.
import { use } from "react";

import { CourseFormDesign } from "./course-form";

// Define the type for the props passed to this page component.
// In Next.js 15, 'params' can be a Promise, even for client components,
// which is why we must type it as such to avoid TypeScript errors.
interface EditCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

// In a Client Component, we use the 'use' hook to get the resolved value
// of the 'params' Promise.
export default function EditCoursePage({ params }: EditCoursePageProps) {
  // The 'use' hook is a React function that unwraps the Promise.
  // This allows us to access the 'id' property safely.
  const resolvedParams = use(params);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      
      {/* We use the 'resolvedParams' object to access the 'id' value. */}
      {resolvedParams?.id ? <CourseFormDesign courseId={resolvedParams.id} /> : "Loading..."}
    </div>
  );
}

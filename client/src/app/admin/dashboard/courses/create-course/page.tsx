// app/create-course/page.tsx
"use client"

import { AdminAPIMethods } from "@/src/services/methods/admin.api"
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/Toast"
import { useAdminContext } from "@/src/context/adminContext"
import { validateCourseForm } from "@/src/validations/adminvalidation"
import CourseForm from "./CourseForm"
import { useRouter } from "next/navigation"
import { IMentor } from "@/src/types/mentorTypes"
import { useEffect, useState } from "react"
import { ICategory } from "@/src/types/categoryTypes"

export default function CreateCoursePage() {
  const route = useRouter()
  const [categories,setCategories]=useState<ICategory[]>([])
  const { cat, setCourses, } = useAdminContext()
  const [mentors, setMentors] = useState<IMentor[]>();
  useEffect(() => {
    fetchAllMentors()
    fetchAllCategories()

  }, [])
  const fetchAllCategories = async () => {
    const res = await AdminAPIMethods.getAllCategories();
    if (res.ok) {
      setCategories(res.data)
    }else showErrorToast(res.msg)
  }
  
  const fetchAllMentors = async () => {
    const res = await AdminAPIMethods.getAllMentor();
    if (res.ok) {
      
      setMentors(res.data)
    }
    else showErrorToast(res.msg)
  }
  const languages = ["English", "Malayalam"]
  const handleSubmit = async (formData:any) => {
    const { isValid, message } = validateCourseForm(formData);
    if (!isValid) {
      showInfoToast(message);
      return 
    }
    const payload = new FormData() ;
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('mentorId', formData.mentorId);
    payload.append('categoryId', formData.categoryId);
    payload.append('category', formData.category);
    payload.append('price', Number(formData.price).toString());
    payload.append('courseLanguage', formData.language);
    payload.append('tags', formData.tags);
    payload.append('startDate', formData.startDate);
    payload.append('endDate', formData.endDate);
    payload.append('startTime', formData.startTime);
    payload.append('categoryName', formData.categoryName);
  
    
   
    if (formData.thumbnail) {
      payload.append('thumbnail', formData.thumbnail); 
    }
  
  
     
      const res = await AdminAPIMethods.createCourse(payload);
      if (res.ok) {
        showSuccessToast(res.msg);
        setCourses((prev) => [...prev, res.data]);
        route.push("/admin/dashboard/courses")
      }
  
  };
  

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-8 py-6 bg-sky-50 border-b border-sky-100">
          <h1 className="text-2xl font-semibold text-gray-800">Create New Course</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details below to create your new course
          </p>
        </div>

        <CourseForm
          mentors={mentors?.filter((i)=>!i.isBlock&&i.isVerified)||[]}
          categories={categories}
          languages={languages}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
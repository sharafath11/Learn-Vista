"use client"
import { useAdminContext } from "@/src/context/adminContext"
import { Button } from "@/src/components/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Input } from "@/src/components/shared/components/ui/input"
import { Label } from "@/src/components/shared/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/shared/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/shared/components/ui/tabs"
import { Textarea } from "@/src/components/shared/components/ui/textarea"
import { useEffect, useState } from "react"
import { AdminAPIMethods } from "@/src/services/methods/admin.api"
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import { useRouter } from "next/navigation"
import { ICategory } from "@/src/types/categoryTypes"
import { IMentor } from "@/src/types/mentorTypes"

export function CourseFormDesign({ courseId }: { courseId: string }) {
  const { courses, avilbleMentors,setCourses ,categories} = useAdminContext();
  const [mentors, setMentors] = useState<IMentor[]>();
   useEffect(() => {
     fetchAllMentors()
     
   }, [])

   const fetchAllMentors = async () => {
     const res = await AdminAPIMethods.getAllMentor();
     if (res.ok) {
       
       setMentors(res.data)
     }
     else showErrorToast(res.msg)
   }
  const course = courses.find((i) => i.id === courseId);
  if (!course) {
    return <div>Loading...</div>
  }
  const router=useRouter()
  const [formData, setFormData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    mentorId: course?.mentorId?.id || "",
    categoryId: course?.categoryId?.id || "",
    price: course?.price || 0,
    courseLanguage: course?.courseLanguage || "English",
    startDate: course?.startDate?.split("T")[0] || "",
    endDate: course?.endDate?.split("T")[0] || "",
    startTime: course?.startTime || "",
    thumbnail: course?.thumbnail || ""
  })

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSelectChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('mentorId', formData.mentorId)
    data.append('categoryId', formData.categoryId)
    data.append('price', formData.price.toString())
    data.append('courseLanguage', formData.courseLanguage)
    data.append('startDate', formData.startDate)
    data.append('endDate', formData.endDate)
    data.append('startTime', formData.startTime);
   
    if (thumbnailFile) {
      data.append('thumbnail', thumbnailFile)
    }
 
    const res = await AdminAPIMethods.editCourse(courseId, data);
    if (res.ok) {
      setCourses(prev => prev.map(c =>
        c.id === courseId ? { ...c, ...res.data } : c
      ));
      showSuccessToast(res.msg);
      router.push("/admin/dashboard/courses")
    
    }
  }
 
  return (
    <form className="space-y-6 p-4" onSubmit={handleSubmit}>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your course"
                  rows={5}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mentor * { course.mentorId.username}</Label>
                  <Select 
                    value={formData.mentorId}
                    onValueChange={(value) => handleSelectChange("mentorId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mentor">
                        {avilbleMentors.find(m => m.id === formData.mentorId)?.username || "Select mentor"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {mentors?.map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category *{ course.categoryId.title}</Label>
                  <Select 
                    value={formData.categoryId}
                    onValueChange={(value) => handleSelectChange("categoryId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category">
                        {categories?.find(c => c.id === formData.categoryId)?.title || "Select category"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((ca) => (
                       ca.isBlock?"":( <SelectItem key={ca.id} value={ca.id as string}>
                        {ca.title}
                      </SelectItem>)
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Course Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <div className="flex flex-col items-center gap-4">
                  <div className="border-2 border-dashed rounded-md p-8 w-full max-w-md text-center">
                    {thumbnailFile ? (
                      <img
                        src={URL.createObjectURL(thumbnailFile)}
                        alt="Course Thumbnail Preview"
                        className="w-full h-auto"
                      />
                    ) : formData.thumbnail ? (
                      <img
                        src={formData.thumbnail}
                        alt="Course Thumbnail"
                        className="w-full h-auto"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Drag and drop image here, or click to select
                      </p>
                    )}
                  </div>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="pl-8"
                    required
                  />
                </div>
              </div> */}

              <div className="space-y-2">
                <Label>Language *</Label>
                <Select 
                  value={formData.courseLanguage}
                  onValueChange={(value) => handleSelectChange("courseLanguage", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Malayalam">Malayalam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Course Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input 
                  id="startTime"
                  type="time" 
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button type="submit" className="w-full">
        Save Course
      </Button>
    </form>
  )
}
"use client"
import { useAdminContext } from "@/src/context/adminContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function CourseFormDesign({ courseId }: { courseId: string }) {
  const { courses, mentors, cat } = useAdminContext()
  const course = courses.find((i) => i._id === courseId)

  // Check if course and mentorId exist
  if (!course || !course.mentorId) {
    return <div>Loading...</div> // or any loading state
  }
  if (!course || !course.categoryId) {
    return <div>Loading...</div>
  }

  console.log("edit", course)
  console.log("Mentor Username:", course?.mentorId?.username)

  return (
    <form className="space-y-6 p-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
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
                  defaultValue={course?.title || ""}
                  placeholder="Enter course title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  defaultValue={course?.description || ""}
                  placeholder="Describe your course"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mentor *</Label>
                  <Select defaultValue={course?.mentorId?._id}>
                    <SelectTrigger>
                      <SelectValue>
                        {course?.mentorId?.username || "Select mentor"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {mentors.map((mentor) => (
                        <SelectItem key={mentor._id} value={mentor._id}>
                          {mentor.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select defaultValue={course?.categoryId._id}>
                    <SelectTrigger>
                      <SelectValue>
                        {course?.categoryId?.title || "Select mentor"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {cat.map((ca) => (
                        <SelectItem key={ca._id} value={ca._id as string}>
                          {ca.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media">
  <Card>
    <CardHeader>
      <CardTitle>Course Media</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label>Thumbnail</Label>
        <div className="flex flex-col items-center gap-4">
          {/* Show existing thumbnail or default image */}
          <div className="border-2 border-dashed rounded-md p-8 w-full max-w-md text-center">
            {course?.thumbnail ? (
              <img
                src={course.thumbnail} // Assuming `thumbnail` contains the URL of the existing image
                alt="Course Thumbnail"
                className="w-full h-auto"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Drag and drop image here, or click to select
              </p>
            )}
          </div>

          {/* Input for file upload */}
          <Input type="file" accept="image/*" />
        </div>
      </div>
    </CardContent>
  </Card>
</TabsContent>


        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    defaultValue={course?.price}
                    className="pl-8"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Language *</Label>
                <Select defaultValue={course?.courseLanguage}>
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

        {/* Schedule Tab */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Course Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    defaultValue={course?.startDate?.split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    defaultValue={course?.endDate?.split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" defaultValue={course?.startTime} />
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


import { z } from "zod"

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  mentorId: z.string().min(1, "Mentor is required"),
  categoryId: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be a positive number"),
  language: z.string().min(1, "Language is required"),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  startTime: z.string().optional(),
})

export type CourseFormValues = z.infer<typeof courseSchema>

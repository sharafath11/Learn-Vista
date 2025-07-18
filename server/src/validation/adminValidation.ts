import { ICourse } from "../types/classTypes";
import { throwError } from "../utils/ResANDError";

export interface CoursePayload {
  title: string;
  description: string;
  mentorId: string;
  categoryId: string;
  category: string;
  price: number;
  courseLanguage: string;
  tags: string;
  startDate: string;
  endDate: string;
  startTime: string;
}

export function validateCoursePayload(data: Partial<ICourse>, thumbnail?: Buffer): void {
  const requiredFields = [
    "title", "description", "mentorId", "categoryId", "category",
    "price", "courseLanguage", "tags", "startDate", "endDate", "startTime"
  ];

  for (const field of requiredFields) {
    if (!data[field as keyof CoursePayload]) {
      throwError(`Missing required field: ${field}`, 400);
    }
  }

  if (typeof data.price !== "string" || data.price <0) {
    throwError("Price must be a positive numbetttr", 400);
  }

  if (!thumbnail || !Buffer.isBuffer(thumbnail)) {
    throwError("Thumbnail file is required and must be a valid buffer", 400);
  }
}

export function validateCategory(title: string, description: string): string | null {
  if (!title || !description) {
    return "Title and description are required";
  }

  if (title.length < 3) {
    return "Title must be at least 3 characters long";
  }

  if (description.length < 10) {
    return "Description must be at least 10 characters long";
  }

  return null;
}
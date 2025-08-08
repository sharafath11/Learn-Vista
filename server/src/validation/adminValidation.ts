import { VALIDATION_MESSAGES } from "../constants/validationMessages";
import { CoursePayload, ICourse } from "../types/classTypes";
import { throwError } from "../utils/ResANDError";


export function validateCoursePayload(data: Partial<ICourse>, thumbnail?: Buffer): void {
  const requiredFields = [
    "title", "description", "mentorId", "categoryId", "category",
    "price", "courseLanguage", "tags", "startDate", "endDate", "startTime"
  ];

  for (const field of requiredFields) {
    if (!data[field as keyof CoursePayload]) {
      throwError(VALIDATION_MESSAGES.COURSE.MISSING_FIELD(field), 400);
    }
  }

  if (!thumbnail || !Buffer.isBuffer(thumbnail)) {
    throwError(VALIDATION_MESSAGES.COURSE.MISSING_THUMBNAIL, 400);
  }
}

export function validateCategory(title: string, description: string): string | null {
  if (!title || !description) {
    return VALIDATION_MESSAGES.CATEGORY.REQUIRED;
  }

  if (title.length < 3) {
    return VALIDATION_MESSAGES.CATEGORY.TITLE_MIN_LENGTH;
  }

  if (description.length < 10) {
    return VALIDATION_MESSAGES.CATEGORY.DESCRIPTION_MIN_LENGTH;
  }

  return null;
}
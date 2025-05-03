import { CourseFormData, ICourse } from "@/src/types/adminTypes";

type ValidationResult = {
    isValid: boolean;
    message: string;
  };
  
  export const validateCourseForm = (data: CourseFormData): ValidationResult => {
    const {
      title,
      description,
      mentorId,
      categoryId,
      price,
      language,
      startDate,
      endDate,
      startTime,
      thumbnail,
    } = data;
  
    if (!title?.trim()) return { isValid: false, message: "Course title is required." };
    if (!description?.trim()) return { isValid: false, message: "Course description is required." };
    if (!mentorId || mentorId.length !== 24) return { isValid: false, message: "Invalid mentor ID." };
    if (!categoryId || categoryId.length !== 24) return { isValid: false, message: "Invalid category ID." };
    if (!language?.trim()) return { isValid: false, message: "Course language is required." };
    if (!startDate) return { isValid: false, message: "Start date is required." };
    if (!endDate) return { isValid: false, message: "End date is required." };
    if (!startTime) return { isValid: false, message: "Start time is required." };
  
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return { isValid: false, message: "Price must be a valid non-negative number." };
    }
    if (!thumbnail) return { isValid: false, message: "Thumbnail image is required." };
    if (new Date(startDate) > new Date(endDate)) {
      return { isValid: false, message: "Start date must be before end date." };
    }
  
    return { isValid: true, message: "Validation successful." };
  };
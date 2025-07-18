import { IMentorSignupData } from "@/src/types/mentorTypes";
import { showInfoToast } from "../utils/Toast";
import { LessonFormValues } from "../app/mentor/courses/[courseId]/addLessonModal";
import { IQuestions } from "../types/lessons";


export const validateMentorSignup = (data?: IMentorSignupData) => {
    if (!data || typeof data !== "object") return "Invalid data provided";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const {
    
    email = "",
    password = "",
    confirmPassword = "",
    experience = 0,
    bio = "",
    phoneNumber = "",
  } = data;

  
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Valid email is required";
  if (!phoneNumber.trim() || !/^\d{10}$/.test(phoneNumber)) return "Valid 10-digit phone number is required";
  
  if (password.length < 8) return "Password must be at least 8 characters long";
  if (!passwordRegex.test(password)) {
    return "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character";
  }
  if (password !== confirmPassword) return "Passwords do not match";
  
  if (isNaN(experience) || experience < 0 || experience > 50) {
    return "Experience must be a number between 0 and 50 years";
  }
  
  if (!bio?.trim() || bio.length < 20) {
    return "Bio must be at least 20 characters long";
  }
  
  return null;
};


export const validateMentorProfile = (profileData: {
  username: string;
  bio: string;
  image?: File | null;
}): boolean => {
  const { username, bio, image } = profileData;
  if (!username.trim()) {
    showInfoToast("Username is required");
    return false;
  }
  
  if (username.length < 3) {
    showInfoToast("Username must be at least 3 characters");
    return false;
  }
  
  if (username.length > 30) {
    showInfoToast("Username must be less than 30 characters");
    return false;
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showInfoToast("Username can only contain letters, numbers, and underscores");
    return false;
  }

  if (bio.length <50) {
    showInfoToast("Bio Minimum 50 characters");
    return false;
  }
  if (image) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; 
    
    if (!validTypes.includes(image.type)) {
      showInfoToast("Only JPEG, PNG, WEBP, or GIF images are allowed");
      return false;
    }
    
    if (image.size > maxSize) {
      showInfoToast("Image must be smaller than 5MB");
      return false;
    }
  }

  return true;
};


export function validateLessonForm(data: LessonFormValues): boolean {
  if (!data.title.trim()) {
    showInfoToast("Title is required");
    return false;
  }

  const desc = data.description.trim();
  if (!desc) {
    showInfoToast("Description is required");
    return false;
  }
  if (desc.length < 20) {
    showInfoToast("Description must be at least 20 characters long");
    return false;
  }

  if (!data.order || isNaN(data.order) || Number(data.order) <= 0) {
    showInfoToast("Order must be a positive number");
    return false;
  }

  if (!data.videoUrl && (data.thumbnail || data.duration)) {
    showInfoToast("If you provide a duration or thumbnail, video URL is required.");
    return false;
  }

  return true;
}


export function isValidQuestion(
  question: Omit<IQuestions, "id" | "isCompleted" | "lessonId">
): boolean {
  const { question: qText, type, options } = question as any;

  if (!qText || qText.trim().length === 0) {
    showInfoToast("Question is required");
    return false;
  }

  if (qText.trim().length < 10) {
    showInfoToast("Question must be at least 10 characters long");
    return false;
  }

  if (!type || !["theory", "practical", "mcq"].includes(type)) {
    showInfoToast("Invalid question type");
    return false;
  }

  if (type === "mcq") {
    if (!Array.isArray(options) || options.length < 2) {
      showInfoToast("At least two options are required for MCQ");
      return false;
    }

    const validOptions = options.filter(
      (opt: string) => typeof opt === "string" && opt.trim().length > 0
    );

    if (validOptions.length < 2) {
      showInfoToast("Each MCQ must have at least two non-empty options");
      return false;
    }
  }

  return true;
}

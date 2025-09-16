import { IQuestions } from "../types/lessons";
import { throwError } from "../utils/resAndError";
import { VALIDATION_MESSAGES } from "../constants/validationMessages";
import { IMentorResponseDto } from "../shared/dtos/mentor/mentor-response.dto";

export const validateMentorSignupInput = (
  data?: Partial<IMentorResponseDto>
): { isValid: boolean; errorMessage?: string } => {
  if (!data || typeof data !== "object") {
    return { isValid: false, errorMessage: VALIDATION_MESSAGES.MENTOR.INVALID_DATA };
  }

  const {
    email = "",
    password = "",
    experience = 0,
    bio = "",
    phoneNumber = "",
  } = data;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim() || !emailRegex.test(email)) {
    return { isValid: false, errorMessage: VALIDATION_MESSAGES.MENTOR.EMAIL };
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneNumber.trim() || !phoneRegex.test(phoneNumber)) {
    return { isValid: false, errorMessage: VALIDATION_MESSAGES.MENTOR.PHONE };
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!password || !strongPasswordRegex.test(password)) {
    return { isValid: false, errorMessage: VALIDATION_MESSAGES.MENTOR.PASSWORD };
  }

  if (isNaN(experience) || experience < 0 || experience > 50) {
    return { isValid: false, errorMessage: VALIDATION_MESSAGES.MENTOR.EXPERIENCE };
  }

  if (!bio?.trim() || bio.length < 100) {
    return { isValid: false, errorMessage: VALIDATION_MESSAGES.MENTOR.BIO };
  }

  return { isValid: true };
};

export const validateMentorProfile = (profileData: {
  username: string;
  bio: string;
  image?: Express.Multer.File | null;
}): boolean => {
  const { username, bio, image } = profileData;

  if (!username.trim()) {
    throwError(VALIDATION_MESSAGES.MENTOR.PROFILE_USERNAME_REQUIRED);
    return false;
  }

  if (username.length < 3) {
    throwError(VALIDATION_MESSAGES.MENTOR.PROFILE_USERNAME_TOO_SHORT);
    return false;
  }

  if (username.length > 30) {
    throwError(VALIDATION_MESSAGES.MENTOR.PROFILE_USERNAME_TOO_LONG);
    return false;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throwError(VALIDATION_MESSAGES.MENTOR.PROFILE_USERNAME_INVALID);
    return false;
  }

  if (bio.length < 50) {
    throwError(VALIDATION_MESSAGES.MENTOR.PROFILE_BIO_TOO_SHORT);
    return false;
  }

  if (image) {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(image.mimetype)) {
      throwError(VALIDATION_MESSAGES.MENTOR.PROFILE_IMAGE_TYPE, 400);
    }

    if (image.size > maxSize) {
      throwError(VALIDATION_MESSAGES.MENTOR.PROFILE_IMAGE_SIZE, 400);
    }
  }

  return true;
};

export function validateQuestion(
  question: Omit<IQuestions, "id" | "isCompleted">
): string | null {
  if (!question.question || question.question.trim().length < 10) {
    return VALIDATION_MESSAGES.QUESTION.TEXT_TOO_SHORT;
  }

  if (question.type !== "theory" && question.type !== "practical") {
    return VALIDATION_MESSAGES.QUESTION.INVALID_TYPE;
  }

  if (!question.lessonId || question.lessonId.trim().length === 0) {
    return VALIDATION_MESSAGES.QUESTION.LESSON_ID_REQUIRED;
  }

  return null;
}

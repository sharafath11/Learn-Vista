import { VALIDATION_MESSAGES } from "../constants/validationMessages";
import { logger } from "../utils/logger";
import { throwError } from "../utils/resAndError";


export const validateUserSignupInput = (
  username: string,
  email: string,
  password: string,
  role: string
): void => {
  if (!username || username.trim().length === 0) {
    throwError(VALIDATION_MESSAGES.USER.NAME_REQUIRED);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throwError(VALIDATION_MESSAGES.USER.EMAIL_INVALID);
  }

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!password || !strongPasswordRegex.test(password)) {
    throwError(VALIDATION_MESSAGES.USER.PASSWORD_WEAK);
  }

  if (role !== "user") {
    throwError(VALIDATION_MESSAGES.USER.ROLE_INVALID);
  }
};

export const validateMentorApplyInput = (
  email: string,
  username: string,
  phoneNumber: string,
  file: Express.Multer.File | null,
  expertise: string
): { isValid: boolean; errorMessage?: string } => {
  if (!file) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.MENTOR.FILE_REQUIRED,
    };
  }

  if (!email?.trim() || !username?.trim() || !phoneNumber?.trim()) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.MENTOR.REQUIRED_FIELDS,
    };
  }

  let parsedExpertise: string[];
  try {
    parsedExpertise = JSON.parse(expertise);
  } catch (error) {
    logger.warn(error);
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.MENTOR.EXPERTISE_INVALID_FORMAT,
    };
  }

  if (!Array.isArray(parsedExpertise) || parsedExpertise.length === 0) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.MENTOR.EXPERTISE_REQUIRED,
    };
  }

  for (const expert of parsedExpertise) {
    if (typeof expert !== "string" || expert.trim().length === 0) {
      return {
        isValid: false,
        errorMessage: VALIDATION_MESSAGES.MENTOR.EXPERTISE_INVALID_ITEM,
      };
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.MENTOR.EMAIL_INVALID,
    };
  }

  const phoneRegex = /^[\d\s+()-]{10,15}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.MENTOR.PHONE_INVALID,
    };
  }

  if (file.mimetype !== "application/pdf") {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.MENTOR.FILE_TYPE_INVALID,
    };
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      errorMessage: VALIDATION_MESSAGES.MENTOR.FILE_TOO_LARGE,
    };
  }

  return { isValid: true };
};

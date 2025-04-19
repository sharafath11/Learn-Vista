import { IMentor } from "../types/mentorTypes";

export const validateMentorSignupInput = (
  data?: Partial<IMentor>
): { isValid: boolean; errorMessage?: string } => {
  if (!data || typeof data !== "object") {
    return { isValid: false, errorMessage: "Invalid data provided" };
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
    return { isValid: false, errorMessage: "Valid email is required" };
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneNumber.trim() || !phoneRegex.test(phoneNumber)) {
    return {
      isValid: false,
      errorMessage: "Valid 10-digit phone number is required",
    };
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!password || !strongPasswordRegex.test(password)) {
    return {
      isValid: false,
      errorMessage: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    };
  }

  if (isNaN(experience) || experience < 0 || experience > 50) {
    return {
      isValid: false,
      errorMessage: "Experience must be a number between 0 and 50 years",
    };
  }

  if (!bio?.trim() || bio.length < 20) {
    return {
      isValid: false,
      errorMessage: "Bio must be at least 20 characters long",
    };
  }

  return { isValid: true };
};
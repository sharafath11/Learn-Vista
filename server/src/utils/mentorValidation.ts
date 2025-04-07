
import { IMentor } from "../types/mentorTypes";

export const validateMentorSignupInput = (
  data?:  Partial<IMentor>
): { isValid: boolean; errorMessage?: string } => {
  if (!data || typeof data !== "object") {
    return { isValid: false, errorMessage: "Invalid data provided" };
  }

  const {
    username = "",
    email = "",
    password = "",
    expertise = [],
    experience = 0,
    bio = "",
    phoneNumber = "",
  } = data;

  if (!username.trim()) {
    return { isValid: false, errorMessage: "Username is required" };
  }

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

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!password || !strongPasswordRegex.test(password)) {
    return {
      isValid: false,
      errorMessage:
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    };
  }

 

  if (!Array.isArray(expertise) || expertise.length === 0) {
    return {
      isValid: false,
      errorMessage: "At least one area of expertise is required",
    };
  }

  if (isNaN(experience) || experience < 0 || experience > 50) {
    return {
      isValid: false,
      errorMessage: "Experience must be a number between 0 and 50",
    };
  }

  if (!bio?.trim() || bio.length < 10) {
    return {
      isValid: false,
      errorMessage: "Bio must be at least 10 characters long",
    };
  }

  return { isValid: true };
};

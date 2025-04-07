import { MentorSignupData } from "@/src/types/mentorTypes";

export const validateMentorSignup = (data?: MentorSignupData) => {
    if (!data || typeof data !== "object") return "Invalid data provided";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const {
    username = "",
    email = "",
    password = "",
    confirmPassword = "",
    expertise = [],
    experience = 0,
    bio = "",
    phoneNumber = "",
  } = data;

  if (!username.trim()) return "Username is required";
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Valid email is required";
  if (!phoneNumber.trim() || !/^\d{10}$/.test(phoneNumber)) return "Valid 10-digit phone number is required";
  if (password.length < 6) return "Password must be at least 6 characters long";
  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters long, include uppercase, lowercase, number, and special character";
  }
  if (!Array.isArray(expertise) || expertise.length === 0) return "At least one area of expertise is required";
  if (isNaN(experience) || experience < 0 || experience > 50) return "Experience must be a number between 0 and 50";
  if (!bio?.trim() || (bio?.length ?? 0) < 10) {
    return "Bio must be at least 10 characters long";
  }
  
  return null;
};

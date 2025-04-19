import { MentorSignupData } from "@/src/types/mentorTypes";

export const validateMentorSignup = (data?: MentorSignupData) => {
    if (!data || typeof data !== "object") return "Invalid data provided";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const {
    username = "",
    email = "",
    password = "",
    confirmPassword = "",
    experience = 0,
    bio = "",
    phoneNumber = "",
  } = data;

  if (!username.trim()) return "Username is required";
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
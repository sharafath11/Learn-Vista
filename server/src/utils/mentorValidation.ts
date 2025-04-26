import { IMentor } from "../types/mentorTypes";
import { throwError } from "./ResANDError";

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

  if (!bio?.trim() || bio.length < 100) {
    return {
      isValid: false,
      errorMessage: "Bio must be at least 100 characters long",
    };
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
    throwError("Username is required");
    return false;
  }
  
  if (username.length < 3) {
    throwError("Username must be at least 3 characters");
    return false;
  }
  
  if (username.length > 30) {
    throwError("Username must be less than 30 characters");
    return false;
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throwError("Username can only contain letters, numbers, and underscores");
    return false;
  }

  if (bio.length > 100) {
    throwError("Bio must be less than 100 characters");
    return false;
  }
  if (image) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; 
    
    if (image) {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; 
      
      if (!validTypes.includes(image.mimetype)) {
        throwError("Only JPEG, PNG, WEBP, or GIF images are allowed", 400);
      }
      
      if (image.size > maxSize) {
        throwError("Image must be smaller than 5MB", 400);
      }
    }
  }

  return true;
};
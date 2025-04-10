

export const validateUserSignupInput = (
  username: string,
    email: string,
    password: string,
    role: string
): void => {
  console.log("dddddddddd",username)
    if (!username || username.trim().length === 0) {
      throw new Error("Name is required");
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error("Please enter a valid email address");
    }
  
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!password || !strongPasswordRegex.test(password)) {
      throw new Error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
    }
  
    if (role !== "user") {
      throw new Error("Invalid role");
    }
  };
  export const validateMentorApplyInput = (
    email: string,
    username: string,
    phoneNumber: string,
    file: Express.Multer.File | null
  ): { isValid: boolean; errorMessage?: string } => {
    if (!file) return { isValid: false, errorMessage: "No file uploaded" };
  
    if (!email?.trim() || !username?.trim() || !phoneNumber?.trim()) {
      return { isValid: false, errorMessage: "Email, username, and phone number are required" };
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, errorMessage: "Please enter a valid email" };
    }
  
    if (!/^[\d\s\+\-\(\)]{10,15}$/.test(phoneNumber)) {
      return { isValid: false, errorMessage: "Please enter a valid phone number" };
    }
  
    if (file.mimetype !== "application/pdf") {
      return { isValid: false, errorMessage: "Only PDF files are accepted" };
    }
  
    const MAX_FILE_SIZE = 5 * 1024 * 1024; 
    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, errorMessage: "File must be smaller than 5MB" };
    }
  
    return { isValid: true };
  };
  
import { MentorApplyFormData, MentorApplyFormErrors } from "@/src/types/authTypes";

export const validateMentorApplyForm = (
  formData: MentorApplyFormData,
  selectedFile: File | null
): { isValid: boolean; errors: MentorApplyFormErrors } => {
  const newErrors: MentorApplyFormErrors = {
    name: "",
    email: "",
    phoneNumber: "",
    file: "",
    socialLink: ""
  };

  let isValid = true;
  if (!formData.username.trim()) {
    newErrors.name = "Name is required";
    isValid = false;
  }
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email";
    isValid = false;
  }
  if (!formData.phoneNumber.trim()) {
    newErrors.phoneNumber = "Phone number is required";
    isValid = false;
  } else if (!/^[\d\s\+\-\(\)]{10,15}$/.test(formData.phoneNumber)) {
    newErrors.phoneNumber = "Please enter a valid phone number";
    isValid = false;
  }
  if (!selectedFile) {
    newErrors.file = "Please upload your CV/resume";
    isValid = false;
  } else if (selectedFile.type !== "application/pdf") {
    newErrors.file = "Only PDF files are allowed";
    isValid = false;
  }
  if (formData.socialLinks && formData.socialLinks.length > 0) {
    for (const link of formData.socialLinks) {
      try {
        new URL(link.url);
        if (link.platform === 'LinkedIn' && !link.url.includes('linkedin.com')) {
          newErrors.socialLink = "Please enter a valid LinkedIn URL (should contain linkedin.com)";
          isValid = false;
        }
      } catch (e) {
        newErrors.socialLink = "Please enter a valid URL";
        isValid = false;
      }
    }
  }

  return { isValid, errors: newErrors };
};export const validateSignup = (userData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): { isValid: boolean; message: string } => {
  if (!userData.username.trim()) {
    return { isValid: false, message: "Full name is required" };
  }
  if (userData.username.length < 3) {
    return { isValid: false, message: "Full name must be at least 3 characters" };
  }
  if (userData.username.length > 50) {
    return { isValid: false, message: "Full name must be less than 50 characters" };
  }
  if (!/^[a-zA-Z\s'-]+$/.test(userData.username)) {
    return { isValid: false, message: "Full name contains invalid characters" };
  }
  if (!userData.email.trim()) {
    return { isValid: false, message: "Email is required" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  if (!userData.password) {
    return { isValid: false, message: "Password is required" };
  }
  if (userData.password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(userData.password)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(userData.password)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(userData.password)) {
    return { isValid: false, message: "Password must contain at least one number" };
  }
  if (!/[^A-Za-z0-9]/.test(userData.password)) {
    return { isValid: false, message: "Password must contain at least one special character" };
  }
  if (userData.password !== userData.confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }

  return { isValid: true, message: "" };
};
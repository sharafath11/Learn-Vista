import { IUserRegistration, MentorApplyFormData, MentorApplyFormErrors } from "../../types/authTypes";
import { showInfoToast } from "../Toast";

export function registrationValidation(userData: IUserRegistration): boolean {
  const { name, email, password, confirmPassword, role } = userData;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!name || name.trim().length === 0) {
    showInfoToast("Name is required");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    showInfoToast("Please enter a valid email address");
    return false;
  }

  if (!password || !strongPasswordRegex.test(password)) {
    showInfoToast(
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
    );
    return false;
  }

  if (confirmPassword !== password) {
    showInfoToast("Passwords do not match");
    return false;
  }

  if (role !== "user") {
    showInfoToast("Invalid role");
    return false;
  }

  return true;
}
export const validateMentorApplyForm = (
  formData: MentorApplyFormData,
  selectedFile: File | null
): { isValid: boolean; errors: MentorApplyFormErrors } => {
  let isValid = true;
  const newErrors: MentorApplyFormErrors = {
    name: "",
    email: "",
    phoneNumber: "",
    file: "",
  };

  if (!formData.name.trim()) {
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
  

  return { isValid, errors: newErrors };
};

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

  // Name validation
  if (!formData.username.trim()) {
    newErrors.name = "Name is required";
    isValid = false;
  }

  // Email validation
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email";
    isValid = false;
  }

  // Phone validation
  if (!formData.phoneNumber.trim()) {
    newErrors.phoneNumber = "Phone number is required";
    isValid = false;
  } else if (!/^[\d\s\+\-\(\)]{10,15}$/.test(formData.phoneNumber)) {
    newErrors.phoneNumber = "Please enter a valid phone number";
    isValid = false;
  }

  // File validation
  if (!selectedFile) {
    newErrors.file = "Please upload your CV/resume";
    isValid = false;
  } else if (selectedFile.type !== "application/pdf") {
    newErrors.file = "Only PDF files are allowed";
    isValid = false;
  }

  // Social links validation - Only strict validation for LinkedIn
  if (formData.socialLinks && formData.socialLinks.length > 0) {
    for (const link of formData.socialLinks) {
      try {
        // Basic URL validation for all links
        new URL(link.url);
        
        // Strict validation only for LinkedIn
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
};
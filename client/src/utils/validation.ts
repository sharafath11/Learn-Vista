import { IUserRegistration } from "../types/authTypes";
import { showInfoToast } from "./Toast";

export function registrationValidation(userData: IUserRegistration): boolean {
    if (!userData.name.trim()) {
      showInfoToast("Name is required");
      return false;
    }
  
    if (!userData.email.includes("@") || !userData.email.includes(".")) {
      showInfoToast("Invalid email address");
      return false;
    }
  
    if (userData.password.length < 6) {
      showInfoToast("Password must be at least 6 characters long");
      return false;
    }
  
    if (userData.confirmPassword !== userData.password) {
      showInfoToast("Confirm password does not match");
      return false;
    }
  
    if (!["user", "mentor"].includes(userData.role)) {
      showInfoToast("Invalid role selected");
      return false;
    }
  
    return true;
  } 
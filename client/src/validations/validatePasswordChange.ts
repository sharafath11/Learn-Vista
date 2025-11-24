export function validatePasswordChange(currentPassword: string, newPassword: string, confirmPassword: string) {
  const current = currentPassword.trim();
  const newPass = newPassword.trim();
  const confirm = confirmPassword.trim();
  if (!current) {
    return { isValid: false, message: "Current password is required." };
  }
  if (!newPass) {
    return { isValid: false, message: "New password is required." };
  }

  if (newPass === current) {
    return { isValid: false, message: "New password must be different from your current password." };
  }

  if (newPass.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long." };
  }

  if (newPass.length > 128) {
    return { isValid: false, message: "Password is too long." };
  }

  if (!/[A-Z]/.test(newPass)) {
    return { isValid: false, message: "Password must contain at least one uppercase letter." };
  }

  if (!/[a-z]/.test(newPass)) {
    return { isValid: false, message: "Password must contain at least one lowercase letter." };
  }

  if (!/[0-9]/.test(newPass)) {
    return { isValid: false, message: "Password must contain at least one number." };
  }

  if (!/[^A-Za-z0-9]/.test(newPass)) {
    return { isValid: false, message: "Password must contain at least one special character." };
  }

  if (newPass !== confirm) {
    return { isValid: false, message: "New password and confirm password do not match." };
  }

  return { isValid: true };
}

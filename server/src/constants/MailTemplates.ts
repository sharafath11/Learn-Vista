
export const MailTemplates = {
  OTP: {
    SUBJECT: "Your OTP Code",
    TEXT: (otp: string) =>
      `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  },

  MENTOR_STATUS_CHANGE: {
    SUBJECT: "Mentor Status Updated",
    TEXT: (status: string) =>
      `Dear Mentor,\n\nYour application status has been updated to: ${status.toUpperCase()}.\n\nThank you!`,
  },

  PASSWORD_RESET: {
    SUBJECT: "Password Reset Request",
    TEXT: (resetLink: string) =>
      `Password Reset Link: ${resetLink}\n\nThis link expires in 1 hour.`,
    HTML: (resetLink: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #2563eb;">Password Reset</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" 
           style="display: inline-block; padding: 10px 20px; 
                  background: #2563eb; color: white; 
                  text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p style="margin-top: 20px; color: #6b7280;">
          This link expires in <strong>1 hour</strong>.
        </p>
      </div>
    `,
  },
};

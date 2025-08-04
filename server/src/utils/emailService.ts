import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { logger } from "./logger";
dotenv.config();


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmailOtp(email: string, otp: string) {
logger.info(otp)
  const mailOptions = {
    from: `"Learn Vista" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}
export async function sendMentorStatusChangeEmail(email: string, status: string) {
  
  const mailOptions = {
    from: `"Learn Vista" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Mentor Status Updated",
    text: `Dear Mentor,\n\nYour application status has been updated to: ${status.toUpperCase()}.\n\nThank you!`,
  };
 
 

  await transporter.sendMail(mailOptions);
}

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  try {
    const mailOptions = {
      from: `"Learn Vista" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Password Reset Request",
      html: `
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
      text: `Password Reset Link: ${resetLink}\n\nThis link expires in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to send email' };
  }
};

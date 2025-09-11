import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { logger } from "./logger";
import { MailTemplates } from "../constants/mailTemplates";

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
  logger.info("Sending OTP:", otp);
  const mailOptions = {
    from: `"Learn Vista" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: MailTemplates.OTP.SUBJECT,
    text: MailTemplates.OTP.TEXT(otp),
  };

  await transporter.sendMail(mailOptions);
}

export async function sendMentorStatusChangeEmail(email: string, status: string) {
  const mailOptions = {
    from: `"Learn Vista" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: MailTemplates.MENTOR_STATUS_CHANGE.SUBJECT,
    text: MailTemplates.MENTOR_STATUS_CHANGE.TEXT(status),
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  try {
    const mailOptions = {
      from: `"Learn Vista" <${process.env.EMAIL_USER}>`,
      to,
      subject: MailTemplates.PASSWORD_RESET.SUBJECT,
      html: MailTemplates.PASSWORD_RESET.HTML(resetLink),
      text: MailTemplates.PASSWORD_RESET.TEXT(resetLink),
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to send email" };
  }
}

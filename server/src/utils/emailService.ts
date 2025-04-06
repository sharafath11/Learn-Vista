import nodemailer from "nodemailer";
import dotenv from "dotenv";
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
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  await transporter.sendMail(mailOptions);
}
export async function sendMentorStatusChangeEmail(email: string, status: string) {
  console.log("ssss");
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Mentor Status Updated",
    text: `Dear Mentor,\n\nYour application status has been updated to: ${status.toUpperCase()}.\n\nThank you!`,
  };
 
 

  await transporter.sendMail(mailOptions);
}

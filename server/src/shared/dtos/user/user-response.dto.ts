import { IReson } from "../../../types/mentorTypes";
import { IEnrolledCourse, IMentorStudentEnroledCourse, userEnrolled } from "../../../types/userTypes";

export interface IUserResponseDto {
  id: string;
  username: string;
  email: string;
  role: string;
  profilePicture?: string | null;
  isBlocked: boolean;
  isVerified: boolean;
  enrolledCourses: string[];
  createdAt?: Date;
  updatedAt?: Date;
  googleUser: boolean;
  googleId?: string;
}

export interface IAdminUserResponseDto {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  status: boolean;
  profilePicture?: string | null;
}

export interface IAdminUserCertificate {
  id: string;
  courseTitle: string;
  certificateId: string;
  issuedDateFormatted: string;
  qrCodeUrl: string;
  isRevoked: boolean;
}
export interface IMentorStudentResposnse{
  id: string,
  username: string,
  email: string,
  profilePicture: string,
  isBlocked: boolean;
  enrolledCourses: IMentorStudentEnroledCourse[];
  isVerified:boolean
}
export interface IUserResponseUser{
  id: string,
  username: string,
  email: string,
  enrolledCourses: userEnrolled[]
  profilePicture:string
}
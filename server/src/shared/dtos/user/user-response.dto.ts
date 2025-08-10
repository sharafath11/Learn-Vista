export interface UserResponseDto {
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
  googleId: string;
}
export class AdminUserResponseDto {
  id!:string;
  username!: string;
  email!: string;
  createdAt!: Date;
  status!: boolean; 
  profilePicture?: string | null;
}
export class AdminUserCertificate{
  id!: string
  courseTitle!: string
  certificateId!: string
  issuedDateFormatted!: string;
  qrCodeUrl!: string;
  isRevoked!: boolean;

}
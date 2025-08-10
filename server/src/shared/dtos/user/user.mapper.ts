
import { ICertificate } from "../../../types/certificateTypes";
import { IUser } from "../../../types/userTypes";
import { AdminUserCertificate, AdminUserResponseDto, UserResponseDto } from "./user-response.dto";

export class UserMapper {
  static toResponseDto(user: IUser): UserResponseDto {
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture || null,
      isBlocked: user.isBlocked,
      isVerified: user.isVerified,
      enrolledCourses: user.enrolledCourses.map(c => c.courseId.toString()),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      googleUser: user.googleUser,
      googleId: user.googleId
    };
  }
  static toResponsAdminUsereDto(user: IUser): AdminUserResponseDto {
      console.log(user)
      return {
      id:user._id.toString(),
      username: user.username,
      email: user.email,
      createdAt: user.createdAt || new Date(),
      status: user.isBlocked,
      profilePicture:user.profilePicture
      
    };
  }
static toResponsAdminUserCertificateDto(certificate: ICertificate): AdminUserCertificate {
  return {
    id: certificate._id.toString(),
    courseTitle: certificate.courseTitle,
    certificateId: certificate.certificateId,
    issuedDateFormatted: certificate.issuedDateFormatted,
    qrCodeUrl: certificate.qrCodeUrl,
    isRevoked: certificate.isRevoked,
  };
}

}

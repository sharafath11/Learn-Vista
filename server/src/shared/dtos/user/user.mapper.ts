
import { ICertificate } from "../../../types/certificateTypes";
import { IUser } from "../../../types/userTypes";
import { IAdminUserCertificate, IAdminUserResponseDto, IUserResponseDto } from "./user-response.dto";

export class UserMapper {
  static toResponseDto(user: IUser): IUserResponseDto {
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
  static toResponsAdminUsereDto(user: IUser): IAdminUserResponseDto {
      return {
      id:user._id.toString(),
      username: user.username,
      email: user.email,
      createdAt: user.createdAt || new Date(),
      status: user.isBlocked,
      profilePicture:user.profilePicture
      
    };
  }
static toResponsAdminUserCertificateDto(certificate: ICertificate): IAdminUserCertificate {
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

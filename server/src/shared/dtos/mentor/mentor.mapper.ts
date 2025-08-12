import { IMentor } from "../../../types/mentorTypes";
import { IMentorResponseDto, IAdminMentorResponseDto, IAdminAddCourseMentorsDto, IMentorMentorResponseDto } from "./mentor-response.dto";

export class MentorMapper {
  static toResponseDto(mentor: IMentor): IMentorResponseDto {
    return {
      id: mentor._id.toString(),
      userId: mentor.userId.toString(),
      profilePicture: mentor.profilePicture || null,
      email: mentor.email,
      phoneNumber: mentor.phoneNumber,
      username: mentor.username,
      experience: mentor.experience,
      expertise: mentor.expertise,
      googleMentor: mentor.googleMentor || false,
      courses: mentor.courses ? mentor.courses.map(c => c._id?.toString?.() || c.toString()) : [],
      role: mentor.role,
      googleId: mentor.googleId,
      status: mentor.status,
      isBlock: mentor.isBlock,
      bio: mentor.bio,
      socialLinks: mentor.socialLinks,
      liveClasses: mentor.liveClasses.map(c => c.toString()),
      coursesCreated: mentor.coursesCreated.map(c => c.toString()),
      reviews: mentor.reviews.map(r => r.toString()),
      applicationDate: mentor.applicationDate,
      isVerified: mentor.isVerified,
      cvOrResume: mentor.cvOrResume,
      createdAt: mentor.createdAt,
    };
  }
   static toResponseAdminDto(mentor: IMentor): IAdminMentorResponseDto {
    return {
      id: mentor._id.toString(),
      username: mentor.username,
      coursesCreated:mentor.coursesCreated.toString(),
      expertise: mentor.expertise,
      status: mentor.status,
      students: mentor.courses ? mentor.courses.reduce((total, course) => total + (course.students || 0), 0) : 0,
      courses: mentor.courses ? mentor.courses.length : 0,
      isBlock: mentor.isBlock,
      liveClasses: mentor.liveClasses.map(lc => lc.toString()),
      cvOrResume: mentor.cvOrResume,
        email: mentor.email,
        profilePicture:mentor.profilePicture||"",
      phoneNumber: mentor.phoneNumber,
      socialLinks:mentor.socialLinks
    };
   }
  static toAdminCourseMentorDet(mentor: IMentor): IAdminAddCourseMentorsDto{
    return {
      id: mentor._id.toString(),
      username: mentor.username,
      isBlock: mentor.isBlock,
      isVerified: mentor.isVerified,
      expertise:mentor.expertise
    }
  }
static toMentorMentorResponse(mentor: IMentor, signedUrl?: string): IMentorMentorResponseDto {
  return {
    id: mentor.id,
    username: mentor.username,
    email: mentor.email,
    expertise: mentor.expertise,
    experience: mentor.experience,
    bio: mentor.bio||"",
    applicationDate: mentor.applicationDate,
    phoneNumber: mentor.phoneNumber || "",
    profilePicture:signedUrl||"",
    socialLinks: mentor.socialLinks,
    liveClasses: mentor.liveClasses.toString(),
    coursesCreated: mentor.coursesCreated.toString(),
    reviews: mentor.reviews.toString()
  };
}


}

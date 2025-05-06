import { inject, injectable } from 'inversify';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { IMentor } from '../../types/mentorTypes';
import { throwError } from '../../utils/ResANDError'; 
import { ICourse, IPopulatedCourse } from '../../types/classTypes';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';

@injectable()
export class MentorService implements IMentorService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
    @inject (TYPES.CourseRepository) private courseRepo:ICourseRepository
  ) {}

  async getMentor(id: string): Promise<Partial<IMentor>> {
    const mentor = await this.mentorRepo.findById(id);
   
    console.log(mentor);
    
    if (!mentor) {
      throwError("Please login", 401); 
    }
    
    if (mentor.isBlock) {
      throwError("Your account was blocked. Please contact support", 403); 
    }
    return {
      username: mentor.username,
      email: mentor.email,
      expertise: mentor.expertise,
      experience: mentor.experience,
      bio: mentor.bio,
      applicationDate: mentor.applicationDate,
      phoneNumber: mentor.phoneNumber || "",
      profilePicture: mentor.profilePicture,
      socialLinks: mentor.socialLinks,
      liveClasses: mentor.liveClasses,
      coursesCreated: mentor.coursesCreated,
      reviews: mentor.reviews
    };
  }
  async getCourses(id: string): Promise<IPopulatedCourse[]> {
    const courses=await this.courseRepo.findWithMenorIdgetAllWithPopulatedFields(id)
    const result = await this.courseRepo.findAll({ mentorId: id });
    if(!result) throwError("You dont have any Courses ")
    return courses
  }
  async courseApproveOrReject(
    mentorId: string,
    courseId: string,
    status: string,
    courseRejectReason?: string
  ): Promise<void> {
    console.log(status)
    if (status !== "approved" && status !== "rejected") {
      throwError("Invalid status", 400);
    }
    console.log("yd",courseId)
  
    if (status === "approved") {
      await this.mentorRepo.update(mentorId, {
        $push: { coursesCreated: courseId }
      });
      await this.courseRepo.update(courseId, {
        mentorStatus: "approved"
      });
      return;
    }
  
    if (!courseRejectReason) {
      throwError("Rejection reason required", 400);
    }
  
    await this.mentorRepo.update(mentorId, {
      $push: {
        courseRejectReson: {
          courseId,
          message: courseRejectReason
        }
      }
    });
  
    await this.courseRepo.update(courseId, {
      mentorStatus: "rejected"
    });
  }
}

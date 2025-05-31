import { inject, injectable } from 'inversify';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { IMentor } from '../../types/mentorTypes';
import { throwError } from '../../utils/ResANDError'; 
import { ICourse, IPopulatedCourse } from '../../types/classTypes';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { StatusCode } from '../../enums/statusCode.enum'; // Consistent StatusCode Enum

@injectable()
export class MentorService implements IMentorService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
    @inject(TYPES.CourseRepository) private courseRepo: ICourseRepository
  ) {}

  async getMentor(id: string): Promise<Partial<IMentor>> {
    const mentor = await this.mentorRepo.findById(id);

    if (!mentor) {
      throwError("Please login", StatusCode.UNAUTHORIZED); 
    }

    if (mentor.isBlock) {
      throwError("Your account was blocked. Please contact support", StatusCode.FORBIDDEN); 
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
    console.log("fgg",id)
    const courses = await this.courseRepo.findWithMenorIdgetAllWithPopulatedFields(id);
    if (!courses) throwError("You don't have any courses", StatusCode.NOT_FOUND); 
    return courses;
  }

  async courseApproveOrReject(
    mentorId: string,
    courseId: string,
    status: string,
    courseRejectReason?: string
  ): Promise<void> {
    if (status !== "approved" && status !== "rejected") {
      throwError("Invalid status", StatusCode.BAD_REQUEST); 
    }

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
      throwError("Rejection reason required", StatusCode.BAD_REQUEST); 
    }

    await this.mentorRepo.update(mentorId, {
      $push: {
        courseRejectReason: {
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


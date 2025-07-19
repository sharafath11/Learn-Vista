import { inject, injectable } from 'inversify';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import { IMentorService } from '../../core/interfaces/services/mentor/IMentor.Service';
import { TYPES } from '../../core/types';
import { IMentor } from '../../types/mentorTypes';
import { throwError } from '../../utils/ResANDError'; 
import { ICategory,IPopulatedCourse } from '../../types/classTypes';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { StatusCode } from '../../enums/statusCode.enum'; 
import { ICategoriesRepository } from '../../core/interfaces/repositories/course/ICategoriesRepository';

@injectable()
export class MentorService implements IMentorService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository,
    @inject(TYPES.CourseRepository) private courseRepo: ICourseRepository,
    @inject(TYPES.CategoriesRepository) private catRepo:ICategoriesRepository
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
      id:mentor.id,
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
  async courseWithPagenated({
  mentorId,
  page,
  limit,
  search,
  filters,
  sort
}: {
  mentorId: string;
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, unknown>;
  sort?: Record<string, 1 | -1>;
    }): Promise<{ data: IPopulatedCourse[]; total: number; categories:ICategory[] }> {
  const { data, total } = await this.courseRepo.fetchMentorCoursesWithFilters({
    mentorId,
    page,
    limit,
    search,
    filters,
    sort: sort || { createdAt: -1 },
  });
  const categories=await this.catRepo.findAll()
  return { data, total,categories };
}


}


import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorCourseService } from "../../core/interfaces/services/mentor/IMentorCourse.Service";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { ICategory, IPopulatedCourse } from "../../types/classTypes";
import { StatusCode } from "../../enums/statusCode.enum";
import { throwError } from "../../utils/ResANDError";
import { convertSignedUrlInArray } from "../../utils/s3Utilits";

@injectable()
export class MentorCourseService implements IMentorCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private courseRepo: ICourseRepository,
    @inject(TYPES.CategoriesRepository) private catRepo: ICategoriesRepository,
    @inject(TYPES.MentorRepository) private mentorRepo: IMentorRepository
  ) {}

  async getCourses(mentorId: string): Promise<IPopulatedCourse[]> {
    const courses = await this.courseRepo.findWithMenorIdgetAllWithPopulatedFields(mentorId);
    if (!courses) throwError("You don't have any courses", StatusCode.NOT_FOUND);
    return convertSignedUrlInArray(courses, ["thumbnail"]);
  }

  async courseApproveOrReject(
    mentorId: string,
    courseId: string,
    status: string,
    courseRejectReason?: string
  ): Promise<void> {
    if (!["approved", "rejected"].includes(status)) {
      throwError("Invalid status", StatusCode.BAD_REQUEST);
    }

    if (status === "approved") {
      await this.mentorRepo.update(mentorId, {
        $push: { coursesCreated: courseId }
      });
      await this.courseRepo.update(courseId, { mentorStatus: "approved" });
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
  }): Promise<{ data: IPopulatedCourse[]; total: number; categories: ICategory[] }> {
    const { data, total } = await this.courseRepo.fetchMentorCoursesWithFilters({
      mentorId,
      page,
      limit,
      search,
      filters,
      sort: sort || { createdAt: -1 }
    });
    const categories = await this.catRepo.findAll();
    const sendCourses = await convertSignedUrlInArray(data, ["thumbnail"]);
    return { data: sendCourses, total, categories };
  }
 async publishCourse(courseId: string,status:boolean): Promise<void> {
    await this.courseRepo.update(courseId,{isActive:status})
 }
}

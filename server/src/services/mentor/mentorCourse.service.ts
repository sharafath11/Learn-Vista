import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { IMentorCourseService } from "../../core/interfaces/services/mentor/IMentorCourse.Service";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { ICategory, IPopulatedCourse } from "../../types/classTypes";
import { StatusCode } from "../../enums/statusCode.enum";
import { throwError } from "../../utils/resAndError";
import { convertSignedUrlInArray } from "../../utils/s3Utilits";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { Messages } from "../../constants/messages";
import { ICourseMentorResponseDto } from "../../shared/dtos/courses/course-response.dto";
import { CourseMapper } from "../../shared/dtos/courses/course.mapping";
import { ICategoryMentorCourseResponse } from "../../shared/dtos/categories/category-response.dto";
import { CategoryMapper } from "../../shared/dtos/categories/category.mapper";

@injectable()
export class MentorCourseService implements IMentorCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private _courseRepo: ICourseRepository,
    @inject(TYPES.CategoriesRepository) private _catRepo: ICategoriesRepository,
    @inject(TYPES.MentorRepository) private _mentorRepo: IMentorRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.UserRepository) private _userRepo:IUserRepository
  ) {}

  async getCourses(mentorId: string): Promise<ICourseMentorResponseDto[]> {
    const courses = await this._courseRepo.findWithMenorIdgetAllWithPopulatedFields(mentorId);
    if (!courses) throwError(Messages.COURSE.NOT_FOUND, StatusCode.NOT_FOUND);
    const singendCourse = await convertSignedUrlInArray(courses, ["thumbnail"]);
    return singendCourse.map((i)=>CourseMapper.toResponseMentorCourse(i))
    
  }

  async courseApproveOrReject(
    mentorId: string,
    courseId: string,
    status: string,
    courseRejectReason?: string
  ): Promise<void> {
    if (!["approved", "rejected"].includes(status)) {
        throwError(Messages.COURSE.INVALID_ID, StatusCode.BAD_REQUEST);
    }

    if (status === "approved") {
      await this._mentorRepo.update(mentorId, {
        $push: { coursesCreated: courseId }
      });
      await this._courseRepo.update(courseId, { mentorStatus: "approved" });
      return;
    }

    if (!courseRejectReason) {
       throwError(Messages.COURSE.FAILED_TO_UPDATE_STATUS, StatusCode.BAD_REQUEST);
    }

    await this._mentorRepo.update(mentorId, {
      $push: {
        courseRejectReason: {
          courseId,
          message: courseRejectReason
        }
      }
    });

    await this._courseRepo.update(courseId, {
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
  }): Promise<{ data: ICourseMentorResponseDto[]; total: number; categories: ICategoryMentorCourseResponse[] }> {
    const { data, total } = await this._courseRepo.fetchMentorCoursesWithFilters({
      mentorId,
      page,
      limit,
      search,
      filters,
      sort: sort || { createdAt: -1 }
    });
    const categories = await this._catRepo.findAll();
    const sendCourses = await convertSignedUrlInArray(data, ["thumbnail"]);
    const sendData = sendCourses.map((i) => CourseMapper.toResponseMentorCourse(i));
    const sendCat=categories.map((i)=>CategoryMapper.toResponseCategoryInMentor(i))
    return { data: sendData, total, categories:sendCat };
  }
 async publishCourse(courseId: string,status:boolean): Promise<void> {
     const coures = await this._courseRepo.update(courseId, { isActive: status });
     const users = await this._userRepo.findAll();
   const userIds: string[] = users.map((i) => i.id);
     if (status) {
    await notifyWithSocket({
        notificationService: this._notificationService,
        userIds,
        roles: ["user", "admin"],
        title: Messages.COURSE.PUBLISHED,
        message: Messages.COURSE.PUBLISHED_NOTIFICATION(coures?.title || "Untitled Course"),
        type: "info"
      });
  }
 }
}

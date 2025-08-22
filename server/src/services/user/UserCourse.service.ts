import { inject, injectable } from "inversify";
import mongoose, { FilterQuery, ObjectId } from "mongoose";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import {  IPopulatedCourse } from "../../types/classTypes";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import { IUserCourseProgressRepository } from "../../core/interfaces/repositories/user/IUserCourseProgressRepository";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import { IUserLessonProgressRepository } from "../../core/interfaces/repositories/course/IUserLessonProgressRepo"; 
import { ICertificateRepository } from "../../core/interfaces/repositories/course/ICertificateRepository";
import { IUserCertificateService } from "../../core/interfaces/services/user/IUserCertificateService"; 
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { convertSignedUrlInArray, getSignedS3Url } from "../../utils/s3Utilits";
import { Messages } from "../../constants/messages";
import { ICourseUserResponseDto, IUserCourseProgressResponse } from "../../shared/dtos/courses/course-response.dto";
import { CourseMapper } from "../../shared/dtos/courses/course.mapping";
import { ICategoryUserCourseResponse } from "../../shared/dtos/categories/category-response.dto";
import { CategoryMapper } from "../../shared/dtos/categories/category.mapper";

@injectable()
export class UserCourseService implements IUserCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private _baseCourseRepo: ICourseRepository,
    @inject(TYPES.UserRepository) private _baseUserRepo: IUserRepository,
    @inject(TYPES.CategoriesRepository) private _categoriesRepo: ICategoriesRepository,
    @inject(TYPES.UserCourseProgressRepository) private _userCourseProgressRepo: IUserCourseProgressRepository,
    @inject(TYPES.LessonsRepository) private _lessonRepo: ILessonsRepository,
    @inject(TYPES.UserLessonProgressRepository) private _userLessonProgressRepo: IUserLessonProgressRepository,
    @inject(TYPES.CertificateRepository) private _certificateRepo: ICertificateRepository,
    @inject(TYPES.UserCertificateService) private _userCertificateService: IUserCertificateService,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService
  ) {}
  async getAllCourses(
    page: number = 1,
    limit: number = 1,
    search?: string,
    filters: FilterQuery<IPopulatedCourse> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: ICourseUserResponseDto[]; total: number; totalPages?: number }> {
    const queryParams = {
      page,
      limit,
      search,
      filters,
      sort: sort,
    };
    
    const { data, total, totalPages } = await this._baseCourseRepo.fetchAllCoursesWithFilters(queryParams);
    console.log(data.length)
       if (!data) throwError("Failed to fetch Courses", StatusCode.INTERNAL_SERVER_ERROR);
    const sendData = await convertSignedUrlInArray(data, ["thumbnail"]);
  
    const sendDatas = await Promise.all(
  sendData.map(async (i) => {
    const photo = await getSignedS3Url(i.mentorId.profilePicture as string);
    return CourseMapper.toResponseUserCourse(i, photo);
  })
    );
    return {data:sendDatas, total, totalPages };
  }
  

  async updateUserCourse(courseId: string, userId: string): Promise<void> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const course = await this._baseCourseRepo.findById(courseId);
    if (!course) {
      throwError(Messages.PROFILE.USER_NOT_FOUND, StatusCode.BAD_REQUEST);
    };
    if(course.enrolledUsers.includes(userId)){}
    await this._baseCourseRepo.update(courseId, {
      $addToSet: { enrolledUsers: userObjectId },
    });
    await this._baseUserRepo.update(userId, {
      $addToSet: {
        enrolledCourses: {
          courseId: courseObjectId,
          allowed: true,
        },
      },
    });
  }

  async getCategries(): Promise<ICategoryUserCourseResponse[]> {
    const result = await this._categoriesRepo.findAll();  
    return result.map((i)=>CategoryMapper.toResponseCategoryInUser(i))
   
  }

  async getProgress(userId: string): Promise<IUserCourseProgressResponse[]> {
    const result = await this._userCourseProgressRepo.findAll({ userId: userId });
    if (!result) throwError(Messages.COMMON.INTERNAL_ERROR);
    return result.map((i)=>CourseMapper.toResponseUserCourseProgress(i))

  }


  async validateUserEnrollment(userId: string | ObjectId, courseId: string | ObjectId): Promise<void> {
    const user = await this._baseUserRepo.findById(userId as string);
    if (!user) throwError(Messages.PROFILE.USER_NOT_FOUND, StatusCode.NOT_FOUND);

    const enrolledCourse = user.enrolledCourses.find(
      (i) => i.courseId.toString() === courseId.toString()
    );
    if (!enrolledCourse) {
      throwError(Messages.COURSE.NOT_ENROLLED, StatusCode.BAD_REQUEST);
    }
    if (!enrolledCourse.allowed) {
      throwError(Messages.AUTH.BLOCKED, StatusCode.FORBIDDEN);
    }

    const course = await this._baseCourseRepo.findById(courseId.toString());
    if (!course) throwError(Messages.COURSE.NOT_FOUND, StatusCode.NOT_FOUND);

    const userObjectId = new mongoose.Types.ObjectId(userId as string);
    const userEnrolled = course.enrolledUsers.some((id) =>
      new mongoose.Types.ObjectId(id.toString()).equals(userObjectId)
    );
    if (!userEnrolled) {
      throwError(Messages.COURSE.NOT_IN_ENROLLMENT_LIST, StatusCode.BAD_REQUEST);
    }
  }

  async updateUserCourseProgress(userId: string, courseId: string, lessonId?: string): Promise<void> {
    const totalLessons = await this._lessonRepo.count({ courseId: new mongoose.Types.ObjectId(courseId) });
    const allProgress = await this._userLessonProgressRepo.findAll({ userId, courseId });

    const completedLessons = allProgress
      .filter((lp) => lp.overallProgressPercent >= 100)
      .map((lp) => new mongoose.Types.ObjectId(lp.lessonId));

    const overallProgress = this.calculateOverallProgress(allProgress, totalLessons);

    await this.upsertCourseProgress(userId, courseId, overallProgress, completedLessons, totalLessons);
    if (Math.round(overallProgress) === 100) {
      await this.issueCertificateIfNotExists(userId, courseId);
    }
  }

  private calculateOverallProgress(lessonProgresses: any[], totalLessons: number): number {
    if (totalLessons === 0) return 0;
    const total = lessonProgresses.reduce((acc, lp) => acc + lp.overallProgressPercent, 0);
    return total / totalLessons;
  }

  private async upsertCourseProgress(
    userId: string,
    courseId: string,
    progress: number,
    completedLessons: mongoose.Types.ObjectId[],
    totalLessons: number
  ): Promise<void> {
    const existing = await this._userCourseProgressRepo.findOne({ userId, courseId });

    const progressData = {
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
      overallProgressPercent: Math.min(100, Math.max(0, progress)),
      completedLessons,
      totalLessons,
    };

    if (existing) {
      await this._userCourseProgressRepo.update(existing._id.toString(), progressData);
    } else {
      await this._userCourseProgressRepo.create(progressData);
    }
  }

  private async issueCertificateIfNotExists(userId: string, courseId: string): Promise<void> {
  const existing = await this._certificateRepo.findOne({ courseId, userId });
  if (existing) return;

  const [course, user] = await Promise.all([
    this._baseCourseRepo.findById(courseId),
    this._baseUserRepo.findById(userId),
  ]);

  if (course && user) {
    await this._userCertificateService.createCertificate({
      userId,
      userName: user.username,
      courseId,
      courseTitle: course.title,
      
    });
 await notifyWithSocket({
  notificationService: this._notificationService,
  userIds: [userId as string],
  roles: ["admin"],
  title: Messages.COURSE.COMPLETED.TITLE,
  message: Messages.COURSE.COMPLETED.MESSAGE(user.username, course.title),
  type: "success",
});

  }
}

}
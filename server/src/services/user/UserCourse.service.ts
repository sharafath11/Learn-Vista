import { inject, injectable } from "inversify";
import mongoose, { FilterQuery, ObjectId } from "mongoose";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { ICategory, IPopulatedCourse } from "../../types/classTypes";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import { IUserCourseProgress } from "../../types/userCourseProgress";
import { IUserCourseProgressRepository } from "../../core/interfaces/repositories/user/IUserCourseProgressRepository";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import { IUserLessonProgressRepository } from "../../core/interfaces/repositories/course/IUserLessonProgressRepo"; 
import { ICertificateRepository } from "../../core/interfaces/repositories/course/ICertificateRepository";
import { IUserCertificateService } from "../../core/interfaces/services/user/IUserCertificateService"; 
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";

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
  ): Promise<{ data: IPopulatedCourse[]; total: number; totalPages?: number }> {
    const queryParams = {
      page,
      limit,
      search,
      filters,
      sort: sort,
    };
    const { data, total, totalPages } = await this._baseCourseRepo.fetchAllCoursesWithFilters(queryParams);
    if (!data) throwError("Failed to fetch Courses", StatusCode.INTERNAL_SERVER_ERROR);
    return { data, total, totalPages };
  }

  async updateUserCourse(courseId: string, userId: string): Promise<void> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const course = await this._baseCourseRepo.findById(courseId);
    if (!course) {
      throwError("Course not found.", StatusCode.BAD_REQUEST);
    }
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

  async getCategries(): Promise<ICategory[]> {
    const result = await this._categoriesRepo.findAll();
    return result;
  }

  async getProgress(userId: string): Promise<IUserCourseProgress[]> {
    const result = await this._userCourseProgressRepo.findAll({ userId: userId });
    if (!result) throwError("Something went wrong");
    return result;
  }


  async validateUserEnrollment(userId: string | ObjectId, courseId: string | ObjectId): Promise<void> {
    const user = await this._baseUserRepo.findById(userId as string);
    if (!user) throwError("User not found", StatusCode.NOT_FOUND);

    const enrolledCourse = user.enrolledCourses.find(
      (i) => i.courseId.toString() === courseId.toString()
    );
    if (!enrolledCourse) {
      throwError("User is not enrolled in this course", StatusCode.BAD_REQUEST);
    }
    if (!enrolledCourse.allowed) {
      throwError("You are blocked from accessing this course", StatusCode.FORBIDDEN);
    }

    const course = await this._baseCourseRepo.findById(courseId.toString());
    if (!course) throwError("Course not found", StatusCode.NOT_FOUND);

    const userObjectId = new mongoose.Types.ObjectId(userId as string);
    const userEnrolled = course.enrolledUsers.some((id) =>
      new mongoose.Types.ObjectId(id.toString()).equals(userObjectId)
    );
    if (!userEnrolled) {
      throwError("User not listed in course enrollment", StatusCode.BAD_REQUEST);
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
    console.log("overall progress",overallProgress)
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
      await this._userCourseProgressRepo.update(existing.id, progressData);
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
      title: "Course Completed!",
      message: `User ${user.username} has completed the course "${course.title}" and received a certificate.`,
      type: "success",
    });
  }
}

}
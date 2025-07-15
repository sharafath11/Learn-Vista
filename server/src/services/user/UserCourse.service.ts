import { inject, injectable } from "inversify";
import mongoose, { FilterQuery } from "mongoose";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { ICategory, ICourse, IPopulatedCourse } from "../../types/classTypes";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { ICategoriesRepository } from "../../core/interfaces/repositories/course/ICategoriesRepository";
import { IUserCourseProgress } from "../../types/userCourseProgress";
import { IUserCourseProgressRepository } from "../../core/interfaces/repositories/user/IUserCourseProgressRepository";
import { IUserLessonProgressRepository } from "../../core/interfaces/repositories/course/IUserLessonProgressRepo";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import { IUserLessonProgress } from "../../types/userLessonProgress";

const SECTION_WEIGHTS = {
  video: 0.40,
  theory: 0.20,
  practical: 0.20,
  mcq: 0.20,
};

const TOTAL_SECTION_WEIGHT =
  SECTION_WEIGHTS.video +
  SECTION_WEIGHTS.theory +
  SECTION_WEIGHTS.practical +
  SECTION_WEIGHTS.mcq;

if (TOTAL_SECTION_WEIGHT !== 1) {
  console.warn(
    "Warning: Section weights in UserCourseService.ts do not sum to 1. Overall lesson progress calculation might be off."
  );
}

@injectable()
export class UserCourseService implements IUserCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private _baseCourseRepo: ICourseRepository,
    @inject(TYPES.UserRepository) private _baseUserRepo: IUserRepository,
    @inject(TYPES.CategoriesRepository) private _categoriesRepo: ICategoriesRepository,
    @inject(TYPES.UserCourseProgressRepository) private _userCourseProgressRepo: IUserCourseProgressRepository,
    @inject(TYPES.UserLessonProgressRepository) private _userLessonProgressRepo: IUserLessonProgressRepository,
    @inject(TYPES.LessonsRepository) private _lessonRepo: ILessonsRepository
  ) {}

  async getAllCourses(
      page: number = 1,
      limit: number = 1,
      search?: string,
      filters: FilterQuery<IPopulatedCourse> = {},
      sort: Record<string, 1 | -1> = { createdAt: -1 }
  ):Promise<{ data: IPopulatedCourse[]; total: number; totalPages?: number }> {
     console.log("filter (received param):", filters,"sort (received param):", sort)

    const queryParams = {
          page,
          limit,
          search,
          filters,
          sort: sort
        };

     console.log("queryParams for repo:", queryParams)

    const { data, total, totalPages } = await this._baseCourseRepo.fetchAllCoursesWithFilters(
         queryParams
    );

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
   const res= await this._baseCourseRepo.update(courseId, {
      $addToSet: { enrolledUsers: userObjectId }
    });
  console.log("cc",courseObjectId)
  await this._baseUserRepo.update(userId, {
  $addToSet: {
    enrolledCourses: {
      courseId: courseObjectId,
      allowed: true
    }
  }
});

  }
  async getCategries(): Promise<ICategory[]> {
    const result = await this._categoriesRepo.findAll();
    return result
  }
  async getProgress(userId: string): Promise<IUserCourseProgress[]> {
    const result = await this._userCourseProgressRepo.findAll({ userId: userId });
    if (!result) throwError("Somthing wrent wrong")
    return result
  }

  private calculateOverallLessonProgress(
    lessonProgress: IUserLessonProgress
  ): number {
    let completedWeight = 0;

    if (lessonProgress.videoTotalDuration > 0) {
      const videoCompletionRatio = Math.min(1, lessonProgress.videoWatchedDuration / lessonProgress.videoTotalDuration);
      completedWeight += videoCompletionRatio * SECTION_WEIGHTS.video;
    }

    if (lessonProgress.theoryCompleted) {
      completedWeight += SECTION_WEIGHTS.theory;
    }
    if (lessonProgress.practicalCompleted) {
      completedWeight += SECTION_WEIGHTS.practical;
    }
    if (lessonProgress.mcqCompleted) {
      completedWeight += SECTION_WEIGHTS.mcq;
    }

    return Math.min(100, Math.max(0, completedWeight * 100));
  }

  private async updateUserCourseOverallProgress(
    userId: string,
    courseId: string
  ): Promise<void> {
    const allLessonProgresses = await this._userLessonProgressRepo.findAll({
      userId,
      courseId,
    });

    const totalLessonsInCourse = await this._lessonRepo.count({ courseId: new mongoose.Types.ObjectId(courseId) });

    if (totalLessonsInCourse === 0) {
      let courseProgress = await this._userCourseProgressRepo.findOne({ userId, courseId });
      if (courseProgress) {
        await this._userCourseProgressRepo.update(courseProgress.id, {
          overallProgressPercent: 0,
          completedLessons: [],
          totalLessons: 0,
        });
      } else {
        await this._userCourseProgressRepo.create({
          userId: new mongoose.Types.ObjectId(userId),
          courseId: new mongoose.Types.ObjectId(courseId),
          overallProgressPercent: 0,
          completedLessons: [],
          totalLessons: 0,
        });
      }
      return;
    }

    let totalWeightedLessonProgressSum = 0;
    const completedLessonIds: mongoose.Types.ObjectId[] = [];

    allLessonProgresses.forEach((lp) => {
      totalWeightedLessonProgressSum += lp.overallProgressPercent;
      if (lp.overallProgressPercent >= 100) {
        completedLessonIds.push(new mongoose.Types.ObjectId(lp.lessonId));
      }
    });

    const overallCourseProgress = totalWeightedLessonProgressSum / totalLessonsInCourse;

    let courseProgress = await this._userCourseProgressRepo.findOne({ userId, courseId });

    if (courseProgress) {
      await this._userCourseProgressRepo.update(courseProgress.id, {
        overallProgressPercent: Math.min(100, Math.max(0, overallCourseProgress)),
        completedLessons: completedLessonIds,
        totalLessons: totalLessonsInCourse,
      });
    } else {
      await this._userCourseProgressRepo.create({
        userId: new mongoose.Types.ObjectId(userId),
        courseId: new mongoose.Types.ObjectId(courseId),
        overallProgressPercent: Math.min(100, Math.max(0, overallCourseProgress)),
        completedLessons: completedLessonIds,
        totalLessons: totalLessonsInCourse,
      });
    }
  }

  async updateLessonProgress(
    userId: string,
    lessonId: string,
    update: {
      videoWatchedDuration?: number;
      videoTotalDuration?: number;
      theoryCompleted?: boolean;
      practicalCompleted?: boolean;
      mcqCompleted?: boolean;
      videoCompleted: boolean
    }
  ): Promise<IUserLessonProgress> {
    const lesson = await this._lessonRepo.findById(lessonId);
    if (!lesson) throwError("Lesson not found", StatusCode.NOT_FOUND);

    const courseId = lesson.courseId.toString();

    let userLessonProgress = await this._userLessonProgressRepo.findOne({ userId, lessonId });

    let currentVideoWatchedDuration = userLessonProgress?.videoWatchedDuration ?? 0;
    let currentVideoTotalDuration = userLessonProgress?.videoTotalDuration ?? 0;
    let currentTheoryCompleted = userLessonProgress?.theoryCompleted ?? false;
    let currentPracticalCompleted = userLessonProgress?.practicalCompleted ?? false;
    let currentMcqCompleted = userLessonProgress?.mcqCompleted ?? false;

    if (update.videoWatchedDuration !== undefined) {
      currentVideoWatchedDuration = Math.max(currentVideoWatchedDuration, update.videoWatchedDuration);
    }
    if (update.videoTotalDuration !== undefined) {
      if (update.videoTotalDuration > 0) {
        currentVideoTotalDuration = update.videoTotalDuration;
      } else if (currentVideoTotalDuration === 0) {
        console.warn(`Video total duration is 0 for lesson ${lessonId}. Cannot calculate video progress accurately.`);
      }
    }
    if (update.theoryCompleted !== undefined) {
      currentTheoryCompleted = update.theoryCompleted;
    }
    if (update.practicalCompleted !== undefined) {
      currentPracticalCompleted = update.practicalCompleted;
    }
    if (update.mcqCompleted !== undefined) {
      currentMcqCompleted = update.mcqCompleted;
    }

    currentVideoWatchedDuration = Math.min(currentVideoWatchedDuration, currentVideoTotalDuration);

    const videoProgressPercent =
      currentVideoTotalDuration > 0
        ? Math.min(100, (currentVideoWatchedDuration / currentVideoTotalDuration) * 100)
        : 0;

    let progressDoc: IUserLessonProgress;

    if (userLessonProgress) {
      const updatedData = {
        videoWatchedDuration: currentVideoWatchedDuration,
        videoTotalDuration: currentVideoTotalDuration,
        videoProgressPercent: videoProgressPercent,
        theoryCompleted: currentTheoryCompleted,
        practicalCompleted: currentPracticalCompleted,
        mcqCompleted: currentMcqCompleted,
      };
      const result = await this._userLessonProgressRepo.update(userLessonProgress.id, updatedData);
      if (!result) throwError("Failed to update lesson progress", StatusCode.INTERNAL_SERVER_ERROR);
      progressDoc = result;
    } else {
      const newProgressData = {
        userId: new mongoose.Types.ObjectId(userId),
        courseId: new mongoose.Types.ObjectId(courseId),
        lessonId: new mongoose.Types.ObjectId(lessonId),
        videoWatchedDuration: currentVideoWatchedDuration,
        videoTotalDuration: currentVideoTotalDuration,
        videoProgressPercent: videoProgressPercent,
        theoryCompleted: currentTheoryCompleted,
        practicalCompleted: currentPracticalCompleted,
        mcqCompleted: currentMcqCompleted,
        overallProgressPercent: 0,
      };
      const result = await this._userLessonProgressRepo.create(newProgressData);
      if (!result) throwError("Failed to create lesson progress", StatusCode.INTERNAL_SERVER_ERROR);
      progressDoc = result;
    }
    const newOverallProgressPercent = this.calculateOverallLessonProgress(progressDoc);
    const finalProgressDoc = await this._userLessonProgressRepo.update(progressDoc.id, {
        overallProgressPercent: newOverallProgressPercent
    });
    if (!finalProgressDoc) throwError("Failed to finalize lesson progress update", StatusCode.INTERNAL_SERVER_ERROR);


    await this.updateUserCourseOverallProgress(userId, courseId);

    return finalProgressDoc;
  }
}
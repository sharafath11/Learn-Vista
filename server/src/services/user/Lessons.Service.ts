import mongoose, { ObjectId } from "mongoose";
import { GetLessonsResponse, IUserLessonsService } from "../../core/interfaces/services/user/IUserLessonsService";
import { IComment, ILessonDetails, ILessonReport, IQuestions, LessonQuestionInput } from "../../types/lessons";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository"; 
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { IQuestionsRepository } from "../../core/interfaces/repositories/lessons/IQuestionsRepository";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../config/AWS";
import { ILessonReportRepository } from "../../core/interfaces/repositories/lessons/ILessonReportRepository";
import { buildPrompt } from "../../utils/Rportprompt";
import { getGemaniResponse } from "../../config/gemaniAi";
import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { IUserLessonProgress } from "../../types/userLessonProgress";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController"; 
import { IUserLessonProgressRepository } from "../../core/interfaces/repositories/course/IUserLessonProgressRepo";
import { convertSignedUrlInArray } from "../../utils/s3Utilits";
import { logger } from "../../utils/logger";

const SECTION_WEIGHTS = {
  video: 0.40,
  theory: 0.20,
  practical: 0.20,
  mcq: 0.20,
};



@injectable()
export class UserLessonsService implements IUserLessonsService {
  constructor(
    @inject(TYPES.LessonsRepository) private _lessonRepository: ILessonsRepository,
    @inject(TYPES.CourseRepository) private _courseRepository: ICourseRepository, 
    @inject(TYPES.QuestionsRepository) private _qustionRepository: IQuestionsRepository,
    @inject(TYPES.LessonReportRepository) private _lessonReportRepo: ILessonReportRepository,
    @inject(TYPES.CommentsRepository) private _commentsRepo: ICommentstRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.UserLessonProgressRepository) private _userLessonProgressRepo: IUserLessonProgressRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.UserCourseService) private _userCourseService: IUserCourseService
  ) {}

  private async getSignedVideoUrl(videoUrl: string): Promise<string> {
    let s3Key = videoUrl;
    const bucketDomain = `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    const pathStyleDomain = `s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}`;

    if (videoUrl.startsWith(`https://${bucketDomain}/`)) {
      s3Key = videoUrl.substring(`https://${bucketDomain}/`.length);
    } else if (videoUrl.startsWith(`https://${pathStyleDomain}/`)) {
      s3Key = videoUrl.substring(`https://${pathStyleDomain}/`.length);
    } else {
      logger.warn("Video URL not in expected S3 URL format. Assuming it's already an S3 Key:", videoUrl);
    }

    if (!s3Key) {
      throwError("Invalid video URL format provided. Could not extract S3 key.", StatusCode.BAD_REQUEST);
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: s3Key,
    });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
  }
  private calculateOverallLessonProgress(lessonProgress: IUserLessonProgress): number {
    let completedWeight = 0;

    if (lessonProgress.videoTotalDuration > 0) {
      const videoCompletionRatio = Math.min(1, lessonProgress.videoWatchedDuration / lessonProgress.videoTotalDuration);
      completedWeight += videoCompletionRatio * SECTION_WEIGHTS.video;
    }

    if (lessonProgress.theoryCompleted) completedWeight += SECTION_WEIGHTS.theory;
    if (lessonProgress.practicalCompleted) completedWeight += SECTION_WEIGHTS.practical;
    if (lessonProgress.mcqCompleted) completedWeight += SECTION_WEIGHTS.mcq;

    return Math.min(100, Math.max(0, completedWeight * 100));
  }

  private calculateAndUpdateLessonSectionProgress(
  progress: IUserLessonProgress,
  update: {
    videoWatchedDuration?: number;
    videoTotalDuration?: number;
    theoryCompleted?: boolean;
    practicalCompleted?: boolean;
    mcqCompleted?: boolean;
    videoCompleted?: boolean;
  }
): IUserLessonProgress {
  if (update.videoWatchedDuration !== undefined) {
    progress.videoWatchedDuration = Math.max(progress.videoWatchedDuration, update.videoWatchedDuration);
  }

  if (update.videoTotalDuration !== undefined && update.videoTotalDuration > 0) {
    progress.videoTotalDuration = update.videoTotalDuration;
  } else if (progress.videoTotalDuration === 0) {
    console.warn(
      `Video total duration is 0 for lesson ${progress.lessonId}. Cannot calculate video progress accurately.`
    );
  }

  if (update.theoryCompleted !== undefined) {
    progress.theoryCompleted = update.theoryCompleted;
  }

  if (update.practicalCompleted !== undefined) {
    progress.practicalCompleted = update.practicalCompleted;
  }

  if (update.mcqCompleted !== undefined) {
    progress.mcqCompleted = update.mcqCompleted;
  }

  progress.videoWatchedDuration = Math.min(progress.videoWatchedDuration, progress.videoTotalDuration);
  progress.videoProgressPercent =
    progress.videoTotalDuration > 0
      ? Math.min(100, (progress.videoWatchedDuration / progress.videoTotalDuration) * 100)
      : 0;

  if (update.videoCompleted !== undefined) {
    progress.videoCompleted = update.videoCompleted;
  }

  return progress; 
}

  async getLessons(courseId: string | ObjectId, userId: string | ObjectId): Promise<GetLessonsResponse> {
    await this._userCourseService.validateUserEnrollment(userId, courseId);
    const lessons = await this._lessonRepository.findAll({ courseId });
    if (!lessons || lessons.length === 0) {
      throwError("No lessons found for this course", StatusCode.NOT_FOUND);
    }

    const lessonProgress = await this._userLessonProgressRepo.findAll({ courseId, userId });
    const sendData=await convertSignedUrlInArray(lessons,["thumbnail"])
    return { lessons: sendData, progress: lessonProgress };
  }

  async getQuestions(lessonId: string | ObjectId): Promise<IQuestions[]> {
    const questions = await this._qustionRepository.findAll({ lessonId });
    if (!questions) throwError("Something went wrong", StatusCode.BAD_REQUEST);
    return questions;
  }

  async getLessonDetils(lessonId: string | ObjectId, userId: string): Promise<ILessonDetails> {
    const lesson = await this._lessonRepository.findById(lessonId.toString());
    if (!lesson) throwError("Lesson not found", StatusCode.NOT_FOUND);

    const [questions, signedUrl, comments, report, lessonProgress] = await Promise.all([
      this._qustionRepository.findAll({ lessonId }),
      this.getSignedVideoUrl(lesson.videoUrl),
      this._commentsRepo.findAll({ lessonId }),
      this._lessonReportRepo.findOne({ lessonId, userId }),
      this._userLessonProgressRepo.findOne({ userId, lessonId }),
    ]);

    return { questions, videoUrl: signedUrl, lesson, comments, report, lessonProgress };
  }

  async lessonReport(
    userId: string | ObjectId,
    lessonId: string | ObjectId,
    data: LessonQuestionInput
  ): Promise<ILessonReport> {
    if (!userId) throwError("User not identified", StatusCode.BAD_REQUEST);

    const existingReport = await this._lessonReportRepo.findOne({ lessonId, userId });
    if (existingReport) {
      throwError("You already have a report for this lesson. Please check the report session.", StatusCode.BAD_REQUEST);
    }

    const lesson = await this._lessonRepository.findById(lessonId as string);
    if (!lesson) throwError("Invalid lesson", StatusCode.NOT_FOUND);
    const course = await this._courseRepository.findById(lesson.courseId as string);
    if (!course) throwError("Invalid course", StatusCode.NOT_FOUND);

    const prompt = buildPrompt(data);
    const geminiReport = await getGemaniResponse(prompt);
    if (!geminiReport)
      throwError("Failed to generate report from AI service. Please try again.", StatusCode.INTERNAL_SERVER_ERROR);

    const report = await this._lessonReportRepo.create({
      userId: userId,
      lessonId: lessonId,
      courseId: course.id,
      mentorId: course.mentorId,
      report: geminiReport,
    });
    await this._userCourseService.updateUserCourseProgress(userId as string, course.id as string, lessonId as string);

    return report;
  }

  async saveComments(userId: string, lessonId: string | ObjectId, comment: string): Promise<IComment> {
    if (!lessonId || !comment || !userId) {
      throwError("Invalid data provided");
    }

    const [userData, lesson] = await Promise.all([
      this._userRepo.findById(userId),
      this._lessonRepository.findById(lessonId as string),
    ]);
    if (!userData) throwError("User not found");
    if (!lesson) throwError("Lesson not found");

    const course = await this._courseRepository.findById(lesson.courseId.toString());
    if (!course || !course.mentorId) throwError("Course or mentor not found");

    const savedComment = await this._commentsRepo.create({
      lessonId,
      courseId: course.id, 
      comment,
      mentorId: course.mentorId,
      userId,
      userName: userData.username,
    });

    await notifyWithSocket({
      notificationService: this._notificationService,
      userIds: [course.mentorId.toString()],
      title: `New Comment ${course.title} on ${lesson.title}`,
      message: `${userData.username} commented on "${lesson.title}": "${comment.slice(0, 50)}..."`,
      type: "info",
    });

    return savedComment;
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
      videoCompleted?: boolean;
    }
  ): Promise<IUserLessonProgress> {
    const lesson = await this._lessonRepository.findById(lessonId);
    if (!lesson) throwError("Lesson not found", StatusCode.NOT_FOUND);

    const courseId = lesson.courseId.toString();
    let userLessonProgress = await this._userLessonProgressRepo.findOne({ userId, lessonId });
    if (!userLessonProgress) {
      userLessonProgress = await this._userLessonProgressRepo.create({
        userId: new mongoose.Types.ObjectId(userId),
        courseId: new mongoose.Types.ObjectId(courseId),
        lessonId: new mongoose.Types.ObjectId(lessonId),
        videoWatchedDuration: 0,
        videoTotalDuration: 0,
        videoProgressPercent: 0,
        theoryCompleted: false,
        practicalCompleted: false,
        mcqCompleted: false,
        overallProgressPercent: 0,
        videoCompleted: false,
      });
    }
    const updatedProgress = this.calculateAndUpdateLessonSectionProgress(userLessonProgress, update);
    const finalProgressDoc = await this._userLessonProgressRepo.update(userLessonProgress.id, {
      ...updatedProgress,
      overallProgressPercent: this.calculateOverallLessonProgress(updatedProgress),
    });
    if (!finalProgressDoc)
      throwError("Failed to finalize lesson progress update", StatusCode.INTERNAL_SERVER_ERROR);
    await this._userCourseService.updateUserCourseProgress(userId, courseId, lessonId);
    return finalProgressDoc;
  }
}
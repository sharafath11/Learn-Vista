import mongoose, { ObjectId } from "mongoose";
import { GetLessonsResponse, IUserLessonsService } from "../../core/interfaces/services/user/IUserLessonsService";
import { IComment, ILesson, ILessonDetails, ILessonReport, IQuestions, LessonQuestionInput } from "../../types/lessons";
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
import { IUserCourseProgressRepository } from "../../core/interfaces/repositories/user/IUserCourseProgressRepository";
import { toObjectId } from "../../utils/convertStringToObjectId";
import { Types } from "mongoose";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { IUserLessonProgressRepository } from "../../core/interfaces/repositories/course/IUserLessonProgressRepo";
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
export class UserLessonsService implements IUserLessonsService{
    constructor(
        @inject(TYPES.LessonsRepository) private _lessonRepository: ILessonsRepository,
        @inject(TYPES.CourseRepository) private _courseRepository: ICourseRepository,
        @inject(TYPES.QuestionsRepository) private _qustionRepository: IQuestionsRepository,
        @inject(TYPES.LessonReportRepository) private _lessonReportRepo: ILessonReportRepository,
        @inject(TYPES.CommentsRepository) private _commentsRepo: ICommentstRepository,
       @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
      @inject(TYPES.UserCourseProgressRepository) private _userCourseProgresRepo: IUserCourseProgressRepository,
      @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.UserLessonProgressRepository) private _userLessonProgressRepo: IUserLessonProgressRepository,
    @inject(TYPES.LessonsRepository) private _lessonRepo: ILessonsRepository
    ) { }
   async getLessons(courseId: string | ObjectId, userId: string|ObjectId): Promise<GetLessonsResponse> {
  const user = await this._userRepo.findById(userId as string);
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
  const course = await this._courseRepository.findById(courseId.toString());
  if (!course) throwError("Course not found", StatusCode.NOT_FOUND);
      console.error("somt", userId, "enrolled user", course.enrolledUsers)
  const userObjectId = new Types.ObjectId(userId as string);
 const userEnrolled = course.enrolledUsers.some((id) =>
  new Types.ObjectId(id.toString()).equals(userObjectId)
);
if (!userEnrolled) {
  throwError("User not listed in course enrollment", StatusCode.BAD_REQUEST);
}


  const lessons = await this._lessonRepository.findAll({ courseId });
  if (!lessons || lessons.length === 0) {
    throwError("No lessons found for this course", StatusCode.NOT_FOUND);
  }
  const lessonProgress=await this._userLessonProgressRepo.findAll({courseId,userId})

  return {lessons:lessons,progress:lessonProgress};
}

    async getQuestions(lessonId: string | ObjectId): Promise<IQuestions[]> {
        const qustions = await this._qustionRepository.findAll({ lessonId });
        if(!qustions) throwError("Somthing wrnet wrong",StatusCode.BAD_REQUEST)
        return qustions
    }
    // ee week passail progress video nte koode validation in user after see the previus lesson 
    async getLessonDetils(lessonId: string | ObjectId,userId:string): Promise<ILessonDetails> {
        console.log('Type of lessonId:', typeof lessonId);
console.log('Value of lessonId:', lessonId);
console.log('Value of lessonId.toString():', lessonId.toString()); 
        const lesson = await this._lessonRepository.findById(lessonId.toString());
        const questions = await this._qustionRepository.findAll({ lessonId });
        if(!lesson)throwError("Lesson desnot find")
        let s3Key = lesson.videoUrl; 
        const bucketDomain = `${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
        const pathStyleDomain = `s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}`;
        if (lesson.videoUrl.startsWith(`https://${bucketDomain}/`)) {
        s3Key = lesson.videoUrl.substring(`https://${bucketDomain}/`.length);
        } else if (lesson.videoUrl.startsWith(`https://${pathStyleDomain}/`)) {
        s3Key = lesson.videoUrl.substring(`https://${pathStyleDomain}/`.length);
        } else {
        console.warn("Video URL not in expected S3 URL format. Assuming it's already an S3 Key:", lesson.videoUrl);
        }
        if (!s3Key) {
        throwError("Invalid video URL format provided. Could not extract S3 key.", StatusCode.BAD_REQUEST);
        }
        const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!, 
        Key: s3Key,
        });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        const comments = await this._commentsRepo.findAll({ lessonId });
      const report = await this._lessonReportRepo.findOne({ lessonId, userId });
      const lessonProgress=await this._userLessonProgressRepo.findOne({userId,lessonId})
        if(report)return {questions,videoUrl:signedUrl,lesson,comments,report,lessonProgress}
        return {questions,videoUrl:signedUrl,lesson,comments,lessonProgress}
    }
  async lessonReport(userId: string|ObjectId, lessonId: string|ObjectId, data: LessonQuestionInput): Promise<ILessonReport> {
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
        if (!geminiReport) throwError("Failed to generate report from AI service. Please try again.", StatusCode.INTERNAL_SERVER_ERROR);

        const report = await this._lessonReportRepo.create({
            userId: userId,
            lessonId: lessonId,
            courseId: course.id,
            mentorId: course.mentorId,
            report: geminiReport
        });

        const totalLessons = course.sessions.length;

        let userCourseProgress = await this._userCourseProgresRepo.findOne({ userId, courseId: course.id });
        const convertedLessonId = toObjectId(lessonId as string);

        if (!userCourseProgress) {
            userCourseProgress = await this._userCourseProgresRepo.create({
                userId: toObjectId(userId as string),
                courseId: course.id,
                completedLessons: [convertedLessonId],
                totalLessons,
                overallProgressPercent: Math.round((1 / totalLessons) * 100),
            });
        } else {
            if (!userCourseProgress.completedLessons.some(id => id.equals(convertedLessonId))) {
                const updatedCompletedLessons = [...userCourseProgress.completedLessons, convertedLessonId];
                const newOverallProgressPercent = Math.round(
                    (updatedCompletedLessons.length / totalLessons) * 100
                );

                await this._userCourseProgresRepo.update(userCourseProgress.id, {
                    completedLessons: updatedCompletedLessons,
                    overallProgressPercent: newOverallProgressPercent,
                });
            }
        }
        return report;
    }
    async saveComments(
  userId: string,
  lessonId: string | ObjectId,
  comment: string
): Promise<IComment> {
  if (!lessonId || !comment || !userId) {
    throwError("Invalid data provided");
  }

  const userData = await this._userRepo.findById(userId);
  if (!userData) throwError("User not found");

  const lesson = await this._lessonRepository.findById(lessonId as string);
  if (!lesson) throwError("Lesson not found");

  const course = await this._courseRepository.findById(lesson.courseId.toString());
  if (!course || !course.mentorId) throwError("Course or mentor not found");

  const savedComment = await this._commentsRepo.create({
    lessonId,
    courseId:lesson.courseId as string,
    comment,
    mentorId:course.mentorId,
    userId,
    userName: userData.username,
  });

  await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [course.mentorId.toString()],
    title: `New Comment  ${course.title} on ${lesson.title}`,
    message: `${userData.username} commented on "${lesson.title}": "${comment.slice(0, 50)}..."`,
    type: "info",
  });

  return savedComment;
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
      let courseProgress = await this._userCourseProgresRepo.findOne({ userId, courseId });
      if (courseProgress) {
        await this._userCourseProgresRepo.update(courseProgress.id, {
          overallProgressPercent: 0,
          completedLessons: [],
          totalLessons: 0,
        });
      } else {
        await this._userCourseProgresRepo.create({
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

    let courseProgress = await this._userCourseProgresRepo.findOne({ userId, courseId });

    if (courseProgress) {
      await this._userCourseProgresRepo.update(courseProgress.id, {
        overallProgressPercent: Math.min(100, Math.max(0, overallCourseProgress)),
        completedLessons: completedLessonIds,
        totalLessons: totalLessonsInCourse,
      });
    } else {
      await this._userCourseProgresRepo.create({
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
      videoCompleted?: boolean
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
        videoCompleted:update.videoCompleted
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
        videoCompleted:false
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
import { ObjectId } from "mongoose";
import { IUserLessonsService } from "../../core/interfaces/services/user/IUserLessonsService";
import { IComment, ILesson, ILessonReport, IQuestions, LessonQuestionInput } from "../../types/lessons";
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
@injectable()
export class UserLessonsService implements IUserLessonsService{
    constructor(
        @inject(TYPES.LessonsRepository) private _lessonRepository: ILessonsRepository,
        @inject(TYPES.CourseRepository) private _courseRepository: ICourseRepository,
        @inject(TYPES.QuestionsRepository) private _qustionRepository: IQuestionsRepository,
        @inject(TYPES.LessonReportRepository) private _lessonReportRepo: ILessonReportRepository,
        @inject(TYPES.CommentsRepository) private _commentsRepo: ICommentstRepository,
       @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
       @inject(TYPES.UserCourseProgressRepository) private _userCourseProgresRepo:IUserCourseProgressRepository
    ) { }
    async getLessons(courseId: string | ObjectId, userId: string|ObjectId): Promise<ILesson[]> {
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

  return lessons;
}

    async getQuestions(lessonId: string | ObjectId): Promise<IQuestions[]> {
        const qustions = await this._qustionRepository.findAll({ lessonId });
        if(!qustions) throwError("Somthing wrnet wrong",StatusCode.BAD_REQUEST)
        return qustions
    }
    // ee week passail progress video nte koode validation in user after see the previus lesson 
    async getLessonDetils(lessonId: string | ObjectId,userId:string): Promise<{ questions: IQuestions[]; videoUrl: string; lesson: ILesson,comments:IComment[];report?:ILessonReport }> {
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
        if(report)return {questions,videoUrl:signedUrl,lesson,comments,report}
        return {questions,videoUrl:signedUrl,lesson,comments}
    }
    async lessonReport(userId: string|ObjectId, lessonId: string|ObjectId, data: LessonQuestionInput): Promise<ILessonReport> {
      const existingReport = await this._lessonReportRepo.findAll({ lessonId, userId });
      if(!userId) throwError("user not identify")
       if(!existingReport)throwError("You already get the report please check in report session")
       const lesson = await this._lessonRepository.findById(lessonId as string);
       if (!lesson) throwError("invalid lessons");
       const course = await this._courseRepository.findById(lesson.courseId as string);
       if (!course) throwError("Invalid course");
       const prompt = buildPrompt(data);
       const geminiRpoert = await getGemaniResponse(prompt);
       if (!geminiRpoert) throwError("Server bcy");
      const report = await this._lessonReportRepo.create({
        userId: userId,
        lessonId: lessonId,
        courseId: course.id,
        mentorId: course.mentorId,
        report: geminiRpoert
      });
       const totalLessons = course.sessions.length;

  let userProgress = await this._userCourseProgresRepo.findOne({ userId, courseId: course.id });
  const convertedLessonId=toObjectId(lessonId as string)
  if (!userProgress) {
    userProgress = await this._userCourseProgresRepo.create({
      userId:toObjectId(userId as string),
      courseId: course.id,
      completedLessons: [convertedLessonId],
      totalLessons,
      overallProgressPercent: Math.round((1 / totalLessons) * 100),
    });
  } else {
    if (!userProgress.completedLessons.includes(convertedLessonId)) {
      userProgress.completedLessons.push(convertedLessonId);
      userProgress.overallProgressPercent = Math.round(
        (userProgress.completedLessons.length / totalLessons) * 100
      );
      await userProgress.save();
    }
  }
       return report
    }
    async saveComments(userId: string, lessonId: string | ObjectId, comment: string): Promise<IComment> {
        const userData=await this._userRepo.findById(userId)
        if (!lessonId || !comment) throwError("Invalid datas");
        const data=await this._commentsRepo.create({ lessonId, comment, userId: userId, userName: userData?.username });
        return data
    }
}
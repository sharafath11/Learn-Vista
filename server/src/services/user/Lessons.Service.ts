import { ObjectId } from "mongoose";
import { IUserLessonsService } from "../../core/interfaces/services/user/IUserLessonsService";
import { ILesson, IQuestions } from "../../types/lessons";
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
@injectable()
export class UserLessonsService implements IUserLessonsService{
    constructor(
        @inject(TYPES.LessonsRepository) private _lessonRepository: ILessonsRepository,
        @inject(TYPES.CourseRepository) private _courseRepository: ICourseRepository,
        @inject(TYPES.QuestionsRepository) private _qustionRepository:IQuestionsRepository 
    ) { }
    async getLessons(courseId: string|ObjectId, userId: string): Promise<ILesson[]> {
        let course = await this._courseRepository.findById(courseId as string);
        const userEnrolled = course?.enrolledUsers.filter((i) => i == userId);
        console.log(userEnrolled,course?.enrolledUsers)
        if(userEnrolled?.length==0) throwError("This course user Desnot enroller please enroll",StatusCode.BAD_REQUEST)
        const lessons = await this._lessonRepository.findAll({ courseId });
        console.log(lessons,courseId)
        if(!lessons) throwError("Somthing wrnet wrong",StatusCode.BAD_REQUEST)
        return lessons
    }
    async getQuestions(lessonId: string | ObjectId): Promise<IQuestions[]> {
        const qustions = await this._qustionRepository.findAll({ lessonId });
        if(!qustions) throwError("Somthing wrnet wrong",StatusCode.BAD_REQUEST)
        return qustions
    }
    // ee week passail progress video nte koode validation in user after see the previus lesson 
    async getLessonDetils(lessonId: string | ObjectId): Promise<{ questions: IQuestions[]; videoUrl: string; lesson: ILesson; }> {
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
        return {questions,videoUrl:signedUrl,lesson}
    }
}
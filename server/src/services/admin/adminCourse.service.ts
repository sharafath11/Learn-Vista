import { inject, injectable } from "inversify";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import {  ICourse } from "../../types/classTypes";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { throwError } from "../../utils/resAndError";
import { uploadThumbnail, deleteFromS3, convertSignedUrlInArray, convertSignedUrlInObject, getSignedS3Url, signConcernAttachmentUrls, generateSignedUrlForVideoFieldInObjects } from "../../utils/s3Utilits";
import { validateCoursePayload } from "../../validation/adminValidation";
import { StatusCode } from "../../enums/statusCode.enum";
import { FilterQuery } from "mongoose";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";
import { IQuestionsRepository } from "../../core/interfaces/repositories/lessons/IQuestionsRepository";
import { Messages } from "../../constants/messages";
import { ICourseAdminResponse, ICourseResponseDto } from "../../shared/dtos/courses/course-response.dto";
import { CourseMapper } from "../../shared/dtos/courses/course.mapping";
import { LessonMapper } from "../../shared/dtos/lessons/lesson.mapper";
import { IAdminLessonResponseDto} from "../../shared/dtos/lessons/lessonResponse.dto";
import { IAdminCommentResponseDto } from "../../shared/dtos/comment/commentResponse.dto";
import { CommentMapper } from "../../shared/dtos/comment/comment.mapper";
import { IQuestionAdminResponseDto } from "../../shared/dtos/question/question-response.dto";
import { QuestionMapper } from "../../shared/dtos/question/question.mapper";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter)
@injectable()
class AdminCourseServices implements IAdminCourseServices {
  constructor(
    @inject(TYPES.CourseRepository) private _courseRepo:ICourseRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.LessonsRepository) private _lessonRepo: ILessonsRepository,
    @inject(TYPES.QuestionsRepository) private _qustionRepo: IQuestionsRepository,
    @inject(TYPES.CommentsRepository) private _commentRepo:ICommentstRepository

  ) {}
async getClass(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters: FilterQuery<ICourse> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: ICourseAdminResponse[]; total: number; totalPages?: number }> {
   
    const { data, total, totalPages } = await this._courseRepo.AdmingetClassRepo(
      page,     
      limit,   
      search,   
      filters,   
      sort      
    );
  
    if (!data) throwError(Messages.COURSE.FETCH_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
  const sendData = await convertSignedUrlInArray(data, ["thumbnail"]);
  const mapperData=sendData.map((i)=>CourseMapper.toResponsePopulatedAdminCourse(i))
    return {
      data:mapperData,
      total,
      ...(totalPages !== undefined && { totalPages })
    };
  }
  
async createClass(data: Partial<ICourse>, thumbnail: Buffer): Promise<ICourseAdminResponse> {
  validateCoursePayload(data, thumbnail);

  if (!data.mentorId) {
    throwError(Messages.COURSE.MENTOR_ID_REQUIRED, StatusCode.BAD_REQUEST);
  }

  if (!data.startDate || !data.endDate || !data.startTime) {
    throwError(Messages.COURSE.MISSING_DATETIME, StatusCode.BAD_REQUEST);
  }

  const newStartDate = dayjs(data.startDate);
  const newEndDate = dayjs(data.endDate);
  const newStartTime = dayjs(data.startTime, "HH:mm");
  const newEndTime = newStartTime.add(1, "hour");

  const courses = await this._courseRepo.findAll({ mentorId: data.mentorId });

  const hasTimeOverlap = courses.some(course => {
    if (!course.startDate || !course.endDate || !course.startTime || !course.endTime) return false;

    const existingStartDate = dayjs(course.startDate);
    const existingEndDate = dayjs(course.endDate);
    const existingStartTime = dayjs(course.startTime, "HH:mm");
    const existingEndTime = dayjs(course.endTime, "HH:mm");

    const isDateOverlap =
      newStartDate.isSameOrBefore(existingEndDate, "day") &&
      newEndDate.isSameOrAfter(existingStartDate, "day");

    const isTimeOverlap =
      newStartTime.isBefore(existingEndTime) &&
      newEndTime.isAfter(existingStartTime);

    return isDateOverlap && isTimeOverlap;
  });

  if (hasTimeOverlap) {
    throwError(Messages.COURSE.MENTOR_TIME_CONFLICT, StatusCode.BAD_REQUEST);
  }


  const imageUrl = await uploadThumbnail(thumbnail);

  const courseData: Partial<ICourse> = {
    ...data,
    thumbnail: imageUrl,
  };

  const createdCourse = await this._courseRepo.create(courseData);
  if (!createdCourse) {
    throwError(Messages.COURSE.FAILED_TO_CREATE, StatusCode.INTERNAL_SERVER_ERROR);
  }

  await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [createdCourse.mentorId.toString()],
    roles: ["user"],
    title: Messages.COURSE.CREATED,
    message: Messages.COURSE.SCHEDULED_NOTIFICATION(createdCourse.title, createdCourse.startTime as string),
    type: "info",
  });

  const sendData = await convertSignedUrlInObject(createdCourse, ["thumbnail"]);
   const mapperData=CourseMapper.toResponsePopulatedAdminCourse(sendData)
  return mapperData;
}

  async editCourseService(
    courseId: string,
    data: Partial<ICourseResponseDto>,
    thumbnail?: Buffer
  ): Promise<ICourseAdminResponse> {
    const currentCourse = await this._courseRepo.findById(courseId);
    if (!currentCourse) {
      throwError(Messages.COURSE.NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const updateData: Partial<ICourseResponseDto> = { ...data };
if (typeof updateData.mentorId === 'string' && updateData.mentorId === '') {
    delete updateData.mentorId;
}
if (typeof updateData.categoryId === 'string' && updateData.categoryId === '') {
    delete updateData.categoryId;
}
    const newMentorId = data.mentorId || currentCourse.mentorId;
    const isMentorChanged =
  !!data.mentorId &&
  data.mentorId !== currentCourse.mentorId.toString();

    const isTimeChanged = (!!data.startTime && data.startTime !== currentCourse.startTime);

    if (isMentorChanged || isTimeChanged) {
      const startDate = data.startDate ?? currentCourse.startDate;
      const endDate = data.endDate ?? currentCourse.endDate;
      const startTime = data.startTime ?? currentCourse.startTime;
      if (!startDate || !endDate || !startTime) {
         throwError(Messages.COURSE.INCOMPLETE_SCHEDULE, StatusCode.BAD_REQUEST);
      }
      const existingCourses = await this._courseRepo.findAll({ mentorId: newMentorId });
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);
      const hasConflict = existingCourses.some(course => {
        if (course._id.toString() === courseId) return false;
        if (!course.startDate || !course.endDate || !course.startTime) return false;

        const courseStart = new Date(course.startDate);
        const courseEnd = new Date(course.endDate);

        const isDateOverlap = newStart <= courseEnd && newEnd >= courseStart;
        const isTimeOverlap = course.startTime === startTime;

        return isDateOverlap && isTimeOverlap;
      });

      if (hasConflict) {
        throwError(Messages.COURSE.MENTOR_COURSE_CONFLICT, StatusCode.CONFLICT);
      }
    }

    if (thumbnail) {
      if (currentCourse.thumbnail) {
        await deleteFromS3(currentCourse.thumbnail).catch(err =>
          console.error("Failed to delete old thumbnail:", err)
        );
      }
      updateData.thumbnail = await uploadThumbnail(thumbnail);
    }
    
    const updatedCourse = await this._courseRepo.update(courseId, updateData);

    if (!updatedCourse) {
      throwError(Messages.COURSE.FAILED_TO_UPDATE, StatusCode.INTERNAL_SERVER_ERROR); 
    }
    await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [updatedCourse.mentorId.toString()],
    title: Messages.COURSE.UPDATED,
    message: Messages.COURSE.UPDATED_NOTIFICATION(updatedCourse.title),
    type: "info",
   });
    const sendData = (await convertSignedUrlInObject(updatedCourse, ["thumbnail"]));

     const mapperData=CourseMapper.toResponsePopulatedAdminCourse(sendData)
    return mapperData;
  }

  async blockCourse(id: string, isBlock: boolean): Promise<void> {
  if (!id || id.length !== 24) {
      throwError(Messages.COURSE.INVALID_ID, StatusCode.BAD_REQUEST);

  }
  const updated = await this._courseRepo.update(id, { isBlock });
  if (!updated) {
    throwError(Messages.COURSE.FAILED_TO_UPDATE_STATUS, StatusCode.INTERNAL_SERVER_ERROR);
  }
  const statusText = isBlock ? "blocked" : "unblocked";

  if (!updated.mentorId) {
    throwError(Messages.COURSE.NO_MENTOR, StatusCode.NOT_FOUND);
  }
 await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [
      updated.mentorId.toString(),
      ...(Array.isArray(updated.enrolledUsers)
        ? updated.enrolledUsers.map((id) => id.toString())
        : []),
    ],
    title: ` Course ${statusText}`,
    message: isBlock ? Messages.COURSE.BLOCKED_NOTIFICATION(updated.title) : Messages.COURSE.UNBLOCKED_NOTIFICATION(updated.title),
    type: isBlock ? "error" : "success",
  });
  }
async getLessons(courseId: string): Promise<{
  lessons: IAdminLessonResponseDto[];
  comments: IAdminCommentResponseDto[];
  questions: IQuestionAdminResponseDto[];
}> {
  const result = await this._lessonRepo.findAll({ courseId });
  if (!result) throwError(Messages.COMMON.INTERNAL_ERROR, StatusCode.BAD_REQUEST);
  const updatedLessons = await convertSignedUrlInArray(result, ["thumbnail"]);
  const sendData=await generateSignedUrlForVideoFieldInObjects(updatedLessons,["videoUrl"])
  const comments = await this._commentRepo.findAll({ courseId });
  const lessonIds = updatedLessons.map((l) => l._id.toString());
  const questions = await this._qustionRepo.findAll({
  lessonId: { $in: lessonIds },
  });
  const mapperData = sendData.map((i) => LessonMapper.toAdminLessonResponseDto(i))
  const sendComment = comments.map((i) => CommentMapper.toAdminCommentResponseDto(i))
  const sendQuestion=questions.map((i)=>QuestionMapper.toQuestionAdminResponseDto(i))
  return {
    lessons: mapperData,
    comments:sendComment,
    questions:sendQuestion,
  };
}

}

export default AdminCourseServices;
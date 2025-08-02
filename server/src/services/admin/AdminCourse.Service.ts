import { inject, injectable } from "inversify";
import { IAdminCourseServices } from "../../core/interfaces/services/admin/IAdminCourseService";
import {  ICourse } from "../../types/classTypes";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { throwError } from "../../utils/ResANDError";
import { uploadThumbnail, deleteFromS3, convertSignedUrlInArray, convertSignedUrlInObject, getSignedS3Url, signConcernAttachmentUrls, generateSignedUrlForVideoFieldInObjects } from "../../utils/s3Utilits";
import { validateCoursePayload } from "../../validation/adminValidation";
import { StatusCode } from "../../enums/statusCode.enum";
import { FilterQuery } from "mongoose";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { IComment, ILesson, IQuestions } from "../../types/lessons";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";
import { IQuestionsRepository } from "../../core/interfaces/repositories/lessons/IQuestionsRepository";
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
  ): Promise<{ data: ICourse[]; total: number; totalPages?: number }> {
   
    const { data, total, totalPages } = await this._courseRepo.AdmingetClassRepo(
      page,     
      limit,   
      search,   
      filters,   
      sort      
    );
  
    if (!data) throwError("Failed to fetch courses", StatusCode.INTERNAL_SERVER_ERROR);
   const sendData=await convertSignedUrlInArray(data,["thumbnail"])
    return {
      data:sendData,
      total,
      ...(totalPages !== undefined && { totalPages })
    };
  }
  
async createClass(data: Partial<ICourse>, thumbnail: Buffer): Promise<ICourse> {
  validateCoursePayload(data, thumbnail);

  if (!data.mentorId) {
    throwError("Mentor ID is required", StatusCode.BAD_REQUEST);
  }

  if (!data.startDate || !data.endDate || !data.startTime) {
    throwError("Missing date/time range", StatusCode.BAD_REQUEST);
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
    throwError("This mentor already has a class during this time range.", StatusCode.BAD_REQUEST);
  }

  const imageUrl = await uploadThumbnail(thumbnail);

  const courseData: Partial<ICourse> = {
    ...data,
    thumbnail: imageUrl,
  };

  const createdCourse = await this._courseRepo.create(courseData);

  if (!createdCourse) {
    throwError("Failed to create course", StatusCode.INTERNAL_SERVER_ERROR);
  }

  await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [createdCourse.mentorId.toString()],
    roles: ["user"],
    title: "New Course Scheduled",
    message: `Course "${createdCourse.title}" is scheduled to start at ${createdCourse.startTime}.`,
    type: "info",
  });

  const sendData = await convertSignedUrlInObject(createdCourse, ["thumbnail"]);
  return sendData;
}

  async editCourseService(
    courseId: string,
    data: Partial<ICourse>,
    thumbnail?: Buffer
  ): Promise<ICourse> {
    const currentCourse = await this._courseRepo.findById(courseId);
    if (!currentCourse) {
      throwError("Course not found", StatusCode.NOT_FOUND);
    }

    const updateData: Partial<ICourse> = { ...data };
if (typeof updateData.mentorId === 'string' && updateData.mentorId === '') {
    delete updateData.mentorId;
}
if (typeof updateData.categoryId === 'string' && updateData.categoryId === '') {
    delete updateData.categoryId;
}
    const newMentorId = data.mentorId || currentCourse.mentorId;
    const isMentorChanged = !!data.mentorId && data.mentorId !== currentCourse.mentorId;

    const isTimeChanged = (!!data.startTime && data.startTime !== currentCourse.startTime);

    if (isMentorChanged || isTimeChanged) {
      const startDate = data.startDate ?? currentCourse.startDate;
      const endDate = data.endDate ?? currentCourse.endDate;
      const startTime = data.startTime ?? currentCourse.startTime;
      if (!startDate || !endDate || !startTime) {
        throwError("Incomplete scheduling data", StatusCode.BAD_REQUEST);
      }
      const existingCourses = await this._courseRepo.findAll({ mentorId: newMentorId });
      const newStart = new Date(startDate);
      const newEnd = new Date(endDate);
      const hasConflict = existingCourses.some(course => {
        if (course.id === courseId) return false;
        if (!course.startDate || !course.endDate || !course.startTime) return false;

        const courseStart = new Date(course.startDate);
        const courseEnd = new Date(course.endDate);

        const isDateOverlap = newStart <= courseEnd && newEnd >= courseStart;
        const isTimeOverlap = course.startTime === startTime;

        return isDateOverlap && isTimeOverlap;
      });

      if (hasConflict) {
        throwError("Mentor already has a course at this time", StatusCode.CONFLICT);
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
      throwError("Failed to update course", StatusCode.INTERNAL_SERVER_ERROR);
    }
    await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [updatedCourse.mentorId.toString()],
    title: "Course Updated",
    message: `Your course "${updatedCourse.title}" has been updated by the admin.`,
    type: "info",
   });
  const sendData=await convertSignedUrlInObject(updatedCourse,["thumbnail"])
    return sendData;
  }

  async blockCourse(id: string, isBlock: boolean): Promise<void> {
  if (!id || id.length !== 24) {
    throwError("Invalid course ID", StatusCode.BAD_REQUEST);
  }
  const updated = await this._courseRepo.update(id, { isBlock });
  if (!updated) {
    throwError("Failed to update course status", StatusCode.INTERNAL_SERVER_ERROR);
  }
  const statusText = isBlock ? "blocked" : "unblocked";

  if (!updated.mentorId) {
    throwError("No mentor associated with this course", StatusCode.NOT_FOUND);
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
    message: `Your ${updated.title} course has been ${statusText} by the admin.`,
    type: isBlock ? "error" : "success",
  });
  }
async getLessons(courseId: string): Promise<{
  lessons: ILesson[];
  comments: IComment[];
  questions: IQuestions[];
}> {
  const result = await this._lessonRepo.findAll({ courseId });
  if (!result) throwError("Invalid request", StatusCode.BAD_REQUEST);
  const updatedLessons = await convertSignedUrlInArray(result, ["thumbnail"]);
  const sendData=await generateSignedUrlForVideoFieldInObjects(updatedLessons,["videoUrl"])
  const comments = await this._commentRepo.findAll({ courseId });
  const lessonIds = updatedLessons.map((l) => l.id.toString());
  const questions = await this._qustionRepo.findAll({
  lessonId: { $in: lessonIds },
});
  return {
    lessons: sendData,
    comments,
    questions,
  };
}

}

export default AdminCourseServices;
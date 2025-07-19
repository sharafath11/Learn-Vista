import { inject, injectable } from "inversify";
import { IMentorLessonService } from "../../core/interfaces/services/mentor/IMentorLesson.Service";
import { TYPES } from "../../core/types";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import mongoose, { ObjectId } from "mongoose";
import {
  IComment,
  ILesson,
  ILessonUpdateData,
  IQuestions,
} from "../../types/lessons";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudImage";
import { IQuestionsRepository } from "../../core/interfaces/repositories/lessons/IQuestionsRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";
import { getGemaniResponse } from "../../config/gemaniAi";
import { buildMcqOptionsPrompt } from "../../utils/Rportprompt";
import { IUserCourseProgressRepository } from "../../core/interfaces/repositories/user/IUserCourseProgressRepository";
import { logger } from "../../utils/logger";

@injectable()
export class MentorLessonService implements IMentorLessonService {
  constructor(
    @inject(TYPES.LessonsRepository) private _lessonRepo: ILessonsRepository,
    @inject(TYPES.QuestionsRepository)
    private _questionRepository: IQuestionsRepository,
    @inject(TYPES.CourseRepository) private _courseRepo: ICourseRepository,
    @inject(TYPES.CommentsRepository)
    private _commentRepo: ICommentstRepository,
    @inject(TYPES.UserCourseProgressRepository)
    private _userCourseProgress: IUserCourseProgressRepository
  ) {}

  async getLessons(
    courseId: string | ObjectId,
    
  ): Promise<ILesson[]> {
    const result = await this._lessonRepo.findAll({ courseId });
    if (!result) throwError("Invalid request", StatusCode.BAD_REQUEST);
    return result;
  }

  async addLesson(data: ILesson): Promise<ILesson> {
    if (!data.title || !data.videoUrl || !data.courseId || !data.thumbnail) {
      throwError("All filed are required", StatusCode.BAD_REQUEST);
    }
    const existingOrder = await this._lessonRepo.findOne({
      order: data.order,
      courseId: data.courseId,
    });
    if (existingOrder) {
      throwError(
        "Lesson order must be unique within the course",
        StatusCode.CONFLICT
      );
    }

    let imageUrl: string | undefined;

    if (Buffer.isBuffer(data.thumbnail)) {
      try {
        imageUrl = await uploadToCloudinary(
          data.thumbnail,
          "lesson_thumbnails"
        );
      } catch (error) {
        logger.error("Cloudinary upload failed:", error);
        throwError(
          "Failed to upload thumbnail to Cloudinary",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
    } else if (typeof data.thumbnail === "string") {
      imageUrl = data.thumbnail;
    } else {
      imageUrl = "/placeholder.svg?height=80&width=120";
    }

    const lessonData: ILesson = {
      ...data,
      courseId: data.courseId as string | ObjectId,
      title: data.title!,
      description: data.description!,
      order: data.order!,
      videoUrl: data.videoUrl!,
      duration: data.duration || "",
      thumbnail: imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ILesson;

    const createdLesson = await this._lessonRepo.create(lessonData);
    if (!createdLesson) {
      throwError("Failed to create lesson", StatusCode.INTERNAL_SERVER_ERROR);
    }
    await this._courseRepo.update(data.courseId as string, {
      $addToSet: { sessions: createdLesson.id },
    });
    await this._userCourseProgress.findAll({ courseId: data.courseId });
    await this._userCourseProgress.updateMany(
      { courseId: data.courseId },
      { $inc: { totalLessons: 1 } }
    );
    return createdLesson;
  }

  async editLesson(
    lessonId: string | ObjectId,
    updateData: ILessonUpdateData
  ): Promise<ILesson> {
    const existingLesson = await this._lessonRepo.findById(lessonId.toString());
    if (!existingLesson) {
      throwError("Lesson not found", StatusCode.NOT_FOUND);
    }
    let newThumbnailUrlForDb: string | undefined;
    if (typeof existingLesson.thumbnail === "string") {
      newThumbnailUrlForDb = existingLesson.thumbnail;
    }

    if (updateData.thumbnailFileBuffer) {
      try {
        newThumbnailUrlForDb = await uploadToCloudinary(
          updateData.thumbnailFileBuffer,
          "lesson_thumbnails"
        );

        if (
          typeof existingLesson.thumbnail === "string" &&
          existingLesson.thumbnail.includes("res.cloudinary.com")
        ) {
          await deleteFromCloudinary(existingLesson.thumbnail);
        }
      } catch (error) {
        console.error("Thumbnail update failed:", error);
        throwError(
          "Failed to update thumbnail",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
    } else if (updateData.clearThumbnail === true) {
      if (
        typeof existingLesson.thumbnail === "string" &&
        existingLesson.thumbnail.includes("res.cloudinary.com")
      ) {
        await deleteFromCloudinary(existingLesson.thumbnail);
      }
      newThumbnailUrlForDb = undefined;
    } else if (updateData.thumbnail !== undefined) {
      if (
        typeof updateData.thumbnail === "string" &&
        updateData.thumbnail !== newThumbnailUrlForDb &&
        typeof existingLesson.thumbnail === "string" &&
        existingLesson.thumbnail.includes("res.cloudinary.com")
      ) {
        await deleteFromCloudinary(existingLesson.thumbnail);
      }
      newThumbnailUrlForDb =
        typeof updateData.thumbnail === "string"
          ? updateData.thumbnail
          : undefined;
    }
    const lessonUpdatePayload: Partial<ILesson> = {
      title: updateData.title,
      description: updateData.description,
      order: updateData.order,
      videoUrl: updateData.videoUrl,
      duration: updateData.duration,
      isFree: updateData.isFree,
      courseId: updateData.courseId,
      thumbnail: newThumbnailUrlForDb,
      updatedAt: new Date(),
    };
    if (typeof lessonUpdatePayload.order === "string") {
      lessonUpdatePayload.order = parseInt(lessonUpdatePayload.order);
    }
    if (
      typeof lessonUpdatePayload.courseId === "string" &&
      mongoose.Types.ObjectId.isValid(lessonUpdatePayload.courseId)
    ) {
      lessonUpdatePayload.courseId = new mongoose.Types.ObjectId(
        lessonUpdatePayload.courseId
      );
    }

    const updated = await this._lessonRepo.update(
      lessonId.toString(),
      lessonUpdatePayload
    );

    if (!updated) {
      throwError("Lesson not found or update failed", StatusCode.NOT_FOUND);
    }

    return updated;
  }
  async getQuestionService(lessonId: string | ObjectId): Promise<IQuestions[]> {
    const result = await this._questionRepository.findAll({ lessonId });
    return result;
  }
  async editQuestionService(
    questionId: string,
    data: Partial<IQuestions>
  ): Promise<void> {
    if (!data.question || !data.type || !data.lessonId) {
      throwError(
        "Missing required fields for validation.",
        StatusCode.BAD_REQUEST
      );
    }
    if (data.question.trim().length < 10)
      throwError("Make qustion at least 10 charcter");
    await this._questionRepository.update(data.id, data);
    return;
  }
  async addQuestionService(
    lessonId: string | ObjectId,
    data: IQuestions
  ): Promise<IQuestions> {
    if (!data.question || !data.type || !data.lessonId) {
      throwError(
        "Missing required fields for validation.",
        StatusCode.BAD_REQUEST
      );
    }
    if (data.question.trim().length < 10)
      throwError("Make qustion at least 10 charcter");
    await this._questionRepository.create(data);
    return data;
  }
  async getComments(lessonId: string | ObjectId): Promise<IComment[]> {
    const result = await this._commentRepo.findAll({ lessonId: lessonId });

    if (!result) throwError("comments denot found ");
    return result;
  }
  async genrateOptions(question: string): Promise<string[]> {
    if (!question.trim()) {
      throwError("Question is required to generate options.");
    }

    const prompt = buildMcqOptionsPrompt(question);
    const resultRaw = await getGemaniResponse(prompt);

    let parsed: string[];

    try {
      parsed =
        typeof resultRaw === "string" ? JSON.parse(resultRaw) : resultRaw;
    } catch {
      throwError("Invalid format received. Please enter options manually.");
    }

    if (!Array.isArray(parsed)) {
      throwError(
        "Currently unable to generate options. Please try again later or enter manually."
      );
    }

    const cleaned = parsed
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    if (cleaned.length < 2) {
      throwError(
        "Insufficient options generated. Try a more descriptive question."
      );
    }

    return cleaned;
  }
}

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
import { throwError } from "../../utils/resAndError";
import { StatusCode } from "../../enums/statusCode.enum";
import { IQuestionsRepository } from "../../core/interfaces/repositories/lessons/IQuestionsRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";
import { getGemaniResponse } from "../../config/gemaniAi";
import { buildMcqOptionsPrompt } from "../../utils/rportprompt";
import { IUserCourseProgressRepository } from "../../core/interfaces/repositories/user/IUserCourseProgressRepository";
import { convertSignedUrlInArray, uploadThumbnail, deleteFromS3, convertSignedUrlInObject } from "../../utils/s3Utilits";
import { Messages } from "../../constants/messages";
import { IMentorLessonResponseDto } from "../../shared/dtos/lessons/lessonResponse.dto";
import { LessonMapper } from "../../shared/dtos/lessons/lesson.mapper";
import { IMentorQustionsDto } from "../../shared/dtos/question/question-response.dto";
import { QuestionMapper } from "../../shared/dtos/question/question.mapper";
import { IMentorCommentResponseAtLesson } from "../../shared/dtos/comment/commentResponse.dto";
import { CommentMapper } from "../../shared/dtos/comment/comment.mapper";

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

  async getLessons(courseId: string | ObjectId): Promise<IMentorLessonResponseDto[]> {
    const result = await this._lessonRepo.findAll({ courseId });
    if (!result) throwError(Messages.COMMON.INTERNAL_ERROR, StatusCode.BAD_REQUEST);
    const updatedResult = await convertSignedUrlInArray(result, ["thumbnail"]);
    return updatedResult.map((i)=>LessonMapper.toMentorLessonResponseDto(i));
  }

  async addLesson(data: ILesson): Promise<IMentorLessonResponseDto> {
    if (!data.title || !data.videoUrl || !data.courseId || !data.thumbnail) {
      throwError(Messages.COMMON.MISSING_FIELDS, StatusCode.BAD_REQUEST);
    }
    const existingOrder = await this._lessonRepo.findOne({
      order: data.order,
      courseId: data.courseId,
    });
    if (existingOrder) {
      throwError(
        Messages.LESSONS.ORDER_NOT_UNIQUE,
        StatusCode.CONFLICT
      );
    }
    let imageUrl: string | undefined;
    if (Buffer.isBuffer(data.thumbnail)) {
      try {
        imageUrl = await uploadThumbnail(data.thumbnail);
      } catch (error) {
       
        throwError(
          Messages.LESSONS.UPLOAD_FAILED,
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
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
      throwError(Messages.LESSONS.CREATE_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
    }
    await this._courseRepo.update(data.courseId as string, {
      $addToSet: { sessions: createdLesson.id },
    });
    await this._userCourseProgress.findAll({ courseId: data.courseId });
    await this._userCourseProgress.updateMany(
      { courseId: data.courseId },
      { $inc: { totalLessons: 1 } }
    );
    return LessonMapper.toMentorLessonResponseDto(createdLesson);
  }

  async editLesson(
    lessonId: string | ObjectId,
    updateData: ILessonUpdateData
  ): Promise<IMentorLessonResponseDto> {
    const existingLesson = await this._lessonRepo.findById(lessonId.toString());
    if (!existingLesson) {
      throwError(Messages.LESSONS.NOT_FOUND, StatusCode.NOT_FOUND);
    }
    let newThumbnailUrlForDb: string | undefined;
    if (typeof existingLesson.thumbnail === "string") {
      newThumbnailUrlForDb = existingLesson.thumbnail;
    }

    if (updateData.thumbnailFileBuffer) {
      try {
        if (
          typeof existingLesson.thumbnail === "string" &&
          existingLesson.thumbnail.includes("thumbnails/")
        ) {
          await deleteFromS3(existingLesson.thumbnail);
        }

        newThumbnailUrlForDb = await uploadThumbnail(
          updateData.thumbnailFileBuffer,
        );
      } catch (error) {
        throwError(Messages.LESSONS.THUMBNAIL_UPDATE_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
      }
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
      throwError(Messages.LESSONS.UPDATE_FAILED, StatusCode.NOT_FOUND);
    }
    const sendData=await convertSignedUrlInObject(updated,["thumbnail"])
    return LessonMapper.toMentorLessonResponseDto(sendData);
  }
  async getQuestionService(lessonId: string | ObjectId): Promise<IMentorQustionsDto[]> {
    const result = await this._questionRepository.findAll({ lessonId });
    return result.map((i)=>QuestionMapper.toImentorQustionResponseDto(i));
  }
  async editQuestionService(
    questionId: string,
    data: Partial<IQuestions>
  ): Promise<void> {
    if (!data.question || !data.type ) {
      throwError(
        Messages.COMMON.MISSING_FIELDS,
        StatusCode.BAD_REQUEST
      );
    }
    if (data.question.trim().length < 3)
      throwError(Messages.QUESTIONS.INVALID_QUESTION);
    await this._questionRepository.update(data.id, data);

    return;
  }
  async addQuestionService(
    lessonId: string | ObjectId,
    data: IQuestions
  ): Promise<IMentorQustionsDto> {
    if (!data.question || !data.type || !data.lessonId) {
      throwError(
        Messages.COMMON.MISSING_FIELDS,
        StatusCode.BAD_REQUEST
      );
    }
    if (data.question.trim().length < 10)
      throwError(Messages.QUESTIONS.INVALID_QUESTION);
    const updated=await this._questionRepository.create(data);
    return QuestionMapper.toImentorQustionResponseDto(updated) ;
  }
  async getComments(lessonId: string | ObjectId): Promise<IMentorCommentResponseAtLesson[]> {
    const result = await this._commentRepo.findAll({ lessonId: lessonId });
    if (!result) throwError(Messages.COMMENT.NO_COMMENTS_FOUND);
    return result.map((i)=>CommentMapper.toMentorCommentResponseAtLessonDto(i));
  }
  async genrateOptions(question: string): Promise<string[]> {
    if (!question.trim()) {
      throwError(Messages.QUESTIONS.INVALID_GENERATION_INPUT);
    }
    const prompt = buildMcqOptionsPrompt(question);
    const resultRaw = await getGemaniResponse(prompt);
let parsed: string[];

try {
  let response = resultRaw;

  if (typeof response === "string") {
    response = response.replace(/```(?:\w+)?\s*([\s\S]*?)\s*```/, "$1").trim();
    parsed = JSON.parse(response);
  } else if (Array.isArray(response)) {
    parsed = response;
  } else {
    throw new Error("Unexpected response format");
  }
} catch (err) {
  console.error("Parsing error:", err, resultRaw);
  throwError(Messages.GENAI.GENERATE_OPTIONS_FAILED);
}
    const cleaned = parsed
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);
    if (cleaned.length < 2) {
      throwError(
        Messages.QUESTIONS.INSUFFICIENT_OPTIONS
      );
    }
    return cleaned;
  }
}

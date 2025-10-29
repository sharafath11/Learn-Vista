import mongoose, { FilterQuery, ObjectId } from "mongoose";
import { GetLessonsResponse, IUserLessonsService } from "../../core/interfaces/services/user/IUserLessonsService";
import {ILessonDetails, IVoiceNote, LessonQuestionInput } from "../../types/lessons";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { throwError } from "../../utils/resAndError";
import { StatusCode } from "../../enums/statusCode.enum";
import { IQuestionsRepository } from "../../core/interfaces/repositories/lessons/IQuestionsRepository";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../config/AWS";
import { ILessonReportRepository } from "../../core/interfaces/repositories/lessons/ILessonReportRepository";
import { buildPerfectNotePrompt, buildPrompt } from "../../utils/rportprompt";
import { getAIResponse } from "../../config/gemaniAi";
import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { IUserLessonProgress } from "../../types/userLessonProgress";
import { IUserCourseService } from "../../core/interfaces/services/user/IUserCourseController";
import { IUserLessonProgressRepository } from "../../core/interfaces/repositories/course/IUserLessonProgressRepo";
import { convertSignedUrlInArray } from "../../utils/s3Utilits";
import { logger } from "../../utils/logger";
import { Messages } from "../../constants/messages";
import { LessonMapper } from "../../shared/dtos/lessons/lesson.mapper";
import { IUserQustionsDto } from "../../shared/dtos/question/question-response.dto";
import { QuestionMapper } from "../../shared/dtos/question/question.mapper";
import { CommentMapper } from "../../shared/dtos/comment/comment.mapper";
import { IUserCommentResponseAtLesson } from "../../shared/dtos/comment/commentResponse.dto";
import { IUserLessonProgressDto, IUserLessonReportResponse, IUserVoiceNoteResponseDto } from "../../shared/dtos/lessons/lessonResponse.dto";
import { IVoiceNoteRepository } from "../../core/interfaces/repositories/user/IVoiceNoteRepository";
import { toObjectId } from "../../utils/convertStringToObjectId";

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
    @inject(TYPES.UserCourseService) private _userCourseService: IUserCourseService,
    @inject(TYPES.VoiceNoteRepository) private _voiceRepo:IVoiceNoteRepository
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
      throwError(Messages.LESSONS.UPLOAD_URL_FAILED, StatusCode.BAD_REQUEST);
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: s3Key,
    });
    return getSignedUrl(s3, command, { expiresIn: 3600 });
  }

async getLessons(
  courseId: string | ObjectId,
  userId: string | ObjectId,
  page: number,
  limit: number
): Promise<GetLessonsResponse> {
  await this._userCourseService.validateUserEnrollment(userId, courseId);
  const { data: lessons, total, totalPages } =
    await this._lessonRepository.findPaginated({ courseId }, page, limit);

  if (!lessons || lessons.length === 0) {
    throwError(Messages.LESSONS.NO_LESSONS_FOUND, StatusCode.NOT_FOUND);
  }
  const lessonProgress = await this._userLessonProgressRepo.findAll({ courseId, userId });
  const sendData = await convertSignedUrlInArray(lessons, ["thumbnail"]);
  const convetData = sendData.map((i) => LessonMapper.toLessonUserResponseDto(i));
  const progressData = lessonProgress.map((i) => LessonMapper.toLessonProgressUser(i));

  return {
    lessons: convetData,
    progress: progressData,
    total,
    totalPages,
  };
}



  async getQuestions(lessonId: string | ObjectId): Promise<IUserQustionsDto[]> {
    const questions = await this._qustionRepository.findAll({ lessonId });
    if (!questions) throwError(Messages.COMMON.INTERNAL_ERROR, StatusCode.BAD_REQUEST);
    return questions.map((i)=>QuestionMapper.toUserQustionResponse(i));
  }

  async getLessonDetils(lessonId: string | ObjectId, userId: string): Promise<ILessonDetails> {
    const lesson = await this._lessonRepository.findById(lessonId.toString());
    if (!lesson) throwError(Messages.LESSONS.NOT_FOUND, StatusCode.NOT_FOUND);

    const [questions, signedUrl, comments, report, lessonProgress] = await Promise.all([
      this._qustionRepository.findAll({ lessonId }),
      this.getSignedVideoUrl(lesson.videoUrl),
      this._commentsRepo.findAll({ lessonId }),
      this._lessonReportRepo.findOne({ lessonId, userId }),
      this._userLessonProgressRepo.findOne({ userId, lessonId }),
    ]);
    const sendQ = questions.map((i) => QuestionMapper.toUserQustionResponse(i));
    const sendL = LessonMapper.toLessonUserResponseDto(lesson);
    const sendC = comments.map((i) => CommentMapper.toUserCommentResponseAtLessonDto(i));
    const sendR = report ? LessonMapper.lessonReportToresponse(report) : report
    const sendP=lessonProgress?LessonMapper.toLessonProgressUser(lessonProgress):lessonProgress
    return { questions:sendQ, videoUrl: signedUrl, lesson:sendL, comments:sendC, report:sendR, lessonProgress:sendP };
  }

  async lessonReport(
    userId: string | ObjectId,
    lessonId: string | ObjectId,
    data: LessonQuestionInput
  ): Promise<IUserLessonReportResponse> {
    if (!userId) throwError(Messages.USERS.MISSING_USER_ID, StatusCode.BAD_REQUEST);

    const existingReport = await this._lessonReportRepo.findOne({ lessonId, userId });
    if (existingReport) {
      throwError(Messages.LESSONS.REPORT_ALREADY_EXISTS, StatusCode.BAD_REQUEST);
    }

    const lesson = await this._lessonRepository.findById(lessonId as string);
    if (!lesson) throwError(Messages.LESSONS.NOT_FOUND, StatusCode.NOT_FOUND);
    const course = await this._courseRepository.findById(lesson.courseId as string);
    if (!course) throwError(Messages.COURSE.NOT_FOUND, StatusCode.NOT_FOUND);

    const prompt = buildPrompt(data);
    const geminiReport = await getAIResponse(prompt);
    if (!geminiReport)
      throwError(Messages.LESSONS.REPORT_GENERATION_FAILED, StatusCode.INTERNAL_SERVER_ERROR);

    const report = await this._lessonReportRepo.create({
      userId: userId,
      lessonId: lessonId,
      courseId: course._id,
      mentorId: course.mentorId,
      report: geminiReport,
    });
    await this._userCourseService.updateUserCourseProgress(userId as string, course.id as string, lessonId as string);

    return LessonMapper.lessonReportToresponse(report);
  }
async saveComments(
  userId: string,
  lessonId: string | ObjectId,
  comment: string
): Promise<IUserCommentResponseAtLesson> {
  if (!lessonId || !comment || !userId) {
    throwError(Messages.LESSONS.INVALID_DATA, StatusCode.BAD_REQUEST);
  }

  const [userData, lesson] = await Promise.all([
    this._userRepo.findById(userId),
    this._lessonRepository.findById(lessonId.toString()),
  ]);

  if (!userData) throwError(Messages.USERS.USER_NOT_FOUND, StatusCode.NOT_FOUND);
  if (!lesson) throwError(Messages.LESSONS.NOT_FOUND, StatusCode.NOT_FOUND);

  const course = await this._courseRepository.findById(
    lesson.courseId.toString()
  );

  if (!course || !course.mentorId) {
    throwError(Messages.COURSE.NOT_FOUND, StatusCode.NOT_FOUND);
  }

  const savedComment = await this._commentsRepo.create({
    lessonId: lesson._id.toString(),
    courseId: course._id.toString(), 
    comment,
    mentorId: course.mentorId.toString(),
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

  return CommentMapper.toUserCommentResponseAtLessonDto(savedComment);
}
private calculateOverallLessonProgress(lessonProgress: IUserLessonProgress): number {
  let completedWeight = 0;

  if (lessonProgress.videoTotalDuration > 0) {
    const videoCompletionRatio = Math.min(
      1,
      lessonProgress.videoWatchedDuration / lessonProgress.videoTotalDuration
    );
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

  const overall = Math.round(Math.min(100, Math.max(0, completedWeight * 100)));
  return overall;
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
    console.warn(`⚠ Video total duration is 0 for lesson ${progress.lessonId}. Cannot calculate video progress accurately.`);
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

// This is the corrected, working version of your code.
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
): Promise<IUserLessonProgressDto> {
  const lesson = await this._lessonRepository.findById(lessonId);
  if (!lesson) {
    throwError(Messages.LESSONS.NOT_FOUND, StatusCode.NOT_FOUND);
  }
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
  const overallProgress = this.calculateOverallLessonProgress(updatedProgress);
  const updatePayload = {
    videoProgressPercent: updatedProgress.videoProgressPercent,
    videoWatchedDuration: updatedProgress.videoWatchedDuration,
    videoTotalDuration: updatedProgress.videoTotalDuration,
    theoryCompleted: updatedProgress.theoryCompleted,
    practicalCompleted: updatedProgress.practicalCompleted,
    mcqCompleted: updatedProgress.mcqCompleted,
    videoCompleted: updatedProgress.videoCompleted,
    overallProgressPercent: overallProgress, 
  };
  const finalProgressDoc = await this._userLessonProgressRepo.update(
    userLessonProgress._id.toString(),
    {
      $set: updatePayload 
    }
  );

  if (!finalProgressDoc) {
  
    throwError(Messages.LESSONS.PROGRESS_UPDATE_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
  }
  await this._userCourseService.updateUserCourseProgress(userId, courseId, lessonId);
  return LessonMapper.toLessonProgressUser(finalProgressDoc);
}
  
  
  async saveVoiceNote(userId: string, courseId: string | ObjectId, lessonId: string | ObjectId, note: string): Promise<void> {
     if (!userId || !courseId || !lessonId || !note) {
    throwError(Messages.LESSONS.INVALID_DATA, StatusCode.BAD_REQUEST);
     }
    const prompt = buildPerfectNotePrompt(note);
    const AiResponse = await getAIResponse(prompt);
    const savedNote = await this._voiceRepo.create({
  userId,
  courseId,
      lessonId,
  AiResponse:AiResponse||"I cant Understand youre english sorry 😵‍💫 ",
  note,
});

  }

async getVoiceNotes(
  userId: string,
  lessonOrCourseId: string | ObjectId,
  params: { search?: string; sort?: "asc" | "desc"; limit: number; page: number } = { limit: 10, page: 1 }
): Promise<{ notes: IUserVoiceNoteResponseDto[]; totalNotes: number }> {
  const { search = "", sort = "desc", limit, page } = params;

  if (!userId || !lessonOrCourseId) {
    throwError(Messages.LESSONS.INVALID_DATA, StatusCode.BAD_REQUEST);
  }

  const lesson = await this._lessonRepository.findById(lessonOrCourseId as string);

  let query: FilterQuery<IVoiceNote> = {
    userId: toObjectId(userId),
  };

  if (lesson) {
    query.lessonId = toObjectId(lessonOrCourseId as string);
  } else {
    query.courseId = toObjectId(lessonOrCourseId as string);
  }

  if (search) {
    query.$or = [
      { note: { $regex: search, $options: "i" } },
      { AiResponse: { $regex: search, $options: "i" } },
    ];
  }

  const { data: notes, total } = await this._voiceRepo.findPaginated(
    query,
    page,
    limit,
    search,
    { createdAt: sort === "asc" ? 1 : -1 }
  );

  const notesWithDetails = await Promise.all(
    notes.map(async (i: IVoiceNote) => {
      const course = await this._courseRepository.findById(i.courseId as string);
      const lesson = await this._lessonRepository.findById(i.lessonId as string);
      return LessonMapper.lessonVoieNoteResponse(
        i,
        course?.title || "",
        lesson?.title || ""
      );
    })
  );

  return {
    notes: notesWithDetails,
    totalNotes: total,
  };
}



  async editVoiceNote(
  userId: string,
  lessonId: string | ObjectId,
  voiceNoteId: string | ObjectId,
  note: string
): Promise<IUserVoiceNoteResponseDto> {
  if (!userId || !lessonId || !voiceNoteId || !note) {
    throwError(Messages.LESSONS.INVALID_DATA, StatusCode.BAD_REQUEST);
  }

  const prompt = buildPerfectNotePrompt(note);
  const aiResponse = await getAIResponse(prompt) || "I can't understand your note 😵‍💫";

  const updatedNote = await this._voiceRepo.update(
    voiceNoteId.toString(),
    {
      $set: {
        note,
        AiResponse:aiResponse,
        updatedAt: new Date()
      }
    }
  );

  if (!updatedNote) {
    throwError(Messages.VOICE_NOTE.DELETE_FAILED, StatusCode.INTERNAL_SERVER_ERROR);
  }
  const course = await this._courseRepository.findById(updatedNote.courseId as string);
  const lesson = await this._lessonRepository.findById(updatedNote.lessonId as string);

  return LessonMapper.lessonVoieNoteResponse(
    updatedNote,
    course?.title || "",
    lesson?.title || ""
  );
}

async deleteVoiceNote(
  userId: string,
  lessonId: string | ObjectId,
  voiceNoteId: string | ObjectId
): Promise<void> {
  if (!userId || !lessonId || !voiceNoteId) {
    throwError(Messages.LESSONS.INVALID_DATA, StatusCode.BAD_REQUEST);
  }

  const deleted = await this._voiceRepo.delete(voiceNoteId.toString());

  if (!deleted) {
    throwError(Messages.VOICE_NOTE.DELETED, StatusCode.INTERNAL_SERVER_ERROR);
  }
}

}

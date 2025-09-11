import { inject, injectable } from "inversify";
import { IMentorConcernService } from "../../core/interfaces/services/mentor/IMentorConcern.Service";
import { TYPES } from "../../core/types";
import { IConcernRepository } from "../../core/interfaces/repositories/concern/IConcernRepository";
import { IAttachment, IConcern } from "../../types/concernTypes";
import { validateConcernPayload } from "../../validation/validateConcernPayload";
import { throwError } from "../../utils/resAndError";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { getSignedS3Url, signConcernAttachmentUrls, uploadConcernAttachment } from "../../utils/s3Utilits";
import { Messages } from "../../constants/messages";
import { StatusCode } from "../../enums/statusCode.enum";
import { ConcernMapper } from "../../shared/dtos/concern/concern.mapper";
import { IConernMentorResponse } from "../../shared/dtos/concern/concern-response.dto";

@injectable()
export class MentorConcernService implements IMentorConcernService {
  constructor(
    @inject(TYPES.ConcernRepository)
    private _concernRepo: IConcernRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.CourseRepository) private _courseRepo:ICourseRepository
  ) {}

  async addConcern(data: IConcern , files?: Express.Multer.File[] ): Promise<IConernMentorResponse> {
  validateConcernPayload(data);
  const existingConcern = await this._concernRepo.findAll({ 
    courseId: data.courseId,
    mentorId: data.mentorId 
  });

  const hasUnresolved = existingConcern.some((c) => c.status !== "resolved");
 if (hasUnresolved) throwError(Messages.CONCERN.UNRESOLVED_EXISTS, StatusCode.BAD_REQUEST);

  const attachments: IAttachment[] = [];

  if (files && files.length > 0) {
    for (const file of files) {
      try {
        const s3Key = await uploadConcernAttachment(file.buffer, file.mimetype);
        attachments.push({
          url: s3Key,
          filename: file.originalname,
          size: file.size,
          type: file.mimetype.startsWith("image") ? "image" : "audio",
        });
      } catch (uploadError: any) {
        throwError(Messages.CONCERN.ATTACHMENT_UPLOAD_FAILED(file.originalname));
      }
    }
  }
  const concern = await this._concernRepo.create({
    ...data,
    attachments,
  });
  

  if (concern.attachments && concern.attachments.length > 0) {
    for (const attachment of concern.attachments) {
      try {
        attachment.url = await getSignedS3Url(attachment.url);
      } catch {
        attachment.url = "";
      }
    }
  }

  const course = await this._courseRepo.findById(concern.courseId as string);
  const ADMIN_ID = process.env.ADMIN_ID;
   if (!ADMIN_ID) throwError(Messages.COMMON.INTERNAL_ERROR, StatusCode.INTERNAL_SERVER_ERROR);
     await notifyWithSocket({
  notificationService: this._notificationService,
  userIds: [data.mentorId.toString(), ADMIN_ID],
  title: Messages.CONCERN.NOTIFICATION.TITLE,
  message: Messages.CONCERN.NOTIFICATION.MESSAGE(course?.title || ""),
  type: "warning",
});
 
 return ConcernMapper.toMentorResponseConcern(concern, course?.title as string);
 
}
 async getConcerns(
  filters: Record<string, unknown>,
  sort: Record<string, 1 | -1>,
  skip: number,
  limit: number
): Promise<{ data: IConernMentorResponse[]; total: number }> {
  const { data, total } = await this._concernRepo.findMany(filters, sort, skip, limit);
  const signedConcerns = await signConcernAttachmentUrls(data);
  const responses = await Promise.all(
    signedConcerns.map(async (concern: IConcern) => {
      const course = await this._courseRepo.findById(concern.courseId as string);
      const courseTitle = course?.title || "Unknown Course";
      return ConcernMapper.toMentorResponseConcern(concern, courseTitle);
    })
  );
  return { data:responses, total };
}
}

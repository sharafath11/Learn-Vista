import { inject, injectable } from "inversify";
import { IMentorConcernService } from "../../core/interfaces/services/mentor/IMentorConcern.Service";
import { TYPES } from "../../core/types";
import { IConcernRepository } from "../../core/interfaces/repositories/concern/IConcernRepository";
import { IAttachment, IConcern } from "../../types/concernTypes";
import { validateConcernPayload } from "../../validation/validateConcernPayload";
import { throwError } from "../../utils/ResANDError";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { getSignedS3Url, uploadConcernAttachment } from "../../utils/s3Utilits";

@injectable()
export class MentorConcernService implements IMentorConcernService {
  constructor(
    @inject(TYPES.ConcernRepository)
    private _concernRepo: IConcernRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.CourseRepository) private _courseRepo:ICourseRepository
  ) {}

  async addConcern(data: IConcern , files?: Express.Multer.File[] ): Promise<IConcern> {
  validateConcernPayload(data);
  console.log(files)
  const existingConcern = await this._concernRepo.findAll({ 
    courseId: data.courseId,
    mentorId: data.mentorId 
  });

  const hasUnresolved = existingConcern.some((c) => c.status !== "resolved");
  if (hasUnresolved) throwError("After completing the first concern, you can raise another one.");

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
        throwError(`Failed to upload attachment ${file.originalname}: ${uploadError.message || "Unknown error"}`);
      }
    }
  }
console.log(attachments,"fvf")
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
  if (!ADMIN_ID) throwError("Something went wrong");

  await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [data.mentorId.toString(), ADMIN_ID],
    title: "New Concern Raised",
    message: `A new concern has been raised for course ${course?.title}.`,
    type: "warning",
  });

  return concern;
}
 async getConcerns(
  filters: Record<string, unknown>,
  sort: Record<string, 1 | -1>,
  skip: number,
  limit: number
): Promise<{ data: IConcern[]; total: number }> {
  const { data, total } = await this._concernRepo.findMany(filters, sort, skip, limit);

  for (const concern of data) {
    if (concern.attachments && Array.isArray(concern.attachments)) {
      for (const attachment of concern.attachments) {
        try {
          attachment.url = await getSignedS3Url(attachment.url);
        } catch {
          attachment.url = "";
        }
      }
    }
  }

  return { data, total };
}
}

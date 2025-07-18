import { inject, injectable } from "inversify";
import { IMentorConcernService } from "../../core/interfaces/services/mentor/IMentorConcern.Service";
import { TYPES } from "../../core/types";
import { IConcernRepository } from "../../core/interfaces/repositories/concern/IConcernRepository";
import { IConcern } from "../../types/concernTypes";
import { validateConcernPayload } from "../../validation/validateConcernPayload";
import { throwError } from "../../utils/ResANDError";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";

@injectable()
export class MentorConcernService implements IMentorConcernService {
  constructor(
    @inject(TYPES.ConcernRepository)
    private _concernRepo: IConcernRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.CourseRepository) private _courseRepo:ICourseRepository
  ) {}

  async addConcern(data: IConcern): Promise<IConcern> {
    validateConcernPayload(data);
    const existingConcern = await this._concernRepo.findAll({ courseId: data.courseId ,mentorId:data.mentorId})
    const ex=existingConcern.some((c) => c.status !== "resolved")
    if(ex) throwError(`after complete  first concern then you can rise concern`)
    const concern = await this._concernRepo.create(data);
    const course=await this._courseRepo.findById(concern.courseId as string)
    const ADMIN_ID=process.env.ADMIN_ID
    if(!ADMIN_ID) throwError("somthing wront wrong")
     await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [data.mentorId.toString(), ADMIN_ID],
    title: " New Concern Raised",
    message: `A new concern has been raised for course  ${course?.title}".`,
    type: "warning",
  });
    return concern;
  }
  async getConcerns(
    filters: Record<string, any>,
    sort: Record<string, 1 | -1>,
    skip: number,
    limit: number
  ): Promise<{ data: IConcern[]; total: number }> {
    return this._concernRepo.findMany(filters, sort, skip, limit);
  }

}

import { inject, injectable } from "inversify";
import { IConcernRepository } from "../../core/interfaces/repositories/concern/IConcernRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { TYPES } from "../../core/types";
import { throwError } from "../../utils/ResANDError";
import { IConcern } from "../../types/concernTypes";
import { signConcernAttachmentUrls } from "../../utils/s3Utilits";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { FilterQuery } from "mongoose";
import { ICourse } from "../../types/classTypes";
import { IAdminConcernService } from "../../core/interfaces/services/admin/IAdminConcernService";
import { Messages } from "../../constants/messages";

@injectable()
export class AdminConcernService implements IAdminConcernService {
  constructor(
    @inject(TYPES.ConcernRepository)
    private _concernRepo: IConcernRepository,
    @inject(TYPES.CourseRepository)
    private _courseRepo: ICourseRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService
  ) {}

 async getConcern(): Promise<IConcern[]> {
    const result = await this._concernRepo.findAll();
    if (!result) throwError(Messages.COMMON.INTERNAL_ERROR);
    return result
  }

  async getAllConcerns(
    filters: {
      status?: 'open' | 'in-progress' | 'resolved';
      courseId?: string;
      search?: string;
    },
    limit: number,
    skip: number,
    sort: Record<string, 1 | -1>
  ): Promise<{ concerns: IConcern[]; courses: ICourse[] }> {
    const query: FilterQuery<IConcern> = {};

    if (filters.status) query.status = filters.status;
    if (filters.courseId) query.courseId = filters.courseId;

    if (filters.search && filters.search.trim()) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { message: { $regex: filters.search, $options: "i" } }
      ];
    }

    const concerns = await this._concernRepo.findWithPagination(query, limit, skip, sort);
    if (!concerns) throwError(Messages.CONCERN.FETCH_FAILED);

    const courses = await this._courseRepo.findAll();
    const signedConcerns = await signConcernAttachmentUrls(concerns);
    return { concerns: signedConcerns, courses };
  }

  async updateConcernStatus(concernId: string, status: 'resolved' | 'in-progress'): Promise<void> {
    const concern = await this._concernRepo.findById(concernId);
    if (!concern) throwError(Messages.CONCERN.NOT_FOUND);
    const updated = await this._concernRepo.update(concernId, {
      status,
      updatedAt: new Date()
    });

    if (!updated) throwError(Messages.CONCERN.STATUS_UPDATE_FAILED);
     const notificationMessage = status === "resolved"
        ? Messages.CONCERN.RESOLVED_NOTIFICATION(concern.title)
        : Messages.CONCERN.IN_PROGRESS_NOTIFICATION(concern.title);

    if (concern.mentorId) {
      const statusText = status === "resolved" ? "resolved" : "marked as in-progress";

      await notifyWithSocket({
        notificationService: this._notificationService,
        userIds: [concern.mentorId.toString()],
        title: `Concern ${statusText}`,
        message: Messages.CONCERN.STATUS_UPDATEDWITHNOT(status),
        type: status === "resolved" ? "success" : "info"
      });
    }
  }

  async countAllConcerns(filters: {
    status?: 'open' | 'in-progress' | 'resolved';
    courseId?: string;
    search?: string;
  }): Promise<number> {
    const query: FilterQuery<IConcern> = {};

    if (filters.status) query.status = filters.status;
    if (filters.courseId) query.courseId = filters.courseId;

    if (filters.search?.trim()) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { message: { $regex: filters.search, $options: "i" } }
      ];
    }

    return this._concernRepo.count(query);
  }

  async updateConcern(concernId: string, updateData: Partial<IConcern>): Promise<void> {
    const concern = await this._concernRepo.findById(concernId);
    if (!concern)  throwError(Messages.CONCERN.NOT_FOUND)

    const updated = await this._concernRepo.update(concernId, {
      ...updateData,
      updatedAt: new Date()
    });

    if (!updated)throwError(Messages.CONCERN.UPDATE_FAILED);
  }
}

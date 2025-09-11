import { inject, injectable } from "inversify";
import { IConcernRepository } from "../../core/interfaces/repositories/concern/IConcernRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { TYPES } from "../../core/types";
import { throwError } from "../../utils/resAndError";
import { IConcern } from "../../types/concernTypes";
import { signConcernAttachmentUrls } from "../../utils/s3Utilits";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { FilterQuery } from "mongoose";
import { IAdminConcernService } from "../../core/interfaces/services/admin/IAdminConcernService";
import { Messages } from "../../constants/messages";
import { IAdminConcernCourseResponseDto, IConcernResponseDto } from "../../shared/dtos/concern/concern-response.dto";
import { ConcernMapper } from "../../shared/dtos/concern/concern.mapper";

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

 async getConcern(): Promise<IConcernResponseDto[]> {
    const result = await this._concernRepo.findAll();
   if (!result) throwError(Messages.COMMON.INTERNAL_ERROR);
       const signedConcerns : IConcern[]= await signConcernAttachmentUrls(result);
    const sendData = signedConcerns.map((i) => ConcernMapper.toResponseDto(i))
    return sendData
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
  ): Promise<{ concerns: IConcernResponseDto[]; courses: IAdminConcernCourseResponseDto[] }> {
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
    const signedConcerns : IConcern[]= await signConcernAttachmentUrls(concerns);
    const sendData = signedConcerns.map((i) => ConcernMapper.toResponseDto(i))
    const sendCourse=courses.map((i)=>ConcernMapper.toResponseCourseInConcern(i))
    return { concerns: sendData, courses:sendCourse };
  }

  async updateConcernStatus(concernId: string, status: 'resolved' | 'in-progress',resolution:string): Promise<void> {
    const concern = await this._concernRepo.findById(concernId);
    if (!concern) throwError(Messages.CONCERN.NOT_FOUND);
    const updated = await this._concernRepo.update(concernId, {
      status,
      resolution,
      updatedAt: new Date()
    });

    if (!updated) throwError(Messages.CONCERN.STATUS_UPDATE_FAILED);


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

  async updateConcern(concernId: string, updateData: IConcernResponseDto): Promise<void> {
    const concern = await this._concernRepo.findById(concernId);
    if (!concern)  throwError(Messages.CONCERN.NOT_FOUND)

    const updated = await this._concernRepo.update(concernId, {
      ...updateData,
      updatedAt: new Date()
    });

    if (!updated)throwError(Messages.CONCERN.UPDATE_FAILED);
  }
}

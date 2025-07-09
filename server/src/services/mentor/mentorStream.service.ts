import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { ILiveRepository } from "../../core/interfaces/repositories/course/ILiveRepository";
import { Types } from "mongoose";
import { IMentorStreamService } from "../../core/interfaces/services/mentor/ImentorStream.service";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { throwError } from "../../utils/ResANDError";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
@injectable()
export class MentorStreamService implements IMentorStreamService{
    constructor(
        @inject(TYPES.LiveRepository) private _baseLiveRepo: ILiveRepository ,
        @inject(TYPES.MentorRepository) private _baseMentorRepo: IMentorRepository,
        @inject(TYPES.CourseRepository) private _courseRepo: ICourseRepository,
        @inject(TYPES.NotificationService) private _notificationService:INotificationService
        
    ){}
    async startStreamSession(courseId: string, mentorId: string): Promise<string> {
        const course=await this._courseRepo.update(courseId,{isStreaming:true})          
        const liveId = `live-${Date.now()}`;
        const currentDate = new Date();
        await this._baseLiveRepo.create({
            courseId: new Types.ObjectId(courseId),
            mentorId: new Types.ObjectId(mentorId),
            liveId,
            isActive: true,
            date:currentDate,
        });
           if (course?.enrolledUsers && course.enrolledUsers.length > 0) {
             await notifyWithSocket({
             notificationService: this._notificationService,
             userIds: course.enrolledUsers.map((id) => id.toString()),
             title: " Live Session Started",
             message: `A live session for the course "${course.title}" has just started. Join now!`,
             type: "info",
         });
  }
              
        return liveId;
    }
    async endStream(liveId: string, mentorId: string): Promise<void> {
        const stream = await this._baseLiveRepo.findOne({ liveId });
        if (!stream) throw new Error("Live stream not found");
        await this._courseRepo.update(stream.courseId as unknown as string,{isStreaming:false})
        await Promise.all([
          this._baseLiveRepo.update(stream.id, { isActive: false, isEnd: true }),
          this._baseMentorRepo.update(mentorId, { $addToSet: { liveClasses: stream?.id } })
        ]);
      }
    
    
}
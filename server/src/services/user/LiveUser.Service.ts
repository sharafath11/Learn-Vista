import { inject, injectable } from "inversify";

import { TYPES } from "../../core/types";
import { throwError } from "../../utils/ResANDError";
import { Types } from "mongoose";
import { IUserLiveService } from "../../core/interfaces/services/user/IUserLiveService";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { ILiveRepository } from "../../core/interfaces/repositories/course/ILiveRepository";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";

@injectable()
export class LiveUserService implements IUserLiveService {
  constructor(
    @inject(TYPES.CourseRepository) 
    private readonly courseRepo: ICourseRepository,
    
    @inject(TYPES.LiveRepository) 
    private readonly liveRepo: ILiveRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.UserRepository) private _userRepo:IUserRepository
    
  ) {}

  async getRoomIdService(courseId: string, userId: string): Promise<string> {
   
      
      // await this.validateCourseEnrollment(courseId, userId);
      const liveSession = await this.validateLiveSession(courseId);
      await this.addParticipant(liveSession.id, userId);
       const user=await this._userRepo.findById(userId)
      await notifyWithSocket({
            notificationService: this._notificationService,
            userIds: [liveSession?.mentorId.toString()],
            title: ` New user joined ${user?.username}`,
            message: ``,
            type: "info",
          });
      return liveSession.liveId;
  
  }

//   private async validateCourseEnrollment(courseId: string, userId: string): Promise<void> {
//   const course = await this.courseRepo.findById(courseId);

//   if (!course) {
//     throwError("Course not found");
//   }

//   const enrolledUserIds = (course.enrolledUsers as Types.ObjectId[])?.map((id) =>
//     id.toString()
//   );


//   if (!enrolledUserIds.includes(userId)) {
//     console.error(" User not enrolled in this course.");
//     throwError("User not enrolled in this course");
//   }

// }

  private async validateLiveSession(courseId: string) {
   
    const liveSession = await this.liveRepo.findOne({ courseId,isActive:true });
    
    if (!liveSession) {
      throwError("Live session not available");
    }
    if (!liveSession.isActive) throwError(`This stream desnot start please try after `);
    if(liveSession.isEnd) throwError("This stream was ended")
    
    return liveSession;
  }

  private async addParticipant(liveId: Types.ObjectId, userId: string): Promise<void> {
      const live=  await this.liveRepo.update(
        liveId.toString(),
        { $addToSet: { participants: new Types.ObjectId(userId) } }
      );
   
      
  }
}
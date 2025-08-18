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
import { Messages } from "../../constants/messages";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
export class LiveUserService implements IUserLiveService {
  constructor(
    @inject(TYPES.CourseRepository) private _courseRepo: ICourseRepository,
    @inject(TYPES.LiveRepository) private _liveRepo: ILiveRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}

  async getRoomIdService(courseId: string, userId: string): Promise<string> {
    const course = await this._courseRepo.findById(courseId);
   if (!course?.enrolledUsers.includes(userId)) {
  throwError("Please enroll in this course");
}

    const liveSession = await this.validateLiveSession(courseId);
    await this.addParticipant(liveSession._id, userId);
    const user = await this._userRepo.findById(userId);
    console.log("mentor",[course.mentorId])
   await notifyWithSocket({
  userIds: [course.mentorId.toString()], 
  notificationService: this._notificationService,
  title: Messages.STREAM.USER_JOINED_NOTIFICATION_TITLE,
  message: Messages.STREAM.USER_JOINED_NOTIFICATION_MESSAGE(
    user?.username || "user"
  ),
  type: "info",
});

    return liveSession.liveId;
  }

  private async validateLiveSession(courseId: string) {
    const liveSession = await this._liveRepo.findOne({
      courseId,
      isActive: true,
    });
    if (!liveSession) {
      throwError(Messages.STREAM.NOT_AVAILABLE, StatusCode.NOT_FOUND);
    }

    if (!liveSession.isActive) {
      throwError(Messages.STREAM.NOT_STARTED, StatusCode.BAD_REQUEST);
    }

    if (liveSession.isEnd) {
      throwError(Messages.STREAM.ALREADY_ENDED, StatusCode.BAD_REQUEST);
    }

    return liveSession;
  }

  private async addParticipant(
    liveId: Types.ObjectId,
    userId: string
  ): Promise<void> {
    
    await this._liveRepo.update(liveId.toString(), {
      $addToSet: { participants: new Types.ObjectId(userId) },
    });
  }
async verifyUser(liveId: string, userId: string): Promise<void> {
  const live = await this._liveRepo.findOne({ liveId });
  if (!live) throwError(Messages.STREAM.NOT_AVAILABLE);
  const courseIdStr = live.courseId?.toString() || "";
  const course = await this._courseRepo.findById(courseIdStr);
  if (!course) throwError(Messages.STREAM.NOT_AVAILABLE);
  const enrolledUserIds = course.enrolledUsers.map(id => id.toString());
   if (!enrolledUserIds.includes(userId)) {
   
    throwError(Messages.STREAM.NOT_ALLOWED);
  }

 
}


}

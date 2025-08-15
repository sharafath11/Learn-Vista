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
    @inject(TYPES.CourseRepository) private courseRepo: ICourseRepository,
    @inject(TYPES.LiveRepository) private liveRepo: ILiveRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}

  async getRoomIdService(courseId: string, userId: string): Promise<string> {
    const liveSession = await this.validateLiveSession(courseId);
    await this.addParticipant(liveSession._id, userId);
    const user = await this._userRepo.findById(userId);
    await notifyWithSocket({
      notificationService: this._notificationService,
      userId: liveSession.mentorId.toString(),
      title: Messages.STREAM.USER_JOINED_NOTIFICATION_TITLE,
      message: Messages.STREAM.USER_JOINED_NOTIFICATION_MESSAGE(
        user?.username || "A user"
      ),
      type: "info",
    });
    return liveSession.liveId;
  }

  private async validateLiveSession(courseId: string) {
    const liveSession = await this.liveRepo.findOne({
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
    await this.liveRepo.update(liveId.toString(), {
      $addToSet: { participants: new Types.ObjectId(userId) },
    });
  }
}

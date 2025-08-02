import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import {  IUser } from "../../types/userTypes";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { sendPasswordResetEmail } from "../../utils/emailService";
import { generateAccessToken } from "../../utils/JWTtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { getSignedS3Url } from "../../utils/s3Utilits";
import { ObjectId ,Types} from "mongoose";
import { dailyTaskPrompt } from "../../utils/Rportprompt";
import { getGemaniResponse } from "../../config/gemaniAi";
import { IDailyTaskRepository } from "../../core/interfaces/repositories/user/IDailyTaskRepository";
import { IDailyTask, ISubTask } from "../../types/dailyTaskType";
dotenv.config();

export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.DailyTaskRepository) private _dailyTaskRepo:IDailyTaskRepository
    
  ) {}

  async getUser(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return throwError("User not found", StatusCode.NOT_FOUND);
    }

    if (user.isBlocked) {
      throwError("User was blocked", StatusCode.FORBIDDEN);
    }

    if (user.profilePicture && !user.profilePicture.startsWith('http')) {
        try {
            user.profilePicture = await getSignedS3Url(user.profilePicture);
        } catch (error) {
            console.error(`Failed to sign profile picture URL for user ${id}:`, error);
            user.profilePicture = null;
        }
    } else if (user.profilePicture === undefined || user.profilePicture === null || user.profilePicture === "") {
        user.profilePicture = "/default-avatar.png";
    }

    return user;
  }

  async forgetPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });

    if (!user) {
      return throwError("User not found", StatusCode.NOT_FOUND);
    }

    if (user.isBlocked) {
      return throwError("This account was blocked", StatusCode.FORBIDDEN);
    }

    const token = generateAccessToken(user.id, "user");
    const resetLink = `${process.env.CLIENT_URL}/user/reset-password/${token}`;

    const result = await sendPasswordResetEmail(user.email, resetLink);

    if (!result.success) {
      throwError("Failed to send reset email. Try again later.", StatusCode.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(id: string, password: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throwError("User not found", StatusCode.NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(id, { password: hashedPassword });
     await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [id],
    title: "Password Reset",
    message: "Your password has been reset successfull.",
    type: "info",
  });
  }
   async getDailyTaskSevice(userId: string | Types.ObjectId): Promise< IDailyTask> {
  const userObjectId = typeof userId === "string" ? new Types.ObjectId(userId) : userId;

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));

  const existingTask = await this._dailyTaskRepo.findOne({
    userId: userObjectId,
    createdAt: { $gte: startOfDay },
  });

  if (existingTask) return existingTask;

  const userTasks = await this._dailyTaskRepo.findAll(userObjectId);
  const day = userTasks.length + 1;

  const prompt = dailyTaskPrompt(day);
  const geminiResponse = await getGemaniResponse(prompt);

  let tasks: ISubTask[];

  try {
    const parsed = JSON.parse(geminiResponse);
    if (!Array.isArray(parsed)) throw new Error("Invalid task array");

    tasks = parsed.map((task: any) => ({
      type: task.type,
      prompt: task.prompt,
      isCompleted: false,
    }));
  } catch (err) {
    throwError("Failed to parse Gemini task response", StatusCode.BAD_REQUEST);
  }

  const newTask = await this._dailyTaskRepo.create({
    userId: userObjectId,
    date: String(day),
    tasks,
    createdAt: new Date(),
  });

  await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [userObjectId.toString()],
    title: "New Daily Task",
    message: `Your Day ${day} task is ready!`,
    type: "info",
  });

  return newTask;
}

}

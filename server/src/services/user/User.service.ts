import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { ISafeUser, IUser } from "../../types/userTypes";
import { IUserService } from "../../core/interfaces/services/user/IUserService";
import { sendPasswordResetEmail } from "../../utils/emailService";
import { generateAccessToken } from "../../utils/JWTtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
dotenv.config();

export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService 
    
  ) {}

  async getUser(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      return throwError("User not found", StatusCode.NOT_FOUND);
    }

    if (user.isBlocked) {
      throwError("User was blocked", StatusCode.FORBIDDEN);
    }

    return user
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
}
